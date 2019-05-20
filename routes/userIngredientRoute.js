var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var User = require('../models/user');
var Ingredient = require('../models/ingredient');
    bcrypt = require('bcrypt');

module.exports = function (router) {

    var userIngredientRoute = router.route('/userIngredients');
    userIngredientRoute.get(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var userID = req.body.userID;
            var q = User.findOne({"_id": userID});
            q.select('IngredientsAvailable');
            q.exec().then((u) => {
                res.status(200).send({
                    "message": "OK",
                    "data": u
                })
            })
            });
        });

    
    userIngredientRoute.post(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.body;
            if("userID" in params && "password" in params && "ingredientID" in params){
                var userID = params.userID;
                var ingredientID = params.ingredientID;
                var password = params.password;
                q = User.findOne({"_id": userID});
                q2 = Ingredient.findOne({"_id":ingredientID});
                q.then((u) => {
                    if(u == null){
                        res.status(500).send({"message": "User not found", "data": {}})
                    }
                    u.comparePassword(password, (err, match) => {
                        if(err != null){
                            res.status(500).send({"message": "Incorrect password", "data": {}})
                        }
                        else {
                            q2.then((u2) =>{
                                if(u2 == null){
                                    res.status(500).send({"message": "Ingredient not found"});
                                }
                                u.IngredientsAvailable.push(ingredientID);
                                u.save().then(function(d){
                                    res.status(200).send({"message": "Ingredient Added", "data": d})
                                });
                            });
                        } 
                    });
                });
            }
            else{
                res.status(500).send({"message": "Not enough info", "data": {}})
            }
        });
    });

    userIngredientRoute.delete(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.body;
            if("userID" in params && "password" in params && "ingredientID" in params){
                var userID = params.userID;
                var ingredientID = params.ingredientID;
                var password = params.password;
                q = User.findOne({"_id": userID});
                q2 = Ingredient.findOne({"_id":ingredientID});
                q.then((u) => {
                    if(u == null){
                        res.status(500).send({"message": "User not found", "data": {}})
                    }
                    u.comparePassword(password, (err, match) => {
                        if(err != null){
                            res.status(500).send({"message": "Incorrect password", "data": {}})
                        }
                        else {
                            q2.then((u2) =>{
                                if(u2 == null){
                                    res.status(500).send({"message": "Ingredient not found"});
                                }
                                var ind = u.IngredientsAvailable.indexOf(ingredientID);
                                if (ind !== -1) u.IngredientsAvailable.splice(ind, 1);
                                u.save().then(function(d){
                                    res.status(200).send({"message": "Friend Added", "data": d})
                                });
                            });
                        } 
                    });
                });
            }
            else{
                res.status(500).send({"message": "Not enough info", "data": {}})
            }
        });
    });

    return router;
}
