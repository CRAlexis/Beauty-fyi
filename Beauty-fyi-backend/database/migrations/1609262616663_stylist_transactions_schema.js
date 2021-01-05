'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StylistTransactionsSchema extends Schema {
  up () {
    this.create('stylist_transactions', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('to_user_id').unsigned().references('id').inTable('users')
      table.integer('amount')
      table.timestamps()
    })
  }

  down () {
    this.drop('stylist_transactions')
  }
}

module.exports = StylistTransactionsSchema
