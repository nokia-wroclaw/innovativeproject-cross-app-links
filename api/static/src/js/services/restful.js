"use strict";
exports.__esModule = true;
var Restful = (function () {
    function Restful($http) {
        this.$http = $http;
        this.url = '/api';
    }
    Restful.prototype.request = function (method, table, id, dataobject) {
        var _this = this;
        id = id == undefined ? '' : '/' + id;
        return this.$http({
            method: method,
            url: this.url + '/' + table + id,
            data: dataobject || {},
            headers: { 'Content-Type': 'application/json' }
        })
            .then(function () { return _this.RequestResponseSuccess; })["catch"](function () { return _this.RequestResponseError; });
    };
    Restful.prototype.RequestResponseSuccess = function (response) {
        return response.data;
    };
    Restful.prototype.RequestResponseError = function (error) {
        return error.data;
    };
    return Restful;
}());
Restful.$inject = ['$http'];
exports["default"] = Restful;
