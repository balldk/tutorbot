const Ask = require('../utils/Ask')
const match = require('../utils/match')

const User = require('../../db/models/User')

module.exports = bot => (payload, chat) => {

    const cancelConvo = convo => {
        convo.say('Đã huỷ ghép đôi!')
        convo.end()
        return true
    }
    const ask = Ask(cancelConvo)

    User.findOne({ userId: payload.sender.id }, async (err, res) => {
        if (err) return console.log(err)
        else {
            data = res ? res._doc : {}

            chat.conversation(convo => {
                convo.set('userId', payload.sender.id)
                convo.set('goodSub', data.goodSub)
                convo.set('grade', data.grade)
                convo.set('userType', 'tutor')

                if (!data.grade) {
                    ask.askGrade(convo, convo => {
                        ask.askGoodSub(convo, convo => {
                            match(convo, bot)
                        })
                    })
                } else if (!data.goodSub) {
                    ask.askGoodSub(convo, async convo => {
                        if (!convo.get('goodSub')) {
                            await chat.say('Bạn không thể bỏ qua mục này')
                            return cancelConvo(convo)
                        } else {
                            match(convo, bot)
                        }
                    })
                } else {
                    match(convo, bot, false)
                }
            })
        }
    })
}