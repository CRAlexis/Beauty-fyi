'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserMediaSchema extends Schema {
  up () {
    this.create('user_medias', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('name').notNullable()
      table.text('fileContents').notNullable()
      table.string('type').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('user_medias')
  }
}

module.exports = UserMediaSchema
