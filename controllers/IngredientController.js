const express = require('express');
const router = express.Router();
const IngredientModel = require('../models/IngredientModel');
const UserModel = require('../models/UserModel');


router.post('', function(req, res, next) {
    IngredientModel.createIngredient(req.body).then(ingredient => {
        res.status(200).json(ingredient);
    })
});
router.get('', function(req, res, next) {
    const allIngredients = IngredientModel.getAllOfficialIngredients();
    const favoriteIngredients = UserModel.getFavoriteIngredientIds(req.login._id);

    Promise.all([favoriteIngredients, allIngredients]).then((values) => {
        res.status(200).json({favoriteItemIds: values[0], items: values[1]});
    });
});
router.post('/favorite/:ingredientId', (req, res, next)=> {
    UserModel.toggleFavoriteIngredient(req.params.ingredientId, req.login._id).then((user)=> {
        res.status(200).json({favoriteItemIds: user.favoriteIngredientIds})
    });
});

module.exports = router;