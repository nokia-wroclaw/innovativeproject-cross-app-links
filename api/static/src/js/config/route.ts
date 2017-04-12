export default class RouteConfig{
    
    static $inject: Array<string> = ['$routeProvider','$locationProvider'];
    
    constructor(private $routeProvider: ng.route.IRouteProvider, private $locationProvider: ng.ILocationProvider){
        var rConfig = this;
        
        rConfig.$routeProvider
            .when('/', {
                templateUrl: 'static/partials/dashboard.html'
            }).when('/dashboard', {
                templateUrl: 'static/partials/dashboard.html'
            }).when('/stats', {
                templateUrl: 'static/partials/stats.html'
            }).when('/action-log', {
                templateUrl: 'static/partials/action-log.html'
            }).when('/links/:linkID', {
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
            }).otherwise({
                controller: function () {
                    window.location.replace(window.location.href);
                },
                template: ''
            });
        
        rConfig.$locationProvider.html5Mode(true);        
    }
    
}