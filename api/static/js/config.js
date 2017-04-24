(function () {

    var app = angular.module('config', []);
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/dashboard', {
                templateUrl: 'static/partials/dashboard.html'
            }).when('/stats', {
                templateUrl: 'static/partials/stats.html'
            }).when('/action-log', {
                templateUrl: 'static/partials/action-log.html'
            }).when('/links/:siteID', {
                templateUrl: 'static/partials/links.html'
            }).when('/links', {
                templateUrl: 'static/partials/links.html'
            }).when('/add-link', {
                templateUrl: 'static/partials/add-link.html'
            }).when('/users', {
                templateUrl: 'static/partials/users.html'
            }).when('/groups', {
                templateUrl: 'static/partials/groups.html'
            }).when('/add-user', {
                templateUrl: 'static/partials/add-user.html'
            }).when('/settings', {
                templateUrl: 'static/partials/settings.html'
            }).when('/ver', {
                templateUrl: 'static/partials/ver.html'
            }).when('/usercp', {
                templateUrl: 'static/partials/usercp.html'
            }).when('/profile/:siteID', {
                templateUrl: 'static/partials/profile.html'
            }).otherwise({
                controller: function () {
                    window.location.replace(window.location);
                },
                template: ''
            });
        $locationProvider.html5Mode(true);
}]);

}())
