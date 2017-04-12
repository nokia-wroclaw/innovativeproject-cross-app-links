 export default class Clock{
    setup: Date;
     
    constructor(){
        var clock = this;
        clock.setup = new Date();
     }
     
    time(): string{
        var clock = this;
        if (clock.setup.getMinutes() < 10)
            return clock.setup.getHours() > 9 ? clock.setup.getHours() + ':0' + clock.setup.getMinutes() : '0' + clock.setup.getHours() + ':0' + clock.setup.getMinutes();
        else
            return clock.setup.getHours() > 9 ? clock.setup.getHours() + ':' + clock.setup.getMinutes() : '0' + clock.setup.getHours() + ':' +
            clock.setup.getMinutes();
    }
    date(): number {
        var clock = this;
        return clock.setup.getTime();
    }
    update(): void {
        var clock = this;
        clock.setup = new Date();
    }
 }
