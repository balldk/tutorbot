const checkInRoom = require('../../utils/check-in-room')

module.exports = (payload, chat) => {
    if (checkInRoom(payload, chat, state)) return false
    chat.say({
        text: 'Bạn muốn trở thành...',
        buttons: [
            { type: 'postback', title: 'Học sinh', payload: 'MATCH_STUDENT' },
            { type: 'postback', title: 'Gia sư', payload: 'MATCH_TUTOR' }
        ]
    })
}