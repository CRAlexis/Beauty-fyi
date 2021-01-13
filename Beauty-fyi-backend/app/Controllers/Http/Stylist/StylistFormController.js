'use strict'

const StylistForm = use('App/Models/StylistForm')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class StylistFormController {

  async AddStylistForm ({ request, session, response }){

    var Index = request.all().content.index
    var Optional_question = request.all().content.optional_question
    var Payment_type = request.all().content.payment_type

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
