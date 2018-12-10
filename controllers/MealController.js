const express = require('express');
const router = express.Router();
const MealModel = require('../models/MealModel');
const UserModel = require('../models/UserModel');
const IngredientModel = require('../models/IngredientModel');
const queryString = require('query-string');

router.get('', function (req, res, next) {
    const favoriteMeals = UserModel.getFavoriteMealIds(req.login._id);
    const allMeals = MealModel.getAllMeals();

    Promise.all([favoriteMeals, allMeals]).then((values) => {
        res.status(200).json({favoriteItemIds: values[0], items: values[1]});
    })
});
router.post('/favorite/:mealId', (req, res, next)=> {
    UserModel.toggleFavoriteMeal(req.params.mealId, req.login._id).then((user)=> {
        res.status(200).json({favoriteItemIds: user.favoriteMealIds})
    });
});

router.get('/ids/', function (req, res, next) {
    let idArray = [];

    for (let [key, value] of Object.entries(req.query)) {
        const parsedValue = queryString.parse(value);
        idArray.push(parsedValue._id);
    }
    MealModel.getMealsById(idArray).then(meals => {
        res.status(200).json(meals);
    })
});

router.post('', function (req, res, next) {
    MealModel.createMeal(req.body).then(meal => {
        res.json(meal);
    })
});
router.post('/build', function (req, res, next) {
    IngredientModel.getNutrientsInIngredientList(req.body.ingredientIds).then(nutrients => {
        MealModel.buildMealFromIngredients(req.body.ingredientIds, nutrients.kcal, req.body.name).then(meal => {
            res.status(200).json(meal);
        })
    });
});


module.exports = router;