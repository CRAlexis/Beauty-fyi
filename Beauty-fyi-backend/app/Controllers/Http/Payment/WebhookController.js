'use strict'
const Stripe = require('stripe');
const stripe = Stripe('pk_test_51HsVnrJoko9usn1WKaaJyUNyB5ItGl1PH2OueBSU9PZXKhuoSsHVVx1uaGlDEL2ENDxQYedzyN5BnC6v9iZaiQRJ00zFV7ISvs');

class WebhookController {

  async webhook ({ request, session, response }) {
        // Match the raw body to content type application/json
      let event;
      console.log("here")
     const eventID = request.input('id')

    const event = await stripe.events.retrieve(eventID)

    console.log(event)
      console.log("Space");
      

     /* try {
        event = JSON.parse(request.all());


      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          // Then define and call a method to handle the successful payment intent.
          // handlePaymentIntentSucceeded(paymentIntent);
          break;
        case 'payment_method.attached':
          const paymentMethod = event.data.object;
          // Then define and call a method to handle the successful attachment of a PaymentMethod.
          // handlePaymentMethodAttached(paymentMethod);
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }*/
      // Return a response to acknowledge receipt of the event
      response.json({received: true});
  }
}

module.exports = WebhookController
