(function () {
    var app = angular.module('mainApp', ['ngRoute', 'config', 'ngScrollbars', 'services', 'directives', 'chart.js', 'angularFileUpload']);
    app.controller('mainCtrl', ['$scope', 'restful', '$location', '$route', '$routeParams', '$interval', 'FileUploader', '$http', '$document', '$filter', function ($scope, restful, $location, $route, $routeParams, $interval, FileUploader, $http, $document, $filter) {
        /*Some globals*/
        $scope.todayDateTime = new Date;
        $scope.navigation = {
            usernav: false
        };
        $scope.actionDataInProgress = false;
        $scope.statusBarBoolean = false;
        $scope.statusRequestTrue = function () {
            $scope.actionDataInProgress = false;
            $scope.statusBarBoolean = true;
        }

        /*Append loading page druing data fetching*/
        var loadingPage = {
            ready: function () {
                angular.element('#loading .text').innerHTML = 'Fetching data...';
                var interval = $interval(function () {
                    if ($http.pendingRequests < 1) {
                        angular.element('#loading').addClass('hidden');
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
            components: 5,
            invites: 5
        };

        /*Menu elements*/
        $scope.menu = {
            status: true,
            rspl: function () {
                if (window.innerWidth <= 768)
                    this.status = false;
            },
            hide: function () {
                this.status = !this.status;
            },
            active: function (url) {
                this.rspl();
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
            invitations: {},
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
                restful.get('me/user').then((response) => {
                    $scope.current_user = response['objects'][0];
                    restful.get('component_user?q={"filters":[{"name":"email","op":"eq","val":"'+$scope.current_user.email+'"}]}')
                            .then((response)=>{
                                $scope.isComponentUser = response['objects'][0] ? true : false;
                                console.log($scope.isComponentUser);
                                if($scope.isComponentUser){
                                    $scope.current_user.token = response['objects'][0].token;
                                    $scope.current_user.component_user_id = response['objects'][0].id;
                                    console.log($scope.current_user);
                                    $scope.actionDataInProgress = false;
                                }
                            })

                });
            },
            apps: function () {
                restful.get('app').then((response) => {
                    var apps = $scope.apps = response['objects'];
                    $scope.stats.apps = {
                        labels: generateWeekStats(apps).week,
                        series: ['Applications created'],
                        data: [generateWeekStats(apps).count]
                    }
                });
            },
            users: function () {
                restful.get('user').then((response) => {
                    var users = $scope.users = response['objects'];
                    $scope.stats.users = {
                        labels: ['Yesterday', 'Today'],
                        series: ['Registered'],
                        data: [generateTwoDaysStats(users).count]
                    }
                });
            },
            groups: function () {
                restful.get('group').then((response) => {
                    $scope.groups = response['objects'];
                });
            },
            logs: function () {
                restful.get('log').then((response) => {
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
                restful.get('note').then((response) => {
                    $scope.notes = response['objects'];
                });
            },
            invites: function () {
                restful.get('invite').then((response) => {
                    var invites = $scope.invites = response['objects'];
                    $scope.stats.invitations = {
                        labels: ["Accepted", "Pending"],
                        data: [
                           $filter('filter')(invites, {
                                active: false
                            }).length,
                            $filter('filter')(invites, {
                                active: true
                            }).length
                        ]
                    }
                });
            },
            components: function () {
                restful.get('component').then((response) => {
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
                this.invites();
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

        /*Managing of webpage datas*/

        $scope.newlink = {
            uploader: new FileUploader({
                url: 'api/upload/img',
                formData: [],
                filters: [],
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
            add: function (apps) {
                var app = $filter('filter')(apps, {
                    link: this.address
                });
                if (app.length == 0) {
                    if (this.uploader.queue.length > 0) {
                        $scope.actionDataInProgress = true;
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
                            restful.post('app', post_object).then(() => {
                                update.apps();
                                this.clear();
                                this.uploader.clearQueue();
                                $scope.statusRequestTrue();
                            });
                        };
                        this.uploader.onErrorItem = function (item, response, status, headers) {
                            $scope.actionDataInProgress = false;
                        };

                        this.uploader.onCancelItem = function (item, response, status, headers) {
                            $scope.actionDataInProgress = false;
                        };
                    } else this.error.noUpload = true;
                } else this.error.noUnique = true
            },
            update: function (app_id, apps) {
                var app = $filter('filter')(apps, {
                    link: this.address
                });
                if (!app.length || app[0].id == app_id) {
                    $scope.actionDataInProgress = true;
                    if (this.uploader.queue.length > 0) {
                        var old_img_link = this.img_link;
                        this.img_link = new Date();
                        this.img_link = this.img_link.getTime();
                        this.uploader.onBeforeUploadItem = (item) => {
                            item.formData.push({
                                filename: this.img_link
                            });
                            item.formData.push({
                                deleteFile: old_img_link
                            });
                        }
                        this.uploader.uploadAll();
                        this.uploader.onSuccessItem = (item, response, status, headers) => {};
                        this.uploader.onErrorItem = (item, response, status, headers) => {
                            $scope.actionDataInProgress = false;
                        };
                        this.uploader.onCancelItem = (item, response, status, headers) => {};
                    }
                    var post_object = {
                        name: this.name,
                        link: this.address,
                        desc: this.desc,
                        img_link: this.img_link,
                        order_id: this.order_id,
                        beta: this.beta,
                    }
                    restful.update('app', app_id, post_object).then(() => {
                        var log_object = {
                            content: 'A link #' + app_id + ' was updated',
                            author_id: $scope.current_user.id
                        }
                        update.apps();
                        restful.post('log', log_object).then(() => {
                            update.logs();
                            $scope.actionDataInProgress = false;
                        });
                    });
                    this.clear();
                    $location.path('/links').replace();
                }
                this.error.noUnique = true;
            },
            hide: function (app_id, app_status) {
                var confirmResult = confirm("Do you want to change visibility of this app?");
                if (confirmResult) {
                    $scope.actionDataInProgress = true;
                    var hide = {
                        status: !app_status
                    }
                    restful.update('app', app_id, hide).then(() => {
                        var log_object = {
                            content: 'A link #' + app_id + ' was updated',
                            author_id: $scope.current_user.id
                        }
                        update.apps();
                        restful.post('log', log_object).then(() => {
                            update.logs();
                            $scope.actionDataInProgress = false;
                        });
                    });
                }
            },
            delete: function (app_id, app_img) {
                var confirmResult = confirm("Do you want to remove this app?");
                if (confirmResult) {
                    $scope.actionDataInProgress = true;
                    restful.delete('app', app_id).then(() => {
                        restful.post('remove-file-on-drop', {
                            filename: app_img
                        }).then((response) => {});
                        var log_object = {
                            content: 'A link #' + app_id + ' was removed',
                            author_id: $scope.current_user.id
                        }
                        update.apps();
                        restful.post('log', log_object).then(() => {
                            update.logs();
                            $scope.actionDataInProgress = false;
                        });
                    });
                }
            },
            clear: function () {
                this.name = '';
                this.address = '';
                this.desc = '';
            },
            error: {
                noUpload: false,
                noImgFile: false,
                noUnique: false,
                clear: function () {
                    this.noUpload = false;
                    this.noImgFile = false;
                    this.noUnique = false;
                }
            }
        };
        $scope.user_inf = {
            uploader: new FileUploader({
                url: 'api/upload/avatar',
                formData: []
            }),
            username: '',
            email: '',
            password: '',
            pass_verify: '',
            current_pass: '',
            manageFill(username, email) {
                this.username = username;
                this.email = email;
            },
            img_update: function () {
                if (this.uploader.queue.length > 0) {
                    $scope.actionDataInProgress = true;
                    this.uploader.uploadAll();
                    restful.update('user', $scope.current_user.id, {
                        avatar_url: 'avatar_' + $scope.current_user.id
                    }).then((response) => {
                        this.uploader.clearQueue();
                        window.location.reload();
                    });
                }
            },
            user_update: function () {
                if (this.password == null || this.password == this.pass_verify) {
                    $scope.actionDataInProgress = true;
                    restful.post('auth/checkpass', {
                        pass: this.current_pass
                    }).then((response) => {
                        if (response == 'True') {
                            var user_info = {
                                username: this.username,
                                email: this.email,
                            }
                            restful.update('user', $scope.current_user.id, user_info).then((response) => {
                                update.me();
                                this.clear();
                                $scope.statusRequestTrue();
                            });
                            if (this.pass_verify.length > 0 && this.password.length >0 && this.password == this.pass_verify){
                                restful.post('auth/changepass', {
                                    newpass: this.password
                                }).then(() => {
                                    window.location.reload();
                                })
                            }
                        } else{
                            $scope.actionDataInProgress = false;
                            $scope.userFormWrongPass = true;
                        }
                    });
                }
            },
            becomeComponentUser: function(email){
                $scope.actionDataInProgress = true;
                var token = Math.floor((Math.random() * 999999) + 1);

                var ComponentUserObj = {
                    email: email,
                    token: token
                }

                restful.post('component_user', ComponentUserObj)
                        .then((response)=>{
                            console.log(response);
                            update.me();
                        });
            },
            clear: function () {
                this.password = '';
                this.current_pass = '';
                this.pass_verify = '';
            }

        };
        $scope.note = {
            content: '',
            tag: '',
            add: function () {
                $scope.actionDataInProgress = true;
                var post_note = {
                    content: this.content,
                    tag: this.tag,
                    owner_id: $scope.current_user.id,
                }
                restful.post('note', post_note).then(() => {
                    $scope.actionDataInProgress = false;
                    update.notes();
                });
                this.clear();
            },
            clear: function () {
                this.content = '';
                this.tag = '';
            }
        };
        $scope.invite = {
            email: '',
            group: '',
            add: function (users, invites, senderemail) {
                var invite = $filter('filter')(invites, {
                    email: this.email
                })[0];
                var user = $filter('filter')(users, {
                    email: this.email
                })[0];
                var inviteEmail = this.email;
                if (!user && (!invite || !invite.active)) {
                    $scope.actionDataInProgress = true;
                    var post_object = {
                        email: this.email,
                        maker: $scope.current_user.id,
                        group: this.group
                    };
                    restful.post('invite', post_object).then(() => {
                        update.invites();
                        restful.post('sendinvite', {
                            email: inviteEmail,
                            sender: senderemail
                        }).then(() => {
                            $scope.statusRequestTrue();
                        });
                    });
                    this.clear();
                    this.status = true;
                }
            },
            delete: function (invite_id) {
                var confirmResult = confirm("Do you want to remove this ivnitation?");
                if (confirmResult) {
                    $scope.actionDataInProgress = true;
                    restful.delete("invite", invite_id).then(() => {
                        var log_object = {
                            content: 'An invitation #' + invite_id + ' was sent',
                            author_id: $scope.current_user.id
                        }
                        update.invites();
                        restful.post('log', log_object).then(() => {
                            update.logs();
                            $scope.actionDataInProgress = false;
                        });
                    });
                }
            },
            deleteUser: function (me, users, removeEmail) {
                var user = $filter('filter')(users, {
                    email: removeEmail
                })[0];
                if (user)
                    $scope.actionDataInProgress = true;
                restful.delete('user', user.id).then(() => {
                    var log_object = {
                        content: 'An user #' + user.id + ' was removed',
                        author_id: $scope.current_user.id
                    }
                    restful.post('log', log_object).then(() => {
                        if (me == removeEmail) {
                            restful.logout().then(() => {
                                window.location.reload();
                            });
                        } else {
                            update.users();
                            update.logs();
                            $scope.actionDataInProgress = false;
                        }
                    });
                });
            },
            clear: function () {
                this.email = ''
                this.group = ''
            }
        };

        $scope.orderArray = function (app_length) {
            var app_count = new Array();
            for (i = 1; i < app_length + 1; i++) {
                app_count.push(i)
            }
            return app_count
        };
        /*
        If you use some variables in a couple places you probably
        want to reset them when you leave a page. That's why you should put
        those variables/functions below.
        */
        $scope.$on('$routeChangeStart', function (current, next) {
            $scope.newlink.clear();
            $scope.invite.clear();
            $scope.user_inf.clear();
            $scope.statusBarBoolean = false;
            $scope.searchBy = '';
            $scope.menu.active(next.originalPath);
            $scope.navigation.usernav = false;

        });

        /*Popup model functions*/
        $scope.popup = {
            edit: {
                close: function () {
                    $location.path('/links').replace();
                }
            }
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
