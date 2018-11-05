const express = require('express');
const router = express.Router();
const RegisterTokenModel = require('../models/RegisterTokenModel');
const LoginModel = require('../models/LoginModel');
const nodemailer = require('nodemailer');

router.get('/confirmation/:token', function (req, res, next) {
    RegisterTokenModel.getToken(req.params.token).then(token => {
        LoginModel.verifyLogin(token.loginId).then(login => {
            res.redirect('http://192.168.1.124:3000');
        });
    })
});
router.post('/resend', function (req, res, next) {
    const body = req.body;
    LoginModel.getLoginByEmail(req.body.email).then(login=> {
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
    });
});

module.exports = router;