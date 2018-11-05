const mongoose = require('mongoose');
const crypto = require('crypto');

const RegisterTokenSchema = new mongoose.Schema({
    loginId: mongoose.Schema.Types.ObjectId,
    token: String,
    createdAt: {type: Date, required: true, default: Date.now, expires: 43200}
});
let RegisterToken = mongoose.model('RegisterToken', RegisterTokenSchema);

module.exports = {
    createNewToken(loginId) {
        return new RegisterToken({
            loginId: loginId,
            token: crypto.randomBytes(16).toString('hex')
        }).save()
    },
    getToken(token) {
        return RegisterToken.findOne({token: token})
    }
};

