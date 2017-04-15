"use strict";
exports.__esModule = true;
var RouteConfig = (function () {
    function RouteConfig($routeProvider, $locationProvider) {
        this.$routeProvider = $routeProvider;
        this.$locationProvider = $locationProvider;
        var viewsUrl = 'static/src/js/views/';
        this.$routeProvider
            .when('/', {
            templateUrl: viewsUrl + 'dashboard.html'
        }).when('/dashboard', {
            templateUrl: viewsUrl + 'dashboard.html'
        }).when('/stats', {
            templateUrl: viewsUrl + 'stats.html'
        }).when('/action-log', {
            templateUrl: viewsUrl + 'action-log.html'
        }).when('/links/:linkID', {
            templateUrl: viewsUrl + 'links.html'
        }).when('/links', {
            templateUrl: viewsUrl + 'links.html'
        }).when('/add-link', {
            templateUrl: viewsUrl + 'add-link.html'
        }).when('/users', {
            templateUrl: viewsUrl + 'users.html'
        }).when('/groups', {
            templateUrl: viewsUrl + 'groups.html'
        }).when('/add-user', {
            templateUrl: viewsUrl + 'add-user.html'
        }).when('/settings', {
            templateUrl: viewsUrl + 'settings.html'
        }).when('/ver', {
            templateUrl: viewsUrl + 'ver.html'
        }).otherwise({
            controller: function () {
                window.location.replace(window.location.href);
            },
            template: ''
        });
        this.$locationProvider.html5Mode(true);
    }
    return RouteConfig;
}());
RouteConfig.$inject = ['$routeProvider', '$locationProvider'];
exports["default"] = RouteConfig;
