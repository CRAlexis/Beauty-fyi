'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class UserClient extends Model {
    Client() {
        return this
            .belongsToMany('App/Models/User')
            .pivotTable('user_client')
    }
}

module.exports = UserClient
