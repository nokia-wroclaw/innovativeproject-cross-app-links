import Link from '../services/link'; 

export default class manageCtrl{
    

    static $inject: Array<string> = ['link']
    constructor(private link: Link){}
    
   
    
    /*
     $scope.newlink = {
            name: '',
            address: '',
            desc: '',
            manageFill: function (name, link, desc) {
                this.name = name;
                this.address = link;
                this.desc = desc;
            },
            add: function () {
                var post_object = {
                    name: this.name,
                    link: this.address,
                    desc: this.desc,
                    creator_id: $scope.current_user.id
                }
                restful.post('app', post_object);
                update.apps();
                this.clear();
                this.status = true;
            },
            update: function (app_id) {
                var post_object = {
                    name: this.name,
                    link: this.address,
                    desc: this.desc,
                }
                restful.update('app', app_id, post_object).then(function (response) {
                    var log_object = {
                        content: 'A link #' + app_id + ' was updated',
                        data_time: 'CURRENT_TIMESTAMP',
                        author_id: $scope.current_user.id
                    }
                    restful.post('log', log_object);
                });

                update.apps();
                update.logs();
                this.clear();
                this.status = true;
                $location.path('/links').replace();
            },
            delete: function (app_id) {
                var confirmResult = confirm("Do you want to remove this app?");
                if (confirmResult) {
                    restful.delete("app", app_id).then(function (response) {
                        var log_object = {
                            content: 'A link #' + app_id + ' was removed',
                            data_time: 'CURRENT_TIMESTAMP',
                            author_id: $scope.current_user.id
                        }
                        restful.post("log", log_object);
                    });
                    update.apps();
                    update.logs();
                }
            },
            clear: function () {
                this.name = '';
                this.address = '';
                this.desc = '';
            },
            status: false
        };

    */
}