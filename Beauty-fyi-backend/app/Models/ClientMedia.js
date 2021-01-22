'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ClientMedia extends Model {
    User() {
        return this.hasOne('App/Models/User')
    }
}

module.exports = ClientMedia
