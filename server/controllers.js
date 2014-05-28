"use strict";

var async       = require("async"),
    path        = require("path"),
    fs          = require("fs");

exports.init = function (app, callback) {
    fs.readdir(path.join(__dirname, "controllers"), function (err, files) {
        async.each(files, function (file, done) {
            try {
                var ctrl = require("./controllers/" + file);
                if (ctrl.init) {
                    if (ctrl.init.length === 2) {
                        ctrl.init(app, done);
                    } else {
                        ctrl.init(app);
                        done();
                    }
                }
            } catch (err) {
                done(err);
            }
        }, callback);
    });
};
