import Restful from '../services/restful'; 

export default class User{
    
    id: number;
    email: string;
    username: string;
    group: Array<Object>;
    logs: Array<Object>;
    applications: Array<Object>;
    
    static $inject: ['restful'];
    
    constructor(private restful: Restful){
        var cuser = this;     
        cuser.restful.request('GET', 'me/user').then(function(response){
            var user = response['objects'][0];
            
            cuser.id = user.id;
            cuser.email = user.email;
            cuser.username = user.username;
            cuser.group = user.group;
            cuser.logs = user.logs;
            cuser.applications = user.applications;
            
        });          
    } 
}
