const mongoose = require('mongoose');
const url = process.env.MONGOLAB_URI;

const connect = function () {
    mongoose.connect(url).then(()=> {
        console.log("moongoose connected");
    });
};


module.exports = {
    connect: connect
};