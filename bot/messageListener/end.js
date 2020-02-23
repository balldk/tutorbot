const checkInRoom = require('../utils/check-in-room')

module.exports = (payload, chat) => {
    if (!checkInRoom(payload, chat)) {
        chat.say('Bạn đang không ở trong bất kì cuộc trò chuyện nào cả!')
    }
}