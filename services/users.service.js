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
  var id = user.id;

  try {
    var oldUser = await UserModel.findById(id);
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
    var savedUser = await oldUser.save();
    return savedUser;
  } catch (e) {
    throw Error('An error occured while updating the user');
  }
};

exports.delete = async function (id) {
  try {
    var deleted = await ToDoModel.remove({ _id: id });
    if (deleted.result.n === 0) {
      throw Error('User could not be deleted');
    }
    return deleted.result.n;
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

exports.getList = async function (query, options) {
  try {
    const users = UserModel.paginate(query, options);
    return users;
  } catch (e) {
    throw Error('Error while paginating users');
  }
}
