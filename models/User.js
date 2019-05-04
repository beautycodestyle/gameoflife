var Mongoose = require('mongoose');

var UserSchema = new Mongoose.Schema({
    ip: { type: String, unique : true, required : true, dropDups: true },
    color: String
});

module.exports = Mongoose.model('User', UserSchema);
