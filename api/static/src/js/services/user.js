"use strict";
exports.__esModule = true;
var User = (function () {
    function User(restful) {
        var _this = this;
        this.restful = restful;
        this.restful
            .request('GET', 'me/user')
            .then(function (response) {
            var user = response['objects'][0];
            _this.id = user.id;
            _this.email = user.email;
            _this.username = user.username;
            _this.group = user.group;
            _this.logs = user.logs;
            _this.applications = user.applications;
        });
    }
    return User;
}());
User.$inject = ['restful'];
exports["default"] = User;
