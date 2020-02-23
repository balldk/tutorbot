const User = require('./models/User')

module.exports = (userId, updateData, callback) => {
    let options = { upsert: true, new: true }
    User.findOneAndUpdate({ userId }, updateData, options, (err, data) => {
        if (err) return console.log(err)
        callback(data)
    })
}