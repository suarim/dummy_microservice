const express = require('express');
const {userregistercontroller,getallusers} = require('../controller/identity_controller');

const router = express.Router();
router.post('/register',userregistercontroller)
router.get('/users',getallusers)
module.exports = router;