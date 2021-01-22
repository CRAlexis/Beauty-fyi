'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ServiceQuestion extends Model {
    Form(){
        this.hasOne('App/Models/ServiceForm')
    }
    Answer() {
        return this.hasMany('App/Models/ServiceQuestionAnswer')
    }
}

module.exports = ServiceQuestion
