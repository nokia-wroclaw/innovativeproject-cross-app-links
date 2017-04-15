import JSONData from '../services/JSONData';
import User from '../services/user';

export default class Link{
    
    private name: string;
    private address: string;
    private desc: string;
    private status: boolean;
    
    static $inject: Array<string> = ['JSONData','$location', 'current_user']
    
    constructor(private JSONData: JSONData, private $location: ng.ILocationService, private current_user: User){
        this.name = '';
        this.address = '';
        this.desc = '';   
        this.status = false;
    }
    
    add(): ng.IPromise<any>{
        const post= {
            name: this.name,
            link: this.address,
            desc: this.desc,
            creator_id: this.current_user.id
        }
        return this.JSONData.post('app', post);
    }
    
    update(app_id): ng.IPromise<any> {
        const put = {
            name: this.name,
            link: this.address,
            desc: this.desc
        }    
        return this.JSONData
                    .put('app', put, app_id)
                    .then(()=>{
                        this.clear();
                        this.status = true;
                        this.$location.path('/links').replace();
                });
    }
    
    delete(app_id): ng.IPromise<any> {
        const confirmResult = confirm("Do you want to remove this app?");
        if (confirmResult)
            return this.JSONData.drop('app', app_id);
    }
    
    fill(name: string, address: string, desc: string): void{
        this.name = name;
        this.address = address;
        this.desc = desc   
    }
    
    clear(): void {
        this.name = '';
        this.address = '';
        this.desc = '';   
    }
}