var express = require('express');

var router = express.Router();
var UsersController = require('../controllers/users.controller');

// Map each API to the Controller FUnctions

router.post('/register', UsersController.register);

router.post('/login', UsersController.login);

module.exports = router;
