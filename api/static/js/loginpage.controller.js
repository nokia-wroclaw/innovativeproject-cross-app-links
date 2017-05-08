(function () {
    var app = angular.module('mainApp', ['services']);
    app.controller('loginCtrl', ['$scope', 'restful', '$http', '$interval', '$document','$location', function ($scope, restful, $http, $interval, $document, $location) {
        $scope.todayDateTime = new Date;
        $scope.isFailure = function(){
            if($location.hash() =='login-failure'){
                return true;
            }
                
        }
        
        var loadingPage = {
            ready: function () {
                angular.element('.loading .text').innerHTML = 'Fetching data...';
                var interval = $interval(function () {
                    if ($http.pendingRequests < 1) {
                        angular.element('.loading').addClass('hidden');
                        $document.find('body').css('overflow', 'auto');
                        $interval.cancel(interval);
                    }
                }, 1000);
            }
        };

        /*Hide it when content is loaded*/
        angular.element(document).ready(function () {
            loadingPage.ready();
        });

        restful.get('me/user').then(function (response) {
            $scope.current_user = response['objects'][0];
        });
        restful.get('v2/app').then(function (response) {
            $scope.apps = response['objects'];
        });


}]);
}());
