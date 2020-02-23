const subjects = require('../templates/subjects')
const updateUser = require('../../db/updateUser')
const state = global.state

module.exports = async (convo, bot, isChange=true) => {
    // Get user info
    let userId = convo.get('userId')
    let userType = convo.get('userType')
    user = {
        needSub: convo.get('needSub'),
        goodSub: convo.get('goodSub'),
        grade: convo.get('grade')
    }

    // Check if info has been changed -> save info
    if (isChange) {
        updateUser(userId, user, data => {
            console.log(data.userId, 'updated profile')
        })
        await convo.say('Thông tin của bạn đã được lưu cho những lần sau, nếu bạn muốn thay đổi hãy vào phần "Menu -> Chỉnh sửa thông tin" nhé!')
    }
    await convo.say('Hệ thống đang tìm kiếm người phù hợp...')

    // Categorize userType
    let otherListType
    let userListType
    let subType
    let subTypeOther
    switch (userType) {
        case 'student':
            otherListType = 'waitTutors'
            userListType = 'waitStudents'
            subType = 'needSub'
            subTypeOther = 'goodSub'
            break
        case 'tutor':
            otherListType = 'waitStudents'
            userListType = 'waitTutors'
            subType = 'goodSub'
            subTypeOther = 'needSub'
            break
    }

    // Find best other
    let bestOther
    let findList = Object.entries(state[otherListType])
    let range = 1
    findList.some(each => {
        let [otherId, other] = each
        let matchSub = user[subType] === other[subTypeOther]
        let matchGrade
        let bestGrade
        if (userType === 'student') {
            matchGrade = (other.grade >= user.grade) && (other.grade <= user.grade + range)
            bestGrade = bestOther ? other.grade < bestOther.info.grade : true
        } else {
            matchGrade = (other.grade <= user.grade) && (other.grade >= user.grade - range)
            bestGrade = bestOther ? other.grade > bestOther.info.grade : true
        }

        if (matchSub && matchGrade && bestGrade) {
            bestOther = { id: otherId, info: other }
        }
        return bestOther ? bestOther.info.grade === user.grade : false
    })

    // Found
    if (bestOther) {
        let student = userType === 'student' ? { id: userId, info: user} : bestOther
        let tutor = userType === 'tutor' ? { id: userId, info: user} : bestOther
        // Put to room
        state.room[student.id] = tutor.id
        state.room[tutor.id] = student.id

        // Send confirm message to student and tutor
        let tutorSub = subjects[tutor.info.goodSub].title
        bot.say(student.id, {
            cards: [{
                title: `Đã tìm được một gia sư phù hợp với bạn (Lớp: ${tutor.info.grade}, Môn: ${tutorSub})`,
                subtitle: 'Nhập "end" hoặc "pp" để dừng cuộc trò chuyện nhé.'
            }]
        })
        let studentSub = subjects[student.info.needSub].title
        bot.say(tutor.id, {
            cards: [{
                title: `Đã tìm được một học sinh phù hợp với bạn (Lớp: ${student.info.grade}, Môn: ${studentSub})`,
                subtitle: 'Nhập "end" hoặc "pp" để dừng cuộc trò chuyện nhé.'
            }]
        })
        delete state[otherListType][bestOther.id]
    // Not found
    } else {
        // Add to wait room
        state[userListType][userId] = user
    }
    convo.end()
}