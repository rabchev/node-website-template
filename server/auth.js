/*jshint -W106 */

"use strict";

var passport            = require("passport"),
    LocalStrategy       = require("passport-local").Strategy,
    RememberMeStrategy  = require("passport-remember-me").Strategy,
    FacebookStrategy    = require("passport-facebook").Strategy,
    ensureLogin         = require("connect-ensure-login"),
    tokens              = require("./data/auth-tokens"),
    users               = require("./data/users"),
    opts                = {
        key: "remember_me",
        cookie: {
            path: "/",
            httpOnly: true,
            maxAge: 604800000
        }
    },
    FACEBOOK_APP_ID     = "465623040250444",
    FACEBOOK_APP_SECRET = "2e65ae79ebd5cdb683d3310752aeab58",
    CALLBACK_URL        = "http://localhost:8095/sign-in/facebook/callback";

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    users.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        // Find the user by username.  If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        users.findByUsername(username, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: "Unknown user " + username });
            }

            if (user.password !== password) {
                return done(null, false, { message: "Invalid password" });
            }

            return done(null, user);
        });
    }
));

passport.use(new RememberMeStrategy(
    opts,
    function(token, done) {
        tokens.getValue(token, function(err, userId) {
            if (err) {
                return done(err);
            }

            if (!userId) {
                return done(null, false);
            }

            users.findById(userId, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            });
        });
    },
    tokens.issueToken
));

passport.use(new FacebookStrategy(
    {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        users.findByUsername(profile.name, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }
            done(null, user);
        });
    }
));

exports.init = function (app, callback) {
    if (!app.settings.authHandler) {
        app
            .use(passport.initialize())
            .use(passport.session())
            .use(passport.authenticate("remember-me"))
            .set("authHandler", ensureLogin.ensureAuthenticated("/sign-in"));
    }
    callback();
};

exports.cookieSetter = function(req, res, next) {
    if (!req.body[opts.key]) {
        return next();
    }

    tokens.issueToken(req.user, function(err, token) {
        if (err) { return next(err); }
        res.cookie(opts.key, token, opts.cookie);
        return next();
    });
};
