import Menu from './services/menu';
import Link from './services/link';
import User from './services/user';
import Restful from './services/restful';
import JSONData from './services/JSONData';

import appCtrl from './controllers/appCtrl';
import dataCtrl from './controllers/dataCtrl';

import RouteConfig from './config/route'

const angular = require('angular');

import 'jquery';
import 'ng-scrollbars';
import 'angular-route';


const app = angular.module('mainApp', ['ngRoute', 'ngScrollbars']);


app
    .service('menu', Menu)
    .service('link', Link)
    .service('restful', Restful)
    .service('current_user', User)
    .service('JSONData', JSONData)
    .controller('dataCtrl', dataCtrl)
    .controller('appCtrl', appCtrl)
    .config('RouteConfig', RouteConfig);
    