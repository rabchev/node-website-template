"use strict";

var scope = {
    layout: false,
    title:  "Backend Administration"
};

function backendApp(req, res) {
    res.render("backend-app", scope);
}

exports.init = function (app) {
    app.get("/admin", app.settings.authHandler, backendApp);
};
