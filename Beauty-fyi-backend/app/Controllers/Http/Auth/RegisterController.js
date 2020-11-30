'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const Validator = use('Validator')
const randomString = require('random-string')
const cleanStrings = require('~/sanitize/cleanStrings').cleanStrings
const Mail = use('Mail')
const Database = use('Database')

class RegisterController {

  async register ({ request, session, response }) {
    try{
      //Vars
      Username = trim(request.input('username'))
      Email = trim(request.input('email'))
      Password = trim(request.input('password'))

      //Cleaning Vars
      Username = cleanStrings(Username, "string")
      Email = cleanStrings(Email, "string")
      Email = cleanStrings(Email, "email")
      Password = cleanStrings(Password, "string")

      //Validate form inputs
      const validation = await validateAll(request.all(), {
        username: 'required|unique:users,username',
        email: 'required|email|unique:users,email',
        password: 'required'
      })
      //return "here";

      if(validation.fails()){
        console.log(validation.messages())
        //return {validation.messages()}
      }
    // create user
    const user =  await User.create({
        username: Username,
        email: Email,
        password: Password,
        //accountType: request.input('accountType'),
        confirmation_token: randomString({ length: 40 })
      })
    console.log("Sending confirmation email...")

    // send confirmation email
    await Mail.send('auth.emails.confirm_email', user.toJSON(), message => {
        message.to(user.email)
        .from('hello@Beauty-fyi.com')
        .subject('Please confirm your email address')
      })
      //console.log("Success")
      return {"status" : "success"}
  }catch(Error){
      Database.table('log_errors').insert({class: "RegisterController", log: Error.sqlMessage})
      console.log(Error.sqlMessage)
    }
  }

  async resendVerification(){
    try{//Note: If there is a error sending the verification email
      await Mail.send('auth.emails.confirm_email', user.toJSON(), message => {
          message.to(user.email)
          .from('hello@Beauty-fyi.com')
          .subject('Please confirm your email address')
        })
      }catch(Error){
        console.log(Error)
      }

    return {"status" : "success"}
  }


  async confirmEmail ( { params, session, response }){
      // get user with the confirmation token
      const user = await User.findBy('confirmation_token', params.token)

      // set confirmation to null and is_active to true
      user.confirmation_token = null
      user.is_active = true

      // save user update to database
      await user.save()

      // display success message
      /*session.flash({
        notification: {
          type: 'success',
          message: 'Your email address has been confirmed.'
        }
      })*/
  }

}


module.exports = RegisterController
