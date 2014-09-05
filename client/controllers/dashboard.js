define([], function() {
    "use strict";

    return ["$scope", function($scope) {

        $scope.welcomeMessage = "My Dashboard!";

        $scope.$apply();
    }];
});
