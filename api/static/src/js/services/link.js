"use strict";
exports.__esModule = true;
var Link = (function () {
    function Link(JSONData, $location, current_user) {
        this.JSONData = JSONData;
        this.$location = $location;
        this.current_user = current_user;
        this.name = '';
        this.address = '';
        this.desc = '';
        this.status = false;
    }
    Link.prototype.add = function () {
        var post = {
            name: this.name,
            link: this.address,
            desc: this.desc,
            creator_id: this.current_user.id
        };
        return this.JSONData.post('app', post);
    };
    Link.prototype.update = function (app_id) {
        var _this = this;
        var put = {
            name: this.name,
            link: this.address,
            desc: this.desc
        };
        return this.JSONData
            .put('app', put, app_id)
            .then(function () {
            _this.clear();
            _this.status = true;
            _this.$location.path('/links').replace();
        });
    };
    Link.prototype["delete"] = function (app_id) {
        var confirmResult = confirm("Do you want to remove this app?");
        if (confirmResult)
            return this.JSONData.drop('app', app_id);
    };
    Link.prototype.fill = function (name, address, desc) {
        this.name = name;
        this.address = address;
        this.desc = desc;
    };
    Link.prototype.clear = function () {
        this.name = '';
        this.address = '';
        this.desc = '';
    };
    return Link;
}());
Link.$inject = ['JSONData', '$location', 'current_user'];
exports["default"] = Link;
