const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');

router.get('', function(req, res, next) {
    UserModel.findUserByLogin(req.login._id).then(user => {
        res.status(200).json(user);
    })
});
router.post('', function(req, res, next) {
    UserModel.updateUser(req.body, req.login._id).then(user => {
        res.status(200).json(user);
    }).catch(error => {
        console.log(error);
    })
});
router.post('/meals', function(req, res, next) {
    UserModel.saveMealList(req.body, req.login._id).then(user => {
        res.status(200).json(user);
    })
});
router.post('/activities', function(req, res, next) {
    UserModel.saveActivityList(req.body, req.login._id).then(user => {
        res.status(200).json(user);
    })
});
module.exports = router;