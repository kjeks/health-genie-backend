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
        const activities = ids.map(id => {
            return this.getActivityById(id._id).then(activities => {
                const quantity = id.quantity;

                return activities.kcal * quantity;
            });
        });

        return Promise.all(activities).then(values => {
            const activityReducer = (currentValue, activityKcal) => {
                return activityKcal + currentValue;
            };
            return values.reduce(activityReducer, 0);
        });

    }
};