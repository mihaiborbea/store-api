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



exports.update = async function (user) {
  const id = user.id;
  let oldUser;

  try {
    oldUser = await UserModel.findById(id);
  } catch (e) {
    throw Error('User could not be found');
  }

  if (!oldUser) {
    return false;
  }

  oldUser.firstName = user.firstName || oldUser.firstName;
  oldUser.lastName = user.lastName || oldUser.lastName;
  oldUser.email = user.email || oldUser.email;
  oldUser.password = user.password || oldUser.password;
  oldUser.country = user.country || oldUser.country;
  oldUser.city = user.city || oldUser.city;
  oldUser.address = user.address || oldUser.address;
  oldUser.phone = user.phone || oldUser.phone;
  oldUser.type = user.type || oldUser.type;

  try {
    const savedUser = await oldUser.save();
    return savedUser;
  } catch (e) {
    throw Error('An error occured while updating the user');
  }
};

exports.delete = async function (id) {
  try {
    const deleted = await UserModel.findOneAndRemove({ _id: id });
  } catch (e) {
    throw Error('Error occured while deleting the user');
  }
};

exports.getById = async function (id, callback) {
  return UserModel.findById(id, callback);
};

exports.getByEmail = async function (email, callback) {
  const query = { email: email };
  return UserModel.findOne(query, callback);
};

exports.getItem = async function (query, callback) {
  return UserModel.findOne(query, callback);
}

exports.getList = async function (query, options) {
  try {
    const users = await UserModel.paginate(query, options);
    return users;
  } catch (e) {
    throw Error('Error while paginating users');
  }
}
