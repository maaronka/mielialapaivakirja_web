var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    local: {
        username: String,
        password: String
    }
});

// generate hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// password validation
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

// create and export model for users
module.exports = mongoose.model('User', UserSchema);