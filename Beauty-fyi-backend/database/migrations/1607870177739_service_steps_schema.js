'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServiceStepsSchema extends Schema {
  up () {
    this.create('service_steps', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('service_id').unsigned().references('id').inTable('add_services')
      table.integer('index')
      table.string('name')
      table.integer('duration')
      table.boolean('capture_footage_in_this_step')
      table.timestamps()
    })
  }

  down () {
    this.drop('service_steps')
  }
}

module.exports = ServiceStepsSchema
