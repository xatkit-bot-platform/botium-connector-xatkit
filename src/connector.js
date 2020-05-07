const debug = require('debug')('botium-connector-xatkit')
const io = require('socket.io-client')

const Capabilities = {
    XATKIT_SERVER_URL: 'XATKIT_SERVER_URL'
}

class BotiumConnectorXatkit {
    constructor ({ queueBotSays, caps }) {
        this.queueBotSays = queueBotSays
        this.caps = caps
        this.server = this.caps[Capabilities.XATKIT_SERVER_URL]
        const urlPattern = /(^https?:\/\/[^\/]+)\/?(.*)/i
        /*
         * If the provided URL contains a base path the result array will contain the following information:
         * [0] full path (e.g. http://localhost:5001/test)
         * [1] server URL (e.g. http://localhost:5001)
         * [2] base path (e.g. test)
         * If the provided URL does not contain a base path the result array will contain the following information:
         * [0] full path
         * [1] server URL
         * [2] an empty string
         */
        const parsedUrl = this.server.match(urlPattern)
        if (parsedUrl === null) {
            /*
             * The provided URL doesn't match the pattern, we need to log an error and stop here.
             */
            console.error('The provided URL ' + this.server + ' is not a valid URL')
            return
        }
        let serverUrl = this.server
        let basePath = '/socket.io'
        if (parsedUrl.length !== null && parsedUrl.length === 3) {
            if (parsedUrl[2] !== '') {
                basePath = '/' + parsedUrl[2]
            }
            serverUrl = parsedUrl[1]
        }
        this.serverUrl = serverUrl
        this.basePath = basePath
    }

    Validate () {
        debug('Validate called')

        if (!this.caps[Capabilities.XATKIT_SERVER_URL]) {
            throw new Error('XATKIT_SERVER_URL capability required')
        }
        return Promise.resolve()
    }

    async Start () {
        debug('Start called')
        const socket = io(this.serverUrl, {
            path: this.basePath
        })
        this.socket = socket

        this.socket.on('bot_message', (message) => {
            const messageText = message.message
            if (messageText) {
                debug('Bot says ' + messageText)
                const botMsg = { sender: 'bot', sourceData: message, messageText}
                this.queueBotSays(botMsg)
            } else {
                debug('Received Websocket Message without text: ' + message)
            }
        })

        return new Promise((resolve, reject) => {
            socket.on('connect', function () {
                resolve()
            })
            socket.on('connect_error', function (err) {
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

module.exports = {
    PluginVersion: 1,
    PluginClass: BotiumConnectorXatkit
}
