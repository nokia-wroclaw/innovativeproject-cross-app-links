export default class Menu{
    
    public status: boolean;
    static $inject: Array<string> = ['$location'];
    
    constructor(private $location: ng.ILocationService){}
    
    hide(): void{
        this.status = !this.status;
    } 
    location(): string{
      return this.$location
                    .path()
                    .replace(/\//g, '')
                    .replace(/\-/g, ' ');
    }
}