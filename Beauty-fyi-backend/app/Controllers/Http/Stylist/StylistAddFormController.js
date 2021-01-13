'use strict'

const StylistAddForm = use('App/Models/StylistAddForm')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class StylistAddFormController {

  async AddStylistAddForm ({ request, session, response }){

    var Question_index = request.all().content.question_index
    var Question_type_index = request.all().content.question_type_index
    var Question = request.all().content.question
    var Question_options = request.all().content.question_options

    // create StylistAddForm
    const stylistAddForm =  await StylistAddForm.create({
      question_index: cleanStrings(Question_index, "int"),
      question_type_index: cleanStrings(Question_type_index, "int"),
      question: cleanStrings(Question, "string"),
      question_options: cleanStrings(Question_options, "string"),
    })

    return {"status" : "success"}

  }

}

module.exports = StylistAddFormController
