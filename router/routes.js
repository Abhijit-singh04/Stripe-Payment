const express = require('express')
const router = express.Router()

const {payment,home}  = require('../controller/request')

// const authMiddleware = require('../middleware/auth')
//get post requests are in reerence to server
router.route('/').get(home)
router.route('/payment').post(payment);



module.exports = router;