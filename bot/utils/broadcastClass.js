const state = global.state

module.exports = (bot, userId, msg, isBot=false) => {
    let user = state.room[userId]
    state.classes[user.classId].members.forEach(memberId => {
        if (memberId === userId) return false

        if (typeof(msg) === 'string') bot.say(memberId, msg, { personaId: isBot ? '' : user.personaId})
        else msg(memberId)
    })
}