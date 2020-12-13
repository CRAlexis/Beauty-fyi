'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StylistAddFormSchema extends Schema {
  up () {
    this.create('stylist_add_forms', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('question_index')
      table.integer('question_type_index')
      table.string('question')
      table.string('question_options')
      table.timestamps()
    })
  }

  down () {
    this.drop('stylist_add_forms')
  }
}

module.exports = StylistAddFormSchema
