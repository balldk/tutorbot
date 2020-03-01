const broadcastClass = require('./broadcastClass')
const state = global.state

module.exports = async (payload, chat, bot) => {
    let userId = payload.sender.id
    let other = state.room[userId]
    // If user in wait room
    if (state.waitStudents[userId]) {
        delete state.waitStudents[userId]
        chat.say('Đã dừng tìm kiếm!')
    } else if (state.waitTutors[userId]) {
        delete state.waitTutors[userId]
        chat.say('Đã dừng tìm kiếm!')
    } else if (other) {
        // If user in classroom
        if (state.classes[other.classId]) {
            let classId = other.classId
            // send message to each members
            chat.say('Bạn đã rời khỏi lớp học!')
            broadcastClass(bot, userId, `"${state.room[userId].nickname}" đã rời khỏi lớp học!`, true)
            // remove user from class and room
            delete state.room[userId]
            let userIndex = state.classes[classId].members.findIndex(value => value === userId)
            state.classes[classId].members.splice(userIndex, 1)
            // Check if class is empty -> delete class
            if (state.classes[classId].members.length === 0) {
                delete state.classes[classId]
            }
        // If user in conversation
        } else {
            delete state.room[userId]
            delete state.room[other.otherId]
            chat.say('Bạn đã thoát khỏi cuộc trò chuyện!')
            bot.say(other.otherId, 'Người ta thoát khỏi cuộc trò chuyện rồi kìa :)')
        }
    }
}