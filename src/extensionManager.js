const { existsSync } = require('fs')
const { join, dirname } = require('path')
const { app } = require('electron')
const getUserName = require('username')
const glob = require('glob')
const repackage = require('@getstation/repackage-chrome-extension-for-electron')
const trustedExtensions = require('./trustedExtensions')

const getCommonExtensionPaths = userName => [
  '/Library/Application Support/Google/Chrome/Default/Extensions/',
  `/Users/${userName}/Library/Application Support/Google/Chrome/Default/Extensions/`,
]

const appPath = app.getAppPath()
console.log('App path: ', appPath)

module.exports.startManager = async () => {
  const userName = await getUserName()
  await trustedExtensions.getPlugins()
  const plugins = global.plugins
  const commonExtensionPaths = getCommonExtensionPaths(userName)
  for (let plugin of plugins) {
    await manageExtension(commonExtensionPaths, plugin)
  }
}

async function manageExtension (commonExtensionPaths, ext) {
  const id = ext.chromeStoreId
  const topExtPath = findExtensionPath(commonExtensionPaths, id)
  if (!topExtPath) {
    return
  }
  ext.installed = true
  const files = glob.sync(join(topExtPath, '**/manifest.json')).sort()
  const extPath = dirname(files[0])
  console.log('Ext path: ', extPath)
  const targetDir = join(appPath, 'extensions', id)
  if (existsSync(targetDir)) {
    return
  }
  try {
    await repackage(extPath, targetDir)
  } catch (err) {
    throw new Error(err)
  }
}

function findExtensionPath (commonExtensionPaths, key) {
  for (let commonPath of commonExtensionPaths) {
    const path = join(commonPath, key)
    if (existsSync(path)) {
      return path
    }
  }
}
