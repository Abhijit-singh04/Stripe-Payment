
const stripe = Stripe("YOUR_PUBLISH_KEY");

// The items the customer wants to buy
const items = [{ id: "abc" }];

let elements;

initialize();//the initialize function is called everytime when the script is instantiated so any code within the function is executed no matter the sub-function that is called via the external script.


document
    .querySelector("#payment-form")
    .addEventListener("submit", handleSubmit);


checkStatus();
// Fetches a payment intent(determine to do something) and captures the client secret
async function initialize() {
    const response = await fetch("/payment", {/*The fetch() method in JavaScript is used to request to the server and load the information in the webpages. The request can be of any APIs that returns the data of the format JSON or XML. This method returns a promise. */
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
    });
    const { clientSecret } = await response.json();//The client secret api required  for a PaymentIntent or SetupIntent.

    const appearance = {/*Used with the Payment Element.Match the design of your site with the appearance option. The layout of each Element stays consistent, but you can modify colors, fonts, borders, padding, and more.*/
        theme: 'stripe',
    };
    elements = stripe.elements({ appearance, clientSecret });/*Initialise the Stripe Elements UI library with the client secret. Elements manages the UI components you need to collect payment details. */

    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");/*Create a PaymentElement and mount it to the placeholder <div> in your payment form. This embeds an iframe with a dynamic form that displays configured payment method types available from the PaymentIntent, allowing your customer to select a payment method. The form automatically collects the associated payments details for the selected payment method type. */
}

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await stripe.confirmPayment({/*Call confirmPayment(), passing along the PaymentElement and a return_url to indicate where Stripe should redirect the user after they complete the payment. */
        elements,
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: "http://localhost:3000/success.html",
        },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {/*If there are any immediate errors (for example, your customer’s card is declined), Stripe.js returns an error. Show that error message to your customer so they can try again. */
        showMessage(error.message);
    } else {
        showMessage("An unexpected error occured.");
    }

    setLoading(false);
}

// Fetches the payment intent status after payment submission
// Show a payment status message
// When Stripe redirects the customer to the return_url, the payment_intent_client_secret query parameter is appended by Stripe.js. Use this to retrieve the PaymentIntent to determine what to show to your customer.
async function checkStatus() {
    // The URLSearchParams() constructor creates and returns a new URLSearchParams object.
    // The search property returns the querystring part of a URL, including the question mark (?).
    const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
    );

    if (!clientSecret) {
        return;
    }
// When Stripe redirects the customer to the return_url, the payment_intent_client_secret query parameter is appended by Stripe.js. Use this to retrieve the PaymentIntent to determine what to show to your customer.

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
        case "succeeded":
            showMessage("Payment succeeded!");
            break;
        case "processing":
            showMessage("Your payment is processing.");
            break;
        case "requires_payment_method":
            showMessage("Your payment was not successful, please try again.");
            break;
        default:
            showMessage("Something went wrong.");
            break;
    }
}

// ------- UI helpers -------

function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageText.textContent = "";
    }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}