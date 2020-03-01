const joinClass = require('../../utils/join-class')
const Ask = require('../../utils/Ask')

module.exports = bot => (payload, chat) => {
    const askClass = convo => {
        convo.ask('Hãy nhập mã lớp học', (payload, convo) => {
            let classId = payload.message.text
            joinClass(bot, chat, classId)
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