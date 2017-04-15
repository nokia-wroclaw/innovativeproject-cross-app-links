import Restful from '../services/restful'; 
import User from '../services/user'; 

export default class JSONData {
   
    private apps: Array<Object>;
    private users: Array<Object>;
    private groups: Array<Object>;
    private logs: Array<Object>;
    
    static $inject: Array<string> = ['restful','current_user'];
    
    constructor(public restful: Restful,  public current_user: User){
        this.updateAll();
    
    }
    
    post(table: string, data: Object): ng.IPromise<any>{
        return this.restful
                    .request('POST', table, null, data)
                    .then((response)=>{
                        this.update('app');
                        this.createLog('p', table);
                    });    
    }
    
    put(table: string, data: Object, el_id: number): ng.IPromise<any>{
        return this.restful
                    .request('PUT', table, el_id, data)
                    .then((response)=>{
                        this.update('app');      
                        this.createLog('u', table, el_id);
                    });
    }
    
    drop(table: string, el_id: number): ng.IPromise<any>{
        return this.restful
                    .request('DELETE', table, el_id, null)
                    .then((response)=>{
                        this.update('app');
                        this.createLog('d', table, el_id);
                    });
    }
    
    createLog(method: string, table: string, el_id?: number): ng.IPromise<any>{
        let content = '';
        
        switch(table){
            case 'app': content = el_id != undefined ? 'A link #' +el_id : 'A link';break;
            case 'user': content = el_id != undefined ? 'An user #' +el_id : 'An user';break;
            case 'group': content = el_id != undefined ? 'A group #' +el_id : 'A group';break;
        }
        
        switch(method){
            case 'p': content += ' was added';break;
            case 'u': content += ' was updated';break;  
            case 'd': content += ' was removed';break;        
        }
        
        const log = {
            content: content,
            datatime: 'CURRENT_TIMESTAMP',
            author_id: this.current_user.id
        }    
        return this.restful
                    .request('POST', 'log', null, log)
                    .then((response)=>
                        this.update('log')
                    );
    }
    
    updateAll(): void{
        const toUpdate =['app', 'user', 'log','group'];
        toUpdate
            .map((table)=>
                this
                .update(table)
                .then((response)=>{
                    return this;
                })
            );
    }

    update(table: string): ng.IPromise<any>{
        return this.restful
                    .request('GET', table)
                    .then((response)=>{
                        const jsondata = response['objects'];
                        switch(table){
                            case 'app': this.apps = jsondata; break;
                            case 'user': this.users = jsondata; break;
                            case 'log': this.logs = jsondata; break;
                            case 'group': this.groups = jsondata; break;
                        }
                    return this;
                    })
                    .catch((error)=>{
                        console.log(error.data);
                    });
    }
}