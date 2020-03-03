const fs = require('fs')
const initialState = require('./initialState')
let filename = 'backup-state.json'

try {
    global.state = JSON.parse(fs.readFileSync(filename, 'utf-8'))
    global.state.room[0] // make sure state is right format
} catch(err) {
    global.state = initialState
}