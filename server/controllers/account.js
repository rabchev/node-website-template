"use strict";

exports.getAccount = function (req, res) {
    res.render("account", {
        htmlTitle: "My Account",
        pageTitle: "My Account",
        message: req.flash("error")
    });
};

exports.postAccount = function (req, res) {
    res.send(100, "Not implemented yet!");
};

exports.init = function (app) {
    var authOpts = {
            failureRedirect: "/sign-in",
            failureFlash: true
        },
        authHandler = app.get("authHandler");

    app.get("/account/:username", authHandler, exports.getAccount);
    app.post("/account/:username", authHandler, exports.postAccount);
};
