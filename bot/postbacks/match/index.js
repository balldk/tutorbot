const Ask = require('../../utils/Ask')
const match = require('../../utils/match')
const checkInRoom = require('../../utils/check-in-room')

module.exports = (bot, userType) => (payload, chat) => {
    if (checkInRoom(payload, chat)) return false

    let askSub = userType === 'student' ? 'askNeedSub' : 'askGoodSub'

    const ask = new Ask(chat, 'Đã huỷ ghép đôi!', true)
    ask.setConvers({
        convers: [ 'askPersona', ['askGrade', [true]], [askSub, [true]] ],
        startConver(convo, next) {
            convo.set('userType', userType)
            next(convo)
        },
        endConver(convo) {
            match(convo, bot, ask.userData)
        }
    })
    ask.start()
}