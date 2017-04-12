import Link from '../services/link'; 

export default class manageCtrl{
    

    static $inject: Array<string> = ['link']
    constructor(private link: Link){}
    
}