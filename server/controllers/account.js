"use strict";

var _       = require("lodash"),
    schema  = require("../models/user.json");

schema.title = "My Account";
delete schema.description;

exports.getAccount = function (req, res) {
    var isAdmin = req.user && req.user.roles && req.user.roles.indexOf("administrators") != -1;

    function replacer(key, value)
    {
        if (key === "password" || (!isAdmin && key === "roles")) {
            return undefined;
        }

        return value;
    }

    res.render("account", {
        htmlTitle: "My Account",
        message: req.flash("error"),
        data: JSON.stringify(req.user, replacer),
        schema: JSON.stringify(schema, replacer)
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

    app.get("/account", authHandler, exports.getAccount);
    app.post("/account", authHandler, exports.postAccount);
};
