const checkInRoom = require('../../utils/check-in-room')

module.exports = (payload, chat) => {
    if (checkInRoom(payload, chat, state)) return false
    chat.say({
        text: 'Bạn muốn...',
        buttons: [
            { title: 'Tạo lớp học', type: 'postback', payload: 'CREATE_CLASS' },
            { title: 'Vào lớp học', type: 'postback', payload: 'JOIN_CLASS' },
            { title: 'Danh sách lớp học', type: 'postback', payload: 'LIST_CLASS' },
        ]
    })
}