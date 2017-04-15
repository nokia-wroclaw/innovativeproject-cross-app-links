"use strict";
exports.__esModule = true;
var JSONData = (function () {
    function JSONData(restful, current_user) {
        this.restful = restful;
        this.current_user = current_user;
        this.updateAll();
    }
    JSONData.prototype.post = function (table, data) {
        var _this = this;
        return this.restful
            .request('POST', table, null, data)
            .then(function (response) {
            _this.update('app');
            _this.createLog('p', table);
        });
    };
    JSONData.prototype.put = function (table, data, el_id) {
        var _this = this;
        return this.restful
            .request('PUT', table, el_id, data)
            .then(function (response) {
            _this.update('app');
            _this.createLog('u', table, el_id);
        });
    };
    JSONData.prototype.drop = function (table, el_id) {
        var _this = this;
        return this.restful
            .request('DELETE', table, el_id, null)
            .then(function (response) {
            _this.update('app');
            _this.createLog('d', table, el_id);
        });
    };
    JSONData.prototype.createLog = function (method, table, el_id) {
        var _this = this;
        var content = '';
        switch (table) {
            case 'app':
                content = el_id != undefined ? 'A link #' + el_id : 'A link';
                break;
            case 'user':
                content = el_id != undefined ? 'An user #' + el_id : 'An user';
                break;
            case 'group':
                content = el_id != undefined ? 'A group #' + el_id : 'A group';
                break;
        }
        switch (method) {
            case 'p':
                content += ' was added';
                break;
            case 'u':
                content += ' was updated';
                break;
            case 'd':
                content += ' was removed';
                break;
        }
        var log = {
            content: content,
            datatime: 'CURRENT_TIMESTAMP',
            author_id: this.current_user.id
        };
        return this.restful
            .request('POST', 'log', null, log)
            .then(function (response) {
            return _this.update('log');
        });
    };
    JSONData.prototype.updateAll = function () {
        var _this = this;
        var toUpdate = ['app', 'user', 'log', 'group'];
        toUpdate
            .map(function (table) {
            return _this
                .update(table)
                .then(function (response) {
                return _this;
            });
        });
    };
    JSONData.prototype.update = function (table) {
        var _this = this;
        return this.restful
            .request('GET', table)
            .then(function (response) {
            var jsondata = response['objects'];
            switch (table) {
                case 'app':
                    _this.apps = jsondata;
                    break;
                case 'user':
                    _this.users = jsondata;
                    break;
                case 'log':
                    _this.logs = jsondata;
                    break;
                case 'group':
                    _this.groups = jsondata;
                    break;
            }
            return _this;
        })["catch"](function (error) {
            console.log(error.data);
        });
    };
    return JSONData;
}());
JSONData.$inject = ['restful', 'current_user'];
exports["default"] = JSONData;
