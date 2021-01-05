'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BioSchema extends Schema {
  up () {
    this.create('bios', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('bio', 300)
      table.timestamps()
    })
  }

  down () {
    this.drop('bios')
  }
}

module.exports = BioSchema
