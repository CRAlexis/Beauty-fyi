'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ScheduleAvailabilityDay extends Model {

  User () {
    return this.hasOne('App/Models/User')
  }

  Location() {
    return this.hasOne('App/Models/Location')
  }

}

module.exports = ScheduleAvailabilityDay
