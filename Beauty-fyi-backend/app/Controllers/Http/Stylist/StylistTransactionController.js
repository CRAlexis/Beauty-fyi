'use strict'

const StylistTransaction = use('App/Models/StylistTransaction')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class StylistTransactionController {

  async AddStylistTransaction ({ request, session, response }){
    const {userId, toUserId, amount} = request.all()

    var userId = request.all().content.userId
    var toUserId = request.all().content.toUserId
    var amount = request.all().content.amount

    // create StylistTransaction
    const stylistTransaction =  await StylistTransaction.create({
      userId: cleanStrings(userId, "int"),
      to_user_id: cleanStrings(toUserId, "int"),
      amount: cleanStrings(amount, "int"),
    })

    return {"status" : "success"}

  }

}

module.exports = StylistTransactionController
