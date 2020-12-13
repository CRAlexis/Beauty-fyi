'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EarlyAccessSchema extends Schema {
  up () {
    this.create('early_accesses', (table) => {
      table.increments()
      table.string('code').notNullable()
      table.integer('uses')
      table.dateTime('expires', { precision: 6 })
      table.timestamps()
    })
  }

  down () {
    this.drop('early_accesses')
  }
}

module.exports = EarlyAccessSchema
