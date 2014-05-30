"use strict";

var authOpts = {
        failureRedirect: "/sign-in",
        failureFlash: true
    },
    passport            = require("passport"),
    local               = passport.authenticate("local", authOpts),
    facebookCallback    = passport.authenticate("facebook", authOpts),
    cookieSetter        = require("../auth").cookieSetter;

exports.getSignIn = function (req, res) {
    var scope = {
        title:  "NodeJS MVC Website Template",
        user: req.user,
        message: req.flash("error")
    };
    res.render("sign-in", scope);
};

exports.redirect = function (req, res) {
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
    app.post("/sign-in", local, cookieSetter, exports.redirect);
    app.get("/sign-out", exports.getSignOut);
    app.get("/sign-in/facebook", passport.authenticate("facebook", { scope: ["email"] }));
    app.get("/sign-in/facebook/callback", facebookCallback, exports.redirect);
};
