(function () {
    var app = angular.module('mainApp', ['ngRoute', 'config', 'ngScrollbars', 'services']);
    app.controller('mainCtrl', ['$scope', 'restful', '$location', '$routeParams', '$interval', function ($scope, restful, $location, $routeParams, $interval) {
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
            me: function () {
                restful.get('me/user').then(function (response) {
                    $scope.current_user = response['objects'][0];
                });
            },
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
                this.me();
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
                if (this.setup.getMinutes() < 10)
                    return this.setup.getHours() > 9 ? this.setup.getHours() + ':0' + this.setup.getMinutes() : '0' + this.setup.getHours() + ':0' + this.setup.getMinutes();
                else
                    return this.setup.getHours() > 9 ? this.setup.getHours() + ':' + this.setup.getMinutes() : '0' + this.setup.getHours() + ':' + this.setup.getMinutes();
            },
            date: function () {
                return this.setup.getTime();
            },
            update: function () {
                this.setup = new Date();
            }
        }
        $interval(function () {
            $scope.clockDate.update()
        }, 3000)

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
                    creator_id: $scope.current_user.id
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