const express = require('express');
const router = express.Router();
const IngredientModel = require('../models/IngredientModel');


router.post('', function(req, res, next) {
    IngredientModel.createIngredient(req.body).then(ingredient => {
        res.status(200).json(ingredient);
    })
});
router.get('', function(req, res, next) {
    IngredientModel.getAllIngredients().then(ingredients => {
        res.status(200).json({selectedIds: [], items: ingredients});
    })
});

module.exports = router;