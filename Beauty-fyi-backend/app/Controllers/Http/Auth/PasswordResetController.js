'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const randomString = require('random-string')
const Mail = use('Mail')
const Hash = use('Hash')

class PasswordResetController {
  showLinkRequestForm({ view}) {
    return view.render('auth.passwords.email')
  }


  async sendResetLinkEmail ({ request, session, resopnse} ) {
    //validate form inputs
    const validation = await validate(request.only('email'), {
      email: 'require|email'
    })

    if(validation.fails()){
      session.withErrors(validation.messages()).flashAll()
      //return '';
    }

    try{
      //get User
      const  user = await User.findBy('email', request.input('email'))

      await PasswordReset.query().where('email', user.email).delete()

      const { token } = await PasswordReset.create({
        email: user.email,
        token: randomString({ length: 40})
      })

      const mailData = {
        user: user.toJSON(),
        token
      }

      await mailData.send('auth.emails.password_reset', mailData, message => {
        message.to(user.email)
        .from('hello@Beauty-fyi.com')
        .subject('Password reset link')
      })


    }catch(error){

    }

    return {"status" : "success"}

  }

  showResetForm ({ params, view }){
    return view.render('auth.password.reset', { token: params.token })
  }

  async reset ({ request, session , response }) {
    //Validate form inputs
    const validation = await validateAll(request.all(), {
      token: 'required',
      email: 'required',
      password: 'required|confirmed'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashExcept(['password'])

      //return ''
    }


    try{

        // get user by the provided email
        const user = await User.findBy('email', request.input('email'))

        //Check if password reset token exists for user
        const token = PasswordReset.query()
        .where('email', user.email)
        .where('token', request.input('token'))
        .first()

        if(!token){
          //Display error message
        //"This password reset token does not exist."
        }

        user.password = await Hash.make(request.input('password'))
        await user.save()

        // delete password reset token
        await PasswordReset.query().where('email', user.email).delete()

        //Display success message
        //"Your password has been reset!"
    }catch(error){
        //Display error message
        //"Sorry, there is no user witht this email address."
    }

    return {"status" : "success"}
  }


}

module.exports = PasswordResetController
