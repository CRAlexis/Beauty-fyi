'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AppointmentReferenceImage extends Model {
    Appointment() {
        this.hasOne('App/Models/Appointment')
    }
}

module.exports = AppointmentReferenceImage
