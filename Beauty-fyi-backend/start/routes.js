'use strict'

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
Route.post('test', 'Auth/RegisterController.test').as('test')
Route.get('stripeTest', 'Payment/StripeController.test').as('stripeTest')

//Route.group(() => {
Route.post('uploadfile', 'upload/UploadPhotoController.uploadPhoto').as('uploadfile')

//Stripe
Route.post('webhook', 'Payment/WebhookController.webhook')

//Stylist routes
Route.post('scheduleavailabilityday', 'Stylist/ScheduleAvailabilityDayController.AddScheduleAvailabilityDay').as('scheduleavailabilityday')
Route.post('scheduleavailabilitydayget', 'Stylist/ScheduleAvailabilityDayController.GetScheduleAvailabilityDay')
Route.post('schedulelimit', 'Stylist/ScheduleLimitController.AddScheduleLimit').as('schedulelimit')
Route.post('schedulelimitget', 'Stylist/ScheduleLimitController.GetScheduleLimit')

//Services, Events and Products
Route.post('addservice', 'Stylist/AddServiceController.AddService').as('addservice')
Route.post('addserviceget', 'Stylist/AddServiceController.GetService')
Route.post('addevent', 'Stylist/AddEventController.AddEvent').as('addevent')
Route.post('addeventget', 'Stylist/AddEventController.GetEvent')
Route.post('addproduct', 'Stylist/AddProductController.AddProduct').as('addproduct')
Route.post('addproductget', 'Stylist/AddProductController.GetProduct')

//User routes
Route.post('accountdetail', 'User/AccountDetailController.AddAccountDetail').as('accountdetail')
Route.post('bio', 'User/BioController.AddBio')
Route.post('bioget', 'User/BioController.GetBio')


//}).middleware(['android'])

//Registering and logging in
Route.group(() => {
  //Route.get('register', 'Auth/RegisterController.showRegisterForm')
  Route.post('register', 'Auth/RegisterController.register').as('register')
  Route.post('resendverification', 'Auth/RegisterController.resendVerification').as('resendVerification')
  //Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail')
  Route.post('loginget', 'Auth/LoginController.showLoginForm')
  Route.post('login', 'Auth/LoginController.login').as('login')
  Route.post('landing', 'Landing/LandingController.getCSRF').as('getCSRF')
  //Route.get('password/reset', 'Auth/PasswordResetController.showLinkRequestForm')
  Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail')
  //Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm')
  Route.post('password/reset', 'Auth/PasswordResetController.reset')
}).middleware(['guest'])
//Throttle .middleware('throttle:10,120')
//Route.post('landing', 'Landing/LandingController.getCSRF').as('getCSRF').middleware(['auth'])
