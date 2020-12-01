'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LogErrorsSchema extends Schema {
  up () {
    this.create('log_errors', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('class', 100).notNullable()
      table.string('log', 5000).notNullable()
      table.string('device', 5000).notNullable()
      table.string('ipaddress', 5000).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('log_errors')
  }
}

module.exports = LogErrorsSchema
