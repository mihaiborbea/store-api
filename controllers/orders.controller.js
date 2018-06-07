const UserModel = require('../models/user.model');
const ProductModel = require('../models/product.model');
const ProductsService = require('../services/products.service');
const OrderService = require('../services/orders.service');

exports.create = async function (req, res, next) {
  try {
    const userId = req.get('userId');
    const user = await UserModel.findById(userId);

    const order = {
      owner: userId,
    };
    try {
      const createdOrder = await OrderService.create(order);
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
  const options = {
    page: req.query.page ? req.query.page : 1,
    limit: req.query.limit ? req.query.limit : 100,
    populate: 'store'
  };
  let query = {};
  if (req.query.filter) {
    query = req.query.filter
  }
  if (req.query.sort) {
    options.sort = req.query.sort;
  }
  try {
    const products = await ProductsService.getList(query, options);
    return res.status(200).json({
      status: 200,
      result: products
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message
    });
  }
}

exports.getItem = async function (req, res, next) {
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
    const product = await ProductsService.getById(id);
    return res.status(200).json({
      status: 200,
      result: product
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
    id,
    products: req.body.products ? req.body.products : []
  };
  if (order.products && order.products.length > 0) {
    order.products.forEach(async (element) => {
      try{
        await ProductModel.findById(element.id);
      } catch(e) {
        return res.status(400).json({
          status: 400,
          message: 'Invalid products found'
        });
      }
    });
  }
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
    const updatedOrder = await OrderService.update(order);
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
