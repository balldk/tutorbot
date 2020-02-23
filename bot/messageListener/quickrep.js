const outRoom = require('../utils/out-room')

module.exports = bot => (payload, chat) => {
    let quickCode = payload.message.quick_reply.payload
    if (quickCode === 'OUT_ROOM') outRoom(payload, chat, bot)
}