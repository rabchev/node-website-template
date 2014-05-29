"use strict";

var fs      = require("fs"),
    path    = require("path"),
    request = require("supertest"),
    jsdom   = require("jsdom"),
    jquery = fs.readFileSync(path.join(__dirname, "..", "client", "bower_components", "jquery", "dist", "jquery.js"), "utf-8");

function proc(examine, done, errs, data) {
    try {
        if (examine.length === 3) {
            examine(data, errs, done);
        } else {
            examine(data, errs);
            done();
        }
    } catch (err) {
        return done(err);
    }
}

exports.test = function (app) {
    var agent = request.agent(app);
    return function test(done, setReq, examine) {
        var req = setReq(agent);
        req.end(function (err, res) {
            if (err) {
                return done(err);
            }
            if (examine) {
                if (res.type === "text/html" && res.text) {
                    jsdom.env({
                        html: res.text,
                        src: [jquery],
                        done: function (errs, window) {
                            proc(examine, done, errs, window);
                        }
                    });
                } else {
                    proc(examine, done, null, res.body);
                }
            } else {
                done();
            }
        });
    };
};
