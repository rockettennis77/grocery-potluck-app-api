// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var HistorySchema = new mongoose.Schema({
    User: String,
    Used: {type: Date, default: new Date()},
    Ingredient: String
},{collection: 'history'});

// Export the Mongoose model
module.exports = mongoose.model('History', HistorySchema);
