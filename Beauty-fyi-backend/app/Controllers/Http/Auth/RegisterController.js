'use strict'
const { validateAll } = use('Validator')
const User = use('App/Models/User')

//const ScheduleAvailabilityDay = use('App/Controllers/Stylist/ScheduleAvailabilityDay').AddScheduleAvailabilityDayDefault
const randomString = require('random-string')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings
const Mail = use('Mail')
const Database = use('Database')

class RegisterController {

  async register ({ request, session, response }) {
    try{
      //Vars
      var FirstName = request.all().content.firstName.trim()
      var LastName = request.all().content.lastName.trim()
      var Email = request.all().content.email.trim()
      var Password = request.all().content.password.trim()
      var PhoneNumber = null
      if(request.all().content.phoneNumber.trim()){
        PhoneNumber = request.all().content.phoneNumber.trim()
      }
      //Cleaning Vars
      FirstName = cleanStrings(FirstName, "string")
      LastName = cleanStrings(LastName, "string")
      Email = cleanStrings(Email, "string")
      Email = cleanStrings(Email, "email")
      Password = cleanStrings(Password, "string")
      PhoneNumber = cleanStrings(PhoneNumber, "int")

      //Captialize first name and last name
      FirstName = await this.capitalizeFirstLetter(FirstName)
      LastName = await this.capitalizeFirstLetter(LastName)


      //Validate form inputs
      const validation = await validateAll(request.all().content, {
        firstName: 'required',
        lastName: 'required',
        email: 'required|email|unique:users,email',
        password: 'required',
        phoneNumber: 'unique:users,PhoneNumber'
      })
      //return "here";
      if(validation.fails()){
        console.log(validation.messages())
        return false;
      }
    // create user
    const user =  await User.create({
        firstName: FirstName,
        lastName: LastName,
        email: Email,
        password: Password,
        phoneNumber: PhoneNumber
        //accountType: request.input('accountType'),
        //confirmation_token: randomString({ length: 40 })
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
      console.log(Error)
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

  async capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  async confirmEmail ( { params, session, response }){
      // get user with the confirmation token
      const user = await User.findBy('confirmation_token', params.token)

      // set confirmation to null and is_active to true
      user.confirmation_token = null
      user.is_active = true

      // save user update to database
      await user.save()

      //await ScheduleAvailabilityDay(user.id)
  }

  async test ( {request  }){
    console.dir(request )
    //console.log(params)
    return "hey";
}

}


module.exports = RegisterController
