define([], function() {
    return ["$scope", "$http", function($scope, $http) {

        $scope.welcomeMessage = "Some Page";

        $scope.$apply();
    }];
});
