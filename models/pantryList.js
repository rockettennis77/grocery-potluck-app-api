// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var PantryListSchema = new mongoose.Schema({
    PantryIngredients: [String],
    PantryDescriptions: [String],
    PantryDates: [Date]
},{collection: 'pantryLists'});

// Export the Mongoose model
module.exports = mongoose.model('PantryList', PantryListSchema);