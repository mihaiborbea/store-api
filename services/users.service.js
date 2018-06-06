const UserModel = require('../models/user.model');

exports.createUser = async function (user) {
  const newUser = new UserModel({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password
  });

  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (e) {
    throw Error('Error while Creating User');
  }
};

exports.getUserById = async function (id, callback) {
  return UserModel.findById(id, callback);
};

exports.getUserByEmail = async function (email, callback) {
  const query = { email: email };
  return UserModel.findOne(query, callback);
};
