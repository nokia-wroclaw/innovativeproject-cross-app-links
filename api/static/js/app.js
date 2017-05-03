(function () {
    var app = angular.module('mainApp', ['ngRoute', 'config', 'ngScrollbars', 'services', 'directives', 'chart.js', 'angularFileUpload']);
    app.controller('mainCtrl', ['$scope', 'restful', '$location', '$route', '$routeParams', '$interval', 'FileUploader', '$http', '$document', '$filter', function ($scope, restful, $location, $route, $routeParams, $interval, FileUploader, $http, $document, $filter) {

        /*Append loading page druing data fetching*/
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
        $scope.$on('$viewContentLoaded', function () {
            loadingPage.ready();
        });


        /*Change route to dashboard*/
        $scope.redirectToDash = function () {
            $location.path('/dashboard');
        };

        /*Limits for lists*/
        $scope.limit = {
            users: 5,
            group: 3,
            log: 5,
            components: 5
        };

        /*Menu elements*/
        $scope.menu = {
            status: true,
            hide: function () {
                this.status = !this.status;
            },
            active: function (url) {
                if (url.indexOf(':siteID') === -1) {
                    var arr = angular.element('#navigation a').removeClass('active-li');
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].href.indexOf(url) !== -1)
                            var active = arr[i];
                    }
                    active.className += ' active-li';
                }
            }
        };
        /*Init stats objects*/
        $scope.stats = {
            apps: {},
            users: {},
            components: {},
            logs: {}
        }

        /*Filter apps by params in a route*/
        $scope.filterParams = {
            manage: function () {
                if ($routeParams.siteID)
                    return parseInt($routeParams.siteID);
                else return '';
            }
        };

        var generateWeekStats = function (array) {
            var today = new Date;
            var week = [];
            week.push($filter('date')(today, 'MM/dd/yyyy'));
            var count = [0, 0, 0, 0, 0];
            for (var i = 0; i < 4; i++) {
                today.setDate(today.getDate() - 1);
                week.push($filter('date')(today, 'MM/dd/yyyy'));
            }
            week.reverse();
            for (var i = 0; i < array.length; i++) {
                var day = $filter('date')(new Date(array[i].date.replace(' ', 'T')), 'MM/dd/yyyy');
                var foundAt = week.indexOf(day);
                if (foundAt !== -1)
                    count[foundAt] += 1;
            }
            return {
                week: week,
                count: count
            }
        }

        var generateTwoDaysStats = function (array) {
            var date = new Date;
            var today = $filter('date')(date, 'MM/dd/yyyy')
            var yesterday = $filter('date')(date.setDate(date.getDate() - 1), 'MM/dd/yyyy')
            var days = [today, yesterday];
            var count = [0, 0];
            for (var i = 0; i < array.length; i++) {
                var day = $filter('date')(new Date(array[i].date.replace(' ', 'T')), 'MM/dd/yyyy');
                var foundAt = days.indexOf(day);
                if (foundAt !== -1)
                    count[foundAt] += 1;
            }
            return {
                count: count.reverse()
            }
        };

        var generateTripleDataStats = function (array) {
            var date = new Date;
            var today = $filter('date')(date, 'MM/dd/yyyy');
            var count = {
                'drop': 0,
                'edit': 0
            };
            for (var i = 0; i < array.length; i++) {
                var day = $filter('date')(new Date(array[i].date.replace(' ', 'T')), 'MM/dd/yyyy');
                if (today == day)
                    if (array[i].content.indexOf('updated') !== -1)
                        count.edit += 1;
                    else
                        count.drop += 1;
            }
            return count;
        }


        /*Get data model*/
        var update = {
            me: function () {
                restful.get('me/user').then(function (response) {
                    $scope.current_user = response['objects'][0];
                });
            },
            apps: function () {
                restful.get('app').then(function (response) {
                    var apps = $scope.apps = response['objects'];
                    $scope.stats.apps = {
                        labels: generateWeekStats(apps).week,
                        series: ['Applications created'],
                        data: [generateWeekStats(apps).count]
                    }
                });
            },
            users: function () {
                restful.get('user').then(function (response) {
                    var users = $scope.users = response['objects'];
                    $scope.stats.users = {
                        labels: ['Yesterday', 'Today'],
                        series: ['Registered'],
                        data: [generateTwoDaysStats(users).count]
                    }
                });
            },
            groups: function () {
                restful.get('group').then(function (response) {
                    $scope.groups = response['objects'];
                });
            },
            logs: function () {
                restful.get('log').then(function (response) {
                    var logs = $scope.logs = response['objects'];
                    $scope.logs.todaysAct = generateTripleDataStats(logs).edit + generateTripleDataStats(logs).drop;
                    $scope.stats.logs = {
                        labels: ['Activity'],
                        series: ['Updates', 'Deletions'],
                        data: [
                    [generateTripleDataStats(logs).edit],
                    [generateTripleDataStats(logs).drop]
                  ]
                    }
                });
            },
            notes: function () {
                restful.get('note').then(function (response) {
                    $scope.notes = response['objects'];
                });
            },
            components: function () {
                restful.get('component').then(function (response) {
                    $scope.components = response['objects'];
                });
            },
            all: function () {
                this.me();
                this.apps();
                this.users();
                this.groups();
                this.logs();
                this.notes();
                this.components();
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
                    return this.setup.getHours() > 9 ? this.setup.getHours() + ':' + this.setup.getMinutes() : '0' + this.setup.getHours() + ':' + this.setup.getMinutes();
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
        }, 30000)

        /*Applications methods*/
        $scope.newlink = {
            uploader: new FileUploader({
                url: 'api/upload/img',
                formData: []
                removeAfterUpload: true,
                withCredentials: true,
                queueLimit: 1
            }),
            name: '',
            address: '',
            desc: '',
            img_link: '',
            order_id: '',
            beta: null,
            manageFill: function (name, link, desc, img_link, order_id, beta) {
                this.name = name;
                this.address = link;
                this.desc = desc;
                this.img_link = img_link;
                this.order_id = order_id;
                this.beta = beta;
            },
            add: function () {
                var img_link = $scope.clockDate.date();
                this.uploader.onBeforeUploadItem = function (item) {
                    item.formData.push({
                        filename: img_link
                    });
                }
                this.uploader.uploadItem(0);
                this.uploader.onSuccessItem = (item, response, status, headers) => {
                    var post_object = {
                        name: this.name,
                        link: this.address,
                        desc: this.desc,
                        creator_id: $scope.current_user.id,
                        img_link: img_link,
                    }
                    restful.post('app', post_object).then(function () {
                        update.apps();
                    });
                    this.clear();
                    this.status = true;
                    this.uploader.clearQueue();
                };
                this.uploader.onErrorItem = function (item, response, status, headers) {
                    console.log('Uplaoder: Error callback');
                    console.log(item);
                    console.log(response);
                    console.log(headers);
                };

                this.uploader.onCancelItem = function (item, response, status, headers) {
                    console.log('Uploader: Cancel callback');
                    console.log(item);
                    console.log(response);
                    console.log(headers);
                };

            },
            update: function (app_id) {
                if (this.uploader.queue.length > 0) {
                    this.img_link = new Date();
                    this.img_link = this.img_link.getTime();
                    this.uploader.onBeforeUploadItem = (item) => {
                        item.formData.push({
                            filename: this.img_link
                        });
                    }
                    this.uploader.uploadAll();
                    this.uploader.onSuccessItem = (item, response, status, headers) => {
                        console.log('Uploader: Success callback');
                        this.uploader.clearQueue();
                    }
                    this.uploader.onErrorItem = (item, response, status, headers) => {
                        //Add information for img uplaod error in DOM (html)
                        console.log('Uplaoder: Error callback');
                        console.log(item);
                        console.log(response);
                        console.log(headers);
                    };
                    this.uploader.onCancelItem = (item, response, status, headers) => {
                        //Add information for img uplaod error in DOM (html)
                        console.log('Uploader: Cancel callback');
                        console.log(item);
                        console.log(response);
                        console.log(headers);
                    };
                }
                var post_object = {
                    name: this.name,
                    link: this.address,
                    desc: this.desc,
                    img_link: this.img_link,
                    order_id: this.order_id,
                    beta: this.beta,
                }
                restful.update('app', app_id, post_object).then(function () {
                    var log_object = {
                        content: 'A link #' + app_id + ' was updated',
                        author_id: $scope.current_user.id
                    }
                    update.apps();
                    restful.post('log', log_object).then(function () {
                        update.logs();
                    });
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
                    restful.update('app', app_id, hide).then(function () {
                        var log_object = {
                            content: 'A link #' + app_id + ' was updated',
                            author_id: $scope.current_user.id
                        }
                        update.apps();
                        restful.post('log', log_object).then(function () {
                            update.logs();
                        });
                    });
                }
            },
            delete: function (app_id) {
                var confirmResult = confirm("Do you want to remove this app?");
                if (confirmResult) {
                    restful.delete("app", app_id).then(function () {
                        var log_object = {
                            content: 'A link #' + app_id + ' was removed',
                            author_id: $scope.current_user.id
                        }
                        update.apps();
                        restful.post('log', log_object).then(function () {
                            update.logs();
                        });
                    });
                }
            },
            clear: function () {
                this.name = '';
                this.address = '';
                this.desc = '';
            },
            status: false
        }; <<

        $scope.user_inf = {
            uploader: new FileUploader({
                url: 'api/upload/avatar',
                formData: []
            }),
            manageFill(username, email) {
                this.username = username;
                this.email = email;
            },
            img_update: function () {
                if (this.uploader.queue.length > 0) {
                    this.uploader.uploadAll();
                    this.uploader.clearQueue();
                    window.location.reload();
                }
            },
            user_update: function () {
                var username = this.username;
                var email = this.email;
                var password = this.password;

                restful.post('auth/checkpass', {
                    pass: this.current_pass
                }).then(function (response) {
                    console.log(response);
                    if (response == 'True') {
                        var user_info = {
                            username: username,
                            email: email,
                        }
                        restful.update('user', $scope.current_user.id, user_info).then(function (response) {
                            update.me();
                        });
                    }
                });

            }
        };

        $scope.note = {
            content: '',
            tag: '',
            add: function () {
                var post_note = {
                    content: this.content,
                    tag: this.tag,
                    owner_id: $scope.current_user.id,
                }
                restful.post('note', post_note).then(function () {
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
        $scope.$on('$routeChangeStart', function (current, next) {
            $scope.newlink.clear();
            $scope.newlink.status = false;
            $scope.searchBy = '';
            $scope.menu.active(next.originalPath);

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
            onchange: function () {}
            //1200
            //768
            //480
            //320
        };

        /*Stats chart settings*/

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
