define(["angular", "app"], function(angular, app) {
    "use strict";

    return app.config(["$routeProvider", function($routeProvider) {
        $routeProvider.
            when("/", {
                templateUrl: appConfig.resources + "/views/dashboard.html",
                controller: "dashboard"
            }).
            when("/page2", {
                templateUrl: appConfig.resources + "/views/page2.html",
                controller: "page2"
            }).
            otherwise({
                redirectTo: "/"
            });
    }]);
});
