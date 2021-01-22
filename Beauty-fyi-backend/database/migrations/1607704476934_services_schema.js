'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServicesSchema extends Schema {
  up () {
    this.create('services', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('image_one')
      table.string('image_two')
      table.string('image_three')
      table.string('image_four')
      table.string('image_five')
      table.string('image_six')
      table.string('name')
      table.integer('price')
      table.string('category')
      table.string('description')
      table.string('rgba_colour')
      table.integer('padding_before')
      table.integer('padding_after')
      table.string('form_id')
      table.string('optional_question')
      table.string('payment_type')
      table.boolean('active').defaultTo(1)
      table.boolean('deleted').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('services')
  }
}

module.exports = ServicesSchema
