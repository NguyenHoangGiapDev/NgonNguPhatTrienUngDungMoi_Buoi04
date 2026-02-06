var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//domain:port/api/v1/products
//domain:port/api/v1/users
//domain:port/api/v1/categories
//domain:port/api/v1/roles

app.use('/', require('./routes/index'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/categories', require('./routes/categories'))
app.use('/api/v1/products', require('./routes/products'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // if the request is for the API, forward an error so the API error handler can return JSON
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send JSON for API requests
  const isApi = req.originalUrl && req.originalUrl.startsWith('/api');
  res.status(err.status || 500);
  if (isApi || req.xhr || (req.get('Accept') && req.get('Accept').includes('application/json'))) {
    return res.json({
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    });
  }

  // otherwise render the error page (HTML)
  res.render('error');
});

module.exports = app;
