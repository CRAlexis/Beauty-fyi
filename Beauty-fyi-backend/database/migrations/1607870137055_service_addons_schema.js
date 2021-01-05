'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServiceAddonsSchema extends Schema {
  up () {
    this.create('service_addons', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('service_id').unsigned().references('id').inTable('add_services')
      table.integer('index')
      table.string('name')
      table.integer('price')
      table.integer('duration')
      table.timestamps()
    })
  }

  down () {
    this.drop('service_addons')
  }
}

module.exports = ServiceAddonsSchema
