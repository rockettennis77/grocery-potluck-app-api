// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Define our user schema
var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    fullName: String,
    password: String,
    Friends: [String],
    IngredientsAvailable: [String]
},{collection: 'users'});

UserSchema.pre('save', function(next) {
    var saltRounds = 9;
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, saltRounds, function(err, hash){
        if(err) {
            return next(err);
        }
        else{
            user.password = hash;
            return next();
        }
    });
});

UserSchema.methods.comparePassword = function(attempt, handler) {
    bcrypt.compare(attempt, this.password, (err, res) => {
        if(err){
            return handler(err);
        }
        else{
            return handler(null, res);
        }
    });
}
// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
