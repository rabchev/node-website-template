"use strict";

var authOpts = {
        failureRedirect: "/sign-in",
        failureFlash: true
    },
    authenticate    = require("passport").authenticate("local", authOpts),
    cookieSetter    = require("../auth").cookieSetter;

exports.getSignIn = function (req, res) {
    var scope = {
        title:  "NodeJS MVC Website Template",
        user: req.user,
        message: req.flash("error")
    };
    res.render("sign-in", scope);
};

exports.postSignIn = function (req, res) {
    var url = "/";
    if (req.session && req.session.returnTo) {
        url = req.session.returnTo;
        delete req.session.returnTo;
    }
    res.redirect(url);
};

exports.getSignOut = function (req, res){
    res.clearCookie("remember_me");
    req.logout();
    res.redirect("/");
};

exports.init = function (app) {
    app.get("/sign-in", exports.getSignIn);
    app.post("/sign-in", authenticate, cookieSetter, exports.postSignIn);
    app.get("/sign-out", exports.getSignOut);
};
