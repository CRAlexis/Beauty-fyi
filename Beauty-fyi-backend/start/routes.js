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
Route.get('test', 'Auth/RegisterController.test').as('test')
Route.get('stripeTest', 'Payment/StripeController.test').as('stripeTest')
Route.group(() => {
  Route.get('register', 'Auth/RegisterController.showRegisterForm')
  Route.post('register', 'Auth/RegisterController.register').as('register')
  Route.post('resendverification', 'Auth/RegisterController.resendVerification').as('resendVerification')
  Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail')
  Route.get('login', 'Auth/LoginController.showLoginForm')
  Route.post('login', 'Auth/LoginController.login').as('login')
  Route.post('landing', 'Landing/LandingController.getCSRF').as('getCSRF')
  Route.get('password/reset', 'Auth/PasswordResetController.showLinkRequestForm')
  Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail')
  Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm')
  Route.post('password/reset', 'Auth/PasswordResetController.reset')
}).middleware(['guest'])
//Route.post('landing', 'Landing/LandingController.getCSRF').as('getCSRF').middleware(['auth'])
