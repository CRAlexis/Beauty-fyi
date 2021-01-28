'use strict'

const { route } = require('@adonisjs/framework/src/Route/Manager')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

//Tests
Route.get("addCard", "Payment/webViewController.addCard")
Route.post("addCard", "Payment/webViewController.addCardAPI")
Route.post("gotostore", "Payment/webViewController.goToStore")
Route.post('test', 'Auth/RegisterController.test').as('test')
Route.get('stripeTest', 'Payment/StripeController.test').as('stripeTest')
Route.post('uploadfile', 'upload/UploadPhotoController.uploadPhoto').as('uploadfile')


Route.group(() => {
  //Schedule
  Route.post('setavailability', 'Stylist/ScheduleAvailabilityDayController.setavailability')
  Route.post('setavailabilityactive', 'Stylist/ScheduleAvailabilityDayController.setDayActive')
  Route.post('setavailabilityget', 'Stylist/ScheduleAvailabilityDayController.setavailabilityget')
  Route.post('schedulelimit', 'Stylist/ScheduleLimitController.addScheduleLimit').as('schedulelimit')
  Route.post('schedulelimitget', 'Stylist/ScheduleLimitController.getScheduleLimit')

  //Services
  Route.post('addservice', 'Service/ServiceController.AddService').as('addservice')
  Route.post('deleteservice', 'Service/ServiceController.deleteService').as('deleteService')
  Route.post('servicesetactive', 'Service/ServiceController.setServiceActive')
  Route.post('servicedelete', 'Service/ServiceController.deleteService')
  Route.post('servicegetimage', 'Service/ServiceController.getServiceImage')
  Route.post('servicegetdata', 'Service/ServiceController.getServiceData')
  Route.post('servicegetaddon', 'Service/ServiceController.getAddonData')
  Route.post('servicegetlength', 'Service/ServiceController.getServiceTime')

  //Service Forms
  Route.post('addform', 'ServiceForm/ServiceFormController.addForm')
  Route.post('deleteform', 'ServiceForm/ServiceFormController.deleteForm')
  Route.post('connectformtoservice', 'ServiceForm/ServiceFormController.connectFormToService')
  Route.post('formsget', 'ServiceForm/ServiceFormController.getForms')
  Route.post('formquestionsget', 'ServiceForm/ServiceFormController.getFormQuestions')

  //User routes
  Route.post('addaccountdetails', 'User/AccountDetailsController.addAccountDetails')
  Route.post('accountdetailsget', 'User/AccountDetailsController.getAccountDetails')
  Route.post('bio', 'User/BioController.AddBio')
  Route.post('bioget', 'User/BioController.GetBio')

  //Clients
  Route.post('clientget', 'Client/ClientController.getClient')
  Route.post('clientsget', 'Client/ClientController.getClients')
  Route.post('clientgetimage', 'Client/ClientController.clientGetImage')
  Route.post('createclientwithimage', 'Auth/RegisterController.createClientwithimage')
  Route.post('createbulkclientwithimage', 'Auth/RegisterController.createBulkClientWithImage')

  //Appointments
  Route.post('availabletimesget', 'Appointment/AppointmentController.getAvailableTimes')
  Route.post('consultationquestionsget', 'Appointment/AppointmentController.getConsultationQuestions')
  Route.post('servicereceiptget', 'Appointment/AppointmentController.getServiceReceipt')
  Route.post('clientemailgetbool', 'Appointment/AppointmentController.clientEmailGetBool')
  Route.post('clientemailappend', 'Appointment/AppointmentController.clientEmailAppend')
  Route.post('createappointment', 'Appointment/AppointmentController.createAppointment')



}).middleware([/*'android'*/])


//Register
Route.post('register', 'Auth/RegisterController.register').as('register')
Route.post('isemailavailable', 'Auth/RegisterController.isEmailAvailable')
Route.post('isphonenumberavailable', 'Auth/RegisterController.isPhoneNumberAvailable')

//authenticate
Route.post('landing', 'Landing/LandingController.getCSRF').as('getCSRF')
Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail')
Route.post('resendverification', 'Auth/RegisterController.resendVerification').as('resendVerification')
Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail')
//Stripe
Route.post('webhook', 'Payment/WebhookController.webhook')




//Throttle .middleware('throttle:10,120')
//Route.post('landing', 'Landing/LandingController.getCSRF').as('getCSRF').middleware(['auth'])
//Route.get('password/reset', 'Auth/PasswordResetController.showLinkRequestForm')

//Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm')
Route.post('password/reset', 'Auth/PasswordResetController.reset')
Route.post('loginget', 'Auth/LoginController.showLoginForm')
Route.post('login', 'Auth/LoginController.login').as('login')