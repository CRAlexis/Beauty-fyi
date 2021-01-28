'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TransactionsSchema extends Schema {
  up () {
    this.create('transactions', (table) => {
      table.increments()
      table.integer('recipient_user_id').unsigned().references('id').inTable('users')
      table.integer('payee_user_id').unsigned().references('id').inTable('users')
      table.integer('deposit').notNullable()
      table.integer('total').notNullable()
      table.string('currency').notNullable()
      table.datetime('due_date').notNullable()
      table.string('description').notNullable()
      table.string('meta', 500)
      table.string('status').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('transactions')
  }
}

module.exports = TransactionsSchema
