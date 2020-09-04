const fs = require('fs')
const path = require('path')
const BotiumConnectorXatkit = require('./src/connector')

const logo = fs.readFileSync(path.join(__dirname, 'logo.png')).toString('base64')

module.exports = {
  PluginVersion: 1,
  PluginClass: BotiumConnectorXatkit,
  PluginDesc: {
    name: 'Botium Connector for Xatkit',
    avatar: logo,
    provider: 'Xatkit',
    capabilities: [
      {
        name: 'XATKIT_SERVER_URL',
        label: 'XATKIT_SERVER_URL',
        description: 'Xatkit server url',
        type: 'url',
        required: true
      }
    ]
  }
}
