
const digits = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const randomStr = (len) => {
    let str = ''
    for (let i = 0; i < len; i++) {
        str += digits[Math.floor(Math.random() * digits.length)]
    }
    return str
}

module.exports = randomStr