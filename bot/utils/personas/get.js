const fetch = require('node-fetch')

module.exports = async persona => {
    let res = await fetch(`https://graph.facebook.com/${persona}?access_token=${process.env.FB_ACCESS_TOKEN}`, { 
        method: 'GET' 
    })
    res = await res.json()
    return res
}