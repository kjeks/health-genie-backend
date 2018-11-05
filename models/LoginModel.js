const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    verified: {type: Boolean, default: false},
    password: String
});
let Login = mongoose.model('Login', LoginSchema);

module.exports = {
    createLogin: (email, password) => {
        return Login.findOne({email: email}).then(login => {
            if (login) {
                throw "user already exists";
            }
            const newLogin = new Login({
                _id: new mongoose.Types.ObjectId(),
                password: password,
                email: email
            });
            return newLogin.save().then(loginId => {
                return loginId;
            })
        });
    },
    getLoginById: (id) => {
        return Login.findOne({_id: id});
    },
    getLoginByEmail: (email) => {
        return Login.findOne({email: email})
    },
    verifyLogin(loginId) {
        return Login.updateOne({_id: loginId}, {verified: true});
    }
}