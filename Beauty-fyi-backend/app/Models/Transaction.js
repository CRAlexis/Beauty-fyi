'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Transaction extends Model {
    Appointment() {
        this.hasOne('App/Models/Appointment')
    }
}

module.exports = Transaction
