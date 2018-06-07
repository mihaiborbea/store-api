const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

const UserModel = require('../models/user.model');
const ProductsService = require('../services/products.service');

exports.create = async function (req, res, next) {
  try {
    const userId = req.get('userId');
    const user = await UserModel.findById(userId);
    const date = new Date();

    if (!req.files) {
      return res.status(400).send('No files were uploaded.');
    }
    let file = req.files.image;
    file.mv(
      '/var/www/store-api/public/images/' + userId + date.getTime() + req.files.image.name,
      function (err) {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: 'No file uploaded'
          });
        }
      });
    const imageURL = 'http://localhost:3000/public/uploads/' + userId + date.getTime() + req.files.image.name;

    const product = {
      name: req.body.name,
      imageURL: imageURL,
      description: req.body.description || null,
      availableQuantity: req.body.availableQuantity,
      store: userId,
      price: req.body.price,
      category: req.body.category,
    };
    try {
      const createdProduct = await ProductsService.create(product);
      return res.status(200).json({
        status: 201,
        result: createdProduct,
        message: 'Created product succesfully'
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

// exports.login = async function (req, res, next) {
//   try {
//     const user = await UsersService.getItem({ email: req.body.email });
//     if (!user) {
//       return res.status(401).json({
//         status: 401,
//         message: 'Auth failed'
//       });
//     }
//     const matches = await bcrypt.compare(req.body.password, user.password);
//     if (!matches) {
//       return res.status(401).json({
//         status: 401,
//         message: 'Auth failed'
//       });
//     }
//     const token = jwt.sign(
//       {
//         userId: user._id
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "2h"
//       }
//     );
//     const loggedUser = {
//       _id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       country: user.country,
//       city: user.city,
//       address: user.address,
//       phone: user.phone,
//       type: user.type
//     }
//     return res.status(200).json({
//       status: 200,
//       message: "Auth successful",
//       result: {
//         user: loggedUser,
//         token: token
//       }
//     })
//   } catch (err) {
//     return res.status(404).json({
//       status: 401,
//       message: "Auth failed"
//     });
//   }
// }

// exports.edit = async function (req, res, next) {
//   if (!req.params.id) {
//     return res.status(400).json({
//       status: 400,
//       message: 'Id of the user is required'
//     });
//   }

//   const id = req.params.id;

//   const user = {
//     id,
//     firstName: req.body.firstName ? req.body.firstName : null,
//     lastName: req.body.lastName ? req.body.lastName : null,
//     email: req.body.email ? req.body.email : null,
//     country: req.body.country ? req.body.country : null,
//     city: req.body.city ? req.body.city : null,
//     address: req.body.address ? req.body.address : null,
//     phone: req.body.phone ? req.body.phone : null,
//   };

//   if (req.body.type) {
//     const newType = ['CUSTOMER', 'SELLER', 'ADMIN']
//       .find((el) => el === req.body.type);
//     if (newType) {
//       user.type = newType
//     } else {
//       return res.status(400).json({
//         status: 400,
//         message: 'The new user type is invalid'
//       });
//     }
//   } else {
//     user.type = null;
//   }

//   if (req.body.password) {
//     const hash = await bcrypt.hash(req.body.password, 10);
//     user.password = hash;
//   } else {
//     user.password = null;
//   }

//   try {
//     const updatedUser = await UsersService.update(user);
//     return res.status(201).json({
//       status: 201,
//       result: updatedUser,
//       message: 'User updated succesfully'
//     });
//   } catch (e) {
//     return res.status(400).json({
//       status: 400,
//       message: e.message
//     });
//   }
// };

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

// exports.getList = async function (req, res, next) {
//   const options = {
//     page: req.query.page ? req.query.page : 1,
//     limit: req.query.limit ? req.query.limit : 100,
//   };

//   let query = {};

//   if (req.query.filter) {
//     query = req.query.filter
//   }

//   if (req.query.sort) {
//     options.sort = req.query.sort;
//   }


//   try {
//     const users = await UsersService.getList(query, options);
//     return res.status(200).json({
//       status: 200,
//       result: users
//     });
//   } catch (e) {
//     return res.status(400).json({
//       status: 400,
//       message: e.message
//     });
//   }
// }

// exports.getItem = async function (req, res, next) {
//   let id;
//   if (req.params.id) {
//     id = req.params.id;
//   } else {
//     return res.status(400).json({
//       status: 400,
//       message: 'Id is mandatory'
//     });
//   }
//   try {
//     const user = await UsersService.getById(id);
//     return res.status(200).json({
//       status: 200,
//       result: user
//     });
//   } catch (e) {
//     return res.status(400).json({
//       status: 400,
//       message: e.message
//     });
//   }
// }
