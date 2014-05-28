"use strict";

var //chai            = require("chai"),
    server          = require("../server"),
    //expect          = chai.expect,
    test;

describe("public site", function () {

    before(function (done) {
        server.init(function (err, res) {
            if (err) {
                return done(err);
            }

            test = require("./util").test(res);
            done();
        });
    });

    it("get account anonymous", function (done) {
        test(done, function (req) {
            return req
            .get("/account")
            .set("Accept", "text/html")
            .expect(302)
            .expect("Location", "/sign-in");
        });
    });
});
