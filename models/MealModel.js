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
    ingredientIds: [mongoose.Schema.Types.ObjectId]
});
let Meal = mongoose.model('Meal', MealSchema);
let OfficalMeal = mongoose.model('OfficialMeal', OfficialMealSchema);

module.exports = {
    updateToComplex: function () {
        return Meal.find({}).then(meals => {
            meals.map(meal => {
                DetailedNutrientsModel.createDetailedNutrients(meal).then(details => {
                    new OfficalMeal({
                        _id: new mongoose.Types.ObjectId(),
                        name: meal.get('navn'),
                        macros: {
                            protein: meal.get('Protein'),
                            fett: meal.get('Fett'),
                            sukker: meal.get('Sukker, tilsatt') + meal.get('Mono+disakk'),
                            kostfiber: meal.get('Kostfiber'),
                            kcal: meal.get('Kilokalorier'),
                        },
                        detailedNutrients: details._id
                    }).save();
                });
            });
        });

    },
    getAllMeals: function () {
        return OfficalMeal.find({}).then(meals => {
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
    getMealsById: function (ids) {
        const meals = ids.map(id => {
            return this.getMealById(id);
        });
        return Promise.all(meals).then(values => {
            return values;
        })
    },
    getMealById: function (id) {
        return Meal.findOne({_id: id});
    },
    getKcalByIds: function (ids) {
        return this.getMealsById(ids).then(meals => {
            const mealReducer = (currentValue, meal) => {
                return meal.kcal + currentValue;
            };
            return meals.reduce(mealReducer, 0)
        }).catch(err => {
            console.log(err);
        })
    }
};