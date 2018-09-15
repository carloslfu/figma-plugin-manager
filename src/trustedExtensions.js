const axios = require('axios')
const pluginsListUrl = 'https://cdn.rawgit.com/carloslfu/figma-community-plugins/cf3bef92/trustedPlugins.json'

module.exports.getPlugins = () => axios.get(pluginsListUrl).then(res => {
  global.plugins = res.data
})
