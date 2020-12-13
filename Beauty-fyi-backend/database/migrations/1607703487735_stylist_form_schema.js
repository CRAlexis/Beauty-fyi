'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StylistFormSchema extends Schema {
  up () {
    this.create('stylist_forms', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('index')
      table.string('optional_question')
      table.integer('payment_type')
      table.timestamps()
    })
  }

  down () {
    this.drop('stylist_forms')
  }
}

module.exports = StylistFormSchema
