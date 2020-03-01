
const subjects = require('../templates/subjects')
const gradeList = require('../templates/grade-list')
const findUser = require('../../db/methods/findUser')
const updateUser = require('../../db/methods/updateUser')
const personas = require('../utils/personas')

class Ask {
    constructor(chat, cancelMsg, skipExist=false) {
        this.chat = chat
        this.userId = chat.userId
        this.cancelMsg = cancelMsg
        this.skipExist = skipExist
    }
    setConvers({ convers, startConver, endConver }) {
        const recur = (convers, endConver) => {
            let method, params = []
            if (typeof(convers[0]) === 'string') method = convers[0]
            else [ method, params ] = convers[0]
            
            let next = convers.length > 1 ? recur(convers.slice(1), endConver) : endConver

            return convo => {
                this[method](convo, next, ...params)
            }
        }
        let t = recur(convers, endConver)
        startConver = startConver || ((convo, next) => next(convo))

        this.convers = async convo => {
            let userData = await findUser(this.userId, 'grade needSub goodSub personaId')
            this.userData = userData || {}
            // Put all data to convo
            convo.set('userId', this.userId)
            if (this.userData.personaId) {
                let persona = await personas.get(this.userData.personaId)
                convo.set('nickname', persona.name)
                convo.set('avatar', persona.profile_picture_url)
            }
            Object.entries(this.userData).forEach(each => {
                convo.set(each[0], each[1])
            })
            startConver(convo, t)
        }
    }
    start() {
        this.chat.conversation(this.convers)
    }
    cancel(convo) {
        convo.say(this.cancelMsg)
        convo.end()
        return true
    }
    async notValid(convo) {
        await convo.say('Thông tin bạn vừa nhập không hợp lệ!')
        this.cancel(convo)
    }
    checkCancel(payload, convo) {
        if (!payload.message) return false
        if (!payload.message.text) return false
        if (payload.message.text.toLowerCase() === 'huỷ') return this.cancel(convo)
    }
    skipCheck(payload, convo, next, required) {
        if (payload.message)
        if (payload.message.text)
        if (payload.message.text.toLowerCase() === 'bỏ qua mục này') {
            if (required) {
                convo.say('Bạn không thể bỏ qua mục này!')
                this.cancel(convo)
            } else {
                next(convo)
            }
            return true
        }
        return false
    }
    setQuickrep(data, required) {
        let quickRep = ['Huỷ']
        if (required === false) {
            quickRep.push('Bỏ qua mục này')
        }
        return [...quickRep, ...data]
    }
    askGrade(convo, next, required=false) {
        if (this.skipExist && this.userData.grade) return next(convo)

        let quickReplies = this.setQuickrep(['6', '7', '8', '9', '10', '11', '12'], required)

        convo.ask({
            text: 'Bạn đang học lớp mấy?',
            quickReplies
        }, (payload, convo) => {
            if (this.checkCancel(payload, convo)) return false
            if (this.skipCheck(payload, convo, next, required)) return false
            if (!payload.message) return this.cancel(convo)
            if (!payload.message.text) return this.cancel(convo)
    
            let ans = parseInt(payload.message.text)
            if (ans >= 6 && ans <= 12) {
                convo.set('grade', ans)
                next(convo)
            } else this.notValid(convo)
        })
    }
    async askNeedSub(convo, next, required=false) {
        if (this.skipExist && this.userData.needSub) return next(convo)

        let quickReplies = this.setQuickrep([], required)
        await convo.say({ cards: gradeList(subjects) })
        
        convo.ask({
            text: 'Hãy chọn môn mà bạn cần gia sư nhé!', 
            quickReplies
        }, (payload, convo) => {
            if (this.checkCancel(payload, convo)) return false
            if (this.skipCheck(payload, convo, next, required)) return false
            
            // Not valid check
            if (!payload.postback) return this.notValid(convo)
            else if (!subjects[payload.postback.payload]) return this.cancel(convo)
    
            convo.set('needSub', payload.postback.payload)
            next(convo)
        })
    }
    async askGoodSub(convo, next, required=false) {
        if (this.skipExist && this.userData.goodSub) return next(convo)

        let quickReplies = this.setQuickrep([], required)
        await convo.say({ cards: gradeList(subjects) })
        
        convo.ask({
            text: 'Bạn muốn trở thành gia sư dạy ở môn nào?', 
            quickReplies
        }, (payload, convo) => {
            if (this.checkCancel(payload, convo)) return false
            if (this.skipCheck(payload, convo, next, required)) return false

            // Not valid check
            if (!payload.postback) return this.notValid(convo)
            else if (!subjects[payload.postback.payload]) return this.cancel(convo)
    
            convo.set('goodSub', payload.postback.payload)
            next(convo)
        })
    }
    askPersona(convo, next) {
        if (this.userData.personaId) {
            if (this.skipExist) {
                return next(convo)
            } else {
                this.askNickname(convo, next, false)
            }
        } else
            this.askNickname(convo, next, true)
    }
    async askNickname(convo, next, required) {
        let quickReplies = this.setQuickrep([], required)

        let profile = await convo.getUserProfile()
        let username = `${profile.last_name} ${profile.first_name}`
        let lenLimit = 30

        if (username.length <= lenLimit) quickReplies.push({
            content_type: 'text',
            title: username,
            payload: 'USERNAME',
        })

        convo.ask({
            text: 'Hãy nhập nickname của bạn', 
            quickReplies
        }, async (payload, convo) => {
            const nextAvatar = convo => this.askAvatar(convo, next, profile, required)

            if (this.checkCancel(payload, convo)) return false
            if (this.skipCheck(payload, convo, nextAvatar, required)) return false
            if (payload.postback) return this.notValid(convo)
            if (payload.message.attachments) return this.notValid(convo)
            
            // If user choose default username
            let nickname
            if (payload.message.quick_reply && payload.message.quick_reply.payload === 'USERNAME'){
                nickname = username
            } else {
                nickname = payload.message.text.replace(/\s+/g, ' ')
            }
            // If reach nickname limit
            if (nickname.length > lenLimit) {
                await convo.say(`Nickname không được quá ${lenLimit} kí tự!`)
                this.cancel(convo)
            } else {
                convo.set('nickname', nickname)
                this.askAvatar(convo, next, profile, required)
            }
        })
    }
    async askAvatar(convo, next, profile, required) {
        const updatePersona = async convo => {
            let newPersona
            let data = {
                name: convo.get('nickname'),
                picture: convo.get('avatar')
            }
            if (this.userData.personaId) {
                newPersona = await personas.update(this.userData.personaId, data)
            } else {
                newPersona = await personas.create(data)
            }
            updateUser(this.userId, { personaId: newPersona.id })
            convo.set('personaId', newPersona.id)
        }
        const next2 = convo => {
            updatePersona(convo)
            next(convo)
        }

        let quickReplies = this.setQuickrep([], required)

        await convo.say({
            cards: [{
                title: 'Hình của bạn',
                image_url: profile.profile_pic,
                buttons: [{ 
                    type: 'postback',
                    title: 'Dùng hình này',
                    payload: 'IMG_URL_' + profile.profile_pic
                }]
            }]
        })

        convo.ask({
            text: 'Hãy gửi hình bạn muốn làm ảnh đại diện', 
            quickReplies
        }, async (payload, convo) => {
            if (this.checkCancel(payload, convo)) return false
            if (this.skipCheck(payload, convo, next2, required)) return false
            if (!payload.postback) return this.notValid(convo)
            
            let postback = payload.postback.payload
            if (postback && postback.slice(0, 8) === 'IMG_URL_') {
                let imgUrl = postback.slice(8)
                convo.set('avatar', imgUrl)
                next2(convo)
            } else this.cancel(convo)
        }, [{
            event: 'attachment',
            callback: (payload, convo) => {
                let attach = payload.message.attachments[0]
                if (attach.type === 'image') {
                    convo.set('avatar', attach.payload.url)
                    next2(convo)
                } else {
                    convo.say('File không hợp lệ!')
                    this.cancel(convo)
                }
            }
        }])
    }
}

module.exports = Ask