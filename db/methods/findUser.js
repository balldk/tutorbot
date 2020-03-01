const User = require('../models/User')

module.exports = async (userId, selectList) => {
    let res
    await User.findOne({ userId }, (err, data) => {
        if (err) return console.log(err)
        if (data) res = data._doc
    }).select(selectList)
    return res
}