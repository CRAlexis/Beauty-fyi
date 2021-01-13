'use strict'
const Drive = use('Drive')
const { validateAll } = use('Validator')
const User = use('App/Models/User')
const encryptions =  use('App/Models/Encryption');

//const ScheduleAvailabilityDay = use('App/Controllers/Stylist/ScheduleAvailabilityDay').AddScheduleAvailabilityDayDefault
const randomString = require('random-string')
const cleanStrings = use('App/Controllers/sanitize/cleanStrings').cleanStrings
const Mail = use('Mail')
const Database = use('Database')

class RegisterController {

  async register ({ request, session, response }) {
    try{
      //Vars
      //Validations
      var plainKey = request.all().auth.plainKey
      var deviceID = request.all().auth.deviceID
      //Other Vars
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

      //Get User ID
      //const user = await User.query().where('email', email).where('is_active', true).first()

      //Tying user ID to deviceID and encryptionKey
      console.log("Tying user ID to deviceID and encryptionKey")
      await encryptions.query().where('deviceID', deviceID).where('user_id', null).update({'user_id' : user.id})

    /*// send confirmation email
    await Mail.send('auth.emails.confirm_email', user.toJSON(), message => {
        message.to(user.email)
        .from('hello@Beauty-fyi.com')
        .subject('Please confirm your email address')
      })
      */

      //console.log("Success")
      return {"status" : "success", "userID" : user.id}

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

  async isEmailAvailable({ request, session, response }){
    //Vars
    var userID = request.all().auth.userID
    var email = request.all().content.email.trim()

    var user = User.query().where('email', email).where('user_id', userID).first()

    if(user.email == 'email'){
      return {"status" : "success", "emailAvailable" : "false"}
    }else{
      return {"status" : "success", "emailAvailable" : "true"}
    }
  }

  async test ( { request  }){
    /*console.log("here3")
    console.log(request.content)
    console.log("here4")*/

    console.log("here 1")

    await request.multipart.file('photo[]', {}, async (file) => {
      try{
      console.log(file)
      //await Drive.disk('s3').put(file.clientName, file.stream
      await Drive.put(Date.now()+'.mp4', (file.stream))//Upload file

      }catch(e){
        console.log(e)
      }
    })
    await request.multipart.file('video[]', {}, async (file) => {
      try{
      console.log(file)
      //await Drive.disk('s3').put(file.clientName, file.stream
      await Drive.put(Date.now()+'.mp4', (file.stream))//Upload file

      }catch(e){
        console.log(e)
      }
    })

    /*await request.multipart.file('photo', {}, async (file) => {
      console.log(file)
      console.log("hi")
      let letFile = file.stream

      console.log("here")
        await letFile.move(Helpers.tmpPath('uploads'), {
          name: 'my-new-name.jpg'
        }, (e) => {
          console.log(e)
        })
      console.log("here 2")

      if (!letFile.movedAll()) {
        console.log(letFile.errors())
      }
    })
    console.log("here5")
    */
    await request.multipart.field((name, value) => {
      var ab = JSON.parse(value)
      if(name=='auth'){
        console.log(ab.userID)
      }else if(name=='auth'){

      }
      console.log(ab)
      try{
        console.log(ab.userID)
      }catch(e){
        console.log(e)
      }

    });


    await request.multipart.process()


    /*const profilePic = request.file('photo', {
      types: ['image'],
      size: '2mb'
    })
    console.log(profilePic)*/
    console.log("here6")
    //console.log(params)
    return "hey";
  }

}


module.exports = RegisterController
