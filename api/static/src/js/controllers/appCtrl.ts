import Clock from '../models/clock';
import Limit from '../models/limit';
import Menu from '../services/menu';

export default class appCtrl{
    private limit : Limit;
    private clock : Clock;
    
    static $inject: Array<string> = ['menu', '$interval'];
    
    constructor(private $interval: ng.IIntervalService, private menu: Menu){
        
        var app = this; 
        app.limit = new Limit();
        app.clock = new Clock();
        
        /*
        app.$interval is not a function error
     
        app.$interval(function(){
           app.clock.update();
        }, 30000); 
        */
    }
}
 