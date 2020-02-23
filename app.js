
const mongoose = require('mongoose')
const express = require('express')

// Config
require('./globalAppState') // set state to global
require('dotenv').config()
const PORT = process.env.PORT || 3000

const app = express()
const route = require('./route')
const bot = require('./bot')

app.use('/api', route)
app.use('/bot', bot.app)

// Database
mongoose
	.connect(process.env.MONGO_URI, { 
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('MongoDB connected'))
	.catch(err => console.log(err))

// Start to listen
app.listen(PORT, () => {
	console.log(`TutorBot is running at PORT:${PORT}...`)
})