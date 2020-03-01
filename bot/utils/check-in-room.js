const state = global.state

module.exports = (payload, chat) => {
    let senderId = payload.sender.id
    let msg
    let repText
    if (state.room[senderId]) {
        if (state.classes[state.room[senderId].classId]) 
            msg = 'Bạn có muốn thoát khỏi lớp học không?'
        else
            msg = 'Bạn có muốn thoát khỏi cuộc trò chuyện không?'
        repText = 'Thoát'
    } else if (state.waitStudents[senderId] || state.waitTutors[senderId]) {
        msg = 'Hệ thống đang tìm kiếm người phù hợp, bạn có muốn dừng tìm kiếm không?'
        repText = 'Dừng tìm kiếm'
    }
    if (msg) {
        chat.say({
            text: msg,
            quickReplies: [
                { content_type: 'text', title: repText, payload: 'OUT_ROOM'},
                { content_type: 'text', title: 'Không' }
            ]
        })
        return true
    }
    return false
}