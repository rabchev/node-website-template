"use strict";

var fs      = require("fs"),
    path    = require("path"),
    swagger = require("swagger-node-express");

exports.updateUserInfo = {
    spec: {
        description: "Sample Operations",
        path: "/users/{id}",
        parameters : [
            swagger.pathParam("id", "The user ID to update.", "string")
        ],
        notes: "Implementation notes on get sample item method.",
        summary: "Updates user information.",
        method: "PUT",
        type: "Account",
        nickname: "updateUserInfo"
    },
    action: function (req, resp) {
        resp.json({ name: req.params.key });
    }
};

exports.init = function (swagger, done) {
    fs.readFile(path.join(__dirname, "../models/user.json"), { encoding: "utf8" }, function (err, data) {
        if (err) {
            return done(err);
        }

        swagger.addModels({
            Account: JSON.parse(data)
        });

        done();
    });
};
