define([], function() {
    return ["$scope", function($scope) {

        $scope.welcomeMessage = "Hey this is my home!";

        $scope.$apply();
    }];
});
