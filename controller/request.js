const stripe = require('stripe')("YOUR_SECRET_KEY");
// const YOUR_DOMAIN = "http://localhost:3000";



const home = (req, res) => {
  res.render('checkout.html')
}

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 10;
};

// Create a PaymentIntent
// Add an endpoint on your server that creates a PaymentIntent. A PaymentIntent tracks the customer’s payment lifecycle, keeping track of any failed payment attempts and ensuring the customer is only charged once. Return the PaymentIntent’s client secret in the response to finish the payment on the client.
const payment = async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
};




  module.exports = { payment, home };