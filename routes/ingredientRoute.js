var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var Ingredient = require('../models/ingredient');
var User = require('../models/user');
module.exports = function (router) {

    var ingredientRoute = router.route('/ingredient');
    ingredientRoute.get(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            if('_id' in req.query){
                var q = Ingredient.findOne({_id: req.query._id});
                q.then((u) => {
                    res.status(201).send({"message": "OK", "data": u});
                    mongoose.disconnect();
                }).catch((err) => {
                    res.status(500).send();
                });  
            }
            else if('userID' in req.query){
                var q1 = User.findOne({_id: req.query.userID});
                q1.then((usr) => {
                    var grocIDs = usr.IngredientsAvailable;
                    var q2 = Ingredient.find({id: { id: {$in : grocIDs}}});
                    q2.then((u) => {
                        res.status(201).send({"message": "OK", "data": u});
                        mongoose.disconnect();
                    }).catch((err) => {
                        res.status(500).send();
                    });  
                })
            }
            else {
                var q = Ingredient.find();
                q.then((u) => {
                    res.status(201).send({"message": "OK", "data": u});
                    mongoose.disconnect();
                });
            }
        });
            
    });

    
    ingredientRoute.post(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.body;

            var ingredient = new Ingredient({
                id: params.idIngredient,
                Name: params.strIngredient,
            })
            ingredient.save().then((u) =>{
                res.status(201).send({"message": "OK", "data": params});
                mongoose.disconnect();
            })
        });
    });

    return router;
}
