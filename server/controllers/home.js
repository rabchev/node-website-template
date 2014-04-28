"use strict";

function home(req, res) {
    res.render("home", {
        pageTitle: "NodeJS MVC Website Template"
    });
}

exports.init = function (app) {
    app.get("/", home);
};
