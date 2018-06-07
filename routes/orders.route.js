const express = require('express');

const router = express.Router();
const OrdersController = require('../controllers/orders.controller');

// Map each API to the Controller Functions

router.post('/', OrdersController.create);

router.patch('/:id', OrdersController.edit);

router.get('/', OrdersController.getList);

router.get('/:id', OrdersController.getItem);

module.exports = router;
