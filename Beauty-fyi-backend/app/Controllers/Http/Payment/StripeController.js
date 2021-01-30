'use strict'

const Stripe = require('stripe');
const Database = use('Database')
const Appointment = use('App/Models/Appointment')
const StripeAttr = use('App/Models/StripeAttr')
var stripe = Stripe('sk_test_51HsVnrJoko9usn1WUGAUwAmXQSRwBlphuawLN2EVYo9FrH2nFRYRpWEOufxDIJcT7uvoB21ytc1SDeL5wOz1MCoq00NhN9KPq0');

class StripeController {

  async test({ }) {
    

    //------------Stylist---------------------\\

    /* const account = await stripe.accounts.create({
       type: 'standard',
       country: 'GB',
       email: 'stylist2@hotmail.com',
     });*/

    /* const accountLinks = await stripe.accountLinks.create({
       account: 'acct_1IEFIuGlR6qPdhPd',
       refresh_url: 'https://example.com/reauth',
       return_url: 'https://example.com/return',
       type: 'account_onboarding',
     });
     return accountLinks*/

    /*const transfer = await stripe.transfers.create({
      amount: 10,
      currency: "gbp",
      destination: "acct_1IEFIuGlR6qPdhPd",
    });

    return paymentIntent*/

    //-------------Customer-------------------//



    /*
    

    //console.log(invoice)
    //console.log(sendInvoice)
    */

    return "success";

  }

  async createCustomerNonHttp(userID, Email) {
    return new Promise(async (resolve, reject) => {
      try {
        const customer = await stripe.customers.create({
          name: "Charles Alexis",
          description: 'This user was created during the booking proccess',
          email: Email
        });
        const stripeAttr = await StripeAttr.findOrCreate(
          { user_id: userID },
          {
            user_id: userID,
            customer_id: customer.id
          }
        )
        resolve()
      } catch (error) {
        console.log(error)
        reject()
      }
    })
  }

  async sendInvoiceNonHttp(userID, amount) {
    return new Promise(async (resolve, reject) => {
      try {
        const query = await Database.table("stripe_attrs").where('user_id', userID).first()
        const customerID = query.customer_id
        console.log(customerID)
        const invoiceItem = await stripe.invoiceItems.create({
          amount: amount,
          currency: 'gbp',
          customer: customerID,
          description: 'Set-up fee',
        });


        const invoice = await stripe.invoices.create({
          customer: customerID,
          auto_advance: true,
          collection_method: "send_invoice",
          description: "Sending an invoice",
          days_until_due: 1
        });

        const sendInvoice = await stripe.invoices.finalizeInvoice(
          invoice.id
        );

        //console.log(sendInvoice)
        resolve(invoice)

      } catch (error) {
        console.log(error)
        reject()
      }
    })

  }

}

module.exports = StripeController
