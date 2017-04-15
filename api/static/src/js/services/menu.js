"use strict";
exports.__esModule = true;
var Menu = (function () {
    function Menu($location) {
        this.$location = $location;
    }
    Menu.prototype.hide = function () {
        this.status = !this.status;
    };
    Menu.prototype.location = function () {
        return this.$location
            .path()
            .replace(/\//g, '')
            .replace(/\-/g, ' ');
    };
    return Menu;
}());
Menu.$inject = ['$location'];
exports["default"] = Menu;
