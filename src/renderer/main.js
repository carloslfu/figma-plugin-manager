const { remote, shell } = require('electron')

const getChromeStoreUrl = id => `https://chrome.google.com/webstore/detail/${id}`
const getExtensionsManagerUrl = id => `chrome://extensions/?id=${id}`

const plugins = remote.getGlobal('plugins')

console.log(plugins)

const installedExtsListElm = document.getElementById('installedExtsList')
const uninstalledExtsListElm = document.getElementById('uninstalledExtsList')

const installedExts = plugins.filter(ext => ext.installed)
const uninstalledExts = plugins.filter(ext => !ext.installed)

installedExtsListElm.innerHTML = installedExts.reduce((view, ext) => view + `<li>${pluginView(ext)}</li>`, '')
uninstalledExtsListElm.innerHTML = uninstalledExts.reduce((view, ext) => view + `<li>${pluginView(ext)}</li>`, '')

function pluginView(ext) {
  return `
    <div>${ext.name}</div>
    <div>
      <button onclick="openExtLinkInChromeStore('${ext.chromeStoreId}')">${ext.installed ? 'View in the Chrome Store' : 'Install from the Chrome Store'}</button>
    </div>
    <div>
    ${ext.installed ? `
      To manage, open this link in Chrome: <span class="code">${getExtensionsManagerUrl(ext.chromeStoreId)}</span>
    ` : ''}
    </div>
  `
}

function openExtLinkInChromeStore(id) {
  shell.openExternal(getChromeStoreUrl(id))
}

function refresh() {
  
}
