const express = require('express');
const registercontroller = require('../controller/identity_controller');
const router = express.Router();
router.post('/register',registercontroller)
module.exports = router;