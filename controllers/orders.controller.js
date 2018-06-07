const UserModel = require('../models/user.model');
const ProductModel = require('../models/product.model');
const ProductsService = require('../services/products.service');
const OrdersService = require('../services/orders.service');

exports.create = async function (req, res, next) {
  try {
    const userId = req.get('userId');
    const user = await UserModel.findById(userId);

    const order = {
      owner: userId,
    };
    try {
      const createdOrder = await OrdersService.create(order);
      return res.status(200).json({
        status: 201,
        result: createdOrder,
        message: 'Created order succesfully'
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        message: e.message
      });
    }
  } catch (e) {
    return res.status(500).json({
      status: 500,
      message: 'Invalid User'
    });
  }
};

exports.getList = async function (req, res, next) {
  const userId = req.get('userId');
  let user;
  try {
    user = await UserModel.findById(userId);
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid user'
    });
  }

  const options = {
    page: req.query.page ? req.query.page : 1,
    limit: req.query.limit ? req.query.limit : 100,
    populate: ['owner', 'products.product']
  };
  let query = {};
  if (req.query.filter) {
    query = req.query.filter
  }
  query.owner = userId;
  if (req.query.sort) {
    options.sort = req.query.sort;
  }
  try {
    const orders = await OrdersService.getList(query, options);
    return res.status(200).json({
      status: 200,
      result: orders
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message
    });
  }
}

exports.getItem = async function (req, res, next) {
  const userId = req.get('userId');
  let user;
  try {
    user = await UserModel.findById(userId);
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid user'
    });
  }
  let id;
  if (req.params.id) {
    id = req.params.id;
  } else {
    return res.status(400).json({
      status: 400,
      message: 'Id is mandatory'
    });
  }
  try {
    const order = await OrdersService.getById(id);
    return res.status(200).json({
      status: 200,
      result: order
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message
    });
  }
}

exports.edit = async function (req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({
      status: 400,
      message: 'Id of the order is required'
    });
  }
  const id = req.params.id;
  const order = {
    id
  };
  let feProds;
  let beProds = [];
  if (req.body.products) {
    feProds = req.body.products;
  }
  if (feProds && feProds.length > 0) {
    feProds.forEach((element) => {
        const tempProd = {
          product: { _id: element.product._id },
          quantity: element.quantity
        };
        beProds.push(tempProd);
    });
  }
  order.products = beProds;
  if (req.body.status) {
    const newStatus = ['ACTIVE', 'DONE']
      .find((el) => el === req.body.status);
    if (newStatus) {
      order.status = newStatus
    } else {
      return res.status(400).json({
        status: 400,
        message: 'The new order status is invalid'
      });
    }
  } else {
    order.status = null;
  }
  try {
    const updatedOrder = await OrdersService.update(order);
    if (updatedOrder.status === 'DONE') {
      await OrdersService.create({ owner: updatedOrder.owner });
    }
    return res.status(201).json({
      status: 201,
      result: updatedOrder,
      message: 'Order updated succesfully'
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message
    });
  }
};

// exports.delete = async function (req, res, next) {
//   if (!req.params.id) {
//     return res.status(400).json({
//       status: 400,
//       message: 'Id of the user is required'
//     });
//   }
//   const id = req.params.id;
//   try {
//     await UsersService.delete(id);
//     return res.status(201).json({
//       status: 201,
//       message: 'Users deleted successfully'
//     });
//   } catch (e) {
//     return res.status(400).json({
//       status: 400,
//       message: e.message
//     });
//   }
// };
