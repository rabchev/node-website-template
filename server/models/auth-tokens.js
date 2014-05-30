// Simulate token persistence.

"use strict";

var uuid    = require("node-uuid"),
    ttl     = 604800000,
    tokens  = {};

function removeToken(token, fn) {
    delete tokens[token];
    if (fn) {
        fn();
    }
}

function consumeRememberMeToken(token, fn) {
    var item = tokens[token];
    // invalidate the single-use token
    removeToken(token);
    if (item && Date.now() - item.date <= ttl) {
        fn(null, item.value);
    } else {
        fn();
    }
}

function issueToken(userId, done) {
    var token = uuid.v4();

    tokens[token] = {
        _id: token,
        value: userId,
        date: Date.now()
    };
    done(null, token);
}

exports.issueToken = issueToken;
exports.removeToken = removeToken;
exports.getValue = consumeRememberMeToken;
