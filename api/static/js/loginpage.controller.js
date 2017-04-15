(function () {
    var app = angular.module('mainApp', ['services']);
    app.controller('loginCtrl', ['$scope', 'restful', function ($scope, restful) {

        restful.get('v2/app').then(function (response) {
            $scope.apps = response['objects'];
        });



        $scope.login = function (email, password) {
            var data = {
                email: email,
                password: password
            };
            restful.login(data).then(function (response) {
                if (response == 'True')
                    restful.get('me/user').then(function (response) {
                        $scope.current_user = response['objects'][0];
                    });
            }).catch(function (response) {
                console.log(response);
            });
        }

}]);
}());