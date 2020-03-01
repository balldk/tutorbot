const fetch = require('node-fetch')

const getAll = async (data=[], nextUrl=null) => {
    let url = nextUrl || `https://graph.facebook.com/me/personas?access_token=${process.env.FB_ACCESS_TOKEN}&limit=4`
    let res = await fetch(url, { 
        method: 'GET' 
    })
    res = await res.json()
    data = [...data, ...res.data]
    if (res.paging && res.paging.next) {
        return await getAll(data, res.paging.next)
    } else {
        return data
    }
}

module.exports = getAll