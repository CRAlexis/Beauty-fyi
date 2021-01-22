'use strict'

const Mail = use('Mail')

class AppointmentController {

  async appointmentConfirmed ({ request }) {
    const data = request.only(['email', 'username', 'password'])
    const user = await User.create(data)

    await Mail.send('auth.emails.appointment.confirmed.edge', user.toJSON(), (message) => {
      message
        .to(user.email)
        .from('<from-email>')
        .subject('Your appointment is confirmed')
    })

    return 'Registered successfully'
  }

  async appointmentOneDayReminder ({ request }) {
    const data = request.only(['email', 'username', 'password'])
    const user = await User.create(data)

    await Mail.send('auth.emails.appointment.oneDayReminder.edge', user.toJSON(), (message) => {
      message
        .to(user.email)
        .from('<from-email>')
        .subject('Your appointment is tomorrow')
    })

    return 'Registered successfully'
  }

  async appointmentUpdated ({ request }) {
    const data = request.only(['email', 'username', 'password'])
    const user = await User.create(data)

    await Mail.send('auth.emails.appointment.updated.edge', user.toJSON(), (message) => {
      message
        .to(user.email)
        .from('<from-email>')
        .subject('Your upcoming appointment has been updated')
    })

    return 'Registered successfully'
  }


}

module.exports = AppointmentController
