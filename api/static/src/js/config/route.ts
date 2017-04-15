export default class RouteConfig{
    
    static $inject: Array<string> = ['$routeProvider','$locationProvider'];
    
    constructor(private $routeProvider: ng.route.IRouteProvider, private $locationProvider: ng.ILocationProvider){
        const viewsUrl = 'static/src/js/views/';
        this.$routeProvider
            .when('/', {
                templateUrl: viewsUrl + 'dashboard.html'
            }).when('/dashboard', {
                templateUrl: viewsUrl + 'dashboard.html'
            }).when('/stats', {
                templateUrl:viewsUrl + 'stats.html'
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
    
}