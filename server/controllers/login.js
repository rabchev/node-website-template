"use strict";

var passport = require("passport");

exports.getLogin = function (req, res) {
    var scope = {
        title:  "NodeJS MVC Website Template",
        user: req.user,
        message: req.flash("error")
    };
    res.render("login", scope);
};

exports.postLogin = function (req, res) {
    res.redirect("/");
};

exports.getLogout = function (req, res){
    req.logout();
    res.redirect("/");
};

exports.init = function (app) {
    var authOpts = {
            failureRedirect: "/login",
            failureFlash: true
        },
        authFn = passport.authenticate("local", authOpts);

    app.get("/login", exports.getLogin);
    app.get("/logout", exports.getLogout);
    app.post("/login", authFn, exports.postLogin);
};
