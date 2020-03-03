const joinClass = require('../../utils/join-class')
const checkInRoom = require('../../utils/check-in-room')
const Ask = require('../../utils/Ask')

module.exports = bot => (payload, chat) => {
    if (checkInRoom(payload, chat)) return false

    const askClass = convo => {
        convo.ask('Hãy nhập mã lớp học', (payload, convo) => {
            let classId = payload.message.text
            joinClass(bot, payload, chat, classId)
            convo.end()
        })
    }
    const ask = new Ask(chat, 'Đã huỷ!', true)
    ask.setConvers({
        convers: [ 'askPersona' ],
        endConver: askClass
    })
    ask.start()
}