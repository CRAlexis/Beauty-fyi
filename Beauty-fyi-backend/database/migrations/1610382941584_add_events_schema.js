'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddEventsSchema extends Schema {
  up () {
    this.create('add_events', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('name')
      table.string('link')
      table.string('password')
      table.boolean('is_online')
      table.string('post_code')
      table.string('address_line_one')
      table.string('address_line_two')
      table.string('town')
      table.string('category')
      table.string('description')
      table.time('start_time')
      table.time('end_time')
      table.date('date')
      table.integer('price')
      table.integer('capacity')
      table.string('ticket_type')
      table.timestamps()
    })
  }

  down () {
    this.drop('add_events')
  }
}

module.exports = AddEventsSchema
