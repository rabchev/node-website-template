"use strict";

var passport = require("passport");

exports.getSignIn = function (req, res) {
    var scope = {
        title:  "NodeJS MVC Website Template",
        user: req.user,
        message: req.flash("error")
    };
    res.render("sign-in", scope);
};

exports.postSignIn = function (req, res) {
    res.redirect("/");
};

exports.getSignOut = function (req, res){
    req.logout();
    res.redirect("/");
};

exports.init = function (app) {
    var authOpts = {
            failureRedirect: "/sign-in",
            failureFlash: true
        },
        authFn = passport.authenticate("local", authOpts);

    app.get("/sign-in", exports.getSignIn);
    app.get("/sign-out", exports.getSignOut);
    app.post("/sign-in", authFn, exports.postSignIn);
};
