const Ask = require('../utils/Ask')
const checkInRoom = require('../utils/check-in-room')
const avatars = require('../templates/avatars')

const updateUser = require('../../db/methods/updateUser')

module.exports = (payload, chat) => {
    if (checkInRoom(payload, chat)) return false

    const endConvo = convo => {
        let update = {
            grade: convo.get('grade'),
            goodSub: convo.get('goodSub'),
            needSub: convo.get('needSub'),
            nickname: convo.get('nickname'),
            personaId: convo.get('personaId')
        }
        updateUser(payload.sender.id, update, data => {
            console.log(data.userId, 'updated profile')
        })
        convo.say('Hoàn tất rồi đó! Bạn có thể kết nối với người khác từ bây giờ, chúc bạn may mắn ;)')
        convo.end()
    }
    const ask = new Ask(chat, 'Đã huỷ cài đặt!')
    ask.setConvers({
        convers: [ 'askPersona', 'askGrade', 'askNeedSub', 'askGoodSub' ],
        endConver: endConvo
    })
    ask.start()
}