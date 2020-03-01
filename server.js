

// Config
require('dotenv').config()
require('./utils/globalAppState') // set state to global
const PORT = process.env.PORT || 8080

// Main app
const app = require('./routes/app')

// Database
require('./db/methods/connect')

// Start to listen
app.listen(PORT, () => {
	console.log(`TutorBot is running at PORT:${PORT}...`)
})