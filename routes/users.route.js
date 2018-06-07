const express = require('express');

const router = express.Router();
const UsersController = require('../controllers/users.controller');

// Map each API to the Controller FUnctions

router.post('/register', UsersController.register);

router.post('/login', UsersController.login);

router.patch('/:id', UsersController.edit);

router.delete('/:id', UsersController.delete);

router.get('/', UsersController.getList);

router.get('/:id', UsersController.getItem);

module.exports = router;
