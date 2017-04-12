export default class Restful{
    
    static $inject: Array<string> = ['$http']; 
    private url: string;
    
    constructor(private $http: ng.IHttpService){
        this.url = 'http://127.0.0.1:5000/api';
    }
    
    request(method: string, table: string, id?:any, dataobject?:Object): ng.IPromise<any>{
        id = id<0 ? '' : '/' + id;
        return this.$http({
            method : method, 
            url : this.url + '/' + table,
            data: dataobject || {},
            headers: {
                'Content-Type': 'application/json',  
                    }
            })
            .then(function (response) {
                return response.data;
            })
             .catch(function (error) {
                return error;
            });
    }
}
