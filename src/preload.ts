import { ipcRenderer } from 'electron'
import * as unhandled from 'electron-unhandled'

unhandled({
  logger: (err: Error) => {
    ipcRenderer.sendSync('unhandledError', err)
  },
  showDialog: false,
})

const win = window as any
win.eprint = (str: string) => {
  ipcRenderer.sendSync('print', str)
}
win.eprintKill = () => {
  ipcRenderer.sendSync('kill')
}
