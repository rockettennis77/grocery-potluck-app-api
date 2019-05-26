// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var RecipeSchema = new mongoose.Schema({
   RecipeName: String,
   RecipeID: String,
   Instructions: String,
   RecipePic: String,
   Ingreds: [String],
   Amounts: [String]
},{collection: 'recipes'});

// Export the Mongoose model
module.exports = mongoose.model('Recipe', RecipeSchema);
