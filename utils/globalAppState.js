const fs = require('fs')
const initialState = require('./initialState')
let filename = 'backup-state.json'

try {
    global.state = JSON.parse(fs.readFileSync(filename, 'utf-8'))
    global.state.room[0] // make sure state is right format
} catch(err) {
    global.state = initialState
}

// Backup cyclically
setInterval(() => {
    global.state.lastBackup = new Date()
    fs.writeFile(filename, JSON.stringify(global.state), () => {
        console.log('Backup State:', new Date())
    })
}, 1000 * 60 * process.env.BACKUP_INTERVAL)