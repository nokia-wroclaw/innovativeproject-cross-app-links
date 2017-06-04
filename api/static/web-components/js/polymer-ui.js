(function () {
    Polymer({
        is: "web-component",
        behavior: ['ColorThief', 'Sortable'],
        properties: {
            email: {
                type: String,
                value: '',
            },
            token: {
                type: String,
                value: '',
            },
            response: {
                type: Array,
                value: [],
            },
            sorted_response: {
                type: Array,
                value: [],
            },
            pinnedResponse:{
                type: Array,
                value: []
            },
            checkAccess: {
                type: Boolean,
                value: false
            },
            pinArray:{
                type: Array,
                value: [],
            },
            orderArray:{
                type: Array,
                value: []
            },
            hiddenArray:{
                type: Array,
                value: [],
            },
            customize: {
                type: String,
                value: '',
                observer: '_handleCustomizeChange'
            }
        },
        ready: function () {
            this._loading();
            this._componentRequest();
            this._getValuesRequest();
            this.$.GetDataResponse.generateRequest();
        },
        _handleCustomizeChange: function(){
            this.response = this.response
                                .map((v)=>{
                                    var selfOrder = this.orderArray.indexOf(v.id.toString());
                                    v.selfOrder = selfOrder;
                                    var pin = this.pinArray.indexOf(v.id.toString());
                                    if (pin !== -1)
                                        v.pin = true;
                                    else
                                        v.pin = false;
                                    var hide = this.hiddenArray.indexOf(v.id.toString());
                                    if (hide !== -1)
                                        v.hide = true;
                                    else
                                        v.hide = false;
                                    return v;
                                });
            this.notifyPath('response', this.response);
            this._loadingFinish();
        },
        _showPolymer: function(){
            this.$$('#web-component-main').className = 'main-nav';
        },
        _loading: function(){
            var loading = this.$$('#loading-box');
            loading.style.visibility = 'visible';
        },
        _loadingFinish:function(){
            var loading = this.$$('#loading-box');
            loading.style.visibility = 'hidden';
        },
        _showEmailInput: function(){
            var input = this.$$('#tokenValue');
            if(input.style.visibility == 'visible')
                input.style.visibility = 'hidden';
            else input.style.visibility = 'visible';
        },
        _getProperPath: function (path) {
            return this.resolveUrl('../static/img/app-img/' + path + '.png');
        },
        _getValuesRequest: function () {
            if (localStorage.getItem('cachedToken') !== null) {
                this.$.AuthRequest.body = {
                    passed_value: localStorage.getItem('cachedToken')
                };
                this.$.AuthRequest.generateRequest();
            } else
                console.log('Anonymous user');
        },
        _retriveArray: function (pinString, orderString, hiddenString) {
            this.pinArray = pinString.split(',') || [];
            this.orderArray = orderString.split(',') || [];
            this.hiddenArray = hiddenString.split(',') || [];
            this.customize = new Date();
        },
        _pinAppTrigger: function (e) {
            if (e.target.className.indexOf('val-true') === -1)
                e.target.className += ' val-true';
            else e.target.className = e.target.className.replace(/val-true/g, 'val-false');
            var foundAt = this.pinArray.indexOf(e.target.parentElement.id);
            if (foundAt === -1)
                this.pinArray.push(e.target.parentElement.id);
            else
                this.pinArray[foundAt] = 'e';
            this._changesRequestSend();
        },
        _loadSortable: function () {
            var el = this.$$('#sortable_ul');
            var polymer = this;
            var sortable = Sortable.create(el, {
                handle: '.glyphicon-menu-hamburger',
                animation: 150,
                dataIdAttr: 'id',
                onEnd: function () {
                    polymer.orderArray = sortable.toArray();
                }
            });
        },
        _hiddenAppTrigger: function (e) {

            if (e.target.className.indexOf('val-true') === -1)
                e.target.className += ' val-true';
            else e.target.className = e.target.className.replace(/val-true/g, 'val-false');
            var foundAt = this.hiddenArray.indexOf(e.target.parentElement.id);
            if (foundAt === -1)
                this.hiddenArray.push(e.target.parentElement.id);
            else
                this.hiddenArray[foundAt] = 'e';
            this._changesRequestSend();
        },
        _voidFilter: function(item){
            return item.hide !== null ? item : false;
        },
        _hideFilter: function (item) {
            return !item.hide ? item : false;
        },
        _pinnedFilter: function (item) {
            return item.pin ? item : false;
        },
        _selfSort: function (a, b) {
            if (this.token && this.orderArray.length > 0)
                return a.selfOrder < b.selfOrder ? -1 : 1;
            else return a.order_id < b.order_id ? -1 : 1;
        },
        _componentRequest: function () {
            if (localStorage.getItem('secured') === null) {
                this.$.ComponentRequest.body = {
                    "domain": window.location.href
                };
                this.$.ComponentRequest.generateRequest();
                localStorage.setItem('secured', true);
            }
        },
        _tokenRequestSend: function (e) {
            if (e.keyCode === 13) {
                this.$.AuthRequest.body = {
                    passed_value: e.target.value
                };
                this.$.AuthRequest.generateRequest();
            }
        },
        _handleAuthRequestResponse: function (response) {
            var ComponentUser = response.detail.response;
            localStorage.removeItem('cachedEmail');
            localStorage.removeItem('cachedToken');
            if (ComponentUser !== null) {
                this._loadSortable();
                console.log('You have been logged in successfully')
                localStorage.setItem('cachedEmail', ComponentUser.email);
                localStorage.setItem('cachedToken', ComponentUser.token);
                this.checkAccess = true;
                this.notifyPath('checkAccess');
                this.email = localStorage.getItem('cachedEmail');
                this.token = localStorage.getItem('cachedToken')
                this.notifyPath('email');
                this.notifyPath('token');
                this._retriveArray(ComponentUser.pin_string, ComponentUser.order_string, ComponentUser.hidden_string);

            }
        },
        _handleAuthRequestError: function (error) {
            console.log(error.detail);
        },
        _handleDataRequest: function (response) {
            this.response = response.detail.response.objects;
            this._showPolymer();
            if(!this.email)
                this._loadingFinish();
        },
        _changesRequestSend: function () {
            this._loading();
            var orderString = this.orderArray.toString();
            var pinString = this.pinArray.toString().replace(/e,/g, '').replace(/,e/g, '');
            var hiddenString = this.hiddenArray.toString().replace(/e,/g, '').replace(/,e/g, '');
            this.$.ChangesRequest.body = {
                passed_value: localStorage.getItem('cachedToken'),
                pin_string: pinString,
                order_string: orderString,
                hidden_string: hiddenString
            };
            this.$.ChangesRequest.generateRequest();
        },
        _sortRequestSend: function () {
            this._loading();
            var orderString = this.orderArray.toString();
            var pinString = this.pinArray.toString().replace(/e,/g, '').replace(/,e/g, '');
            var hiddenString = this.hiddenArray.toString().replace(/e,/g, '').replace(/,e/g, '');
            this.$.ChangesRequest.body = {
                passed_value: localStorage.getItem('cachedToken'),
                pin_string: pinString,
                order_string: orderString,
                hidden_string: hiddenString
            };
            this.$.ChangesRequest.generateRequest();
            this.onlySortSend = true;
            //location.reload();
        },
        _handleChangesRequestResponse: function (response) {
            var responseDetail = response.detail.response;
            if (response !== null) {
                if(this.onlySortSend === true)
                    location.reload();
                else
                    this.$.AuthRequest.generateRequest();
            } else console.log('Something went wrong');
        },
        _handleChangesRequestError: function (error) {
            console.log(error.detail);
        },
        _showToggle: function () {
            var component = this.$$('#web-component-navbar');
            var button = this.$$('#button-switch');
            if (component.className.indexOf("visible") === -1) {
                component.className = component.className.replace(/c-hidden/g, 'visible');
                button.className = button.className.replace(/c-hidden/g, 'visible');
            } else {
                component.className = component.className.replace(/visible/g, 'c-hidden');
                button.className = button.className.replace(/visible/g, 'c-hidden');
            }
        },
        _switchView: function () {
            var sortable = this.$$('#sortable_ul');
            var items = this.$$('#items_ul');

            if (sortable.className.indexOf("hidden") === -1) {
                sortable.className += ' hidden';
                items.className = items.className.replace(/hidden/g, '');
            } else {
                items.className += ' hidden';
                sortable.className = sortable.className.replace(/hidden/g, '');
            }
        },
        _setAsPinned: function (pin) {
            if (pin)
                return 'glyphicon glyphicon-pushpin pinned';
            else
                return 'glyphicon glyphicon-pushpin';
        },
        _setAsHidden: function(hide){
            if(hide)
                return 'glyphicon glyphicon-eye-open';
            else
                return 'glyphicon glyphicon-eye-open not-hidden';
        },
        _getColor: function (e) {

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
        _signMeOut: function () {
            this._loading();
            localStorage.removeItem('cachedEmail');
            localStorage.removeItem('cachedToken');
            location.reload();
        }
    });
}());
