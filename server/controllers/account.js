"use strict";

var schema = require("../models/schema/user.json"),
    scripts;

schema.title = "My Account";
delete schema.description;

exports.getAccount = function (req, res) {

    function replacer(key, value) {
        switch (key) {
        case "_id":
        case "password":
        case "roles":
        case "identityProviders":
            return undefined;
        }

        return value;
    }

    res.render("account", {
        htmlTitle: "My Account",
        message: req.flash("error"),
        data: JSON.stringify(req.user, replacer),
        schema: JSON.stringify(schema, replacer),
        scripts: scripts
    });
};

exports.init = function (app) {
    scripts = "<script src=\"" + app.settings.resources + "/bower_components/json-editor/dist/jsoneditor.min.js\"></script>";
    app.get("/account", app.settings.authHandler, exports.getAccount);
};
