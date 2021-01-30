'use strict'


const User = use('App/Models/User')
const Hash = use('Hash')
const Database = use('Database')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class LoginController {
  showLoginForm({ view }) {
    return view.render('auth.login')
  }

  async login({ request, auth, session, response }) {
    try {
      //get form data
      const email = cleanStrings(request.all().content.email.trim(), "email")
      var password = cleanStrings(request.all().content.password.trim(), "string")
      var plainKey = request.all().auth.plainKey
      var deviceID = request.all().auth.deviceID

      //Check if encryptedKey, and deviceKey are valid

      const query = await Database.table('encryptions').select('*').where('deviceID', deviceID).first();
      const encryptedKey = query.encryptionKey

      const isSame = await Hash.verify(plainKey, encryptedKey)
      if (!isSame) { return false; }

      const user = await User.query().where('email', email).where('is_active', false).first()
      if (user) {
        const passwordVerified = await Hash.verify(password, user.password)
        if (passwordVerified) {
          await Database.table('encryptions').where('deviceID', deviceID).update({ 'user_id': user.id })
          return { status: "success", userID: user.id }
        } 
      } else {
        return { "status": "error", "message": "Incorrect email or password" }
      }
    }
    catch (Error) {
      Database.table('log_errors').insert({ class: "LoginController", log: Error.sqlMessage })
      console.log(Error.sqlMessage)
    }
  }


}

module.exports = LoginController
