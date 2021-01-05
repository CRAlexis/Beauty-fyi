'use strict'

const AccountDetail = use('App/Models/AccountDetail')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings


class AccountDetailController {

  async AddAccountDetail ({ request, session, response }){
    const { username, password, phoneNumber, location, allowUsToSendEmails} = request.all()
    userId = 1;

    // create accountDetail
    const accountDetail =  await AccountDetail.create({
      user_id: cleanStrings(userId, "int"),
      username: cleanStrings(username, "string"),
      password: cleanStrings(password, "string"),
      phoneNumber: cleanStrings(phoneNumber, "string"),
      location: cleanStrings(location, "string"),
      allowUsToSendEmails: cleanStrings(allowUsToSendEmails, "boolean"),
    })

    return {"status" : "success"}

  }

  async GetAccountDetail ({ request, session, response }){
    console.log("start");

    userId = request.input('userId');

    //Get data by user_id
    const accountDetail = await AccountDetail.query().where('user_id', userId)

    return {"status" : "success", "accountdetail" : accountDetail}
  }

}

module.exports = AccountDetailController
