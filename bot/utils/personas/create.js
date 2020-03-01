const fetch = require('node-fetch')

module.exports = async data => {
    let body = {
        name: data.name,
        profile_picture_url: data.picture
    }
    let res = await fetch(`https://graph.facebook.com/me/personas?access_token=${process.env.FB_ACCESS_TOKEN}`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    res = await res.json()
    return res
}