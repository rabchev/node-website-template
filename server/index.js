/*jshint -W106 */

"use strict";

var http            = require("http"),
    https           = require("https"),
    express         = require("express"),
    bodyParser      = require("body-parser"),
    cookieParser    = require("cookie-parser"),
    methodOverride  = require("method-override"),
    serveStatic     = require("serve-static"),
    favicon         = require("static-favicon"),
    flash           = require("connect-flash")(),
    exphbs          = require("express3-handlebars"),
    swaggy          = require("swaggy"),
    path            = require("path"),
    url             = require("url"),
    fs              = require("fs"),
    async           = require("async"),
    auth            = require("./auth"),
    pckg            = require("../package.json"),
    controllers     = require("./controllers"),
    ignorePaths     = new RegExp("^/public/|/content/|/client/", "i"),
    resourcesRoot   = "/res/" + pckg.version,
    servers         = [],
    secretKey,
    session,
    hbs,
    render;

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

function flashHandler(req, res, next) {
    if (!req.session) {
        return next();
    }
    flash(req, res, next);
}

hbs = exphbs.create({
    layoutsDir: path.resolve("server", "views", "layouts"),
    partialsDir: path.resolve("server", "views", "partials"),
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

function addServer(opts, app, callback) {
    var srv, cred;
    if (opts.protocol === "https") {
        cred = {};
        if (opts.pfx) {
            cred.pfx = fs.readFileSync(opts.pfx);
        } else {
            cred.key = fs.readFileSync(opts.key);
            cred.cert = fs.readFileSync(opts.cert);
        }
        srv = https.createServer(cred, app);
    } else {
        srv = http.createServer(app);
    }
    srv.listen(opts.port, function () {
        console.log("listening on ", url.format(opts));
        callback(null, srv);
    });
    srv._inst_opts = opts;
    servers.push(srv);
}

function init(opts, callback) {
    if (typeof opts === "function") {
        callback = opts;
        opts = null;
    }

    if (!callback) {
        callback = dummyCb;
    }

    if (servers.length) {
        return callback(new Error("Server is already running."));
    }

    if (!opts) {
        opts = require("./config");
    } else if (typeof opts === "number") {
        opts = { instances: [{ port: opts, hostname: "localhsot", protocol: "http" }] };
    }

    var app = express();
    async.series(
        [
            function (done) {
// Configure server instance varialbes.

// FIXME: Change the key below with randomly generated number. You could use (http://randomkeygen.com).
                secretKey = "95DA438DE3A81";
                session = require("express-session")({
                    secret: secretKey,
                    saveUninitialized: true,
                    resave: true
                });

                done();
            },
            function (done) {
                app.set("resources", resourcesRoot)
                    .set("views", path.resolve("server", "views"))
                    .engine("html", hbs.engine)
                    .set("view engine", "html")
                    .use(favicon())
                    .use(bodyParser.urlencoded({ extended: true }))
                    .use(bodyParser.json())
                    .use(methodOverride())
                    .use(cookieParser(secretKey))
                    .use(sessionHandler)
                    .use(flashHandler)
                    .use(resourcesRoot, serveStatic(path.resolve("client")));

                app.locals.projectName = pckg.name;
                app.locals.htmlTitle = pckg.name;

                done();
            },
            function (done) {
                auth.init(app, done);
            },
            function (done) {
                var conf = {
                    controllersDir: path.join(__dirname, "rest-api")
                };
                swaggy(app, conf, done);
            },
            function (done) {
                controllers.init(app, done);
            }
        ], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, app, opts);
        }
    );
}

function start(opts, callback) {
    if (typeof port === "function") {
        callback = opts;
        opts = null;
    }

    if (!callback) {
        callback = dummyCb;
    }

    init(opts, function (err, app, opts) {
        if (err) {
            return callback(err);
        }

        async.each(opts.instances, function (inst, done) {
            addServer(inst, app, done);
        }, function () {
            exports.app = app;
            exports.servers = servers;
            callback();
        });
    });
}

function stop(callback) {
    if (servers.length) {
        async.each(servers, function (srv, done) {
            console.log("stopping on ", url.format(srv._inst_opts));
            srv.close(done);
        }, function (err) {
            exports.app = null;
            exports.servers = null;
            servers.length = 0;
            if (callback) {
                callback(err);
            }
        });
    } else if (callback) {
        callback();
    }
}

// Override render method to add authentication and user info to the view scope.
render = express.response.render;
express.response.render = function (view, options, fn) {
    options = options || {};
    options.isAuthenticated = this.req.isAuthenticated();
    options.user = this.req.user;

    render.call(this, view, options, fn);
};

exports.init = init;
exports.start = start;
exports.stop = stop;
