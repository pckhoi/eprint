import * as path from 'path'
import * as fs from 'fs'

import { app, BrowserWindow, ipcMain } from 'electron'
import * as unhandled from 'electron-unhandled'

let anticipateFatalErr = false

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    show: false,
    focusable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'))

  ipcMain.on('print', (event, str: string) => {
    process.send({ type: 'print', str })
    event.returnValue = 'done'
  })

  ipcMain.on('unhandledError', (event, err: Error) => {
    process.send({ type: 'print', str: 'Unhandled error from your bundle:' })
    process.send({ type: 'print', str: err.stack })
    if (anticipateFatalErr) {
      app.quit()
    }
    event.returnValue = 'done'
  })

  ipcMain.on('kill', (event) => {
    app.quit()
    event.returnValue = 'done'
  })

  // load user script
  const scriptPath = process.argv[process.argv.length - 1]
  mainWindow.webContents.executeJavaScript(
    fs.readFileSync(scriptPath).toString('utf8')
  )
}

unhandled({
  logger: (err: Error) => {
    if (
      err.message.startsWith(
        'Script failed to execute, this normally means an error was thrown.'
      )
    ) {
      anticipateFatalErr = true
    } else {
      process.send({
        type: 'error',
        errMsg: err.message,
        errStack: err.stack,
      })
    }
  },
})

app.on('ready', () => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
