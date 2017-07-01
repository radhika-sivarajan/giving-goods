var User = require("../models/User");
var bcrypt = require('bcrypt-nodejs');

module.exports = {
    allUsers: function (req, res) {
        User.find({}).then(function (doc) {
            res.json(doc);
        }).catch(function (err) {
            res.json(err);
        });
    },
    addUser: function (req, res) {
        var result = {
            role: req.body.role,
            privilege: req.body.privilege,
            emailId: req.body.emailId,
            password: bcrypt.hashSync(req.body.password)
        };
        User.create(result).then(function (doc) {
            res.json(doc);
        }).catch(function (err) {
            res.json(err);
        });
    },
    getMyInfo: function (req, res) {
        if (req.user) {
            let userId = req.user._id;
            User.findById(userId).then(function (doc) {
                res.json(doc);
            }).catch(function (err) {
                res.json(err);
            });
        } else {
            res.json(false);
        }
    },
    updateMyInfo: function (req, res) {
        if (req.user) {
            let userId = req.user._id;
            User.update({ _id: userId }, req.body)
                .then(function (doc) {
                    res.json(doc);
                }).catch(function (err) {
                    res.json(err);
                });
        }
    },
    suspendUser: function (req, res) {
        let userId = req.body.id;
        User.update({ _id: userId }, { privilege: 3 })
            .then(function (doc) {
                res.json(doc);
            }).catch(function (err) {
                res.json(err);
            });
    },
    activateAcc: function (req, res) {
        let userId = req.body.id;
        let userPrivilege = req.body.privilege;
        User.update({ _id: userId }, { privilege: userPrivilege })
            .then(function (doc) {
                res.json(doc);
            }).catch(function (err) {
                res.json(err);
            });
    }
};