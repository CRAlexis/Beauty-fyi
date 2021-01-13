'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScheduleAvailabilityDaySchema extends Schema {
  up () {
    this.create('schedule_availability_days', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.boolean('active')
      table.string('day')
      table.time('start_time')
      table.time('end_time')
      table.string('location')
      table.string('timezone')
      table.timestamps()
    })
  }

  down () {
    this.drop('schedule_availability_days')
  }
}

module.exports = ScheduleAvailabilityDaySchema
