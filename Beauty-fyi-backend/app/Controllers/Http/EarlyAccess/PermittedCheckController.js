'use strict'

const EarlyAccess = use('App/Models/EarlyAccess')

class PermittedCheckController {

  async permittedCheck ({ request, session, response }){
    var Code = request.all().content.code

    const earlyAccess = await EarlyAccess.query().where('code', code).first()
    //Check if code is valid
    if(earlyAccess.code == Code){
      //Check if expiration date has passed
      //const currentDate = moment().format('MM Do YYYY, h:mm:ss a');
      if(moment(earlyAccess.expires).fromNow() > 0){
        //Update uses of this code in the database
        await EarlyAccess.where('code', code).update({'uses' : earlyAccess.uses+1})

        return {"status" : "success"}
      }else{
        return {"status" : "error", "message" : "Code has Expired"}
      }
    }else{
      return {"status" : "error", "message" : "Invalid code"}
    }
  }

}

module.exports = PermittedCheckController
