"use strict";

var scope = {
    title:  "NodeJS MVC Website Template"
};

function home(req, res) {
    res.render("home", scope);
}

exports.init = function (app) {
    app.get("/", home);
};
