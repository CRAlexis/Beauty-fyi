'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ServiceForm extends Model {

    User() {
        return this.hasOne('App/Models/User')
    }
    Question() {
        return this.hasMany('App/Models/ServiceQuestion')
    }

}

module.exports = ServiceForm
