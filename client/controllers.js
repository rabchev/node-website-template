define(["angular", "services"], function (angular) {
    "use strict";

    return angular.module("app.controllers", ["app.services"])
        .controller("dashboard", ["$scope", "$injector", function($scope, $injector) {
            require(["controllers/dashboard"], function(ctrl) {
                $injector.invoke(ctrl, this, {"$scope": $scope});
            });
        }])
        .controller("page2", ["$scope", "$injector", function($scope, $injector) {
            require(["controllers/page2"], function(ctrl) {
                $injector.invoke(ctrl, this, {"$scope": $scope});
            });
        }]);
});
