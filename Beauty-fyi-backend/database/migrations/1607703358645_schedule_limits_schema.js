'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScheduleLimitsSchema extends Schema {
  up () {
    this.create('schedule_limits', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('minimum_hours_for_reschedule')
      table.integer('maximum_days_for_schedule_in_future')
      table.boolean('allow_clients_to_reschedule_or_cancel').defaultTo(false)
      table.integer('hours_in_advance_they_can_reschedule_or_cancel')
      table.boolean('avoid_gaps_between_appointments_during_the_day').defaultTo(false)
      table.boolean('allow_gaps')
      table.integer('allow_gaps_up_to')
      table.timestamps()
    })
  }

  down () {
    this.drop('schedule_limits')
  }
}

module.exports = ScheduleLimitsSchema
