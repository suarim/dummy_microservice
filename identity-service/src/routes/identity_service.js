const express = require('express');
const {userregistercontroller,getallusers,refreshtokenController,logoutController} = require('../controller/identity_controller');

const router = express.Router();
router.post('/register',userregistercontroller)
router.get('/users',getallusers)
router.post('/refresh-token',refreshtokenController)
router.post('/logout',logoutController)

module.exports = router;