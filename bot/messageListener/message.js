const endMessages = require('../templates/end-messages')
const attachments = require('./attachments')
const broadcastClass = require('../utils/broadcastClass')

const state = global.state

module.exports = bot => async (payload, chat) => {
    // Skip some kind of message
    let checkEndMsg = endMessages.some(each => {
        if (payload.message.text) {
            return each === payload.message.text.toLowerCase()
        }
    })
    if (checkEndMsg) return false
    if (payload.message.quick_reply) return false

    // Handler
    let userId = payload.sender.id
    let other = state.room[userId]
    let msg = payload.message
    
    if (other) {
        let isClass = state.classes[other.classId]
        if (msg.attachments) {
            attachments(payload, other, bot)
        }
        if (msg.text) {
            if (isClass) broadcastClass(bot, userId, msg.text)
            else bot.say(other.otherId, msg.text, { personaId: other.personaId })
        }
    } else {
        if (msg.text) {
            if (['hi', 'hello', 'chào', 'xin chào'].includes(msg.text.toLowerCase())) 
                chat.say('Quen không mà chào :)')
            else
                chat.say('Nói gì hiểu chết liền :)')
        } else {
            chat.say('Gửi gì tào lao vậy ba 😒')
        }
    }
}
