'use strict'

const StylistForm = use('App/Models/StylistForm')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class StylistFormController {

  async AddStylistForm ({ request, session, response }){

    Index = request.input('index')
    Optional_question = request.input('optional_question')
    Payment_type = request.input('payment_type')

    // create StylistForm
    const stylistForm =  await StylistForm.create({
      index: cleanStrings(Index, "int"),
      optional_question: cleanStrings(Optional_question, "string"),
      payment_type: cleanStrings(Payment_type, "int"),
    })

    return {"status" : "success"}

  }

}

module.exports = StylistFormController
