const Ask = require('../utils/Ask')
const checkInRoom = require('../utils/check-in-room')

const updateUser = require('../../db/updateUser')

module.exports = (payload, chat) => {
    if (checkInRoom(payload, chat)) return false

    const cancelConvo = convo => {
        convo.say('Đã huỷ cài đặt!')
        convo.end()
        return true
    }

    const endConvo = convo => {
        let update = { 
            grade: convo.get('grade'),
            goodSub: convo.get('goodSub'),
            needSub: convo.get('needSub')
        }
        updateUser(payload.sender.id, update, data => {
            console.log(data.userId, 'updated profile')
        })
        convo.say('Hoàn tất rồi đó! Bạn có thể kết nối với người khác từ bây giờ, chúc bạn may mắn ;)')
        convo.end()
    }
    const ask = Ask(cancelConvo)
    chat.conversation(convo => {
        ask.askGrade(convo, () => {
            ask.askNeedSub(convo, () => {
                ask.askGoodSub(convo, endConvo)
            })
        })
    })
}