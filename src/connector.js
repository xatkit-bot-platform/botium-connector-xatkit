const debug = require('debug')('botium-connector-xatkit')
const io = require('socket.io-client')

const Capabilities = {
  XATKIT_SERVER_URL: 'XATKIT_SERVER_URL'
}

const Defaults = {
}

class BotiumConnectorXatkit {
  constructor ({ queueBotSays, caps }) {
    this.queueBotSays = queueBotSays
    this.caps = caps
  }

  Validate () {
    debug('Validate called')
    this.caps = Object.assign({}, Defaults, this.caps)

    if (!this.caps[Capabilities.XATKIT_SERVER_URL]) {
      throw new Error('XATKIT_SERVER_URL capability required')
    }

    this.server = this.caps[Capabilities.XATKIT_SERVER_URL]
    const urlPattern = /(^https?:\/\/[^/]+)\/?(.*)/i

    this.parsedUrl = this.server.match(urlPattern)
    if (this.parsedUrl === null) {
      throw new Error('The provided URL ' + this.server + ' is not a valid URL')
    }
    return Promise.resolve()
  }

  async Start () {
    debug('start called')
    let serverUrl = this.server
    let basePath = '/socket.io'
    if (this.parsedUrl.length !== null && this.parsedUrl.length === 3) {
      if (this.parsedUrl[2] !== '') {
        basePath = '/' + this.parsedUrl[2]
      }
      serverUrl = this.parsedUrl[1]
    }
    this.serverUrl = serverUrl
    this.basePath = basePath
    const socket = io(this.serverUrl, {
      path: this.basePath
    })
    this.socket = socket

    this.socket.on('bot_message', (message) => {
      const messageText = message.message
      if (messageText) {
        debug('Bot says ' + messageText)
        const botMsg = { sender: 'bot', sourceData: message, messageText }
        this.queueBotSays(botMsg)
      } else {
        debug('Bot message received without text: ' + message)
      }
    })

    return new Promise((resolve, reject) => {
      this.socket.on('connect', function () {
        resolve()
      })
      this.socket.on('connect_error', function (err) {
        reject(err)
      })
      socket.on('connect_timeout', (timeout) => {
        reject(timeout)
      })
    })
  }

  async UserSays ({ messageText }) {
    debug('User says ' + messageText)

    const message = {
      message: messageText,
      username: 'test'
    }

    this.socket.emit('user_message', message)
    return Promise.resolve()
  }

  Stop () {
    debug('Stop called')

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          this.socket.close()
          resolve()
        } catch (err) {
          reject(err)
        }
      }, 1000)
    })
  }
}

module.exports = BotiumConnectorXatkit
