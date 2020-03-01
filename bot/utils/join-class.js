const broadcastClass = require('./broadcastClass')
const findUser = require('../../db/methods/findUser')
const personas = require('./personas')
const state = global.state

module.exports = async (bot, chat, classId) => {
    let userId = chat.userId
    if (state.classes[classId]) {
        let classData = state.classes[classId]
        if (classData.limit <= classData.members.length) {
            return chat.say('Lớp học đã đầy!')
        }

        let userData = await findUser(userId, 'personaId')
        let persona = await personas.get(userData.personaId)

        state.room[userId] = {
            classId,
            personaId: userData.personaId,
            nickname: persona.name
        }
        classData.members.push(userId)
        let privacyVN = classData.privacy === 'public' ? 'Công khai' : 'Không công khai'
        let formatAmount = `Học sinh: ${classData.members.length}/${classData.limit}`
        chat.say({
            cards: [{
                title: `Bạn đã tham gia lớp học! (${privacyVN})`,
                subtitle: `Tên: ${classData.title}\n${formatAmount}`
            }]
        })
        broadcastClass(bot, userId, `"${persona.name}" đã tham gia lớp học!`, true)
    } else {
        chat.say('Lớp học không tồn tại!')
    }
}