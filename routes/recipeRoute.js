var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var Recipe = require('../models/recipe');

module.exports = function (router) {

    var recipeRoute = router.route('/recipe');
    recipeRoute.get(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.params;
            var query = Recipe.find()
            if(id in params){
                query = Recipe.find({RecipeID: params.id});
            }
            if(name in params){
                query = Recipe.find({RecipeName: params.name});
            }
            if(ingredients in params){
                query.all('Ingreds', params.ingredients);
            }
            query.exec(function(err,result){
                if(err){
                    res.status(500);
                    res.json({ 
                        message: "Server Error",
                        data: "500 status code"
                    });
                }
                res.status(200);
                res.json({ 
                        message: "OK",
                        data: result
                });
                mongoose.disconnect();
            });
        });         
    });

    
    recipeRoute.post(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.body;
            var recipe = new Recipe(params)
            recipe.save().then((u) =>{
                res.status(201).send({"message": "OK", "data": u});
                mongoose.disconnect();
            })
        });
    });

    return router;
}
