const ProductModel = require('../models/product.model');

exports.create = async function (product) {
  const newProduct = new ProductModel({
    name: product.name,
    imageURL: product.imageURL,
    description: product.description || '',
    availableQuantity: product.availableQuantity,
    store: product.store,
    price: product.price,
    category: product.category,
  });

  try {
    const savedProduct = await newProduct.save();
    return savedProduct;
  } catch (e) {
    throw Error('Error while creating the product: ' + e);
  }
};

exports.getById = async function (id, callback) {
  return ProductModel.findById(id, callback);
};

exports.getByEmail = async function (email, callback) {
  const query = { email: email };
  return ProductModel.findOne(query, callback);
};

exports.getItem = async function (query, callback) {
  return ProductModel.findOne(query, callback);
}

exports.getList = async function (query, options) {
  try {
    const products = await ProductModel.paginate(query, options);
    return products;
  } catch (e) {
    throw Error('Error while paginating products');
  }
}

// exports.update = async function (user) {
//   const id = user.id;
//   let oldUser;

//   try {
//     oldUser = await UserModel.findById(id);
//   } catch (e) {
//     throw Error('User could not be found');
//   }

//   if (!oldUser) {
//     return false;
//   }

//   oldUser.firstName = user.firstName || oldUser.firstName;
//   oldUser.lastName = user.lastName || oldUser.lastName;
//   oldUser.email = user.email || oldUser.email;
//   oldUser.password = user.password || oldUser.password;
//   oldUser.country = user.country || oldUser.country;
//   oldUser.city = user.city || oldUser.city;
//   oldUser.address = user.address || oldUser.address;
//   oldUser.phone = user.phone || oldUser.phone;
//   oldUser.type = user.type || oldUser.type;

//   try {
//     const savedUser = await oldUser.save();
//     return savedUser;
//   } catch (e) {
//     throw Error('An error occured while updating the user');
//   }
// };

// exports.delete = async function (id) {
//   try {
//     const deleted = await UserModel.findOneAndRemove({ _id: id });
//   } catch (e) {
//     throw Error('Error occured while deleting the user');
//   }
// };
