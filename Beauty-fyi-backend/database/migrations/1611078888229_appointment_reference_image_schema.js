'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AppointmentReferenceImageSchema extends Schema {
  up () {
    this.create('appointment_reference_images', (table) => {
      table.increments()
      table.integer('appointment_id').unsigned().references('id').inTable('appointments')
      table.string('image_one')
      table.string('image_two')
      table.string('image_three')
      table.string('image_four')
      table.string('image_five')
      table.string('image_six')
      table.timestamps()
    })
  }

  down () {
    this.drop('appointment_reference_images')
  }
}

module.exports = AppointmentReferenceImageSchema
