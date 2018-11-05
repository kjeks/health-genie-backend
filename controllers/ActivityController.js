const express = require('express');
const router = express.Router();
const ActivityModel = require('../models/ActivityModel');
const UserModel = require('../models/UserModel');

router.get('', function(req, res, next) {
    const selectedIds = UserModel.getSelectedActivityIds(req.login._id);
    const allMeals = ActivityModel.getAllActivities();

    Promise.all([selectedIds, allMeals]).then((values) => {
        res.status(200).json({selectedIds: values[0], items: values[1]});
    })
});
router.get('/ids/', function (req, res, next) {
    let idArray = [];

    for (let [key, value] of Object.entries(req.query)) {
        idArray.push(value);
    }
    console.log(idArray, "array");
    ActivityModel.getActivitiesById(idArray).then(activities => {
        console.log(activities, "activities");
        res.status(200).json(activities);
    })
});

module.exports = router;