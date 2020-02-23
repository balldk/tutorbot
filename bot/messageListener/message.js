const endMessages = require('../templates/end-messages')
const state = global.state

module.exports = bot => (payload, chat) => {
    // Skip some kind of message
    let checkEndMsg = endMessages.some(each => {
        if (payload.message.text) {
            return each === payload.message.text.toLowerCase()
        }
    })
    if (checkEndMsg) return false
    if (payload.message.quick_reply) return false

    // Handler
    let sender = payload.sender.id
    let other = state.room[sender]
    if (other) {
        let msg = payload.message
        if (msg.attachments) {
            msg.attachments.forEach(attach => {
                bot.sendAttachment(other, attach.type, attach.payload.url)
            })
        } else if (msg.text) {
            bot.say(other, msg.text)
        }
    }
}
