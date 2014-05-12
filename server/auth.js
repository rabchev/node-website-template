var passport            = require("passport"),
    LocalStrategy       = require("passport-local").Strategy,
    ensureLogin         = require("connect-ensure-login"),
    users               = require("./data/users");

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
                return done(null, false, {
                    message: "Unknown user " + username
                });
            }

            if (user.password != password) {
                return done(null, false, {
                    message: "Invalid password"
                });
            }

            return done(null, user);
        });
    }
));

exports.init = function (app, callback) {
    app
        .use(passport.initialize())
        .use(passport.session())
        .set("authHandler", ensureLogin.ensureAuthenticated("/sign-in"));

    callback();
};
