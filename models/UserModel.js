const mongoose = require('mongoose');
const moment = require('moment');

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    loginId: mongoose.Schema.Types.ObjectId,
    weight: Number,
    height: Number,
    targetWeight: Number,
    targetDate: mongoose.Schema.Types.Date,
    activityLevel: Number,
    sex: String,
    age: Number,
    selectedMealIds: [ mongoose.Schema.Types.ObjectId],
    selectedActivityIds: [mongoose.Schema.Types.ObjectId]
});
const User = mongoose.model('User', UserSchema);

module.exports = {
    createUserWithLogin: function(loginId) {
        const date = new moment().add(1, 'M');
        const newUser =  new User({
            _id: new mongoose.Types.ObjectId(),
            loginId: loginId,
            weight: 75,
            targetWeight: 75,
            height: 180,
            targetDate: date,
            activityLevel: 1,
            sex: "male",
            age: 25,
            selectedMealIds: [],
            selectedActivityIds: []
        });
        return newUser.save()
    },
    findUserByLogin: function (loginId) {
        return User.findOne({loginId: loginId});
    },
    updateUser: function (user, id) {
        return User.findOneAndUpdate({loginId: id}, user)
    },
    saveMealList: function (mealIdsList, id) {
        return User.findOneAndUpdate({loginId: id}, {selectedMealIds: mealIdsList});
    },
    saveActivityList: function (activityIdList, id) {
        return User.findOneAndUpdate({loginId: id}, {selectedActivityIds: activityIdList});
    },
    getSelectedMealIds: function (loginId) {
        return User.findOne({loginId: loginId}).then(user => {
            return user.selectedMealIds
        })
    },
    getSelectedActivityIds: function (loginId) {
        return User.findOne({loginId: loginId}).then(user => {
            return user.selectedActivityIds
        })
    },
    getCaloriesUsedByLogin: function (loginId) {
        return User.findOne({loginId: loginId}).then(user => {
            return this.getBRMByLogin(loginId).then(BRM => {
                switch(user.activityLevel) {
                    case 1:
                        return BRM * 1.2;
                    case 2:
                        return BRM * 1.375;
                    case 3:
                        return BRM * 1.55;
                    case 4:
                        return BRM * 1.725;
                    case 5:
                        return BRM * 1.9;
                    default:
                        return BRM * 1.2;
                }
            })

        });
    },
    getBRMByLogin: function (loginId) {
        return User.findOne({loginId: loginId}).then(user => {
            if(user.sex === 'male') {
                return 88.362 + (13.397*user.weight) + (4.799 * user.height) - (5.677 * user.age);
            }
            if(user.sex === 'female') {
                return 447.593 + (9.247 * user.weight) + (3.098 * user.height) - (4.330 * user.age);
            }
        });
    }
};