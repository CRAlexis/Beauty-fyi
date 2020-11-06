'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const randomString = require('random-string')
//const Mail = use('Mail')

class RegisterController {

  async register ({ request, session, response }) {
    //Validate form inputs
    const validation = await validateAll(request.all(), {
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required'
    })
    //return "here";

    if(validation.fails()){
    }
    // create user
    const user =  await User.create({
      username: request.input('username'),
      email: request.input('email'),
      password: request.input('password'),
      confirmation_token: randomString({ length: 40 })
    })
    // send confirmation email
    /*await Mail.send('auth.emails.confirm_email', user.toJSON(), message => {
      message.to(user.email)
      .from('hello@Beauty-fyi.com')
      .subject('Please confirm your email address')
    })*/
    console.log("Success")
    return "Completed"
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
