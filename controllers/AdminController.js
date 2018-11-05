const express = require('express');
const router = express.Router();
const ActivityModel = require('../models/ActivityModel');
const MealModel = require('../models/MealModel');

router.post('/:id', function (req, res, next) {
    if(req.body.type ==='activity') {
        ActivityModel.updateActivityById(req.params.id, req.body.name, req.body.kcal).then(activity => {
            res.status(200).json(activity);
        })
    }
    if(req.body.type ==='meal') {
        MealModel.updateMealById(req.params.id, req.body.name, req.body.kcal).then(meal => {
            res.status(200).json(meal);
        })
    }
});
router.post('/:id/:type', function(req, res, next) {
    console.log(req.params);
    if(req.params.type ==='activity') {
        ActivityModel.deleteActivityById(req.params.id).then(activity => {
            res.status(200).json({});
        })
    }
    if(req.params.type ==='meal') {
        MealModel.deleteActivityById(req.params.id).then(meal => {
            console.log("test");
            res.status(200).json({});
        })
    }
});

module.exports = router;