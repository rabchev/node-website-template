"use strict";

var _       = require("lodash"),
    uuid    = require("node-uuid"),
    users   = {
        "048237e0-e7d5-11e3-ac10-0800200c9a66": {
            _id: "048237e0-e7d5-11e3-ac10-0800200c9a66",
            name: "Bob Pott",
            password: "secret",
            email: "bob@example.com",
            roles: [
                "administrators"
            ]
        },
        "27062010-e7d5-11e3-ac10-0800200c9a66": {
            _id: "27062010-e7d5-11e3-ac10-0800200c9a66",
            name: "Joe Haxby",
            password: "birthday",
            email: "joe@example.com",
            roles: [
                "contributers"
            ]
        }
    };

function returnBack(callback, err, res) {
    // Simulate IO
    setImmediate(function () {
        if (callback) {
            callback(err, res);
        } else if (err) {
            throw err;
        }
    });
}

function findById(id, callback) {
    var user = users[id],
        err;

    if (user) {
        user = _.cloneDeep(user);
    } else {
        err = new Error("User \"" + id + "\" does not exist.");
    }
    returnBack(callback, err, user);
}

function findByUsername(username, callback) {
    var user = _.find(users, function (user) {
        return (user.username === username || user.email === username);
    });
    if (user) {
        user = _.cloneDeep(user);
    }
    returnBack(callback, null, user);
}

function findByIdentityProvider(providerName, userId, callback) {
    var user = _.find(users, function (user) {
        return (user.identityProviders && user.identityProviders.some(function (el) {
            return (el.name === providerName && el.id === userId);
        }));
    });
    if (user) {
        user = _.cloneDeep(user);
    }
    returnBack(callback, null, user);
}

function update(user, callback) {
    var dest = users[user._id],
        err;

    if (user) {
        dest = _.cloneDeep(_.merge(dest, user));
    } else {
        err = new Error("User \"" + user._id + "\" does not exist.");
    }

    returnBack(callback, err, dest);
}

function insert(user, callback) {
    var dest = users[user._id],
        err;
    if (dest) {
        err = new Error("There is already a user with the specified ID.");
    } else {
        if (!user._id) {
            user._id = uuid.v1();
        }
        users[user._id] = user;
    }
    returnBack(callback, err, dest);
}

function deleteUser(id, callback) {
    delete users[id];
    returnBack(callback);
}

exports.findById = findById;
exports.findByUsername = findByUsername;
exports.findByIdentityProvider = findByIdentityProvider;
exports.update = update;
exports.insert = insert;
exports.delete = deleteUser;
