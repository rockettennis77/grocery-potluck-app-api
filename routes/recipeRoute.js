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
            if('_id' in req.query){
                var q = Recipe.findOne({_id: req.query._id});
                q.then((u) => {
                    res.status(201).send({"message": "OK", "data": u});
                    mongoose.disconnect();
                }).catch((err) => {
                    res.status(500).send();
                });  
            }
            if('name' in params){
                query = Recipe.find({RecipeName: params.name});
            }
            if('ingredients' in params){
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

    recipeRoute.put(function(req,res){
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        mongoose.set('useFindAndModify', false);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.body;
            if("_id" in params){
                Recipe.findOne({"_id": params._id}).then((doc) => {
                    for(key in params){
                        doc[key] = params[key]
                    }
                    return doc.save()
                }).then((u) => {
                    res.status(200).send({"message": "Recipe Updated", "data": u})
                    mongoose.disconnect();
                }).catch((err) => {
                    res.status(500).send({"message": "500 Server Error", "data": err})
                    mongoose.disconnect();
                }) 
            }          
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
