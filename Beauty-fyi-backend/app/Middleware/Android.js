'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const encryptions =  use('App/Models/Encryption');
const Hash = use('Hash')

class Android {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    // call next to advance the request
    var userID = request.all().auth.userID
    var plainKey = request.all().auth.plainKey
    var deviceID = request.all().auth.deviceID

    console.log(userID)
    //See If the variables above are valid and in the database
    const encription = await encryptions.query().where('user_id', userID).where('deviceID', deviceID).first()

    if(!encription){
      console.log("invalid Request")
      return false
    }
    //Check If encrpytion key is the same
    let encryptedKey = encription.encryptionKey
    const isSame = await Hash.verify(plainKey, encryptedKey)
    if (!isSame) {//Invalid encryptedKey
      console.log("invalid Encryption key")
      return false;
    }

    console.log("Valid")

    await next()
  }
}

module.exports = Android
