'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StylistAddonsSchema extends Schema {
  up () {
    this.create('stylist_addons', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('index')
      table.string('name')
      table.integer('price')
      table.integer('duration')
      table.timestamps()
    })
  }

  down () {
    this.drop('stylist_addons')
  }
}

module.exports = StylistAddonsSchema
