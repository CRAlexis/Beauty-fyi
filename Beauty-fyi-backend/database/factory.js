'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/Appointment', (faker) => {
    let clientStartTime = parseInt(Math.random() * 3) + 10
    let clientEndTime = parseInt(Math.random() * 3) + 11
    let stylistStartTime = clientStartTime - parseInt(Math.random() * 2)
    let stylistEndTime = clientEndTime + parseInt(Math.random() * 2)
    return {
        user_id: 41,
        client_id: faker.integer({ min: 35, max: 40 }),
        service_id: 35,
        addon_ids: 20,
        status: "pending",
        client_start_time: clientStartTime + ":" + faker.minute() + ":" + faker.second(),
        client_end_time: clientEndTime + ":" + faker.minute() + ":" + faker.second(),
        stylist_start_time: stylistStartTime + ":" + faker.minute() + ":" + faker.second(),
        stylist_end_time: stylistEndTime + ":" + faker.minute() + ":" + faker.second(),
        stylist_end_time: stylistEndTime + ":" + faker.minute() + ":" + faker.second(),
        appointment_date: faker.date({ year: 2021, month: 2 })
    }
})
