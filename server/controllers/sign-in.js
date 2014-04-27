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

exports.getSignOut = function (req, res){
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
    app.post("/sign-in", passport.authenticate("local", authOpts));
};
