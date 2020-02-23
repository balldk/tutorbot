const state = global.state

module.exports = (payload, chat) => {
    let senderId = payload.sender.id
    let msg
    let repText
    if (state.room[senderId]) {
        msg = 'Bạn đang trong cuộc trò chuyện, bạn có muốn kết thúc cuộc trò chuyện không?'
        repText = 'kết thúc'
    } else if (state.waitStudents[senderId] || state.waitTutors[senderId]) {
        msg = 'Hệ thống đang tìm kiếm người phù hợp, bạn có muốn dừng tìm kiếm không?'
        repText = 'Dừng tìm kiếm'
    }
    if (msg) {
        chat.say({
            text: msg,
            quickReplies: [
                { content_type: 'text', title: repText, payload: 'OUT_ROOM'}
            ]
        })
        return true
    }
    return false
}