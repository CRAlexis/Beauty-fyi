'use strict'

const User = use('App/Models/User')
const ClientMedia = use('App/Models/ClientMedia')
const UserClient = use('App/Models/UserClient')
const Location = use('App/Models/Location')
const encryptions = use('App/Models/Encryption');
const Mail = use('Mail')
const Database = use('Database')
const { validateAll } = use('Validator')
const { cleanStrings } = use('App/Controllers/sanitize/cleanStrings')
const { uploadMedia } = require("../../media/uploadMedia")
const randomString = require('random-string')


class RegisterController {

  async register({ request, session, response }) {
    try {
      console.log("Registering account")
      var plainKey = request.all().auth.plainKey
      var deviceID = request.all().auth.deviceID
      let FirstName = cleanStrings(request.all().content.firstName.trim(), "string")
      let LastName = cleanStrings(request.all().content.lastName.trim(), "string")
      let Email = cleanStrings(request.all().content.email.trim(), "email")
      let Password = cleanStrings(request.all().content.password.trim(), "string")
      let PhoneNumber = null
      if (request.all().content.phoneNumber) { PhoneNumber = cleanStrings(request.all().content.phoneNumber.trim(), "int") }
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
      if (validation.fails()) {
        console.log(validation.messages())
        return false;
      }
      // create user
      const user = await User.create({
        firstName: FirstName,
        lastName: LastName,
        email: Email,
        password: Password,
        phoneNumber: PhoneNumber,
        pro: 1,
        confirmation_token: randomString({ length: 40 })
      })

      //const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

      //Tying user ID to deviceID and encryptionKey
      await encryptions.query().where('deviceID', deviceID).where('user_id', null).update({ 'user_id': user.id })

      //Send auth email
      //await Mail.send('auth.emails.confirm_email', user.toJSON(), message => {
      //  message.to(user.email)
      //    .from('hello@Beauty-fyi.com')
      //    .subject('Please confirm your email address')
      //})
      return { "status": "success", "userID": user.id }

    } catch (Error) {
      Database.table('log_errors').insert({ class: "RegisterController", log: Error.sqlMessage })
      console.log(Error)
    }
  }

  async resendVerification() {
    try {//Note: If there is a error sending the verification email
      await Mail.send('auth.emails.confirm_email', user.toJSON(), message => {
        message.to(user.email)
          .from('hello@Beauty-fyi.com')
          .subject('Please confirm your email address')
      })
    } catch (Error) {
      console.log(Error)
    }

    return { "status": "success" }
  }

  async capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async confirmEmail({ params, session, response }) {
    // get user with the confirmation token
    const user = await User.findBy('confirmation_token', params.token)
    // set confirmation to null and is_active to true
    user.confirmation_token = null
    user.is_active = true
      // save user update to database
      /
      await user.save()
  }

  async isEmailAvailable({ request, session, response }) {
    const email = request.all().content.email.trim()
    const userID = request.all().auth.userID
    const user = await User.query().where('email', email).first()
    user ? console.log("Email is taken or the user already has this email") : console.log("Email is free")
    if (user && userID == user.id) {
      return { "status": "success", "emailAvailable": true }
    }
    if (user) {
      return { "status": "success", "emailAvailable": false }
    } else {
      return { "status": "success", "emailAvailable": true }
    }
  }

  async isPhoneNumberAvailable({ request, session, response }) {
    var phoneNumber = request.all().content.phoneNumber.trim()
    const user = await User.query().where('phoneNumber', phoneNumber).first()

    user ? console.log("Phone number is taken") : console.log("number is free")
    if (user) {
      return { "status": "success", "phoneNumberAvailable": false }
    } else {
      return { "status": "success", "phoneNumberAvailable": true }
    }
  }

  async createClientwithimage({ request, session, response }) {
    //clients have temporary password
    let auth;
    let content;

    await request.multipart.field((name, value) => {
      if (name == "auth") { auth = JSON.parse(value) }
      if (name == "content") { content = JSON.parse(value) }
    })
    let uploadedFiles = await uploadMedia(request, "clientMedia")
    try {
      let firstName = cleanStrings(content.firstName.trim(), "string")
      let lastName = cleanStrings(content.lastName.trim(), "string")
      let emailAddress = cleanStrings(content.emailAddress.trim(), "email")

      const validation = await validateAll(content, {
        firstName: 'required',
        lastName: 'required',
        emailAddress: 'required|email|unique:users,email',
        phoneNumber: 'unique:users,PhoneNumber'
      })
      if (validation.fails()) {
        console.log(validation.messages())
        return false;
      }

      const user = await User.create({
        firstName: firstName,
        lastName: lastName,
        email: emailAddress,
        password: randomString({ length: 40 }),
        phoneNumber: content.phoneNumber ? content.phoneNumber : null,
        confirmation_token: randomString({ length: 40 })
      })
      console.log("Created new client")
      const location = await Location.create({
        user_id: user.id,
        first_line_address: content.addressLineOne ? cleanStrings(content.addressLineOne, "string") : null,
        second_line_address: content.addressLineOne ? cleanStrings(content.addressLineTwo, "string") : null,
        city_town: content.cityTown ? cleanStrings(content.cityTown, "string") : null,
        postcode: content.postCode ? cleanStrings(content.postCode, "string") : null,
        country: null
      })
      console.log("Set clients location")

      if (uploadedFiles.images.length != 0) {
        const clientMedia = await ClientMedia.create({
          user_id: user.id,
          file_path: uploadedFiles.images[0],
          type: "image",
          meta_one: "profile_image",
        })
        console.log("Saved clients profile picture")
      }

      const userClient = await UserClient.create({
        user_id: auth.userID,
        client_id: user.id,
      })
      console.log("Connected salon owner to client")
      //response.send({ "status": "success", "userID": user.id })
      response.json({ userID: user.id })
    } catch (error) {
      
      console.log("2")
      console.log(error)
    }
  };

}


module.exports = RegisterController
