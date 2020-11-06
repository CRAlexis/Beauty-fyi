'use strict'

const Hash = use('Hash')
const RandomString = require('random-string');
const Database = use('Database')
const encryptions =  use('App/Models/Encryption');

class LandingController {

  async getCSRF ({ request, auth, session, response }) {
    const { deviceID } = request.all()

    const plainKey = RandomString({length: 25})
    const encryptedKey = await Hash.make(plainKey)
    try{
    await encryptions.create({user_id: null, encryptionKey: encryptedKey, deviceID: deviceID})
    }catch(Error){
      console.log(Error)
    }

    return {"PlainKey" : plainKey}
  }

}

module.exports = LandingController
