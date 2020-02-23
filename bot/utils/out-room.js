const state = global.state

module.exports = (payload, chat, bot) => {
    let userId = payload.sender.id
    let otherPer = state.room[userId]
    if (state.waitStudents[userId]) {
        delete state.waitStudents[userId]
        chat.say('Đã dừng tìm kiếm!')
    } else if (state.waitTutors[userId]) {
        delete state.waitTutors[userId]
        chat.say('Đã dừng tìm kiếm!')
    } else if (otherPer) {
        delete state.room[userId]
        delete state.room[otherPer]
        chat.say('Cuộc trò chuyện đã kết thúc!')
        bot.say(otherPer, 'Cuộc trò chuyện đã kết thúc!')
    }
}