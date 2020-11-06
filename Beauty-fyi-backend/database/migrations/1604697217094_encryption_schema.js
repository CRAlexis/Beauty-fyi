'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EncryptionSchema extends Schema {
  up () {
    this.create('encryptions', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users').nullable()
      table.string('encryptionKey', 5000).notNullable()
      table.string('deviceID', 5000).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('encryptions')
  }
}

module.exports = EncryptionSchema
