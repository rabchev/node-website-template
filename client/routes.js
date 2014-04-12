define(["angular", "app"], function(angular, app) {
    "use strict";

    return app.config(["$routeProvider", function($routeProvider) {
        $routeProvider.
            when("/", {
                templateUrl: appConfig.resources + "/views/home.html",
                controller: "home"
            }).
            when("/page1", {
                templateUrl: appConfig.resources + "/views/page1.html",
                controller: "page1"
            }).
            otherwise({
                redirectTo: "/"
            });
    }]);
});
