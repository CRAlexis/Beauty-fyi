'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ScheduleLimit extends Model {

  User () {
    return this.hasOne('App/Models/User')
  }

}

module.exports = ScheduleLimit
