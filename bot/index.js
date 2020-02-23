const BootBot = require('bootbot')

const postbacksListener = require('./postbacks')
const messageListener = require('./messageListener')
const PersistentMenu = require('./templates/persistent-menu')

// Bot config
const bot = new BootBot({
	accessToken: process.env.FB_ACCESS_TOKEN,
	verifyToken: process.env.FB_VERIFY_TOKEN,
	appSecret: process.env.FB_APP_SECRET
})

// Listener
messageListener(bot)
postbacksListener(bot)

// Persistent features
bot.setGetStartedButton('GET_START')
bot.setPersistentMenu(PersistentMenu)

bot._initWebhook()
module.exports = bot