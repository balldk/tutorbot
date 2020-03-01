let create = require('./create')
let get = require('./get')
let getAll = require('./get-all')
let deletePersona = require('./delete')
let deleteAll = require('./delete-all')
let update = require('./update')

module.exports = {
    create, 
    get, 
    getAll,
    delete: deletePersona,
    deleteAll,
    update
}