const express = require('express')

const app = express()
const api = require('./api')
const bot = require('../bot')
const FileLink = require('../db/models/FileLink')
let messengerUrl = process.env.MESSENGER_URL

// Other routes
app.use('/api', api)
app.use('/bot', bot.app)

// Public assets
app.use(express.static('./assets/public'))

// Main route
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.send('TutorBot is running~~'))
app.get('/file/:filePath', (req, res) => {
    FileLink.findOne({ path: req.params.filePath }, (err, attach) => {
        if (err) {
            res.send('Error')
            return console.log(err)
        // Attach not found
        } else if (!attach) {
            return res.redirect('../404')
        // Attach is file type
        } else if (attach.type === 'file') {
            return res.redirect(attach.url)
        }
        // Display file
        res.render('message-file', {
            fileType: attach.type,
            fileUrl: attach.url
        })
    })
})

// 404
app.get('/404', (req, res) => {
    res.render('404', { messengerUrl })
})
app.get('*', (req, res) => {
    res.redirect('/404')
})

module.exports = app