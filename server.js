const express = require('express');
const app = express();
// const stripe =require('stripe')("YOUR_SECRET_KEY");
require('dotenv').config();


//view_engine
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

// middleware
app.use(express.static('./views'));
app.use(express.json());


//router
const mainrouter=require('./router/routes');
app.use('/',mainrouter)



const port = process.env.PORT || 3000;

const start = async () => {
    try {
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    }
    catch (error) {
        console.log(error);
    }
}

start();