'use strict'

/*
|--------------------------------------------------------------------------
| AppointmentSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class AppointmentSeeder {
  async run () {
    const appointment = await Factory
      .model('App/Models/Appointment')
      .createMany(40)
    const appointments = await Database.table('appointments')
    console.log(appointments)
  }
}

module.exports = AppointmentSeeder
