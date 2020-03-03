const subjects = require('../templates/subjects')
const updateUser = require('../../db/methods/updateUser')
const state = global.state

module.exports = async (convo, bot, oldData) => {
    // Get user info
    let userId = convo.get('userId')
    let userType = convo.get('userType')
    let user = {
        needSub: convo.get('needSub'),
        goodSub: convo.get('goodSub'),
        grade: convo.get('grade'),
        personaId: convo.get('personaId')
    }

    // Check if info has been changed -> save info
    let isChange = Object.entries(user).some(each => oldData[each[0]] !== each[1])

    if (isChange) {
        updateUser(userId, user, data => {
            console.log(data.userId, 'updated profile')
        })
        await convo.say('Thông tin của bạn đã được lưu cho những lần sau, nếu bạn muốn thay đổi hãy vào phần "Menu -> Tính năng khác -> Cài đặt tài khoản" nhé!')
    }
    await convo.say({
        text: 'Hệ thống đang tìm kiếm người phù hợp...',
        quickReplies: [ { content_type: 'text', title: 'Dừng tìm kiếm', payload: 'OUT_ROOM'} ]
    })

    user.nickname = convo.get('nickname')

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
    let range = 3
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
        state.room[student.id] = {
            otherId: tutor.id,
            personaId: student.info.personaId
        }
        state.room[tutor.id] = {
            otherId: student.id,
            personaId: tutor.info.personaId
        }

        // Send confirm message to student and tutor
        let subtitle =  '🤖 Nhập "end" để kết thúc!'

        let tutorSub = subjects[tutor.info.goodSub].title
        let tutorInfoText = `Nickname: ${tutor.info.nickname} (Lớp ${tutor.info.grade})\nMôn: ${tutorSub}\n${subtitle}`
        bot.say(student.id, {
            cards: [{
                title: `Đã tìm được một gia sư phù hợp với bạn`,
                subtitle: tutorInfoText
            }]
        })

        let studentSub = subjects[student.info.needSub].title
        let studentInfoText = `Nickname: ${student.info.nickname} (Lớp ${student.info.grade})\nMôn: ${studentSub}\n${subtitle}`
        bot.say(tutor.id, {
            cards: [{
                title: `Đã tìm được một học sinh phù hợp với bạn`,
                subtitle: studentInfoText
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