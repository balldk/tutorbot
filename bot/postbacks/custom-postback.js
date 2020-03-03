const joinClass = require('../utils/join-class')
const listClass = require('../postbacks/classroom/list-class')

module.exports = bot => (payload, chat) => {
    let [ key, value ] = payload.postback.payload.split('#')
    if (!value) return false

    if (key === 'JOIN_CLASS') {
        joinClass(bot, payload, chat, value)
    } else if (key === 'LIST_CLASS') {
        listClass(parseInt(value))(payload, chat)
    }
}