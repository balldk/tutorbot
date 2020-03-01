const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let regHost = host = process.env.HOST.split('.').join('\\.')
let linkRegex = RegExp(`^(https?:\\/\\/)?((?!${regHost})[-a-zA-Z0-9@:%._\\+~#=]{2,}\\.[a-z]{2,})\\b([-a-zA-Z0-9@:%_\\+.~#?&\\/\\/=]*)$`)
let pathRegex = /^[a-zA-Z\d-\_]{3,100}$/

const FileLink = mongoose.Schema({
    url: {
        type: String,
        required: true,
        match: [ linkRegex, 'Invalid url' ] 
    },
    path: {
        type: String,
        required: true,
        unique: true,
        index: true,
        match: [ pathRegex, 'Invalid path' ]
    },
    type: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        required: true,
    }
}, { timestamps: true })

FileLink.plugin(uniqueValidator, { message: 'path already exist' })

module.exports = mongoose.model('FileLink', FileLink)