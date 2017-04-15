import Menu from './services/menu';
import Link from './services/link';
import User from './services/user';
import Restful from './services/restful';
import JSONData from './services/JSONData';

import LinkValid from './directives/linkValid'

import appCtrl from './controllers/appCtrl';
import dataCtrl from './controllers/dataCtrl';

import RouteConfig from './config/route'

const angular = require('angular');

import 'jquery';
import 'jquery-mousewheel';
import 'malihu-custom-scrollbar-plugin';
import 'ng-scrollbars';
import 'angular-route';

const app = angular.module('mainApp', ['ngRoute', 'ngScrollbars']);


app 
    .config(RouteConfig)
    .service('menu', Menu)
    .service('link', Link)
    .service('restful', Restful)
    .service('current_user', User)
    .service('JSONData', JSONData)
    .directive('linkValid', LinkValid)
    .controller('dataCtrl', dataCtrl)
    .controller('appCtrl', appCtrl);
   
    