'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AppointmentsSchema extends Schema {
  up () {
    this.create('appointments', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('client_id').unsigned().references('id').inTable('users')
      table.integer('service_id').unsigned().references('id').inTable('services')
      table.string('addon_ids')
      table.string('status').notNullable()
      table.time('client_start_time').notNullable()
      table.time('client_end_time').notNullable()
      table.time('stylist_start_time').notNullable()
      table.time('stylist_end_time').notNullable()
      table.date('appointment_date').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('appointments')
  }
}

module.exports = AppointmentsSchema
