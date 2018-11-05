const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    activities: [mongoose.Schema.Types.ObjectId],
    meals: [mongoose.Schema.Types.ObjectId],
    ownerLogin: mongoose.Schema.Types.ObjectId,
    name: String
});

const Day = mongoose.model('Day', DaySchema);

module.exports = {
    createDay(mealIds, activityIds, loginId, name) {
        return new Day({
            _id: mongoose.Types.ObjectId(),
            activities: activityIds,
            meals: mealIds,
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
