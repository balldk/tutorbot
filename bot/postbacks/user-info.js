const findUser = require('../../db/methods/findUser')
const personas = require('../utils/personas')
const subjects = require('../templates/subjects')

module.exports = async (payload, chat) => {
    let userData = await findUser(payload.sender.id)
    if (!userData) return chat.say({
        text: 'Tài khoản của bạn chưa có thông tin, bạn có muốn cài đặt tài khoản không?',
        buttons: [{ type: 'postback', title: 'Cài đặt tài khoản', payload: 'SETTINGS' }]
    })

    let persona = await personas.get(userData.personaId)
    let grade = userData.grade || '???'
    let needSub = subjects[userData.needSub] || {}
    let goodSub = subjects[userData.goodSub] || {}
    needSub = needSub.title || '???'
    goodSub = goodSub.title || '???'

    chat.say({
        cards: [{
            image_url: persona.profile_picture_url,
            title: `Nickname: ${persona.name}`,
            subtitle: `Lớp: ${grade}\nMôn cần gia sư: ${needSub}\nMôn gia sư: ${goodSub}`,
            buttons: [{ type: 'postback', title: 'Cài đặt tài khoản', payload: 'SETTINGS' }]
        }]
    })
}