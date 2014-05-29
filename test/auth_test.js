/*jshint -W106 */

"use strict";

var chai            = require("chai"),
    server          = require("../server"),
    util            = require("./util"),
    expect          = chai.expect,
    test;

describe("authentication tests", function () {

    before(function (done) {
        server.init(function (err, app) {
            if (err) {
                return done(err);
            }

            test = util.test(app);
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

    it("get sign-in form", function (done) {
        test(done, function (req) {
            return req
                .get("/sign-in")
                .set("Accept", "text/html")
                .expect("Content-Type", /html/)
                .expect(200);
        }, function (window, errs) {
            expect(errs).to.not.be.ok;
            expect(window).to.be.ok;
            var $           = window.$,
                form        = $(".form-signin"),
                username    = $("input[name='username']"),
                password    = $("input[name='password']"),
                rememberMe  = $("input[name='remember_me']"),
                submit      = $("button[type='submit']");

            expect(form).to.be.ok;
            expect(form.attr("action")).to.equal("/sign-in");
            expect(form.attr("method")).to.equal("POST");

            expect(username).to.be.ok;
            expect(password).to.be.ok;
            expect(rememberMe).to.be.ok;
            expect(submit).to.be.ok;
        });
    });

    it("post sign-in form", function (done) {
        test(done, function (req) {
            return req
                .post("/sign-in")
                .type("form")
                .set("Accept", "text/html")
                .send({ username: "bob@example.com", password: "secret", remember_me: "on" })
                .expect(302)
                .expect("Location", "/account")
                .expect("set-cookie", /remember_me=/);
        });
    });

    it("get account authenticated", function (done) {
        test(done, function (req) {
            return req
                .get("/account")
                .set("Accept", "text/html")
                .expect(200);
        });
    });

    it("sign out", function (done) {
        test(done, function (req) {
            return req
            .get("/sign-out")
            .set("Accept", "text/html")
            .expect(302)
            .expect("Location", "/");
        });
    });

    it("attempt wrong credentials", function (done) {
        test(done, function (req) {
            return req
            .post("/sign-in")
            .type("form")
            .set("Accept", "text/html")
            .send({ username: "bob@example.com", password: "wrong", remember_me: "on" })
            .expect(302)
            .expect("Location", "/sign-in");
        });
    });

    it("get failure message", function (done) {
        test(done, function (req) {
            return req
            .get("/sign-in")
            .type("form")
            .set("Accept", "text/html")
            .expect(200);
        }, function (window, errs) {
            expect(errs).to.not.be.ok;
            expect(window).to.be.ok;
            var $       = window.$,
                msg     = $("p.alert");

            expect(msg.text()).to.equal("Invalid password");
        });
    });

});
