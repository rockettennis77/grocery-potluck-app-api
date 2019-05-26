var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var User = require('../models/user');
    bcrypt = require('bcrypt');

module.exports = function (router) {

    var friendRoute = router.route('/userFriend');
    friendRoute.get(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var q = User.findOne({"_id": userID});
            q.select('Friends');
            q.exec().then((u) => {
                res.status(200).send({
                    "message": "OK",
                    "data": u
                })
            })
            });
        });

    
    friendRoute.post(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.body;
            if("userID" in params && "password" in params && "friendID" in params){
                var userID = params.userID;
                var friendID = params.friendID;
                var password = params.password;
                q = User.findOne({"_id": userID});
                q2 = User.findOne({"_id": friendID});
                q.then((u) => {
                    if(u == null){
                        res.status(500).send({"message": "No User found", "data": {}})
                    }
                    u.comparePassword(password, (err, match) => {
                        if(err != null){
                            res.status(500).send({"message": "Incorrect password", "data": {}})
                        }
                        else {
                            q2.then((u2) => {
                                if(u2 == null){
                                    res.status(500).send({"message": "Friend not found", "data": {}})
                                }
                                u.Friends.push(friendID);
                                u.save().then(function(d){
                                    res.status(200).send({"message": "Friend Added", "data": d})
                                });
                            })
                        } 
                    });
                });
            }
            else{
                res.status(500).send({"message": "Not enough info", "data": {}})
            }
        });
    });

    friendRoute.delete(function (req, res) {
        mongoose.connect(secrets.mongo_connection, {useNewUrlParser: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            var params = req.body;
            if("userID" in params && "password" in params && "friendID" in params){
                var userID = params.userID;
                var friendID = params.friendID;
                var password = params.password;
                q = User.findOne({"_id": userID});
                q2 = User.findOne({"_id": friendID});
                q.then((u) => {
                    u.comparePassword(password, (err, match) => {
                        if(err != null){
                            res.status(500).send({"message": "Incorrect password", "data": {}})
                        }
                        else {
                            q2.then((u2) => {
                                if(u2 == null){
                                    res.status(500).send({"message": "Friend not found", "data": {}})
                                }
                                var ind = u.Friends.indexOf(friendID);
                                if (ind !== -1) u.Friends.splice(ind, 1);
                                u.save().then(function(d){
                                    res.status(200).send({"message": "Friend Added", "data": d})
                                });
                            })
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
