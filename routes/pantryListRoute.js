var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var User = require('../models/user');
var PantryList = require('../models/pantryList');
var bcrypt = require('bcrypt');

module.exports = function (router) {

    var pantryRoute = router.route('/pantryList');
    pantryRoute.get(function (req, res) {
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
                        mongoose.disconnect();
                    }
                    var pantryID = result.PantryListID;
                    q2 = PantryList.findOne({"_id": pantryID});
                    q2.exec(function(err2, res2){
                        if(err2){
                            res.status(500);
                            res.json({ 
                                message: "Pantry Server Error",
                                data: err2
                            });
                            mongoose.disconnect();
                        }
                        res.status(200).send({
                            "message": "OK", 
                            "data": res2
                        })
                        mongoose.disconnect();
                    })
                });
            }
            else if("_id" in req.query){
                    q = PantryList.findOne({"_id": req.query._id});
                    q.exec(function(err,result){
                        if(err){
                            res.status(500);
                            res.json({ 
                                message: "Server Error",
                                data: err
                            });
                            mongoose.disconnect();
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
    
    pantryRoute.post(function (req, res) {
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
                            var q2 = PantryList.findOne({"_id": u.PantryListID});
                            q2.exec(function(err2, pList){
                                if(err2){
                                    res.status(500).send({ 
                                        message: "Server Error",
                                        data: err2
                                    });
                                    mongoose.disconnect();
                                }
                                else{
                                    if(pList != null){
                                        var newDate = new Date();
                                        pList.PantryIngredients.push(params.ingredientID);
                                        pList.PantryDescriptions.push(params.ingredientDescription);
                                        pList.PantryDates.push(newDate);
                                        pList.save().then(function(d) {
                                            res.status(200).send({"message": "Pantry Item Added", "data": d});
                                            mongoose.disconnect();
                                        });
                                    }
                                    else{
                                        res.status(200).send({"message": "Ingredient not Found", "data": {}})
                                        mongoose.disconnect();
                                    }
                                }
                            });
                        } 
                    });
                });
            }

        });
    });

    pantryRoute.delete(function (req, res) {
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
                            var q2 = PantryList.findOne({"_id": u.PantryListID});
                            q2.exec(function(err2, pList){
                                if(err2){
                                    res.status(500).send({ 
                                        message: "Server Error",
                                        data: err2
                                    });
                                    mongoose.disconnect();
                                }
                                else{
                                    var index = pList.PantryIngredients.indexOf(params.ingredientID);
                                    if(index >= 0){
                                        pList.PantryIngredients.splice(index, 1);
                                        pList.PantryDescriptions.splice(index, 1);
                                        pList.PantryDates.splice(index, 1);
                                        pList.save().then(function(d) {
                                            res.status(200).send({"message": "Pantry Item Deleted", "data": d});
                                            mongoose.disconnect();
                                        });
                                    }
                                    else{
                                        res.status(200).send({"message": "Item not found in Pantry", "data": {}})
                                        mongoose.disconnect();
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
