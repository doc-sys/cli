import {expect, test} from '@oclif/test'

describe('deploy:docker', () => {
  test
  .stdout()
  .command(['deploy:docker'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['deploy:docker', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
