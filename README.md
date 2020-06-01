docsyscli
=========

Command Line Interface for the docsys productivity suite

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/docsyscli.svg)](https://npmjs.org/package/docsyscli)
[![Downloads/week](https://img.shields.io/npm/dw/docsyscli.svg)](https://npmjs.org/package/docsyscli)
[![License](https://img.shields.io/npm/l/docsyscli.svg)](https://github.com/https://github.com/doc-sys/docsys/docsyscli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g docsyscli
$ dscli COMMAND
running command...
$ dscli (-v|--version|version)
docsyscli/0.0.0 win32-x64 node-v14.3.0
$ dscli --help [COMMAND]
USAGE
  $ dscli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dscli config [FILE]`](#dscli-config-file)
* [`dscli config:dotenv`](#dscli-configdotenv)
* [`dscli deploy:docker [FILE]`](#dscli-deploydocker-file)
* [`dscli hello [FILE]`](#dscli-hello-file)
* [`dscli help [COMMAND]`](#dscli-help-command)

## `dscli config [FILE]`

describe the command here

```
USAGE
  $ dscli config [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\config\index.ts](https://github.com/doc-sys/docsys/docsyscli/blob/v0.0.0/src\commands\config\index.ts)_

## `dscli config:dotenv`

create a new dotenv file

```
USAGE
  $ dscli config:dotenv

OPTIONS
  -a, --redo             ignore existing .env warning and redo
  -e, --storage=storage  storage engine to use
  -h, --help             show CLI help

EXAMPLES
  dscli config dotenv
  dscli config dotenv -e aws
```

_See code: [src\commands\config\dotenv.ts](https://github.com/doc-sys/docsys/docsyscli/blob/v0.0.0/src\commands\config\dotenv.ts)_

## `dscli deploy:docker [FILE]`

describe the command here

```
USAGE
  $ dscli deploy:docker [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\deploy\docker.ts](https://github.com/doc-sys/docsys/docsyscli/blob/v0.0.0/src\commands\deploy\docker.ts)_

## `dscli hello [FILE]`

describe the command here

```
USAGE
  $ dscli hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ dscli hello
  hello world from ./src/hello.ts!
```

_See code: [src\commands\hello.ts](https://github.com/doc-sys/docsys/docsyscli/blob/v0.0.0/src\commands\hello.ts)_

## `dscli help [COMMAND]`

display help for dscli

```
USAGE
  $ dscli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.1/src\commands\help.ts)_
<!-- commandsstop -->
