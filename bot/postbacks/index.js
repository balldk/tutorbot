const Settings = require('./settings')
const Match = require('./match')
const MatchStudent = require('./match-student')
const MatchTutor = require('./match-tutor')
const GetStart = require('./get-start')

module.exports = bot => {
    bot.on('postback:SETTINGS', Settings)
    bot.on('postback:MATCH', Match)
    bot.on('postback:MATCH_STUDENT', MatchStudent(bot))
    bot.on('postback:MATCH_TUTOR', MatchTutor(bot))
    bot.on('postback:GET_START', GetStart)
}