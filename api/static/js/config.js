(function () {

    var app = angular.module('config', []);
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'static/partials/dashboard.html'
            }).when('/dashboard', {
                templateUrl: 'static/partials/dashboard.html'
            }).when('/stats', {
                templateUrl: 'static/partials/stats.html'
            }).when('/action-log', {
                templateUrl: 'static/partials/action-log.html'
            }).when('/links', {
                templateUrl: 'static/partials/links.html'
            }).when('/add-link', {
                templateUrl: 'static/partials/add-link.html'
            }).when('/users-permissions', {
                templateUrl: 'static/partials/users-permissions.html'
            }).when('/add-user', {
                templateUrl: 'static/partials/add-user.html'
            }).when('/settings', {
                templateUrl: 'static/partials/settings.html'
            }).when('/ver', {
                templateUrl: 'static/partials/ver.html'
            }).otherwise({
                controller: function () {
                    window.location.replace(window.location);
                },
                template: ''
            });
        $locationProvider.html5Mode(true);
}]);

}())