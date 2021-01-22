'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Service extends Model {
    User() {
        return this.hasOne('App/Models/User')
    }
    ServiceAddon() {
        return this.hasMany('App/Models/ServiceAddon')
    }
    ServiceStep() {
        return this.hasMany('App/Models/ServiceStep')
    }
    Appointment() {
        return this.hasMany('App/Models/Appointment')
    }
    ServiceForm() {
        return this.hasOne('App/Models/ServiceForm')
    }
}

module.exports = Service
