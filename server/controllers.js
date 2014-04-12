"use strict";

var async       = require("async"),
    path        = require("path"),
    fs          = require("fs");

exports.init = function (app, callback) {
    fs.readdir(path.join(__dirname, "controllers"), function (err, files) {
        async.each(files, function (file, done) {
            try {
                require("./controllers/" + file).init(app);
            } catch (err) {
                return done(err);
            }
            done();
        }, callback);
    });
};
