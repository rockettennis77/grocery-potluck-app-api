var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var User = require('../models/user');
var GroceryList = require('../models/groceryList');
var bcrypt = require('bcrypt');

module.exports = function (router) {

    var groceryRoute = router.route('/groceryList');
    groceryRoute.get(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var q;
            if("userID" in req.query){
                q = User.findOne({"_id": req.query.userID});
                q.exec(function(err, result) {
                    if(err){
                        res.status(500);
                        res.json({ 
                            message: "User Server Error",
                            data: err
                        });
                    }
                    var groceryID = result.groceryListID;
                    q2 = GroceryList.findOne({"_id": groceryID});
                    q2.exec(function(err2, res2){
                        if(err2){
                            res.status(500);
                            res.json({ 
                                message: "Grocery Server Error",
                                data: err2
                            });
                        }
                        res.status(200).send({
                            "message": "OK", 
                            "data": res2
                        })
                    })
                });
            }
            else if("_id" in req.query){
                    q = GroceryList.findOne({"_id": req.query.groceryListID});
                    q.exec(function(err,result){
                        if(err){
                            res.status(500);
                            res.json({ 
                                message: "Server Error",
                                data: err
                            });
                        }
                        res.status(200);
                        res.json({ 
                                message: "OK",
                                data: result
                        });
                        mongoose.disconnect();
                    });
                }
        });
    });
    
    groceryRoute.post(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.body;
            if("username" in params && "password" in params && "ingredientID" in params && "ingredientDescription" in params){
                q1 = User.findOne({"username": params.username});
                q1.then((u) => {
                    if(u == null) {
                        res.status(500).send({"message": "Could not find user", "data": {}});
                    }
                    u.comparePassword(params.password, (err, match) => {
                        if(match == false){
                            res.status(500).send({"message": "Incorrect password", "data": {}});
                        }
                        else {
                            var q2 = GroceryList.findOne({"_id": u.groceryListID});
                            q2.exec(function(err2, pList){
                                if(err2){
                                    res.status(500).send({ 
                                        message: "Server Error",
                                        data: err2
                                    });
                                }
                                else{
                                    if(pList != null){
                                        var newDate = new Date();
                                        pList.GroceryIngredients.push(params.ingredientID);
                                        pList.GroceryDescriptions.push(params.ingredientDescription);
                                        pList.GroceryDates.push(newDate);
                                        pList.save().then(function(d) {
                                            res.status(200).send({"message": "Grocery Item Added", "data": d})
                                        });
                                    }
                                    else{
                                        res.status(200).send({"message": "Ingredient not Found", "data": {}})
                                    }
                                }
                            });
                        } 
                    });
                });
            }

        });
    });

    groceryRoute.delete(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.body;
            if("username" in params && "password" in params && "ingredientID" in params){
                q1 = User.findOne({"username": params.username});
                q1.then((u) => {
                    if(u == null) {
                        res.status(500).send({"message": "Could not find user", "data": {}});
                    }
                    u.comparePassword(params.password, (err, match) => {
                        if(match == false){
                            res.status(500).send({"message": "Incorrect password", "data": {}});
                        }
                        else {
                            var q2 = GroceryList.findOne({"_id": u.groceryListID});
                            q2.exec(function(err2, pList){
                                if(err2){
                                    res.status(500).send({ 
                                        message: "Server Error",
                                        data: err2
                                    });
                                }
                                else{
                                    var index = pList.GroceryIngredients.indexOf(params.ingredientID);
                                    if(index != -1){
                                        pList.GroceryIngredients.splice(index, 1);
                                        pList.GroceryDescriptions.splice(index, 1);
                                        pList.GroceryDates.splice(index, 1);
                                        pList.save().then(function(d) {
                                            res.status(200).send({"message": "Grocery Item Deleted", "data": d})
                                        });
                                    }
                                    else{
                                        res.status(200).send({"message": "Item not found in Grocery", "data": {}})
                                    }
                                }
                            });
                        } 
                    });
                });
            }

        });
    });

    return router;
}
