(function () {
    var app = angular.module('mainApp', ['ngRoute', 'config', 'ngScrollbars', 'services']);
    app.controller('mainCtrl', ['$scope', 'restful', '$location', '$routeParams', function ($scope, restful, $location, $routeParams) {
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
                return $location.path().replace(/\//g, '').replace(/\-/g, ' ');
            }
        }

        $scope.filterParams = {
                manage: function () {
                    if ($routeParams.linkID)
                        return parseInt($routeParams.linkID);
                    else return '';
                }
            }
            //Get data

        var update = {
            apps: function () {
                restful.get('app').then(function (response) {
                    $scope.apps = response['objects'];
                });
            },
            users: function () {
                restful.get('user').then(function (response) {
                    $scope.users = response['objects'];
                });
            },
            groups: function () {
                restful.get('group').then(function (response) {
                    $scope.groups = response['objects'];
                });
            },
            logs: function () {
                restful.get('log').then(function (response) {
                    $scope.logs = response['objects'];
                });
            },
            all: function () {
                this.apps();
                this.users();
                this.groups();
                this.logs();
            }
        }
        update.all();

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
            manageFill: function (name, link, desc) {
                this.name = name;
                this.address = link;
                this.desc = desc;
            },
            add: function () {
                var post_object = {
                    name: this.name,
                    link: this.address,
                    desc: this.desc,
                    creator_id: 1
                }
                restful.post('app', post_object);
                update.apps();

                this.clear();
                this.status = true;
            },
            update: function (app_id) {
                var post_object = {
                    name: this.name,
                    link: this.address,
                    desc: this.desc,
                }
                restful.update('app', app_id, post_object);
                update.apps();
                this.clear();
                this.status = true;
            },
            clear: function () {
                this.name = '';
                this.address = '';
                this.desc = '';
            },
            status: false
        };

        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.newlink.clear();
            $scope.newlink.status = false;
        });


                }]);


}());