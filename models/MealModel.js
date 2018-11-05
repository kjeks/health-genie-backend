const mongoose = require('mongoose');

let MealSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    kcal: Number,
    ingredientIds: [mongoose.Schema.Types.ObjectId]
});

let Meal = mongoose.model('Meal', MealSchema);

module.exports = {
    getAllMeals: function () {
        return Meal.find({}).then(meals => {
            return meals;
        });
    },
    createMeal: function (meal) {
        return new Meal({
            _id: new mongoose.Types.ObjectId(),
            name: meal.name,
            kcal: meal.kcal
        }).save();
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
            }
            return meals.reduce(mealReducer, 0)
        }).catch(err => {
            console.log(err);
        })
    }
};