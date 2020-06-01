/* eslint-disable max-statements-per-line */
import {Command, flags} from '@oclif/command'
import * as Docker from 'dockerode'
import {cli} from 'cli-ux'
import {green, red} from 'chalk'
import * as Listr from 'listr'
import * as exec from 'execa'
import {Observable} from 'rxjs'
import {existsSync} from 'fs'
import {eachLine} from 'line-reader'

export default class DeployDocker extends Command {
  static description = 'deploys docsys to a local docker installation'

  // config = new Config(require('../../../package.json').name)

  // dockerConfig = this.config.get('docker_conf')

  docker = new Docker()

  static args = [
    {
      name: 'command',
      required: true,
      description: 'action to run against docker',
      options: ['up', 'down', 'status', 'restart'],
      default: 'status',
    },
  ]

  static flags = {
    ...cli.table.flags(),
    help: flags.help({char: 'h'}),
    version: flags.string({char: 'v', description: 'choose own version to deploy'}),
    port: flags.integer({char: 'p', description: 'port to bind the web frontend to', default: 80}),
  }

  async run() {
    const {argv, flags} = this.parse(DeployDocker)

    switch (argv[0]) {
    case 'status':
      this.dockerStatus()
      break
    case 'up':
      this.dockerUp(flags.version, flags.port)
      break
    }
  }

  async dockerStatus() {
    const containerList = await this.docker.listContainers({filters: '{"label": ["docsys"]}', all: true})
    cli.table(containerList, {
      name: {
        minWidth: 15,
        get: row => row.Names[0],
      },
      image: {
        minWidth: 15,
        get: row => row.Image,
      },
      status: {
        get: row => row.State === 'running' ? green(row.State) : red(row.State),
      },
      uptime: {
        get: row => row.Status,
      },
    },
    {
      printLine: this.log,
      ...flags,
    })
  }

  async dockerUp(version: string | undefined, port: number) {
    version = version || 'latest'
    const tasks = new Listr([
      {
        title: 'Build .env file',
        task: ctx => new Promise((resolve, reject) => {
          if (!existsSync('./.env')) reject(new Error('Cant find a .env file. Please run dscli configure:dotenv first'))
          const envVars: string[] = []
          eachLine('./.env', (line: string) => {
            envVars.push(line)
          })
          ctx.env = envVars
          resolve(envVars)
        }),
      },
      {
        title: 'Pull images',
        task: async () => {
          return new Observable(observer => {
            observer.next('Pulling core image')
            exec('docker', ['pull', `docsysjs/core:${version}`]).then(() => {
              observer.next('Pulling web image')
              return exec('docker', ['pull', `docsysjs/web:${version}`])
            }).then(() => {
              observer.next('Pulling proxy image')
              return exec('docker', ['pull', 'docsysjs/proxy'])
            }).then(() => {
              observer.complete()
            }).catch(error => observer.error(error))
          })
        },
      },
      {
        title: 'Create network',
        task: async ctx => {
          const networkList = await this.docker.listNetworks({filters: '{"label": ["docsys"]}'})
          if (networkList.length > 0) {ctx.networkId = networkList[0].Id; return}
          this.docker.createNetwork({Name: 'docsys', Labels: {docsys: 'docsys'}}).then(data => {ctx.networkId = data.id})
        },
      },
      {
        title: 'Setting up proxy',
        task: ctx => {
          return new Observable(observer => {
            observer.next('Creating proxy container')
            this.docker.createContainer({
              Image: 'docsysjs/proxy',
              Labels: {docsys: 'docsys'},
              name: 'proxy',
              HostConfig: {PortBindings: {'80/tcp': [{HostPort: `${port}/tcp`}]}},
            }).then(data => {
              observer.next('Attaching container to network')
              const network = this.docker.getNetwork(ctx.networkId)
              network.connect({Container: data.id}, err => observer.error(err))
            }).then(_ => observer.complete())
            .catch(error => observer.error(error))
          })
        },
      },
      {
        title: 'Create core container',
        task: ctx => {
          return new Observable(observer => {
            observer.next('Creating core container')
            this.docker.createContainer({
              Image: `docsysjs/core:${version}`,
              Labels: {docsys: 'docsys'},
              name: 'core',
              Env: ctx.env,
            }).then(container => {
              observer.next('Starting container')
              return container.start()
            }).then(_ => observer.complete())
            .catch(error => observer.error(error))
          })
        },
      },
      {
        title: 'Create web container',
        task: _ => {
          return new Observable(observer => {
            observer.next('Creating web container')
            this.docker.createContainer({
              Image: `docsysjs/web:${version}`,
              Labels: {docsys: 'docsys'},
              name: 'web',
            }).then(container => {
              observer.next('Starting container')
              return container.start()
            }).then(_ => observer.complete())
            .catch(error => observer.error(error))
          })
        },
      },
      {
        title: 'Attach container to network',
        task: ctx => {
          return new Observable(observer => {
            observer.next('Fetching container')
            const network = this.docker.getNetwork(ctx.networkId)
            this.docker.listContainers({filters: '{"label": ["docsys"]}', all: true}, (err, containers) => {
              if (err) return observer.error(err)
              containers?.forEach(info => {
                observer.next(`Connecting ${info.Names[0]}`)
                network.connect({Container: info.Id}, err => observer.error(err))
              })
            })
            observer.complete()
          })
        },
      },
    ])

    tasks.run().catch(error => this.error(error))
  }
}
