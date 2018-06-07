const OrderModel = require('../models/order.model');

exports.create = async function (order) {
  const newOrder = new OrderModel({
    owner: order.owner,
    products: [],
    status: order.status
  });

  try {
    const savedOrder = await newOrder.save();
    return savedOrder;
  } catch (e) {
    throw Error('Error while creating the order: ' + e);
  }
};

exports.getById = async function (id, callback) {
  // Post.find().deepPopulate('comments.user').exec(function (err, posts)
  return OrderModel.findById(id).deepPopulate('owner products.product');
};

exports.getByEmail = async function (email, callback) {
  const query = { email: email };
  return OrderModel.findOne(query).deepPopulate('owner products.product');
};

exports.getItem = async function (query, callback) {
  return OrderModel.findOne(query).deepPopulate('owner products.product');
}

exports.getList = async function (query, options) {
  try {
    const orders = await OrderModel.paginate(query, options);
    return orders;
  } catch (e) {
    throw Error('Error while paginating orders');
  }
}

exports.update = async function (order) {
  const id = order.id;
  let oldOrder;

  try {
    oldOrder = await OrderModel.findById(id);
  } catch (e) {
    throw Error('Order could not be found');
  }

  if (!oldOrder) {
    return false;
  }

  oldOrder.owner = oldOrder.owner;
  oldOrder.products = (order.products && order.products.length !== oldOrder.products.length) ||
    oldOrder.products.every((v, i) => v !== order.products[i]) ? order.products : oldOrder.products;
  oldOrder.status = order.status || oldOrder.status;

  try {
    const savedOrder = await oldOrder.save();
    return savedOrder.deepPopulate('owner products.product');
  } catch (e) {
    throw Error('An error occured while updating the order');
  }
};

// exports.delete = async function (id) {
//   try {
//     const deleted = await UserModel.findOneAndRemove({ _id: id });
//   } catch (e) {
//     throw Error('Error occured while deleting the user');
//   }
// };
