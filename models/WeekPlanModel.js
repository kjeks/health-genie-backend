const mongoose = require('mongoose');

const WeekPlanSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    loginId: mongoose.Schema.Types.ObjectId,
    monday: mongoose.Schema.Types.ObjectId,
    tuesday: mongoose.Schema.Types.ObjectId,
    wednesday: mongoose.Schema.Types.ObjectId,
    thursday: mongoose.Schema.Types.ObjectId,
    friday: mongoose.Schema.Types.ObjectId,
    saturday: mongoose.Schema.Types.ObjectId,
    sunday: mongoose.Schema.Types.ObjectId,
    default: mongoose.Schema.Types.ObjectId
});

const WeekPlan = mongoose.model("WeekPlan", WeekPlanSchema);

module.exports = {
    getDayId(dayName, loginId) {
        return WeekPlan.findOne({loginId: loginId}).then(weekPlan => {
            return weekPlan[dayName];
        })
    },
    saveDays(days, loginId) {
        const newPlan = new WeekPlan({
            loginId: loginId,
            monday: days.monday,
            tuesday: days.tuesday,
            wednesday: days.wednesday,
            thursday: days.thursday,
            friday: days.friday,
            saturday: days.saturday,
            sunday: days.sunday
        });
        return WeekPlan.replaceOne({loginId: loginId}, newPlan, {upsert: true})

    },
    getAllDays(loginId) {
        return WeekPlan.findOne({loginId: loginId}).then(week => {
            return {
                monday: week.monday,
                tuesday: week.tuesday,
                wednesday: week.wednesday,
                thursday: week.thursday,
                friday: week.friday,
                saturday: week.saturday,
                sunday: week.sunday
            }
        })
    }
};