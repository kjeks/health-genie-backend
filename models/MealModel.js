const mongoose = require('mongoose');
const DetailedNutrientsModel = require('./DetailedNutrientsModel');

let MealSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    kcal: Number,
    protein: Number,
    fat: Number,
    carbs: Number,
    ingredientIds: [mongoose.Schema.Types.ObjectId]
});

let OfficialMealSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    macros: {
        protein: Number,
        fett: Number,
        karbohydrat: Number,
        sukker: Number,
        kostfiber: Number,
        kcal: Number
    },
    detailedNutrients: mongoose.Schema.Types.ObjectId,
    ingredients: [{id: mongoose.Schema.Types.ObjectId, quantity: Number}],
    ownerId: mongoose.Schema.Types.ObjectId
});

let Meal = mongoose.model('Meal', MealSchema);
let OfficalMeal = mongoose.model('OfficialMeal', OfficialMealSchema);

module.exports = {
    removeBrokenMeals: function() {
        return OfficalMeal.findOneAndDelete({name: ''});
    },
    removeMealtypeHeaders: function () {
        return OfficalMeal.remove({"macros.kcal": null})
    },
    updateToComplex: function () {
        return Meal.find({}).then(meals => {
            meals.map(meal => {
                DetailedNutrientsModel.createDetailedNutrients(meal).then(details => {
                    console.log(meal, "meal");
                    new OfficalMeal({
                        _id: new mongoose.Types.ObjectId(),
                        name: meal.get('navn'),
                        macros: {
                            protein: meal.get('Protein'),
                            fett: meal.get('Fett'),
                            sukker: meal.get('Sukker, tilsatt') + meal.get('Mono+disakk'),
                            kostfiber: meal.get('Kostfiber'),
                            karbohydrat: meal.get('Karbohydrat'),
                            kcal: meal.get('Kilokalorier'),
                        },
                        detailedNutrients: details._id
                    }).save()
                });
            });
        });

    },
    getAllMeals: function () {
        return OfficalMeal.find({}).sort({'name': 1}).then(meals => {
            return meals;
        });
    },
    createMeal: function (meal) {
        let mealValues = meal.nutrients;

        mealValues._id = new mongoose.Types.ObjectId();
        mealValues.name = meal.name;

        return new Meal(mealValues).save();
    },
    updateMealById: function (id, name, kcal) {
        return Meal.findOneAndUpdate({_id: id}, {name: name, kcal: kcal})
    },
    deleteActivityById: function (id) {
        return Meal.findOneAndDelete({_id: id});
    },
    buildMealFromIngredients: function (ingredientIds, kcal, name) {
        return new Meal({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            kcal: kcal,
            ingredientIds: ingredientIds
        }).save();
    },
    buildOfficialMeal: function (ingredients, macros, detailedNutrients, name, loginId) {
        return new OfficalMeal({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            macros: macros,
            detailedNutrients: detailedNutrients,
            ingredients: ingredients,
            ownerId: loginId
        }).save();
    },
    getMealsById: function (ids) {
        const meals = ids.map(id => {
            return this.getMealById(id);
        });

        return Promise.all(meals).then(values => {
            return values;
        })
    },
    getMealById: function (id) {
        return OfficalMeal.findOne({_id: id})
    },
    getKcalByIds: function (ids) {
        const meals = ids.map(id => {
            return this.getMealById(id._id).then(meal => {
                const quantity = id.quantity;

                return meal.macros.kcal * quantity/100;
            });
        });

        return Promise.all(meals).then(values => {
            const mealReducer = (currentValue, mealKcal) => {
                return mealKcal + currentValue;
            };
            return values.reduce(mealReducer, 0);
        });
    },
    getMealsMadeById: function (ownerId) {
        return OfficalMeal.find({ownerId: ownerId});
    }
};