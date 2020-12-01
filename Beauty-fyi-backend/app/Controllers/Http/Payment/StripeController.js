'use strict'

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51HsVnrJoko9usn1WUGAUwAmXQSRwBlphuawLN2EVYo9FrH2nFRYRpWEOufxDIJcT7uvoB21ytc1SDeL5wOz1MCoq00NhN9KPq0');

class StripeController {

  async test({}){
    stripe.charges.retrieve('ch_1HsVojJoko9usn1Wds1EuSfk', {
      api_key: 'sk_test_51HsVnrJoko9usn1WUGAUwAmXQSRwBlphuawLN2EVYo9FrH2nFRYRpWEOufxDIJcT7uvoB21ytc1SDeL5wOz1MCoq00NhN9KPq0'
    });

    const Stripe = require('stripe');
    const stripe = Stripe('sk_test_51HsVnrJoko9usn1WUGAUwAmXQSRwBlphuawLN2EVYo9FrH2nFRYRpWEOufxDIJcT7uvoB21ytc1SDeL5wOz1MCoq00NhN9KPq0');
    stripe.charges.retrieve('ch_1HsVojJoko9usn1WTElytS1E', {
      expand: ['customer', 'invoice.subscription'],
    });
  }

}

module.exports = StripeController
