const messageHandler = require('./message')
const quickrepHandler = require('./quickrep')
const endhandler = require('./end')

module.exports = bot => {
    bot.on('quick_reply', quickrepHandler(bot))
    bot.on('attachment', messageHandler(bot))
    bot.on('message', messageHandler(bot))
    bot.hear(['pp', 'end'], endhandler)
}