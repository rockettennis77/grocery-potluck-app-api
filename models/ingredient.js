// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var IngredientSchema = new mongoose.Schema({
    Name: String,
    id: String,
    Icon: String,
},{collection: 'ingredients'});

// Export the Mongoose model
module.exports = mongoose.model('Ingredient', IngredientSchema);
