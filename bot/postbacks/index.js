const Settings = require('./settings')
const GetStart = require('./get-start')
const UserInfo = require('./user-info')
const Help = require('./help')
const EndConver = require('../messageListener/end')
const CustomPostback = require('./custom-postback')

const Match = require('./match')

const CreateClass = require('./classroom/create-class')
const JoinClass = require('./classroom/join-class')
const ListClass = require('./classroom/list-class')

module.exports = bot => {
    bot.on('postback:SETTINGS', Settings)
    bot.on('postback:GET_START', GetStart)
    bot.on('postback:USER_INFO', UserInfo)
    bot.on('postback:HELP', Help)
    bot.on('postback:END_CONVER', EndConver)

    bot.on('postback:MATCH_STUDENT', Match(bot, 'student'))
    bot.on('postback:MATCH_TUTOR', Match(bot, 'tutor'))
    
    bot.on('postback:CREATE_CLASS', CreateClass)
    bot.on('postback:JOIN_CLASS', JoinClass(bot))
    bot.on('postback:LIST_CLASS', ListClass(0))

    bot.on('postback', CustomPostback(bot))
}