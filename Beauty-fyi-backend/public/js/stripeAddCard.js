// Create a Stripe client.
/*var stripe = Stripe('pk_test_51HsVnrJoko9usn1WKaaJyUNyB5ItGl1PH2OueBSU9PZXKhuoSsHVVx1uaGlDEL2ENDxQYedzyN5BnC6v9iZaiQRJ00zFV7ISvs');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
    
    base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

// Create an instance of the card Element.
var card = elements.create('card', { style: style, hidePostalCode: true });

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');
// Handle real-time validation errors from the card Element.
card.on('change', function (event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Handle form submission.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function (event) {
    event.preventDefault();

    stripe.createToken(card).then(function (result) {
        if (result.error) {
            // Inform the user if there was an error.
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to your server.
            stripeTokenHandler(result.token);
        }
    });
});



// Submit the form with the token ID.
function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    console.log(token.id)
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    // Submit the form
    form.submit();
}

var createCheckoutSession = function (priceId) {
    return fetch("/create-checkout-session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            priceId: "price_1I9xizJoko9usn1W9nCpOLxm"
        })
    }).then(function (result) {
        return result.json();
    });
};

document
    .getElementById("checkout")
    .addEventListener("click", function (evt) {
        createCheckoutSession(PriceId).then(function (data) {
            // Call Stripe.js method to redirect to the new Checkout page
            stripe
                .redirectToCheckout({
                    sessionId: data.sessionId
                })
                .then(handleResult);
        });
    });
*/

var stripe = Stripe('pk_test_51HsVnrJoko9usn1WKaaJyUNyB5ItGl1PH2OueBSU9PZXKhuoSsHVVx1uaGlDEL2ENDxQYedzyN5BnC6v9iZaiQRJ00zFV7ISvs');

var checkoutButton = document.getElementById('checkout-button-price_1I9xizJoko9usn1W9nCpOLxm');
checkoutButton.addEventListener('click', function () {
    /*
     * When the customer clicks on the button, redirect
     * them to Checkout.
     */
    stripe.redirectToCheckout({
        lineItems: [{ price: 'price_1I9xizJoko9usn1W9nCpOLxm', quantity: 1 }],
        mode: 'subscription',
        /*
         * Do not rely on the redirect to the successUrl for fulfilling
         * purchases, customers may not always reach the success_url after
         * a successful payment.
         * Instead use one of the strategies described in
         * https://stripe.com/docs/payments/checkout/fulfill-orders
         */
        successUrl: 'https://your-website.com/success',
        cancelUrl: 'https://your-website.com/canceled',
    })
        .then(function (result) {
            if (result.error) {
                /*
                 * If `redirectToCheckout` fails due to a browser or network
                 * error, display the localized error message to your customer.
                 */
                var displayError = document.getElementById('error-message');
                displayError.textContent = result.error.message;
            }
        });
});