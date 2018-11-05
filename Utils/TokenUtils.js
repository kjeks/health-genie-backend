let jwt = require('jsonwebtoken');

let generateToken = function(data) {
    console.log(data);
    let u = {
        _id: data._id,
        email: data.email
    };
    return jwt.sign(u, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24
    });
};
module.exports = {
    generateToken: generateToken
};