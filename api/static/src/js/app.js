"use strict";
exports.__esModule = true;
var menu_1 = require("./services/menu");
var link_1 = require("./services/link");
var user_1 = require("./services/user");
var restful_1 = require("./services/restful");
var JSONData_1 = require("./services/JSONData");
var linkValid_1 = require("./directives/linkValid");
var appCtrl_1 = require("./controllers/appCtrl");
var dataCtrl_1 = require("./controllers/dataCtrl");
var route_1 = require("./config/route");
var angular = require('angular');
require("jquery");
require("jquery-mousewheel");
require("malihu-custom-scrollbar-plugin");
require("ng-scrollbars");
require("angular-route");
var app = angular.module('mainApp', ['ngRoute', 'ngScrollbars']);
app
    .config(route_1["default"])
    .service('menu', menu_1["default"])
    .service('link', link_1["default"])
    .service('restful', restful_1["default"])
    .service('current_user', user_1["default"])
    .service('JSONData', JSONData_1["default"])
    .directive(linkValid_1["default"])
    .controller('dataCtrl', dataCtrl_1["default"])
    .controller('appCtrl', appCtrl_1["default"]);
