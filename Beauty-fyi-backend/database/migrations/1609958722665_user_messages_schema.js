'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserMessagesSchema extends Schema {
  up () {
    this.create('user_messages', (table) => {
      table.increments()
      table.integer('to_user_id').unsigned().references('id').inTable('users')
      table.integer('from_user_id').unsigned().references('id').inTable('users')
      table.string('content')
      table.string('randomCode')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_messages')
  }
}

module.exports = UserMessagesSchema
