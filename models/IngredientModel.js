const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    kcal: Number,
    protein: Number,
    fat: Number,
    carbs: Number
});

const Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = {
    getAllIngredients: function () {
        return Ingredient.find({});
    },
    createIngredient: function (ingredient) {
        console.log("creating ingredient", ingredient);
        let ingredientValues = ingredient.nutrients;
        ingredientValues._id = new mongoose.Types.ObjectId();
        ingredientValues.name = ingredient.name;

        return new Ingredient(ingredientValues).save();
    },
    getIngredientsById: function (ids) {
        const ingredientList = ids.map(id => {
            return new Promise((resolve, reject)=> {
                Ingredient.findOne({_id: id}).then(ingredient => {
                    resolve(ingredient);
                })
            });
        });
        return Promise.all(ingredientList).then(ingredients => {
            return ingredients;
        })
    },
    getNutritientsInIngredient: function (id) {
        return Ingredient.findOne({_id: id}).then(ingredient => {
            return {kcal: ingredient.kcal};
        })
    },
    getNutrientsInIngredientList: function (ids) {
        const nutrients = ids.map(id => {
            return new Promise((resolve, reject) => {
                resolve(this.getNutritientsInIngredient(id));
            });
        });

        return Promise.all(nutrients).then(nutrients => {
            console.log(nutrients, "nut");
            let nutrientInIngredients = {kcal: 0};
            nutrients.forEach(nutrient => {
                nutrientInIngredients.kcal = nutrientInIngredients.kcal + nutrient.kcal;
            });
            console.log(nutrientInIngredients, "ing");
            return nutrientInIngredients;
        })
    }
};
