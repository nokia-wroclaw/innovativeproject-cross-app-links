(function () {

    var app = angular.module('services', []);

    app.service('restful', ['$http', function ($http) {

        var _get = function (table, row_id) {
            row_id = (row_id == undefined) ? '' : '/' + row_id
            var url = '/api/' + table + row_id;
            return $http.get(url, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function (response) {
                    return response.data;
                })
                .catch(function (error) {
                    return null;
                });
        };


        var _post = function (table, data) {
            var url = 'api/' + table;
            if (data)
                return $http.post(url, data, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function (response) {
                        return response.data;
                    })
                    .catch(function (error) {
                        return null;
                    });
        };




        var _update = function (table, row_id, data) {
            row_id = (row_id == undefined) ? false : '/' + row_id
            var url = '/api/' + table + row_id;
            if (data && row_id)
                return $http.put(url, data, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function (response) {
                        return response.data;
                    })
                    .catch(function (error) {
                        return null;
                    });
        };




        var _delete = function (table, row_id) {
            row_id = (row_id == undefined) ? false : '/' + row_id
            var url = '/api/' + table + row_id;
            if (row_id)
                return $http.delete(url, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function (response) {
                        return response.data;
                    })
                    .catch(function (error) {
                        return null;
                    });
        };

        var _login = function (data) {
            var url = 'api/auth';
            if (data)
                return $http.post(url, data, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function (response) {
                        return response.data;
                    })
                    .catch(function (error) {
                        return null;
                    });
        };
        var _logout = function () {
            var url = '/api/auth/logout';
            if (data)
                return $http.post(url, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function (response) {
                        return response.data;
                    })
                    .catch(function (error) {
                        return null;
                    });
        };



        return {
            get: _get,
            post: _post,
            update: _update,
            delete: _delete,
            login: _login,
            logout: _logout
        }

        }]);


})()