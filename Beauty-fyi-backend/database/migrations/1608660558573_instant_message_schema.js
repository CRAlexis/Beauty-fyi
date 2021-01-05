'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class InstantMessageSchema extends Schema {
  up () {
    this.create('instant_messages', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('to_user_id').unsigned().references('id').inTable('users')
      table.string('message')
      table.timestamps()
    })
  }

  down () {
    this.drop('instant_messages')
  }
}

module.exports = InstantMessageSchema
