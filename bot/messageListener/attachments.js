const FileLink = require('../../db/models/FileLink')
const randomStr = require('../../utils/randomStr')
const broadcastClass = require('../utils/broadcastClass')

const state = global.state
const attachTypes = {image: '📷 Hình ảnh', video: '🎬 Video', audio: '🔊 Ghi âm', file: '📁 Tệp'}

module.exports = (payload, other, bot) => {
    let userId = payload.sender.id
    let classData = state.classes[other.classId]
    let options = { personaId: other.personaId }

    payload.message.attachments.forEach(attach => {
        // image type
        if (attach.type === 'image') {
            if (classData) broadcastClass(bot, userId, memberId => {
                bot.sendAttachment(memberId, attach.type, attach.payload.url, [], options)
            })
            else bot.sendAttachment(other.otherId, attach.type, attach.payload.url, [], options)
        // others
        } else {
            FileLink.create({ 
                url: attach.payload.url, 
                path: randomStr(12),
                type: attach.type,
                sender: payload.sender.id
            }, (err, data) => {
                if (err) return console.log(err)
                let fileUrl = `https://${process.env.HOST}/file/${data.path}`
                console.log(`New "${attach.type}" added at ${fileUrl}`)

                if (classData) broadcastClass(bot, userId, `${attachTypes[attach.type]}: ${fileUrl}`)
                else bot.say(other.otherId, `${attachTypes[attach.type]}: ${fileUrl}`, options)
            })
        }
    })
}