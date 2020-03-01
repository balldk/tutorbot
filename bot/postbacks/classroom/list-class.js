const checkInRoom = require('../../utils/check-in-room')

const state = global.state

module.exports = pageIndex => async (payload, chat) => {
    if (checkInRoom(payload, chat)) return false

    let publicClasses = Object.entries(state.classes).filter(each => each[1].privacy === 'public')
    
    let nextPageIndex = pageIndex + 8
    let cardClasses = publicClasses.slice(pageIndex, nextPageIndex).map(each => {
        let [ classId, classData ] = each
        let formatAmount = `Học sinh: ${classData.members.length}/${classData.limit}`
        return {
            title: `Mã lớp: ${classId}`,
            subtitle: `Tên: ${classData.title}\n${formatAmount}`,
            buttons: [{ type: 'postback', title: 'Tham gia', payload: `JOIN_CLASS#${classId}` }]
        }
    })
    if (cardClasses.length === 0) {
        chat.say({
            text: 'Hiện tại chưa có lớp học nào cả, bạn có muốn tạo lớp học mới không?',
            buttons: [{ type: 'postback', title: 'Tạo lớp học', payload: 'CREATE_CLASS'}]
        })
    } else {
        if (nextPageIndex < publicClasses.length) {
            cardClasses.push({
                title: `Bạn đã xem ${nextPageIndex}/${publicClasses.length} lớp`,
                buttons: [{ type: 'postback', title: 'Xem thêm...', payload: `LIST_CLASS#${nextPageIndex}` }] 
            })
        }
        chat.say({ cards: cardClasses })
    }
}