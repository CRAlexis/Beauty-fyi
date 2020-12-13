'use strict'

const Stripe = require('stripe');
const stripe = Stripe('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

class StripeController {

  async test({}){
    /*stripe.charges.retrieve('ch_1HsVojJoko9usn1Wds1EuSfk', {
      api_key: 'sk_test_51HsVnrJoko9usn1WUGAUwAmXQSRwBlphuawLN2EVYo9FrH2nFRYRpWEOufxDIJcT7uvoB21ytc1SDeL5wOz1MCoq00NhN9KPq0'
    });

    const Stripe = require('stripe');
    const stripe = Stripe('sk_test_51HsVnrJoko9usn1WUGAUwAmXQSRwBlphuawLN2EVYo9FrH2nFRYRpWEOufxDIJcT7uvoB21ytc1SDeL5wOz1MCoq00NhN9KPq0');
    stripe.charges.retrieve('ch_1HsVojJoko9usn1WTElytS1E', {
      expand: ['customer', 'invoice.subscription'],
    });*/

    stripe.charges.create({
      amount: 2000,
      currency: "usd",
      source: "tok_visa", // obtained with Stripe.js
      description: "My First Test Charge (created for API docs)"
    }, {
      idempotencyKey: "iixHtZtHZMTT7px5"
    }, function(err, charge) {
      // asynchronously called
      return charge;
    });
    return "success";

    myFunction.then((result) =>{

    }, (error) => {

    }).catch((error) =>{

    })

    function myFunction(){
      return new Promise((resolve, reject) => {

        resolve("string")
        reject()``
      })
    }

  }

}

module.exports = StripeController
