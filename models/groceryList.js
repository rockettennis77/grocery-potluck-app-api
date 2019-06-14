// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var GroceryListSchema = new mongoose.Schema({
    GroceryIngredients: [String],
    GroceryDescriptions: [String],
    GroceryDates: [Date]
},{collection: 'groceryLists'});

// Export the Mongoose model
module.exports = mongoose.model('GroceryList', GroceryListSchema);