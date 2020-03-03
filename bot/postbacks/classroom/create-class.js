
const randomStr = require('../../../utils/randomStr')
const checkInRoom = require('../../utils/check-in-room')
const Ask = require('../../utils/Ask')
const state = global.state

const cancel = convo => {
    convo.say('Đã huỷ lớp học!')
    convo.end()
    return true
}

const checkCancel = (payload, convo) => {
    if (!payload.message) return false
    if (!payload.message.text) return false
    if (payload.message.text.toLowerCase() === 'huỷ') return cancel(convo)
}

const notValid = async convo => {
    await convo.say('Thông tin bạn vừa nhập không hợp lệ!')
    cancel(convo)
}

const askTitle = convo => {
    convo.ask({
        text: 'Hãy nhập tên lớp học',
        quickReplies: ['Huỷ']
    }, async (payload, convo) => {
        if (checkCancel(payload, convo)) return false
        if (!payload.message || !payload.message.text) return notValid(convo)

        let msg = payload.message.text.replace(/\s+/g, ' ')
        // Check if title higher than 150 digits 
        if (msg.length >= 1 && msg.length <= 60) {
            convo.set('title', msg)
            askPrivacy(convo)
        } else {
            await convo.say('Tên lớp không được quá 60 kí tự!')
            cancel(convo)
        }
    })
}

const askPrivacy = convo => {
    convo.ask({
        text: 'Bạn có muốn công khai lớp học không?',
        quickReplies: ['Huỷ', 'Có', 'Không']
    }, (payload, convo) => {
        if (checkCancel(payload, convo)) return false
        if (!payload.message || !payload.message.text) return notValid(convo)

        let msg = payload.message.text.toLowerCase()
        let privacy
        if (msg === 'có') {
            privacy = 'public'
        } else if (msg === 'không') {
            privacy = 'private'
        } else {
            return notValid(convo)
        }
        convo.set('privacy', privacy)
        askClassLimit(convo)
    })
}

const askClassLimit = convo => {
    let max = 40
    convo.ask({
        text: `Hãy nhập giới hạn học sinh (tối đa: ${max})`,
        quickReplies: ['Huỷ', '10', '15', '20']
    }, (payload, convo) => {
        if (checkCancel(payload, convo)) return false
        if (!payload.message || !payload.message.text) return notValid(convo)
        
        let limit = parseInt(payload.message.text)
        if (limit >= 1 && limit <= max) {
            convo.set('limit', limit)
            end(convo)
        } else {
            return notValid(convo)
        }
    })
}

const end = async convo => {
    let userId = convo.userId
    let classId = randomStr(10)
    let classData = {
        title: convo.get('title'),
        privacy: convo.get('privacy'),
        limit: convo.get('limit'),
        members: [ userId ]
    }
    state.classes[classId] = classData
    state.room[userId] = {
        classId,
        personaId: convo.get('personaId'),
        nickname: convo.get('nickname')
    }
    let privacyVN = classData.privacy === 'public' ? 'Công khai' : 'Không công khai'
    await convo.say({
        cards: [{
            title: `Lớp học đã được tạo! (${privacyVN})`,
            subtitle: `Tên: ${classData.title}\nHọc sinh: 1/${classData.limit}`
        }]
    })
    await convo.say(`Mã lớp học: ${classId}`)
    convo.end()
}

module.exports = (payload, chat) => {
    if (checkInRoom(payload, chat)) return false

    const ask = new Ask(chat, 'Đã huỷ tạo lớp học!', true)
    ask.setConvers({
        convers: [ 'askPersona' ],
        endConver: askTitle
    })
    ask.start()
}