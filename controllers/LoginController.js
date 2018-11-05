const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const LoginModel = require('../models/LoginModel');
const generateToken = require('../Utils/TokenUtils').generateToken;
const UserModel = require('../models/UserModel');
const RegisterTokenModel = require('../models/RegisterTokenModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

router.post('/register', function (req, res, next) {
    const body = req.body;
    LoginModel.createLogin(body.email, passwordHash.generate(body.password)).then(userId => {
        return LoginModel.getLoginById(userId);
    }).then(login => {
        UserModel.createUserWithLogin(login._id);
        RegisterTokenModel.createNewToken(login._id).then(token => {
            let transporter = nodemailer.createTransport({ service: 'Sendgrid', tls: {rejectUnauthorized: false}, auth: {user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD}});
            let mailOptions = {from: 'no-reply@healthapp.com', to: body.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/register/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, err => {
                if(err) {
                    return res.status(500).json({msg: err.message})
                }
                res.status(200).json({msg: `A verification email has been sent to ${body.email}`})
            })
        });
    }).catch(error => {
        res.status(403).json(error);
    });
});
router.get('/:email/:password', function (req, res, next) {
    LoginModel.getLoginByEmail(req.params.email).then(login => {
        UserModel.findUserByLogin(login._id).then(user => {
            console.log(user, "user");
            if(!login.verified) {
                return res.status(403).json({msg: "your account has not been verified yet, please check your email for a verification email"});
            }
            res.status(200).json({
                user: user,
                token: generateToken(login)
            })
        })
    }).catch(error => {

        console.log(error);
    });
});
router.get('/whoami', function (req, res, next) {
    if(req.method === 'OPTIONS') {
        next();
    }
    else {
        let token = req.headers['authorization'].replace('Bearer ', "");
        if(!token) {
            return res.status(200).json({isAuthenticated: 2})
        }
        jwt.verify(token, process.env.JWT_SECRET, function(err, login) {
            if(err) {
                return res.status(200).json({isAuthenticated: 2})

            }
            else {
                return res.status(200).json({isAuthenticated: 1})
            }
        });
    }
});


module.exports = router;