'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SeviceFormSchema extends Schema {
  up () {
    this.create('service_forms', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('form_name')
      table.boolean('active')
      table.timestamps()
    })
  }

  down () {
    this.drop('service_forms')
  }
}

module.exports = SeviceFormSchema
