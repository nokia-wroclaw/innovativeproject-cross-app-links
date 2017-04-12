export default class Menu{
    
    public status: boolean;
    static $inject: Array<string> = ['$location'];
    
    constructor(private $location: ng.ILocationService){}
    
    hide(): void{
        var menu = this;
        menu.status = !menu.status;
    } 
    location(): string{
      return this.$location.path().replace(/\//g, '').replace(/\-/g, ' ');
    }
}