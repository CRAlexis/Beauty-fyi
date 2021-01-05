'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScheduleLimitsSchema extends Schema {
  up () {
    this.create('schedule_limits', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('minimumHoursBeforeAppointment')
      table.integer('maximumDaysInAdvance')
      table.boolean('rescheduleAppointments')
      table.boolean('cancelAppointments')
      table.integer('maximumHoursForReschedule')
      table.boolean('avoidGaps')
      table.boolean('allowGaps')
      table.integer('gapHours')
      table.timestamps()
    })
  }

  down () {
    this.drop('schedule_limits')
  }
}

module.exports = ScheduleLimitsSchema
