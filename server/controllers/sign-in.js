/*jshint -W106 */

"use strict";

var passport    = require("passport"),
    uuid        = require("node-uuid");

// TODO: Add token persistance.
var tokens = {};

function consumeRememberMeToken(token, fn) {
    var userId = tokens[token];
    // invalidate the single-use token
    delete tokens[token];
    return fn(null, userId);
}

function saveRememberMeToken(token, userId, fn) {
    tokens[token] = userId;
    return fn();
}

function issueToken(user, done) {
    var token = uuid.v1();
    saveRememberMeToken(token, user.id, function(err) {
        if (err) { return done(err); }
        return done(null, token);
    });
}

exports.getSignIn = function (req, res) {
    var scope = {
        title:  "NodeJS MVC Website Template",
        user: req.user,
        message: req.flash("error")
    };
    res.render("sign-in", scope);
};

exports.getSignOut = function (req, res){
    res.clearCookie("remember_me");
    req.logout();
    res.redirect("/");
};

exports.init = function (app) {
    var authOpts = {
            successReturnToOrRedirect: "/",
            failureRedirect: "/sign-in",
            failureFlash: true
        };

    app.get("/sign-in", exports.getSignIn);
    app.get("/sign-out", exports.getSignOut);
    app.post("/sign-in", passport.authenticate("local", authOpts), function(req, res, next) {
        // Issue a remember me cookie if the option was checked
        if (!req.body.remember_me) { return next(); }

        issueToken(req.user, function(err, token) {
            if (err) { return next(err); }
            res.cookie("remember_me", token, { path: "/", httpOnly: true, maxAge: 604800000 });
            return next();
        });
    }, function(req, res) {
        res.redirect("/");
    });
};
