var passport            = require("passport"),
    LocalStrategy       = require("passport-local").Strategy,
    FacebookStrategy    = require("passport-facebook").Strategy;

var users = [
    {
        id: 1,
        name: "Bob Pott",
        username: "bob",
        password: "secret",
        email: "bob@example.com",
        roles: [
            "administrators"
        ]
    },
    {
        id: 2,
        name: "Joe Haxby",
        username: "joe",
        password: "birthday",
        email: "joe@example.com",
        roles: [
            "contributers"
        ]
    }
];

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error("User " + id + " does not exist"));
    }
}

// FIXME: Replace with database.
function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        // Find the user by username.  If there is no user with the given
        // username, or the password is not correct, set the user to `false` to
        // indicate failure and set a flash message.  Otherwise, return the
        // authenticated `user`.
        findByUsername(username, function (err, user) {
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
        .use(passport.session());

    callback();
};
