const {app, BrowserWindow} = require('electron')
const { startManager } = require('./extensionManager')

async function createWindow () {
  await startManager()  
  const win = new BrowserWindow({width: 800, height: 600})
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
