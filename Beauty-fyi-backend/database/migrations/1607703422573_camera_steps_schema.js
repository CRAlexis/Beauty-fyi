'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CameraStepsSchema extends Schema {
  up () {
    this.create('camera_steps', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('index')
      table.string('name')
      table.integer('duration')
      table.boolean('capture_footage_in_this_step')
      table.integer('padding_before')
      table.integer('padding_after')
      table.timestamps()
    })
  }

  down () {
    this.drop('camera_steps')
  }
}

module.exports = CameraStepsSchema
