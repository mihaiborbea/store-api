const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/user.model');
const UsersService = require('../services/users.service');

exports.register = async function (req, res, next) {
  try {
    const testEmail = await UsersService.getUserByEmail(req.body.email);
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
      password: hash
    };
    try {
      const createdUser = await UsersService.createUser(user);
      return res.status(200).json({
        status: 201,
        result: createdUser,
        message: 'User registered Succesfully'
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
    const user = await UsersService.getUserByEmail(req.body.email);
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
        expiresIn: "1h"
      }
    );
    const loggedUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }
    return res.status(200).json({
      status: 200,
      message: "Auth successful",
      user: loggedUser,
      token: token
    })
  } catch (err) {
    return res.status(404).json({
      status: 401,
      message: "Auth failed"
    });
  }
}
