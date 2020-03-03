const broadcastClass = require('./broadcastClass')
const checkInRoom = require('./check-in-room')
const Ask = require('./Ask')

const state = global.state

const end = (bot, convo, classId) => {
    let userId = convo.userId
    let classData = state.classes[classId]

    state.room[userId] = {
        classId,
        personaId: convo.get('personaId'),
        nickname: convo.get('nickname')
    }
    classData.members.push(userId)
    let privacyVN = classData.privacy === 'public' ? 'Công khai' : 'Không công khai'
    let formatAmount = `Học sinh: ${classData.members.length}/${classData.limit}`
    convo.say({
        cards: [{
            title: `Bạn đã tham gia lớp học! (${privacyVN})`,
            subtitle: `Tên: ${classData.title}\n${formatAmount}`
        }]
    })
    broadcastClass(bot, userId, `"${convo.get('nickname')}" đã tham gia lớp học!`, true)
    convo.end()
}

module.exports = async (bot, payload, chat, classId) => {
    if (checkInRoom(payload, chat)) return false

    if (state.classes[classId]) {
        let classData = state.classes[classId]
        if (classData.limit <= classData.members.length) {
            return chat.say('Lớp học đã đầy!')
        }

        const ask = new Ask(chat, 'Đã huỷ!', true)
        ask.setConvers({
            convers: [ 'askPersona' ],
            endConver(convo) {
                end(bot, convo, classId)
            }
        })
        ask.start()
    } else {
        chat.say('Lớp học không tồn tại!')
    }
}