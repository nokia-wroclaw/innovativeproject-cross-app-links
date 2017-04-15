"use strict";
exports.__esModule = true;
var clock_1 = require("../models/clock");
var limit_1 = require("../models/limit");
var appCtrl = (function () {
    function appCtrl($interval, menu) {
        this.$interval = $interval;
        this.menu = menu;
        var app = this;
        app.limit = new limit_1["default"]();
        app.clock = new clock_1["default"]();
        /*
        app.$interval is not a function error
     
        app.$interval(function(){
           app.clock.update();
        }, 30000);
        */
    }
    return appCtrl;
}());
appCtrl.$inject = ['menu', '$interval'];
exports["default"] = appCtrl;
