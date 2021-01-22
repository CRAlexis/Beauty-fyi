'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientMediaSchema extends Schema {
  up () {
    this.create('client_medias', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('file_path').notNullable()
      table.string('type')
      table.string('meta_one')
      table.string('meta_two')
      table.string('meta_three')
      table.string('meta_four')
      table.timestamps()
    })
  }

  down () {
    this.drop('client_medias')
  }
}

module.exports = ClientMediaSchema
