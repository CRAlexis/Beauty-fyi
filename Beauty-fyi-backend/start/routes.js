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
Route.group(() => {
  Route.get('register', 'Auth/RegisterController.showRegisterForm')
  Route.post('register', 'Auth/RegisterController.register').as('register')
  Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail')
  Route.get('login', 'Auth/LoginController.showLoginForm')
  Route.post('login', 'Auth/LoginController.login').as('login')
  Route.post('landing', 'Landing/LandingController.getCSRF').as('getCSRF')
}).middleware(['guest'])
//Route.post('landing', 'Landing/LandingController.getCSRF').as('getCSRF').middleware(['auth'])
