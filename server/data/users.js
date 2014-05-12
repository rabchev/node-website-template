var _       = require("lodash"),
    users   = {
    1: {
        _id: 1,
        name: "Bob Pott",
        nickname: "bob",
        password: "secret",
        email: "bob@example.com",
        phone: "+35986656060",
        roles: [
            "administrators"
        ]
    },
    2: {
        _id: 2,
        name: "Joe Haxby",
        nickname: "joe",
        password: "birthday",
        email: "joe@example.com",
        phone: "",
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

function update(user, callback) {
    var dest = users[user._id],
        err;

    if (user) {
        dest = _.cloneDeep(_.merge(dest, user));
    } else {
        err = new Error("User \"" + id + "\" does not exist.");
    }

    returnBack(callback, err, dest);
}

function insert(user, callback) {
    var dest = users[user._id],
        err;
    if (dest) {
        err = new Error("There is already a user with the specified ID.");
    } else {
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
exports.update = update;
exports.insert = insert;
exports.delete = deleteUser;
