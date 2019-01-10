const express = require('express');
const router = express.Router();
const ActivityModel = require('../models/ActivityModel');
const IngredientModel = require('../models/IngredientModel');
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
router.get('/ingredients/clean', (req, res, next) => {
    IngredientModel.removeBrokenIngredients();
    IngredientModel.removeIngredienttypeHeaders();
    res.status(202);
});
router.get('/meals/clean', (req, res, next) => {
    MealModel.removeBrokenMeals();
    MealModel.removeMealtypeHeaders();
    res.status(202);
});

module.exports = router;