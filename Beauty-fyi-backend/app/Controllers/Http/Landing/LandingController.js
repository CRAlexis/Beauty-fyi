'use strict'
console.log("1")
const Hash = use('Hash')
const RandomString = require('random-string');
const Database = use('Database')
const encryptions =  use('App/Models/Encryption');
const { validateAll } = use('Validator')

class LandingController {

  async getCSRF ({ request, auth, session, response }) {
    var deviceID = request.all().content.deviceID
    console.log(deviceID)

    //Check for unique device ID
    const validation = await validateAll(request.all().content, {
        deviceID: 'required|unique:encryptions,deviceID',
    })
    if(validation.fails()){
      console.log("")
      return {"status" : false, "content" : "retry"};
    }

    //Create Encryption
    const plainKey = RandomString({length: 25})
    const encryptedKey = await Hash.make(plainKey)
    console.log(encryptedKey)
    try{
    await encryptions.create({user_id: null, encryptionKey: encryptedKey, deviceID: deviceID})
    }catch(Error){
      console.log(Error)
    }

    return {"status" : "success", "plainKey" : plainKey}
  }

}

module.exports = LandingController
