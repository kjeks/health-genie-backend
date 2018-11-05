const createError = require('http-errors');
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const DBConnection = require('./DBConnection');
const LoginController = require('./controllers/LoginController');
const mealController = require('./controllers/MealController');
const userController = require('./controllers/UserController');
const ActivityController = require('./controllers/ActivityController');
const AdminController = require('./controllers/AdminController');
const IngredientController = require('./controllers/IngredientController');
const DayController = require('./controllers/DayController');
const RegisterController = require('./controllers/RegisterController');

const app = express();

DBConnection.connect();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Request-Headers", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use('/login', LoginController);
app.use('/register', RegisterController);
app.use(function (req, res, next) {
    if(req.method === 'OPTIONS') {
        next();
    }
    else {
        let token = req.headers['authorization'].replace('Bearer ', "");
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "No token, please log in"
            });
        }
        jwt.verify(token, process.env.JWT_SECRET, function(err, login) {
            if(err) {
                return res.status(401).json({
                    success: false,
                    message: "Token not valid, Please login again"
                });
            }
            else {
                req.login = login;
                next();
            }
        });
    }
});
app.use('/users', userController);
app.use('/meals', mealController);
app.use('/activities', ActivityController);
app.use('/admin', AdminController);
app.use('/ingredients', IngredientController);
app.use('/days', DayController);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
