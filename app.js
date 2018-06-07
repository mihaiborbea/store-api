const bluebird = require('bluebird');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const indexRouter = require('./routes/index.route');
const usersRouter = require('./routes/users.route');
const productsRouter = require('./routes/products.route');

const app = express();

dotenv.config();

// DB connection
mongoose.Promise = bluebird;
mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log(`Succesfully Connected to the Mongodb Database at ${process.env.DB_URI}`);
})
  .catch(err => {
    console.log(`Error Connecting to the Mongodb.\nERROR: ${err}`);
});

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, UserId'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use(fileUpload());

// Logger
app.use(logger('dev'));


// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static folder
app.use(express.static(__dirname + '/public'));

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);


// Error handling

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
