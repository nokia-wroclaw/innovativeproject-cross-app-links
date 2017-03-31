(function () {
    var app = angular.module('mainApp', ['ngRoute', 'config', 'ngScrollbars', 'services']);
    app.controller('mainCtrl', ['$scope', 'restful', '$location', function ($scope, restful, $location) {
        /*Custom Scrollbar Config*/
        $scope.config = {
            autoHideScrollbar: true,
            theme: 'minimal',
            advanced: {
                updateOnContentResize: true
            },
            scrollInertia: 0,
            axis: 'y'
        };

        $scope.menu = {
            status: true,
            hide: function () {
                this.status = !this.status;
            },
            location: function () {
                return $location.path().replace(/\//g, '').replace(/\ /g, 'sa');
            }
        }

        //Get data
        //Aplications 
        restful.get('app').then(function (response) {
            $scope.apps = response['objects'];
        });
        //Users
        restful.get('user').then(function (response) {
            $scope.users = response['objects'];
        });
        //Groups 
        restful.get('group').then(function (response) {
            $scope.groups = response['objects'];
        });
        //Logs
        restful.get('log').then(function (response) {
            $scope.logs = response['objects'];
        });

        //DASHBOARD COMPONENTS
        $scope.clockDate = {
            setup: new Date(),
            time: function () {
                return this.setup.getHours() + ':' + this.setup.getMinutes();
            },
            date: function () {
                return this.setup.getTime();
            }
        }

        //ADDING ITEMS MODELS

        $scope.newlink = {
            name: '',
            address: '',
            desc: '',
            add: function () {
                alert('App adding start');
                var post_object = {
                    name: this.name,
                    link: this.address,
                    desc: this.desc,
                    creator_id: 1
                }
                console.log(post_object);
                restful.post('app', post_object);
            }
        };

                }]);


}());