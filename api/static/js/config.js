(function () {

    var app = angular.module('config', []);
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        var path = 'static/partials/';
        $routeProvider
            .when('/dashboard', {
                templateUrl: path + 'dashboard.html'
            }).when('/stats', {
                templateUrl: path + 'stats.html'
            }).when('/action-log', {
                templateUrl: path + 'action-log.html'
            }).when('/links/:siteID', {
                templateUrl: path + 'links.html'
            }).when('/links', {
                templateUrl: path + 'links.html'
            }).when('/add-link', {
                templateUrl: path + 'add-link.html'
            }).when('/users', {
                templateUrl: path + 'users.html'
            }).when('/groups', {
                templateUrl: path + 'groups.html'
            }).when('/add-user', {
                templateUrl: path + 'add-user.html'
            }).when('/settings', {
                templateUrl: path + 'settings.html'
            }).when('/ver', {
                templateUrl: path + 'ver.html'
            }).when('/usercp', {
                templateUrl: path + 'usercp.html'
            }).when('/usercp/permissions', {
                templateUrl: path + 'my_permissions.html'
            }).when('/profile/:siteID', {
                templateUrl: path + 'profile.html'
            }).when('/components', {
                templateUrl: path + 'components.html'
            }).otherwise({
                controller: function () {
                    window.location.replace(window.location);
                },
                template: ''
            });
        $locationProvider.html5Mode(true);
}]);

}())
