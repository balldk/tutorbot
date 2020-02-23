const express = require('express')

const route = express.Router()
const User = require('../db/models/User')

route.get('/users', (req, res) => {
	User.find({}, (err, data) => {
		res.json(data)
	})
})

route.get('/state', (req, res) => {
	res.json(global.state)
})

route.get('/delete-all', (req, res) => {
	User.deleteMany({}, (err, data) => {
		if (err) return console.log(err)
		res.redirect('/api/users')
	})
})

module.exports = route