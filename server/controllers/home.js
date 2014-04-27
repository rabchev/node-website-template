"use strict";

function home(req, res) {
    req.scope.title = "NodeJS MVC Website Template";
    res.render("home", req.scope);
}

exports.init = function (app) {
    app.get("/", home);
};
