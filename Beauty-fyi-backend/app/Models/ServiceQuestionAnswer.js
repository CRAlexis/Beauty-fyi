'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ServiceQuestionAnswer extends Model {
    Question() {
        return this.hasOne('App/Models/ServiceQuestion')
    }
    Appointment() {
        return this.hasOne('App/Models/Appointment')
    }
}

module.exports = ServiceQuestionAnswer
