'use strict'
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51HsVnrJoko9usn1WUGAUwAmXQSRwBlphuawLN2EVYo9FrH2nFRYRpWEOufxDIJcT7uvoB21ytc1SDeL5wOz1MCoq00NhN9KPq0');
//const webSocketController = new WebSocketController();
const Database = use('Database')
const dateFormat = require("dateformat");
const Helpers = use('Helpers')
const webSocketController = require(Helpers.appRoot() + '/App/Controllers/Ws/WebSocketController');

class WebhookController {

  async webhook({ request, session, response }) {
    try {
      const event = request.all();
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          break;
        case 'payment_method.attached':
          const paymentMethod = event.data.object;
          break;
        case 'invoice.paid':
          console.log("invoice.paid")
          const invoicePaid = event.data.object
          this.invoicePaidEvent(event)
          break;
        default:
      }
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }
    response.json({ received: true });
  }

  async invoicePaidEvent(invoice) {
    try {
      console.log("inside invoice paid event")

      const transaction = await Database.table("transactions").where('invoice_id', 'in_1IExxeJoko9usn1WvWXCOboS').first()
      //console.log(transaction)
      const clientName = await Database.select('firstName').from('users').where('id', transaction.payee_user_id).first()
      const appointment = await Database.table('appointments').where('transaction_id', transaction.id).first()
      //console.log(appointment)
      const service = await Database.select('name').from('services').where('id', appointment.service_id).first()
      const time = appointment.stylist_start_time.slice(0, 3)
      const date = dateFormat(appointment.appointment_date, "ddd, mmmm dS");
      //console.log("clientName: ", clientName, "service: " + service.name, "time: " + time, "date: " + date)
      const messageObject = {
        content: {
          notification: 'newAppointment',
          clientName: clientName,
          serviceName: service.name,
          date: date,
          time: time
        },
        action: "notification"
      }
      webSocketController.sendMessage(messageObject, transaction.recipient_user_id)
    } catch (error) {
      console.log(error)
    }
    // send phone notification to stylist
    // send emails
    // transaction status to paid
    // appointment status pre appointment
  }

  
}

module.exports = WebhookController
