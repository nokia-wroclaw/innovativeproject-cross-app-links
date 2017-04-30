(function(){
    Polymer({
            is: "web-component",
            behavior: ['ColorThief', 'Sortable'],
            properties: {
            },
            ready: function() {
                //Change for API request
                localStorage.setItem('databasePersonalToken', 'leksykonpwr');
                localStorage.setItem('email', 'bakowroc@gmail.com'); 
                this._getValuesRequest();
                this._retriveArray();
                //this._componentRequest();
            },
            _cachedToken: localStorage.getItem('cachedToken'),
            _getValuesRequest: function(){ 
                if(this._cachedToken!=null){
                    
                    this._loadSortable();
                    console.log('You are authorized');
                }else 
                    console.log('You are using component as an Anonymous');
            }, 
            _checkAccess: function(){
                if(this._cachedToken!=null)
                    return true;
                return false;
            },
            _retriveArray: function(){
                //Change for API request
                if(localStorage.getItem('cachedToken')){
                    this._pinArray = localStorage.getItem('pinString').split(',') || [];
                    this._orderArray = localStorage.getItem('orderString').split(',') || [];
                }
            },
            _pinArray: [],
            _pinAppTrigger: function(e){
                if(e.target.className.indexOf('beChanged') === -1)
                    e.target.className+=' beChanged';
                else e.target.className = e.target.className.replace(/beChanged/g,'');
                var foundAt = this._pinArray.indexOf(e.target.parentElement.id);
                if(foundAt === -1)
                    this._pinArray.push(e.target.parentElement.id);
                else
                    this._pinArray[foundAt] = 'e';
            },
            _orderArray: [],
            _loadSortable: function() {
                var el = this.$$('#sortable_ul');
                var polymer = this;
                var sortable = Sortable.create(el, {
                        handle: '.glyphicon-menu-hamburger',
                        animation: 150,
                        dataIdAttr: 'id',
                        onEnd: function() {
                            polymer._orderArray = sortable.toArray();
                        }
                    }  
                );
            },
            _appendFields: function(item){
              if(this._cachedToken && this._pinArray.length>0){
                    var selfOrder = this._orderArray.indexOf(item.id.toString());
                    item.selfOrder= selfOrder;
                    var pin = this._pinArray.indexOf(item.id.toString());
                    if(pin !== -1)
                        item.pin = true;
                    else 
                        item.pin = false;
                    return !item.pin ? item : false;
                }
                return true;
            },
            _pinnedFilter: function(item){
                if(this._cachedToken && this._pinArray.length>0){
                    var pin = this._pinArray.indexOf(item.id.toString());
                    if(pin !== -1)
                        item.pin = true;
                    else 
                        item.pin = false;
                    return item.pin ? item : false;
                }
                return false;
            },
            _selfSort: function(a,b){
                if(this._cachedToken && this._orderArray.length>0)
                    return a.selfOrder < b.selfOrder ? -1 : 1;
                else a.order_id < b.order_id ? -1 : 1;
            },
            _componentRequest: function() {
                this.$.ComponentRequest.body = {
                    "domain": window.location.href
                };
                this.$.ComponentRequest.generateRequest();
            },
            _handleComponentRequestResponse: function(response) {
                console.log(response.data);
            },
            _handleComponentRequestError: function(error) {
                console.log(error.data);
            },
            _tokenRequestSend: function(e) {
                if (e.keyCode === 13) {
                    //Change for API request
                    var dbToken = localStorage.getItem('databasePersonalToken');
                    if(e.target.value == dbToken){
                        localStorage.cachedToken = e.target.value;
                        location.reload();
                    }
                    else alert('Wrong token!!!');
                }
            },
            _changesRequestSend: function() {
                if(this._orderArray.length == 0){
                    console.log('You didnt change the order!');
                }
                else{
                    var orderString = this._orderArray.toString();
                    //Change for API request
                    localStorage.orderString = orderString;
                    console.log('Order:' + orderString);
                }
                if(this._pinArray.length == 0){
                    console.log('You didnt pinned the app!')
                }   
                else{
                    var pinString = this._pinArray.toString().replace(/e,/g, '').replace(/,e/g, '');
                    //Change for API request
                    localStorage.pinString = pinString;
                    console.log('Pinned: ' + pinString);
                }
                location.reload();
            },
            _switchView: function(){
                var sortable = this.$$('#sortable_ul');
                var items = this.$$('#items_ul');

                if (sortable.className.indexOf("hidden") === -1) {
                    sortable.className +=' hidden';
                    items.className = items.className.replace(/hidden/g, '');
                } else {
                    items.className +=' hidden';
                    sortable.className = sortable.className.replace(/hidden/g, '');
                }
            },
            _setAsPinned: function(pin){
               if(pin)
                    return 'glyphicon glyphicon-pushpin pinned';
                else
                    return 'glyphicon glyphicon-pushpin';
            },
            _getColor: function(e) {
                var colorThief = new ColorThief();
                var background = colorThief.getColor(e.target);
                var red = background[0] + 120;
                var green = background[1] + 50;
                var blue = background[2] + 90;
                var ld = Number;
                if ((red * 0.299 + green * 0.587 + blue * 0.114) > 186) ld = 1;
                else ld = 0;
                background = [red, green, blue];
                background = 'rgba(' + background.toString() + ',1)';
                e.path[1].childNodes[3].style.color = ld == 1 ? '#000' : '#fff';
                e.path[1].style.background = background;
            },
            _signMeOut: function(){
                localStorage.removeItem('cachedToken')
                location.reload();
            }
        });
}())