(function () {
    var app = angular.module('mainApp', ['ngRoute', 'config', 'ngScrollbars']);
    app.controller('mainCtrl', ['$scope', function ($scope) {
        /*Custom Scrollbar Config*/
        $scope.config = {
            autoHideScrollbar: true,
            theme: 'minimal',
            advanced: {
                updateOnContentResize: true
            },
            scrollInertia: 0,
            axis: 'y'
        }

        }]);


}());