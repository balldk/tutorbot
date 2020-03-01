const express = require('express')

const api = express.Router()
const User = require('../db/models/User')
const FileLink = require('../db/models/FileLink')
const personas = require('../bot/utils/personas')
const initialState = require('../utils/initialState')

const adminSecure = (req, res, next) => {
	let secret = req.query.secret
	if (process.env.SECRET === secret) next()
	else res.redirect('/404')
}

api.use(adminSecure)

// State
api.get('/state', (req, res) => {
	res.json(global.state)
})

api.get('/reset-state', (req, res) => {
	global.state = initialState
	res.redirect('state?secret=' + req.query.secret)
})

// User
api.get('/users', (req, res) => {
	User.find({}, (err, data) => {
		res.json(data)
	})
})

api.get('/delete-all-users', (req, res) => {
	personas.deleteAll()
	User.deleteMany({}, (err, data) => {
		if (err) return console.log(err)
		res.redirect('users?secret=' + req.query.secret)
	})
})

api.get('/delete-user/:userId', (req, res) => {
	let userId = req.params.userId
	User.findOneAndDelete({ userId }, (err, data) => {
		if (err) return res.json({ status: 'Error' })
		if (!data) return res.json({ status: 'User is not exist' })
		if (data.personaId) {
			personas.delete(data.personaId)
		}
		res.redirect('/api/users?secret=' + req.query.secret)
	})
})

// File
api.get('/files', (req, res) => {
	FileLink.find({}, (err, data) => {
		res.json(data)
	})
})

api.get('/delete-all-files', (req, res) => {
	FileLink.deleteMany({}, (err, data) => {
		res.redirect('files?secret=' + req.query.secret)
	})
})

// Personas
api.get('/personas', async (req, res) => {
	let allPersona = await personas.getAll()
	res.json(allPersona)
})

api.get('/delete-all-personas', async (req, res) => {
	await personas.deleteAll()
	res.redirect('personas?secret=' + req.query.secret)
})

module.exports = api