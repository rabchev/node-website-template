define([], function() {
    return ["$scope", function($scope) {

        $scope.welcomeMessage = "My Dashboard!";

        $scope.$apply();
    }];
});
