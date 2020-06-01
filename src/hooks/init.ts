import {Hook} from '@oclif/config'
const clear = require('clear')
import {white, black, bgBlue} from 'chalk'
import {textSync} from 'figlet'

const hook: Hook<'init'> = async () => {
    clear()
    console.log(white.bgBlue(textSync('docSys CLI', {horizontalLayout: 'full'})))
    console.log(white('\ndocSys is a open source productivity suite, featuring file storage, voice/video chat, text editing and much more!\n\nLearn more at https://github.com/doc-sys/docsys\n\nSee our documentation on usage information for this tool.'))
    console.log('\n')
}

export default hook
