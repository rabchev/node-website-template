"use strict";

var request = require("supertest");

exports.test = function (app) {
    return function test(done, setReq, examine) {
        var req = setReq(request(app));
        req.end(function (err, res) {
            if (err) {
                return done(err);
            }
            if (examine) {
                try {
                    examine(res.body);
                } catch (err) {
                    return done(err);
                }
            }
            done();
        });
    };
};
