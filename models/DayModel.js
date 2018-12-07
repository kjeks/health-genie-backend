const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    activities: [{
        _id: mongoose.Schema.Types.ObjectId,
        quantity: Number
    }],
    meals: [{
        _id: mongoose.Schema.Types.ObjectId,
        quantity: Number
    }],
    ownerLogin: mongoose.Schema.Types.ObjectId,
    name: String
});

const Day = mongoose.model('Day', DaySchema);

module.exports = {
    createDay(mealsObj, activityObj, loginId, name) {
        const meals = mealsObj.map(meal => {
            return {_id: meal[0], quantity: meal[1]}
        });
        console.log(activityObj, "act obj");
        const activities = activityObj.map(activity => {
            return {_id: activity[0], quantity: activity[1]}
        });
        return new Day({
            _id: mongoose.Types.ObjectId(),
            activities: activities,
            meals: meals,
            ownerLogin: loginId,
            name: name
        }).save()
    },

    getDaysByLoginId(loginId) {
        return Day.find({ownerLogin: loginId}).then(days => {
            return days.map(day => {
                return {meals: day.meals, name: day.name, activities: day.activities, _id: day._id}
            })
        })
    },


    getDay(dayId) {
        return Day.findOne({_id: dayId})
    }
};
