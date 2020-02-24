
const subjects = require('../templates/subjects')
const gradeList = require('../templates/grade-list')

module.exports = cancel => ({
    async notValid(convo) {
        await convo.say('Thông tin bạn vừa nhập không hợp lệ, xin hãy thử lại nhé!')
        cancel(convo)
    },
    checkCancel(payload, convo) {
        if (!payload.message) return false
        if (!payload.message.text) return false
        if (payload.message.text.toLowerCase() === 'huỷ') return cancel(convo)
    },
    askGrade(convo, next) {
        convo.ask({
            text: 'Bạn đang học lớp mấy?',
            quickReplies: ['Huỷ', '6', '7', '8', '9', '10', '11', '12']
        }, (payload, convo) => {
            if (this.checkCancel(payload, convo)) return false
            if (!payload.message) return cancel(convo)
            if (!payload.message.text) return cancel(convo)
    
            let ans = parseInt(payload.message.text)
            if (ans >= 6 && ans <= 12) {
                convo.set('grade', ans)
                next(convo)
            } else this.notValid(convo)
        })
    },
    async askNeedSub(convo, next) {
        await convo.say({ cards: gradeList(subjects) })
        
        convo.ask({ 
            text: 'Hãy chọn môn mà bạn cần gia sư nhé!', 
            quickReplies: ['Huỷ', 'Bỏ qua mục này']
        }, (payload, convo) => {
            if (this.checkCancel(payload, convo)) return false
            // Skip check
            if (payload.message)
                if (payload.message.text)
                    if (payload.message.text.toLowerCase() === 'bỏ qua mục này') {
                        convo.set('needSub', undefined)
                        return next(convo)
                    }
            // Not valid check
            if (!payload.postback) return this.notValid(convo)
            else if (!subjects[payload.postback.payload]) return cancel(convo)
    
            convo.set('needSub', payload.postback.payload)
            next(convo)
        })
    },
    async askGoodSub(convo, next) {
        await convo.say({ cards: gradeList(subjects) })
        
        convo.ask({
            text: 'Bạn muốn trở thành gia sư dạy ở môn nào?', 
            quickReplies: ['Huỷ', 'Bỏ qua mục này'] 
        }, (payload, convo) => {
            if (this.checkCancel(payload, convo)) return false
            // Skip check
            if (payload.message)
                if (payload.message.text) 
                    if (payload.message.text.toLowerCase() === 'bỏ qua mục này') {
                        convo.set('goodSub', undefined)
                        return next(convo)
                    }
            // Not valid check
            if (!payload.postback) return this.notValid(convo)
            else if (!subjects[payload.postback.payload]) return cancel(convo)
    
            convo.set('goodSub', payload.postback.payload)
            next(convo)
        })
    }
})