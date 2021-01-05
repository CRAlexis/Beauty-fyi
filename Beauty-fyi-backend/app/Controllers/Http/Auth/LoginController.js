'use strict'


const User = use('App/Models/User')
const Hash = use('Hash')
const Database = use('Database')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings

class LoginController {
  showLoginForm ({ view }){
    return view.render('auth.login')
  }

  async login ({ request, auth, session, response }) {
    console.log("hey")
    try{
      //get form data
      const { email, password, plainKey, deviceID } = request.all()
      email = trim(email);
      password = trim(password);

      //Cleaning Vars
      email = cleanStrings(Email, "string")
      email = cleanStrings(Email, "email")
      password = cleanStrings(Password, "string")

      //Check if encryptedKey, and deviceKey are valid
      console.log("plainKey " + plainKey)
      console.log("deviceID " + deviceID)
      let encryptedKey = await Database.table('encryptions').select('*').where('deviceID', deviceID).first();
      encryptedKey = encryptedKey.encryptionKey
      console.log(encryptedKey)
      const isSame = await Hash.verify(plainKey, encryptedKey)
      if (!isSame) {//Invalid encryptedKey and deviceKey
        return false;
      }

      // retrieve user base on the form data
      const user = await User.query().where('email', email).where('is_active', true).first()
      if (user) {
        //verify password
        const passwordVerified = await Hash.verify(password, user.password)
        if (passwordVerified) {
          //login user
          //await auth.remeber(!!remember).login(user)
        }
      }else{
        return {"status" : "error", "message" : "Please verify your email"}
      }

      //Update the user_id in 'encryptions'
      await Database.table('encryptions').where('deviceID', deviceID).update({'user_id' : user.id})

      console.log("Success")
      return {"status" : "success", "firstName" : user.firstName, "lastName" : user.lastName}

  }catch(Error){
    Database.table('log_errors').insert({class: "LoginController", log: Error.sqlMessage})
    console.log(Error.sqlMessage)
  }
  }


}

module.exports = LoginController
