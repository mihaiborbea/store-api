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
