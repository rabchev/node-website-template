"use strict";

var swagger     = require("swagger-node-express"),
    express     = require("express"),
    async       = require("async"),
    path        = require("path"),
    fs          = require("fs"),
    api         = express();

exports.init = function (app, callback) {
    app.use("/api", api);

    swagger.setAppHandler(api);
    swagger.configureSwaggerPaths("", "/api-docs", "");

    swagger.setHeaders = function setHeaders(res) {
        res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
        res.header("Content-Type", "application/json; charset=utf-8");
    };

    fs.readdir(path.join(__dirname, "rest-api"), function (err, files) {
        async.each(files, function (file, done) {
            try {
                require("./rest-api/" + file).init(swagger);
            } catch (err) {
                return done(err);
            }
            done();
        }, function (err) {
            var uiPath = path.join(__dirname, "..", "client", "bower_components", "swagger-ui", "dist");
            swagger.configure(app.get("rootUrl") + "/api", "0.1");
            api.use("/docs", express.static(uiPath));
            callback(err);
        });
    });
};
