import Restful from '../services/restful'; 
import User from '../services/user'; 

export default class JSONData {
   
    private apps: Array<Object>;
    private users: Array<Object>;
    private groups: Array<Object>;
    private logs: Array<Object>;
    
    static $inject: Array<string> = ['restful','current_user'];
    
    constructor(public restful: Restful,  public current_user: User){
        var data = this;
        data.updateAll();
    
    }
    updateAll():void{
        var data = this;
        data.update('app');
        data.update('user');
        data.update('log');
        data.update('group');
    }

    update(table: string): void{
        var data = this;
        data.restful.request('GET', table).then(function(response){
            var jsondata = response['objects'];
            switch(table){
                case 'app': data.apps = jsondata; break;
                case 'user': data.users = jsondata; break;
                case 'log': data.logs = jsondata; break;
                case 'group': data.groups = jsondata; break;
            }
        });
    }
}
