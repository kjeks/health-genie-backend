const express = require('express');
const router = express.Router();
const DayModel = require('../models/DayModel');
const WeekPlanModel = require('../models/WeekPlanModel');
const MealModel = require('../models/MealModel');
const ActivityModel = require('../models/ActivityModel');
const UserModel = require('../models/UserModel');

router.post('/new', function (req, res, next) {
    DayModel.createDay(req.body.mealIds, req.body.activityIds, req.login._id, req.body.dayName).then(day => {
        res.status(200).json(day);
    })
});
router.get('', function (req, res, next) {
    DayModel.getDaysByLoginId(req.login._id).then(days => {
        res.status(200).json({items: days, selectedIds: []});
    })
});
router.get('/plans', function (req, res, next) {
    WeekPlanModel.getAllDays(req.login._id).then(week => {
        res.status(200).json(week);
    })
});
router.post('/new/week', function (req, res, next) {
    WeekPlanModel.saveDays(req.body, req.login._id).then(week => {
        res.status(200).json(week);
    });
});
router.get('/summary/:dayPlanId', function (req, res, next) {
    DayModel.getDay(req.params.dayPlanId).then(day => {
        const kcalEaten = MealModel.getKcalByIds(day.meals);
        const kcalBurnedFromExercise = ActivityModel.getKcalByIds(day.activities);

        Promise.all([kcalEaten, kcalBurnedFromExercise]).then(values => {
            res.status(200).json({kcalEaten: values[0], kcalBurned: values[1]})
        })
    }).catch(error => {
        console.log(error);
    })
});
router.get('/week/summary', function (req, res, next) {
    WeekPlanModel.getAllDays(req.login._id).then(week => {
        const days = Object.entries(week).map(weekDay => {
            const dayName = weekDay[0];
            const dayPlanId = weekDay[1];
            if (!dayPlanId) {
                return [2500, 0];
            }
            return DayModel.getDay(dayPlanId).then(day => {
                const kcalEaten = MealModel.getKcalByIds(day.meals);
                const kcalBurnedFromExercise = ActivityModel.getKcalByIds(day.activities);

                return Promise.all([kcalEaten, kcalBurnedFromExercise]).then(values => {
                    return values;
                })
            })
        });
        const caloriesUsed =  UserModel.getCaloriesUsedByLogin(req.login._id);

        const foodAndExerciseKcals = Promise.all(days).then(values => {
            let kcalEaten = 0;
            let kcalBurned = 0;

            values.forEach(value => {
                kcalEaten = kcalEaten + value[0];
                kcalBurned = kcalBurned + value[1];
            });
            return {kcalEaten: kcalEaten, kcalBurned: kcalBurned}
        });

        Promise.all([foodAndExerciseKcals, caloriesUsed]).then(values => {
            res.status(200).json({
                kcalEaten: values[0].kcalEaten,
                kcalUsedFromExercise: values[0].kcalBurned,
                baseCaloriesUsed: values[1] * 7
            })
        })
    })
});

module.exports = router;