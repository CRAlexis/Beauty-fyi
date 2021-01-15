'use strict'

const view = use('View');
const stripe = require('stripe')('sk_test_51HsVnrJoko9usn1WUGAUwAmXQSRwBlphuawLN2EVYo9FrH2nFRYRpWEOufxDIJcT7uvoB21ytc1SDeL5wOz1MCoq00NhN9KPq0');


class WebViewController {

    async addCard({ request }){
        return view.render('webViews/addcard')
    }


    async addCardAPI({ response }){ // This is for stylists to view their packages

        //retrieve their customer ID form our database by searching for their emali
        //And parse their customer id into the function below
        const session = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: 'https://example.com/account',
        });

        response.redirect(session.url);
    }

    async goToStore ({ request, response}){
            //const { priceId } = request.all();
            let priceId = "price_1I9xizJoko9usn1W9nCpOLxm"

            // See https://stripe.com/docs/api/checkout/sessions/create
            // for additional parameters to pass.
            try {
                const session = await stripe.checkout.sessions.create({
                    mode: "subscription",
                    payment_method_types: ["card"],
                    line_items: [
                        {
                            price: priceId,
                            // For metered billing, do not pass quantity
                            quantity: 1,
                        },
                    ],
                    // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
                    // the actual Session ID is returned in the query parameter when your customer
                    // is redirected to the success page.
                    success_url: 'https://example.com/success.html?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url: 'https://example.com/canceled.html',
                });

                response.send({
                    sessionId: session.id,
                });
            } catch (e) {
                response.status(400);
                return response.send({
                    error: {
                        message: e.message,
                    }
                });
            }
    }

}

module.exports = WebViewController
