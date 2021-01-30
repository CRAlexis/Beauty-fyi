'use strict'
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51HsVnrJoko9usn1WUGAUwAmXQSRwBlphuawLN2EVYo9FrH2nFRYRpWEOufxDIJcT7uvoB21ytc1SDeL5wOz1MCoq00NhN9KPq0');

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

  async invoicePaidEvent(event){
    // send phone notification to stylist
    // send emails
    // transaction status to paid
    // appointment status pre appointment
  }
}

module.exports = WebhookController
