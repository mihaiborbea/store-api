const express = require('express');

const router = express.Router();
const ProductsController = require('../controllers/products.controller');

// Map each API to the Controller Functions

router.post('/', ProductsController.create);

router.get('/', ProductsController.getList);

router.get('/:id', ProductsController.getItem);

module.exports = router;
