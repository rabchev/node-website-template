"use strict";

var express         = require("express"),
    bodyParser      = require("body-parser"),
    cookieParser    = require("cookie-parser"),
    methodOverride  = require("method-override"),
    serveStatic     = require("serve-static"),
    favicon         = require("static-favicon"),
    exphbs          = require("express3-handlebars"),
    path            = require("path"),
    url             = require("url"),
    async           = require("async"),
    auth            = require("./auth"),
    pckg            = require("../package.json"),
    controllers     = require("./controllers"),
    rest_api        = require("./rest-api"),
    ignorePaths     = new RegExp("^/public/|/content/|/client/", "i"),
    resourcesRoot   = "/res/" + pckg.version,
    session,
    srv,
    hbs;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function dummyCb(err) {
    if (err) {
        throw err;
    }
}

function sessionHandler(req, res, next) {
    if (ignorePaths.test(req.url)) {
        return next();
    }
    session(req, res, next);
}

hbs = exphbs.create({
    layoutsDir: path.resolve("server", "views", "layouts"),
    defaultLayout: "main",
    extname: ".html",
    helpers: {
        version: function () {
            return pckg.version;
        },
        resources: function () {
            return resourcesRoot;
        }
    }
});

function init(opts, callback) {
    if (typeof opts === "function") {
        callback = opts;
        opts = null;
    }

    if (!callback) {
        callback = dummyCb;
    }

    if (!opts) {
        opts = {};
    } else if (typeof opts === "number") {
        opts = { url: { port: opts } };
    }

    if (!opts.url) {
        opts.url = {};
    }

    if (!opts.url.port) {
        opts.url.port = process.env.VCAP_APP_PORT || 8095;
    }

    if (!opts.url.hostname) {
        opts.url.hostname = process.env.VCAP_APP_HOST || "localhost";
    }

    if (!opts.url.protocol) {
        opts.url.protocol = process.env.VCAP_APP_PROTOCOL || "http";
    }

    var app = express();
        app.set("rootUrl", url.format(opts.url));
        app.set("views", path.resolve("server", "views"));
        app.engine("html", hbs.engine);
        app.set("view engine", "html");

        app.use(favicon())
            .use(bodyParser())
            .use(methodOverride())
            .use(cookieParser("7AFFF1E44C4D3"))
            .use(resourcesRoot, serveStatic(path.resolve("client")));

    async.series(
        [
            function (done) {
                auth.init(app, done);
            },
            function (done) {
                rest_api.init(app, done);
            },
            function (done) {
                controllers.init(app, done);
            }
        ], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, app);
        }
    );
}

function start(opts, callback) {
    if (srv) {
        return callback(srv, opts.url);
    }

    if (typeof port === "function") {
        callback = opts;
        opts = null;
    }

    if (!callback) {
        callback = dummyCb;
    }

    if (!opts) {
        opts = {};
    } else if (typeof opts === "number") {
        opts = { url: { port: opts } };
    }

    init(opts, function (err, app) {
        if (err) {
            return callback(err);
        }

        try {
            srv = app.listen(opts.url.port, function () {
                console.log("Listening on ", url.format(opts.url));
                exports.app = app;
                callback(null, srv, opts.url);
            });
        } catch (err) {
            callback(err);
        }
    });
}

function stop(callback) {
    if (srv) {
        console.log("Stopping on ", exports.app.get("rootUrl"));
        exports.app = null;
        srv.close(callback);
        srv = null;
    } else if (callback) {
        callback();
    }
}

exports.init = init;
exports.start = start;
exports.stop = stop;
