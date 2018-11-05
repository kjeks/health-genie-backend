const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    kcal: Number
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = {
    getAllActivities: function () {
        return Activity.find({});
    },
    createFakeActivity: function () {
        new Activity({
            _id: mongoose.Types.ObjectId(),
            name: "jogging(1h)",
            kcal: 850
        }).save();
    },
    updateActivityById: function (id, name, kcal) {
        return Activity.findOneAndUpdate({_id: id}, {name: name, kcal: kcal})
    },
    deleteActivityById: function (id) {
        return Activity.findOneAndDelete({_id: id});
    },
    getActivitiesById: function (ids) {
        const Activity = ids.map(id => {
            return this.getActivityById(id);
        });
        return Promise.all(Activity).then(values => {
            return values;
        })
    },
    getActivityById: function (id) {
        return Activity.findOne({_id: id});
    },
    getKcalByIds: function (ids) {
        return this.getActivitiesById(ids).then(activities => {
            const activityReducer = (currentValue, activity) => {
                return activity.kcal + currentValue;
            };

            return activities.reduce(activityReducer, 0)
        }).catch(err => {
            console.log(err);
        })

    }
};