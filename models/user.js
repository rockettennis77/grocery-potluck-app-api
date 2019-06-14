// Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

// Define our user schema
var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    fullName: String,
    password: String,
    Friends: [String],
    GroceryListID: {type: Schema.Types.ObjectId, ref: 'GroceryList'},
    PantryListID: {type: Schema.Types.ObjectId, ref: 'PantryList'}
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

UserSchema.methods.comparePassword = function(attempt, handlr) {
    bcrypt.compare(attempt, this.password, (err, res) => {
        handlr(res);
    });
}
// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
