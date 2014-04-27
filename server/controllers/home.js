"use strict";

function home(req, res) {
    var scope = {
        title:  "NodeJS MVC Website Template",
        user: req.user,
        isAuthenticated: req.isAuthenticated()
    };

    res.render("home", scope);
}

exports.init = function (app) {
    app.get("/", home);
};
