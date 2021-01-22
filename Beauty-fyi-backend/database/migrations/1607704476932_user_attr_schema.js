'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserAttrSchema extends Schema {
  up () {
    this.create('user_attrs', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('attr', 300)
      table.string('value', 15000)
      table.datetime('lastUpdated', { precision: 6 })
      table.timestamps()
    })
  }

  down () {
    this.drop('user_attrs')
  }
}

module.exports = UserAttrSchema
