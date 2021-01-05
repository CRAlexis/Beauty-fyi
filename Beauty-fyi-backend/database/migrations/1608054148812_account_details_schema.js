'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccountDetailsSchema extends Schema {
  up () {
    this.create('account_details', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('password')
      table.string('phoneNumber')
      table.string('location')
      table.boolean('allowUsToSendEmails')
      table.timestamps()
    })
  }

  down () {
    this.drop('account_details')
  }
}

module.exports = AccountDetailsSchema
