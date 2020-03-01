const deletePersona = require('./delete')
const createPersona = require('./create')

module.exports = async (oldPersona, data) => {
    deletePersona(oldPersona)
    let persona = await createPersona(data)
    return persona
}