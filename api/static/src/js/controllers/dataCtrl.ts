import Link from '../services/link';
import JSONData from '../services/JSONData';

export default class dataCtrl {
    
    static $inject: ['link','JSONData'];
    
    constructor(private link: Link, private JSONData: JSONData){
        
        var data = this;
       
    }
    
}
