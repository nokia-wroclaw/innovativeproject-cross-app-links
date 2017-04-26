(function () {
    var app = angular.module('mainApp', ['ngRoute', 'config', 'ngScrollbars', 'services', 'directives', 'chart.js', 'angularFileUpload']);
    app.controller('mainCtrl', ['$scope', 'restful', '$location', '$routeParams', '$interval', 'FileUploader', function ($scope, restful, $location, $routeParams, $interval, FileUploader) {

        $scope.redirectToDash = function () {
            $location.path('/dashboard');
        }

        /*Limits for lists*/
        $scope.limit = {
            users: 5,
            group: 3,
            log: 5
        }

        /*Menu elements*/
        $scope.menu = {
            status: true,
            hide: function () {
                this.status = !this.status;
            },
            location: function () {
                return $location.path().replace(/\//g, '').replace(/\-/g, ' ');
            },
            active: function () {

            }

        };
        /*Filter apps by params in a route*/
        $scope.filterParams = {
            manage: function () {
                if ($routeParams.siteID)
                    return parseInt($routeParams.siteID);
                else return '';
            }
        };
        /*Get data model*/
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
            notes: function () {
                restful.get('Note').then(function (response) {
                    $scope.notes = response['objects'];
                });
            },
            all: function () {
                this.me();
                this.apps();
                this.users();
                this.groups();
                this.logs();
                this.notes();
            }

        };
        update.all();

        /*Dashboard clock*/
        $scope.clockDate = {
            setup: new Date(),
            time: function () {
                if (this.setup.getMinutes() < 10)
                    return this.setup.getHours() > 9 ? this.setup.getHours() + ':0' + this.setup.getMinutes() : '0' + this.setup.getHours() + ':0' + this.setup.getMinutes();
                else
                    return this.setup.getHours() > 9 ? this.setup.getHours() + ':' + this.setup.getMinutes() : '0' + this.setup.getHours() + ':'
                this.setup.getMinutes();
            },
            date: function () {
                return this.setup.getTime();
            },
            update: function () {
                this.setup = new Date();
            }
        };

        /*Refresh clock every 30s*/
        $interval(function () {
            $scope.clockDate.update()
        }, 3000)

        /*Applications methods*/

        $scope.newlink = {
            uploader: new FileUploader({
                url: 'api/upload',
                formData: []
            }),
            name: '',
            address: '',
            desc: '',
            img_link: '',
            order_id: '',
            manageFill: function (name, link, desc, img_link, order_id) {
                this.name = name;
                this.address = link;
                this.desc = desc;
                this.img_link = img_link;
                this.order_id = order_id;
            },
            add: function () {
                var img_link = $scope.clockDate.date();
                this.uploader.onBeforeUploadItem = function (item) {
                    item.formData.push({
                        filename: img_link
                    });
                }
                this.uploader.uploadAll();
                this.uploader.clearQueue();
                var post_object = {
                    name: this.name,
                    link: this.address,
                    desc: this.desc,
                    creator_id: $scope.current_user.id,
                    img_link: img_link,
                    date: 'CURRENT_TIMESTAMP'
                }
                restful.post('app', post_object).then(function (response) {
                    update.apps();
                });

                this.clear();
                this.status = true;
            },
            update: function (app_id) {
                if (this.uploader.queue.length > 0) {
                    this.img_link = $scope.clockDate.date();
                }
                var img_link = this.img_link;
                this.uploader.onBeforeUploadItem = function (item) {
                    item.formData.push({
                        filename: img_link
                    });
                }
                this.uploader.uploadAll();
                this.uploader.clearQueue();
                var post_object = {
                    name: this.name,
                    link: this.address,
                    desc: this.desc,
                    img_link: img_link,
                    order_id: this.order_id
                }
                restful.update('app', app_id, post_object).then(function (response) {
                    var log_object = {
                        content: 'A link #' + app_id + ' was updated',
                        data_time: 'CURRENT_TIMESTAMP',
                        author_id: $scope.current_user.id
                    }
                    restful.post('log', log_object);
                    update.apps();
                    update.logs();
                });


                this.clear();
                this.status = true;
                $location.path('/links').replace();
            },

            hide: function (app_id, app_status) {
                var confirmResult = confirm("Do you want to change visibility of this app?");
                if (confirmResult) {

                    var hide = {
                        status: !app_status

                    }
                    restful.update('app', app_id, hide).then(function (response) {
                        var log_object = {
                            content: 'A link #' + app_id + ' was updated',
                            data_time: 'CURRENT_TIMESTAMP',
                            author_id: $scope.current_user.id
                        }
                        restful.post('log', log_object);
                        update.apps();
                        update.logs();
                    });

                };
            },

            delete: function (app_id) {
                var confirmResult = confirm("Do you want to remove this app?");
                if (confirmResult) {
                    restful.delete("app", app_id).then(function (response) {
                        var log_object = {
                            content: 'A link #' + app_id + ' was removed',
                            data_time: 'CURRENT_TIMESTAMP',
                            author_id: $scope.current_user.id
                        }
                        restful.post("log", log_object);
                        update.apps();
                        update.logs();
                    });

                }
            },
            clear: function () {
                this.name = '';
                this.address = '';
                this.desc = '';
            },
            status: false
        };

        $scope.note = {

            content: '',
            tag: '',

            add: function () {
                var post_note = {
                    content: this.content,
                    tag: this.tag,
                    owner_id: $scope.current_user.id,
                    date: 'CURRENT_TIMESTAMP'
                }
                restful.post('Note', post_note).then(function (response) {
                    update.notes();
                });
                this.clear();
            },
            clear: function () {
                this.content = '';
                this.tag = '';
            }
        };

        $scope.orderArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        /*
        If you use some variables in a couple places you probably 
        want to reset them when you leave a page. That's why you should put
        those variables/functions below.
        */
        $scope.$on('$routeChangeStart', function (next, current) {
            $scope.newlink.clear();
            $scope.newlink.status = false;
            $scope.searchBy = '';

        });

        /*Popup model functions*/
        $scope.popup = {
            edit: {
                close: function () {
                    $location.path('/links').replace();
                }
            }
        };
        /*Some elements should change with resolution so it's nice to include them*/
        var bootstrap_resolution = {
            resl: document.body.innerWidth,
            onchange: function () {

            }
            //1200
            //768
            //480
            //320
        };

        /*Stats chart settings and data*/

        $scope.stats = {
            users: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                series: ['Number of users'],
                data: [[3, 7, 2, 10, 6]]
            },
            invitations: {
                labels: ['Accepted', 'Unaccepted'],
                data: [17, 5]
            },
            apps: {
                labels: ['Yesterday', 'Today'],
                series: ['Registered', 'Beta'],
                data: [
                    [65, 59],
                    [28, 48]
                  ]
            },
            components: {
                labels: ['Usage'],
                series: ['Iframe', 'JSON', 'Polymer'],
                data: [
                    [17],
                    [3],
                    [7]
                  ]
            }
        }
        $scope.datasetOverride = [{
            yAxisID: 'y-axis-1'
        }, {
            yAxisID: 'y-axis-2'
            }];
        $scope.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    }
                        ]
            }
        };

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


                }]);


}());
