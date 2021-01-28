'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StripeAttrSchema extends Schema {
  up () {
    this.create('stripe_attrs', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('customer_id').nullable()
      table.string('connected_account_id').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('stripe_attrs')
  }
}

module.exports = StripeAttrSchema
