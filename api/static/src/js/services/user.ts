import Restful from '../services/restful'; 

export default class User{
    
    id: number;
    email: string;
    username: string;
    group: Array<Object>;
    logs: Array<Object>;
    applications: Array<Object>;
    
    static $inject: Array<String> = ['restful'];
    
    constructor(private restful: Restful){   
        this.restful
            .request('GET', 'me/user')
            .then((response)=>{
                const user = response['objects'][0];
                this.id = user.id;
                this.email = user.email;
                this.username = user.username;
                this.group = user.group;
                this.logs = user.logs;
                this.applications = user.applications;   
            });          
    } 
}
