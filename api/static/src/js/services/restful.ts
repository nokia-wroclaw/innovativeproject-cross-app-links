export default class Restful{
    
    static $inject: Array<string> = ['$http']; 
    private url: string;
    
    constructor(private $http: ng.IHttpService){    
        this.url = '/api';
    }
    
    request(method: string, table: string, id?:any, dataobject?:Object): ng.IPromise<any>{      
        id = id==undefined ? '' : '/' + id;
        return this.$http({
                        method : method, 
                        url : this.url + '/' + table + id,
                        data: dataobject || {},
                        headers: {'Content-Type': 'application/json'}
                    })
                    .then(()=>this.RequestResponseSuccess)
                    .catch(()=>this.RequestResponseError);
    }
    private RequestResponseSuccess(response: any): ng.IHttpPromiseCallback<Object>{      
        return response.data;
    }
    private RequestResponseError(error: any): ng.IHttpPromiseCallback<any>{      
        return error.data;
    }
}
