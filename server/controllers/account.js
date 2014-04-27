"use strict";

exports.getAccount = function (req, res) {
    var scope = req.scope;
    scope.title = "My Account";
    scope.message = req.flash("error");

    res.render("account", scope);
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
