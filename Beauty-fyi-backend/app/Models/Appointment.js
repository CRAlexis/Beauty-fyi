'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Appointment extends Model {
    User() {
        return this.hasOne('App/Models/User')
    }
    Service() { return this.hasOne('App/Models/Service') }
    Image() {
        this.hasOne('App/Models/AppointmentReferenceImage')
    }
    Answer() {
        this.hasMany('App/Models/ServiceQuestionAnswer')
    }
    Transaction() {
        this.hasOne('App/Models/Transaction')
    }
}

module.exports = Appointment
