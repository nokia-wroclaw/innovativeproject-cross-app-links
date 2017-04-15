"use strict";
exports.__esModule = true;
var Clock = (function () {
    function Clock() {
        var clock = this;
        clock.setup = new Date();
    }
    Clock.prototype.time = function () {
        var clock = this;
        if (clock.setup.getMinutes() < 10)
            return clock.setup.getHours() > 9 ? clock.setup.getHours() + ':0' + clock.setup.getMinutes() : '0' + clock.setup.getHours() + ':0' + clock.setup.getMinutes();
        else
            return clock.setup.getHours() > 9 ? clock.setup.getHours() + ':' + clock.setup.getMinutes() : '0' + clock.setup.getHours() + ':' +
                clock.setup.getMinutes();
    };
    Clock.prototype.date = function () {
        var clock = this;
        return clock.setup.getTime();
    };
    Clock.prototype.update = function () {
        var clock = this;
        clock.setup = new Date();
    };
    return Clock;
}());
exports["default"] = Clock;
