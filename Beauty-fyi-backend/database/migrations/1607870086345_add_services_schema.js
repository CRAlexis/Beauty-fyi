'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddServicesSchema extends Schema {
  up () {
    this.create('add_services', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('image')
      table.string('name')
      table.integer('price')
      table.string('category')
      table.string('description')
      table.string('rgba_colour')
      table.integer('padding_before')
      table.integer('padding_after')
      table.timestamps()
    })
  }

  down () {
    this.drop('add_services')
  }
}

module.exports = AddServicesSchema
