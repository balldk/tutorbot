const fetch = require('node-fetch')
const getAll = require('./get-all')

module.exports = async () => {
    let allPersonas = await getAll()
    allPersonas.forEach(persona => {
        fetch(`https://graph.facebook.com/${persona.id}?access_token=${process.env.FB_ACCESS_TOKEN}`, { 
            method: 'DELETE' 
        })
    })
}