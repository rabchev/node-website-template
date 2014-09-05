define([], function() {
    "use strict";

    return ["$scope", "$http", function($scope, $http) {

        $scope.welcomeMessage = "Some Page";

        $scope.$apply();
    }];
});
