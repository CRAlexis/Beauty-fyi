'use strict'


const User = use('App/Models/User')
const Hash = use('Hash')
const Database = use('Database')

class LoginController {
  showLoginForm ({ view }){
    return view.render('auth.login')
  }

  async login ({ request, auth, session, response }) {
    //get form data
    const { email, password, plainKey, deviceID } = request.all()
    console.log("Starting")

    //Check if encryptedKey, and deviceKey are valid
    console.log("plainKey " + plainKey)
    console.log("deviceID " + deviceID)
    let encryptedKey = await Database.table('encryptions').select('*').where('deviceID', deviceID).first();
    encryptedKey = encryptedKey.encryptionKey
    console.log(encryptedKey)
    const isSame = await Hash.verify(plainKey, encryptedKey)
    if (!isSame) {//Invalid encryptedKey and deviceKey
      console.log("Encrypted Key not valid")
      return false;
    }
    console.log("Encrypted Key valid")
    // retrieve user base on the form data
    const user = await User.query().where('email', email).where('is_active', true).first()
    if (user) {
      //verify password
      const passwordVerified = await Hash.verify(password, user.password)
      if (passwordVerified) {
        //login user
        //await auth.remeber(!!remember).login(user)
      }
    }

    //Update the user_id in 'encryptions'
    await Database.table('encryptions').where('deviceID', deviceID).update({'user_id' : user.id})

    console.log("Success")
    return "success";
  }
}

module.exports = LoginController
