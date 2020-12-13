'use strict'

const StylistAddForm = use('App/Models/StylistAddForm')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class StylistAddFormController {

  async AddStylistAddForm ({ request, session, response }){

    Question_index = request.input('question_index')
    Question_type_index = request.input('question_type_index')
    Question = request.input('question')
    Question_options = request.input('question_options')

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
