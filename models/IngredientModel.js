const mongoose = require('mongoose');
const DetailedNutrientsModel = require('./DetailedNutrientsModel');

const IngredientSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    kcal: Number,
    protein: Number,
    fat: Number,
    carbs: Number
});

const OfficialIngredientSchema = new mongoose.Schema({
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
});
const Ingredient = mongoose.model('Ingredient', IngredientSchema);
const OfficialIngredient = mongoose.model('OfficialIngredient', OfficialIngredientSchema);

module.exports = {
    removeBrokenIngredients: function() {
        return OfficialIngredient.findOneAndDelete({name: ''})
    },
    removeIngredienttypeHeaders: function () {
        return OfficialIngredient.remove({"macros.kcal": null})
    },
    updateToComplex: function () {
        return Ingredient.find({}).then(ingredients => {
            ingredients.map(ingredient => {
                DetailedNutrientsModel.createDetailedNutrients(ingredient).then(details => {
                    new OfficialIngredient({
                        _id: new mongoose.Types.ObjectId(),
                        name: ingredient.get('navn'),
                        macros: {
                            protein: ingredient.get('Protein'),
                            fett: ingredient.get('Fett'),
                            sukker: ingredient.get('Sukker, tilsatt') + ingredient.get('Mono+disakk'),
                            kostfiber: ingredient.get('Kostfiber'),
                            karbohydrat: ingredient.get('Karbohydrat'),
                            kcal: ingredient.get('Kilokalorier'),
                        },
                        detailedNutrients: details._id
                    }).save();
                });
            });
        });

    },
    getAllOfficialIngredients: function () {
        return OfficialIngredient.find({}).sort({name: 1});
    },

    createIngredient: function (ingredient) {
        let ingredientValues = ingredient.nutrients;
        ingredientValues._id = new mongoose.Types.ObjectId();
        ingredientValues.name = ingredient.name;

        return new Ingredient(ingredientValues).save();
    },

    getNutritientsInIngredient: function (id) {
        return OfficialIngredient.findOne({_id: id}).then(ingredient => {
            return {macros: ingredient.macros, detailedNutrients: ingredient.detailedNutrients}
        })
    },

};
