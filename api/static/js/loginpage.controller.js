(function () {
	var app = angular.module('mainApp', ['services']);
	app.controller('loginCtrl', ['$scope', 'restful', function ($scope, restful) {

		restful.get('v2/app').then(function (response) {
			$scope.apps = response['objects'];
		});

		restful.get('me/user').then(function (response) {
			$scope.current_user = response['objects'][0];
		});


}]);
}());