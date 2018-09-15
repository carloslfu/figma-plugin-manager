const { app, BrowserWindow, ipcMain } = require('electron')
const { startManager } = require('./extensionManager')

let win

async function createWindow () {
  await startManager()
  win = new BrowserWindow({ width: 800, height: 600 })
  win.webContents.openDevTools()
  win.loadFile('src/renderer/index.html')
  win.on('close', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('refresh', async event => {
  await startManager()
  event.returnValue = ''
})
