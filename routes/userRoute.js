var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var User = require('../models/user');
var bcrypt = require('bcrypt');

module.exports = function (router) {

    var userRoute = router.route('/users');
    userRoute.get(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var q;
            if("username" in req.query && "password" in req.query){
                q = User.findOne({"username": req.query.username});
                q.then((u) => {
                    u.comparePassword(req.query.password, (match) => {
                        if(match == false){
                            res.status(500).send({"message": "Incorrect password", "data": {}})
                        }
                        else {
                            res.status(200).send({"message": "User authenticated", "data": u})
                        } 
                    });
                });
            }
            else {
                if("username" in req.query){
                    q = User.findOne({"username": req.query.username});
                }
                else if("_id" in req.query){
                    q = User.findOne({"_id": req.query._id});
                }
                else {
                    q = User.find({});
                }
                q.select('_id username fullName friends IngredientsAvailable').exec(function(err,result){
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
            }
        });
    });

    userRoute.put(function(req,res){
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var q;
            if("username" in req.body && "password" in req.body){
                q = User.findOne({"username": req.body.username});
                q.then((u) => {
                    u.comparePassword(req.body.password, (err, match) => {
                        if(err != null){
                            res.status(500).send({"message": "Incorrect password", "data": {}})
                        }
                        else {
                            User.findOneAndUpdate({"username": req.q}, req.body, function(err, doc){
                                if(err) return res.status(500).send({"message": "500 Server Error", "data": {}})
                                res.status(200).send({"message": "User authenticated", "data": doc})
                            })
                        } 
                    });
                });
            }          
        });
    });

    
    userRoute.post(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.body;
            var newUser = new User(params)
            newUser.save().then(function(u){
                res.status(201).send({"message": "OK", "data": u});
                mongoose.disconnect();
            });

        });
    });

    userRoute.delete(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var q;
            if("username" in req.body && "password" in req.body){
                q = User.findOne({"username": req.body.username});
                q.then((u) => {
                    if(u == null) {
                        res.status(500).send({"message": "Could not find user", "data": {}});
                    }
                    u.comparePassword(req.body.password, (err, match) => {
                        if(err != null){
                            res.status(500).send({"message": "Incorrect password", "data": {}});
                        }
                        else {
                            var b = User.findOneAndDelete({"username": req.body.username});
                            res.status(200).send({"message": "User deleted", "data": b})
                        } 
                    });
                });
            }

        });
    });

    return router;
}
