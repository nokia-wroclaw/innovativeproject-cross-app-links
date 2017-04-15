(function () {
    var app = angular.module('mainApp', ['services']);
    app.controller('loginCtrl', ['$scope', 'restful', function ($scope, restful) {

        restful.get('v2/app').then(function (response) {
            $scope.apps = response['objects'];
        });

        restful.get('me/user').then(function (response) {
            $scope.current_user = response['objects'][0];
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
                    });
                else
                    $scope.loginFormError = true;
                $scope.loginFormLoading = false;
            }).catch(function (response) {
                console.log(response);
            });
        }

}]);
}());