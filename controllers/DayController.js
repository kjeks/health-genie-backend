const express = require('express');
const router = express.Router();
const DayModel = require('../models/DayModel');
const WeekPlanModel = require('../models/WeekPlanModel');
const MealModel = require('../models/MealModel');
const ActivityModel = require('../models/ActivityModel');
const UserModel = require('../models/UserModel');

router.post('/new', function (req, res, next) {
    DayModel.createDay(req.body.meals, req.body.activities, req.login._id, req.body.dayName).then(day => {
        res.status(200).json(day);
    })
});
router.get('', function (req, res, next) {
    DayModel.getDaysByLoginId(req.login._id).then(days => {
        days = days.map(day => {
            return new Promise(resolve => {
                const act = Promise.all(day.activities.map(activity => {
                    return ActivityModel.getActivityById(activity._id).then(activityObj => {
                        return {activity: activityObj, quantity: activity.quantity};
                    })
                }));
                const meals = Promise.all(day.meals.map(meal => {
                    return MealModel.getMealById(meal._id).then(mealObj => {
                        return {meal: mealObj, quantity: meal.quantity};
                    })
                }));
                Promise.all([act, meals]).then(values => {
                    resolve({
                        activities: values[0],
                        meals: values[1],
                        name: day.name,
                        _id: day._id
                    })
                })
            });
        });
        Promise.all(days).then(values => {
            res.status(200).json({items: values})
        });
    });
});
router.get('/plans', function (req, res, next) {
    WeekPlanModel.getAllDays(req.login._id).then(week => {
        res.status(200).json(week);
    }).catch(error => {
        console.log(error);
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
    let dayIdArray = [];

    for (let [key, value] of Object.entries(req.query)) {
        dayIdArray.push(value);
    }
    dayIdArray = dayIdArray.filter(dayId => {
        return dayId.length > 0
    });
    const numberOfUnPlannedDays = 7 - dayIdArray.length;

    const currentDays = dayIdArray.map(dayId => {
        return DayModel.getDay(dayId).then(day => {
            const kcalEaten = MealModel.getKcalByIds(day.meals);
            const kcalBurnedFromExercise = ActivityModel.getKcalByIds(day.activities);

            return Promise.all([kcalEaten, kcalBurnedFromExercise]).then(values => {
                return values;
            })
        });
    });

    const currentPlan = Promise.all(currentDays).then(values => {
        let kcalEaten = 0;
        let kcalBurned = 0;

        values.forEach(value => {
            kcalEaten = kcalEaten + value[0];
            kcalBurned = kcalBurned + value[1];
        });
        kcalEaten = kcalEaten + (numberOfUnPlannedDays * 2500);

        return {kcalEaten: kcalEaten, kcalBurned: kcalBurned}
    });

    const caloriesUsed = UserModel.getCaloriesUsedByLogin(req.login._id);

    const initialPlan = WeekPlanModel.getAllDays(req.login._id).then(week => {
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
        return Promise.all(days).then(values => {
            let kcalEaten = 0;
            let kcalBurned = 0;

            values.forEach(value => {
                kcalEaten = kcalEaten + value[0];
                kcalBurned = kcalBurned + value[1];
            });
            return {kcalEaten: kcalEaten, kcalBurned: kcalBurned}
        });
    });
    Promise.all([initialPlan, currentPlan, caloriesUsed]).then(values => {
        res.status(200).json({
            initialPlan: {
                kcalEaten: values[0].kcalEaten,
                kcalUsedFromExercise: values[0].kcalBurned,
                baseCaloriesUsed: values[2] * 7
            },
            updatedPlan: {
                kcalEaten: values[1].kcalEaten,
                kcalUsedFromExercise: values[1].kcalBurned,
                baseCaloriesUsed: values[2] * 7
            }
        });
    })
});

module.exports = router;