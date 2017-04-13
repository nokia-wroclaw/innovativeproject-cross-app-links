export default class Restful{
    
    static $inject: Array<string> = ['$http']; 
    private url: string;
    
    constructor(private $http: ng.IHttpService){
        
        var restful = this;
        
        restful.url = '/api';
    }
    
    request(method: string, table: string, id?:any, dataobject?:Object): ng.IPromise<any>{
        
        var restful = this;
        
        id = id<0 ? '' : '/' + id;
        return restful.$http({
            method : method, 
            url : restful.url + '/' + table,
            data: dataobject || {},
            headers: {'Content-Type': 'application/json'}
        })
        .then(restful.RequestResponseSuccess)
        .catch(restful.RequestResponseError);
    }
    private RequestResponseSuccess(response: ng.IHttpPromiseCallback<Object>): Object{      
        return response.data;
    }
    private RequestResponseError(error: ng.IHttpPromiseCallback<any>): String{      
        return error.data;
    }
}
