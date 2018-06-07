const UserModel = require('../models/user.model');

exports.create = async function (user) {
  const newUser = new UserModel({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
    country: user.country,
    city: user.city,
    address: user.address,
    phone: user.phone
  });

  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (e) {
    throw Error('Error while Creating User: ' + e);
  }
};

exports.getById = async function (id, callback) {
  return UserModel.findById(id, callback);
};

exports.getByEmail = async function (email, callback) {
  const query = { email: email };
  return UserModel.findOne(query, callback);
};
