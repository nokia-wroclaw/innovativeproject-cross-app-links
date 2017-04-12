import JSONData from '../services/JSONData';

export default class Link{
    
    private name: string;
    private address: string;
    private desc: string;
    private status: boolean;
    
    static $inject: Array<string> = ['JSONData','$location']
    
    constructor(private JSONData: JSONData, private $location: ng.ILocationService){
        var link = this;
        link.name = '';
        link.address = '';
        link.desc = '';   
        link.status = false;
    }
    
    fill(name: string, address: string, desc: string): void{
        var link = this;
        link.name = name;
        link.address = address;
        link.desc = desc   
    }
    
    add(): void{
        var link = this;
        var post_object = {
            name: link.name,
            link: link.address,
            desc: link.desc,
            creator_id: link.JSONData.current_user.id
        }
        link.JSONData.restful.request('POST', 'app', null, post_object);
        link.JSONData.update('app');
    }
    update(app_id): void {
         var link = this;
            var post_object = {
                name: link.name,
                link: link.address,
                desc: link.desc
            }
           link.JSONData.restful.request('PUT', 'app', app_id, post_object).then(function(response){
                var log_object = {
                    content: 'A link #' + app_id + ' was updated',
                    data_time: 'CURRENT_TIMESTAMP',
                    author_id: link.JSONData.current_user.id
                }
                link.JSONData.restful.request('POST', 'log', null, log_object);
            });

            link.JSONData.update('app');
            link.JSONData.update('log');
            link.clear();
            link.status = true;
            link.$location.path('/links').replace();
    }
    delete(app_id): void {
        var link = this;
        var confirmResult = confirm("Do you want to remove this app?");
        if (confirmResult) {
            link.JSONData.restful.request('DELETE', 'app', app_id).then(function(response){
                var log_object = {
                    content: 'A link #' + app_id + ' was removed',
                    data_time: 'CURRENT_TIMESTAMP',
                    author_id: link.JSONData.current_user.id
                }
                 link.JSONData.restful.request('POST', 'log', null, log_object);
            });
            link.JSONData.update('app');
            link.JSONData.update('log');
        }
    }
    clear(): void {
        var link = this;
        link.name = '';
        link.address = '';
        link.desc = '';   
    }
}