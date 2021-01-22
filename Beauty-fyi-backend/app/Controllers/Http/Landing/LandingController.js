'use strict'
const Hash = use('Hash')
const RandomString = require('random-string');
const Database = use('Database')
const encryptions = use('App/Models/Encryption');
const { validateAll } = use('Validator')

class LandingController {

  async getCSRF({ request, session, response }) {
    var deviceID = request.all().content.deviceID

    //Check for unique device ID
    const validation = await validateAll(request.all().content, {
      deviceID: 'required|unique:encryptions,deviceID',
    })
    if (validation.fails()) {
      console.log("")
      return { "status": false, "content": "retry" };
    }

    //Create Encryption
    const plainKey = RandomString({ length: 25 })
    const encryptedKey = await Hash.make(plainKey)
    try {
      await encryptions.create({ user_id: null, encryptionKey: encryptedKey, deviceID: deviceID })
      console.log("encrypted device")
    } catch (Error) {
      console.log(Error)
      response.redirect('/url', false, 301)
    }

    return { "status": "success", "plainKey": plainKey }
  }

}

module.exports = LandingController
