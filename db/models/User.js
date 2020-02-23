const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            require: true,
            unique: true,
            index: true
        },
        grade: {
            type: Number,
            min: 6,
            max: 12,
            require: true
        },
        goodSub: {
            type: String
        },
        needSub: {
            type: String
        }
    },
    { timestamps: true }
)

mongoose.set('useCreateIndex', true)
UserSchema.plugin(uniqueValidator, { message: 'is already taken' })

module.exports = mongoose.model('User', UserSchema)