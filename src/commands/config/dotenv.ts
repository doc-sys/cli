import {Command, flags} from '@oclif/command'
import {existsSync, unlinkSync, appendFileSync} from 'fs'
import {prompt, Separator} from 'inquirer'

export default class Dotenv extends Command {
  static description = 'create a new dotenv file'

  static examples = [
    'dscli config dotenv',
    'dscli config dotenv -e aws',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    redo: flags.boolean({char: 'a', description: 'ignore existing .env warning and redo'}),
    storage: flags.string({char: 'e', description: 'storage engine to use'}),
  }

  async run() {
    const {flags} = this.parse(Dotenv)

    // check if .env file already exists
    if (existsSync('./.env') && !flags.redo) {
      this.warn('There already exists a .env file in this directory.\nRun with -a flag if you want to setup again.')
      this.exit(0)
    } else if (existsSync('./.env') && flags.redo) {
      this.log('Removing existing .env file...\n')
      await unlinkSync('./.env')
    }

    const answers = await prompt([
      // {
      //   type: 'number',
      //   name: 'PORT',
      //   message: 'Port number to run backend',
      //   default: 3000,
      // },
      {
        type: 'list',
        name: 'STORAGE_ENGINE',
        message: 'Backend storage engine',
        choices: [
          'AWS',
          'Azure',
          'Google',
          'GridFS',
          new Separator(),
          'Local',
        ],
        filter: (val: string) => val.toLowerCase(),
        when: () => !flags.storage,
      },
      // AWS CREDS
      {
        type: 'password',
        name: 'AWS_ACCESS_KEY_ID',
        message: 'AWS access key',
        when: (answers) => (flags.storage == 'aws' || answers.STORAGE_ENGINE == 'aws'),
      },
      {
        type: 'password',
        name: 'AWS_SECRET_ACCESS_KEY',
        message: 'AWS secret access key',
        when: (answers) => (flags.storage == 'aws' || answers.STORAGE_ENGINE == 'aws'),
      },
      {
        type: 'input',
        name: 'AWS_BUCKET_NAME',
        message: 'AWS bucket name',
        when: (answers) => (flags.storage == 'aws' || answers.STORAGE_ENGINE == 'aws'),
      },
      {
        type: 'confirm',
        name: 'AWS_INTELLIGENT_TIERING',
        message: 'Use AWS intelligent tiering?',
        default: true,
        when: (answers) => (flags.storage == 'aws' || answers.STORAGE_ENGINE == 'aws'),
      },
      // AZURE CREDS
      {
        type: 'input',
        name: 'AZURE_ACCOUNT_NAME',
        message: 'Azure account name',
        when: (answers) => (flags.storage == 'azure' || answers.STORAGE_ENGINE == 'azure'),
      },
      {
        type: 'password',
        name: 'AZURE_ACCOUNT_KEY',
        message: 'Azure account key',
        when: (answers) => (flags.storage == 'azure' || answers.STORAGE_ENGINE == 'azure'),
      },
      {
        type: 'input',
        name: 'AZURE_CONTAINER_NAME',
        message: 'Azure container name',
        when: (answers) => (flags.storage == 'azure' || answers.STORAGE_ENGINE == 'azure'),
      },
      // GOOGLE CREDS
      {
        type: 'input',
        name: 'GC_CLIENT_EMAIL',
        message: 'Google Cloud client email',
        when: (answers) => (flags.storage == 'google' || answers.STORAGE_ENGINE == 'google'),
      },
      {
        type: 'password',
        name: 'GC_PRIVATE_KEY',
        message: 'Google Cloud private key',
        when: (answers) => (flags.storage == 'google' || answers.STORAGE_ENGINE == 'google'),
      },
      {
        type: 'input',
        name: 'GC_BUCKET_NAME',
        message: 'Google Cloud bucket name',
        when: (answers) => (flags.storage == 'google' || answers.STORAGE_ENGINE == 'google'),
      },
      // GRIDFS CREDS
      {
        type: 'input',
        name: 'GRIDFS_PATH',
        message: 'GridFS URI',
        when: (answers) => (flags.storage == 'gridfs' || answers.STORAGE_ENGINE == 'gridfs'),
      },
      {
        type: 'input',
        name: 'GRIDFS_COLLECTION',
        message: 'GridFS collection name',
        when: (answers) => (flags.storage == 'gridfs' || answers.STORAGE_ENGINE == 'gridfs'),
      },
      // LOCAL CREDS
      {
        type: 'input',
        name: 'LOCAL_STORAGE_DIR',
        message: 'Local directory',
        default: 'uploads',
        when: (answers) => (flags.storage == 'local' || answers.STORAGE_ENGINE == 'local'),
      },
      // DB SETTINGS
      // -----------
      {
        type: 'input',
        name: 'DB_PATH',
        message: 'MongoDB URI',
      },
      {
        type: 'input',
        name: 'REDIS_URI',
        message: 'Redis URI',
      },
      // JWT SETTINGS
      // ------------
      {
        type: 'password',
        name: 'JWT_SECRET',
        message: 'JWT secret (must be over 8 characters long)',
        validate: (val: string) => val.length > 8 ? true : 'Must be longer than 8 characters',
      },
      {
        type: 'input',
        name: 'JWT_EXPIRES_IN',
        message: 'JWT expiration time in ms',
        default: '36000',
      },
      // SMTP SETTINGS
      // -------------
      {
        type: 'confirm',
        name: 'USE_SMTP',
        message: 'Use SMTP functions to send mail?',
        default: true,
      },
      {
        type: 'input',
        name: 'SMTP_HOST',
        message: 'SMTP Host',
        when: answers => answers.USE_SMTP,
      },
      {
        type: 'input',
        name: 'SMTP_PORT',
        message: 'SMTP Port',
        default: '25',
        when: answers => answers.USE_SMTP,
      },
      {
        type: 'input',
        name: 'SMTP_USER',
        message: 'SMTP User',
        when: answers => answers.USE_SMTP,
      },
      {
        type: 'password',
        name: 'SMTP_PASSWORD',
        message: 'SMTP Password',
        when: answers => answers.USE_SMTP,
      },
      {
        type: 'confirm',
        name: 'SMTP_SECURE',
        message: 'Use SMTP securely only?',
        default: true,
        when: answers => answers.USE_SMTP,
      },
    ])

    if (flags.storage) {
      answers.STORAGE_ENGINE = flags.storage
    }

    answers.PORT = 3000

    this.log('\nWriting to .env file...')

    for (const key in answers) {
      if (answers.hasOwnProperty(key)) {
        const element = answers[key]
        appendFileSync('./.env', `${key}=${element}\n`)
      }
    }
  }
}
