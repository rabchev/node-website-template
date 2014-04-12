define(["angular", "services"], function (angular) {
    "use strict";

    return angular.module("app.controllers", ["app.services"])
        .controller("home", ["$scope", "$injector", function($scope, $injector) {
            require(["controllers/home"], function(ctrl) {
                $injector.invoke(ctrl, this, {"$scope": $scope});
            });
        }])
        .controller("page1", ["$scope", "$injector", function($scope, $injector) {
            require(["controllers/page1"], function(ctrl) {
                $injector.invoke(ctrl, this, {"$scope": $scope});
            });
        }]);
});
