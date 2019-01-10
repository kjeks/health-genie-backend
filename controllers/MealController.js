const express = require('express');
const router = express.Router();
const MealModel = require('../models/MealModel');
const UserModel = require('../models/UserModel');
const IngredientModel = require('../models/IngredientModel');
const DetailedNutrientsModel = require('../models/DetailedNutrientsModel');
const queryString = require('query-string');

function nameSort (a, b) {
    if(a.name < b.name) {
        return -1;
    }
    if(b.name < b.name) {
        return 1;
    }
}

router.get('', function (req, res, next) {
    const favoriteMeals = UserModel.getFavoriteMealIds(req.login._id);
    const selfMadeMeals = MealModel.getMealsMadeById(req.login._id);
    const allMeals = MealModel.getAllMeals();
    Promise.all([favoriteMeals, allMeals, selfMadeMeals]).then((values) => {
        const selfMadeMealIds = values[2].sort((a, b) => nameSort(a,b))
            .map(function (meal) {
            return meal._id;
        });
        res.status(200).json({favoriteItemIds: values[0], selfMadeItemIds: selfMadeMealIds, items: values[1]});
    })
});
router.post('/favorite/:mealId', (req, res, next) => {
    UserModel.toggleFavoriteMeal(req.params.mealId, req.login._id).then((user) => {
        res.status(200).json({favoriteItemIds: user.favoriteMealIds})
    });
});

router.get('/ids/', function (req, res, next) {
    let idArray = [];
    for (let [key, value] of Object.entries(req.query)) {
        idArray.push(value);
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
    let detailedNutrients = [];
    let macroList = [];
    const summedQuantityReducer = (accumulator, currentValue) => {
        return accumulator + Number(currentValue[1]);
    };
    const summedQuantities = req.body.ingredients.reduce(summedQuantityReducer, 0);

    for (let [id, quantity] of req.body.ingredients) {
        detailedNutrients.push(new Promise(resolve => {
            IngredientModel.getNutritientsInIngredient(id).then(nutrients => {
                const quantityMacros = {
                    protein: nutrients.macros.protein * quantity / summedQuantities,
                    karbohydrat: nutrients.macros.karbohydrat * quantity / summedQuantities,
                    kcal: nutrients.macros.kcal * quantity / summedQuantities,
                    fett: nutrients.macros.fett * quantity / summedQuantities,
                    sukker: nutrients.macros.sukker * quantity / summedQuantities,
                    kostfiber: nutrients.macros.kostfiber * quantity / summedQuantities
                };

                macroList.push(quantityMacros);
                resolve([nutrients.detailedNutrients, quantity]);
            })
        }))
    }
    Promise.all(detailedNutrients).then(values => {
        let summedMacros = {
            kcal: 0,
            fett: 0,
            sukker: 0,
            kostfiber: 0,
            protein: 0,
            karbohydrat: 0
        };
        macroList.forEach(macros => {
            for (let [key, values] of Object.entries(summedMacros)) {
                summedMacros[key] += macros[key]
            }
        });
        const ingredients = req.body.ingredients.map(function ([id, quantity]) {
            return {id: id, quantity: Number(quantity)}
        });
        DetailedNutrientsModel.createFromIdAndQuantity(values, summedQuantities).then(detailedNutrients => {
            MealModel.buildOfficialMeal(ingredients, summedMacros, detailedNutrients._id, req.body.name, req.login._id).then(meal => {
                res.status(202);
            })
        });
    });
});

module.exports = router;