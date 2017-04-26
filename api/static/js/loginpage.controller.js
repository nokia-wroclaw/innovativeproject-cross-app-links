(function () {
    var app = angular.module('mainApp', ['services']);
    app.controller('loginCtrl', ['$scope', 'restful', '$http', '$interval', function ($scope, restful, $http, $interval) {

        var loadingPage = {
            ready: function () {
                document.body.querySelector('.loading .text').innerHTML = 'Fetching data...';
                $interval(function () {
                    if ($http.pendingRequests < 1) {
                        document.body.querySelector('.loading').remove();
                        document.body.style.overflow = 'auto';
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


        $scope.login = function (email, password) {
            $scope.loginFormLoading = true;
            var data = {
                email: email,
                password: password
            };
            restful.login(data).then(function (response) {
                if (response == 'True')
                    restful.get('me/user').then(function (response) {
                        $scope.current_user = response['objects'][0];
                        $scope.loginFormLoading = false;
                    });
                else {
                    $scope.loginFormError = true;
                    $scope.loginFormLoading = false;
                }
            }).catch(function (response) {
                console.log(response);
            });
        }
}]);
}());
