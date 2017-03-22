(function () {
    var app = angular.module('mainApp', ['ngRoute', 'config']);
    app.controller('mainCtrl', ['$scope', function ($scope) {
        $scope.navigation = {
            usernav: false
        }
        }]);


}());