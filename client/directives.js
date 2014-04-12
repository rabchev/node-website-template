define(["angular", "services"], function(angular, services) {
    "use strict";

    angular.module("app.directives", ["app.services"])
        .directive("appVersion", ["version", function(version) {
            return function(scope, elm, attrs) {
                elm.text(version);
        };
    }]);
});
