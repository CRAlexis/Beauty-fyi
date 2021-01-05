'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const encryptions =  use('App/Models/Encryption');

class Android {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    // call next to advance the request
    userId = trim(request.input('user_id'))
    encryptionKey = trim(request.input('encryptionKey'))
    deviceID = trim(request.input('deviceID'))

    //See If the variables above are valid and in the database
    const encription = await encryptions.query().where('user_id', userId).where('encryptionKey', encryptionKey).where('deviceID', deviceID).first()
    if(encription.userId === ""){
      //return false
    }

    await next()
  }
}

module.exports = Android
