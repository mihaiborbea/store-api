const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');
const UsersService = require('../services/users.service');

exports.register = async function (req, res, next) {
  try {
    const testEmail = await UsersService.getByEmail(req.body.email);
    if (testEmail) {
      return res.status(409).json({
        status: 409,
        message: "Email arleady used"
      });
    }
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
      country: req.body.country,
      city: req.body.city,
      address: req.body.address,
      phone: req.body.phone
    };
    try {
      const createdUser = await UsersService.create(user);
      return res.status(200).json({
        status: 201,
        result: createdUser,
        message: 'User registered succesfully'
      });
    } catch (e) {
      return res.status(400).json({
        status: 400,
        message: e.message
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      error: "Password invalid"
    });
  }
};

exports.login = async function (req, res, next) {
  try {
    const user = await UsersService.getByEmail(req.body.email);
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: 'Auth failed'
      });
    }
    const matches = await bcrypt.compare(req.body.password, user.password);
    if (!matches) {
      return res.status(401).json({
        status: 401,
        message: 'Auth failed'
      });
    }
    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h"
      }
    );
    const loggedUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      country: user.country,
      city: user.city,
      address: user.address,
      phone: user.phone,
      type: user.type
    }
    return res.status(200).json({
      status: 200,
      message: "Auth successful",
      result: {
        user: loggedUser,
        token: token
      }
    })
  } catch (err) {
    return res.status(404).json({
      status: 401,
      message: "Auth failed"
    });
  }
}

exports.edit = async function (req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({
      status: 400,
      message: 'Id of the user is required'
    });
  }

  const id = req.params.id;

  const user = {
    id,
    firstName: req.body.firstName ? req.body.firstName : null,
    lastName: req.body.lastName ? req.body.lastName : null,
    email: req.body.email ? req.body.email : null,
    country: req.body.country ? req.body.country : null,
    city: req.body.city ? req.body.city : null,
    address: req.body.address ? req.body.address : null,
    phone: req.body.phone ? req.body.phone : null,
  };

  if (req.body.type) {
    const newType = ['CUSTOMER', 'SELLER', 'ADMIN']
      .find((el) => el === req.body.type);
    if (newType) {
      user.type = newType
    } else {
      return res.status(400).json({
        status: 400,
        message: 'The new user type is invalid'
      });
    }
  } else {
    user.type = null;
  }

  if (req.body.password) {
    const hash = await bcrypt.hash(req.body.password, 10);
    user.password = hash;
  } else {
    user.password = null;
  }

  try {
    const updatedUser = await UsersService.update(user);
    return res.status(200).json({
      status: 200,
      result: updatedUser,
      message: 'User updated succesfully'
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message
    });
  }
};

exports.delete = async function (req, res, next) {
  if (!req.params.id) {
    return res.status(400).json({
      status: 400,
      message: 'Id of the user is required'
    });
  }

  const id = req.params.id;

  try {
    await UsersService.delete(id);
    return res.status(204).json({
      status: 204,
      message: 'Users deleted successfully'
    });
  } catch (e) {
    return res.status(400).json({
      status: 400,
      message: e.message
    });
  }
};
