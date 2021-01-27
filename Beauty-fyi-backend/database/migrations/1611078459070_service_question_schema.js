'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServiceQuestionSchema extends Schema {
  up () {
    this.create('service_questions', (table) => {
      table.increments()
      table.integer('form_id').unsigned().references('id').inTable("service_forms").nullable()
      table.integer('question_index').unsigned()
      table.integer('question_type_index')
      table.string('question')
      table.string('question_options')
      table.timestamps()
    })
  }

  down () {
    this.drop('service_questions')
  }
}

module.exports = ServiceQuestionSchema
