'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServiceQuestionAnswerSchema extends Schema {
  up () {
    this.create('service_question_answers', (table) => {
      table.increments()
      table.integer('appointment_id').unsigned().references('id').inTable('appointments')
      table.integer('question_id').unsigned().references('id').inTable("service_questions")
      table.string('answer')
      table.timestamps()
    })
  }

  down () {
    this.drop('service_question_answers')
  }
}

module.exports = ServiceQuestionAnswerSchema
