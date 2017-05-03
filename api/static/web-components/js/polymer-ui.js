(function () {
    Polymer({
        is: "web-component",
        behavior: ['ColorThief', 'Sortable'],
        properties: {},
        ready: function () {
            this._componentRequest();

            if (this._cachedToken == null)
                this.$.GetDataResponse.generateRequest();

            this._getValuesRequest();

        },
        _getProperPath: function (path) {
            return this.resolveUrl('../static/img/app-img/' + path + '.png');
        },
        _cachedToken: localStorage.getItem('cachedToken') || null,
        _getValuesRequest: function () {
            if (this._cachedToken != null) {
                this.$.AuthRequest.body = {
                    token: this._cachedToken
                };
                this.$.AuthRequest.generateRequest();
            } else
                console.log('Anonymous user')
        },
        _checkAccess: function () {
            if (this._cachedToken != null)
                return true;
            return false;
        },
        _retriveArray: function (pinString, orderString) {
            this._pinArray = pinString.split(',') || [];
            this._orderArray = orderString.split(',') || [];
        },
        _pinArray: [],
        _pinAppTrigger: function (e) {
            if (e.target.className.indexOf('beChanged') === -1)
                e.target.className += ' beChanged';
            else e.target.className = e.target.className.replace(/beChanged/g, '');
            var foundAt = this._pinArray.indexOf(e.target.parentElement.id);
            if (foundAt === -1)
                this._pinArray.push(e.target.parentElement.id);
            else
                this._pinArray[foundAt] = 'e';
        },
        _orderArray: [],
        _loadSortable: function () {
            var el = this.$$('#sortable_ul');
            var polymer = this;
            var sortable = Sortable.create(el, {
                handle: '.glyphicon-menu-hamburger',
                animation: 150,
                dataIdAttr: 'id',
                onEnd: function () {
                    polymer._orderArray = sortable.toArray();
                }
            });
        },
        _appendFields: function (item) {
            if (this._cachedToken && this._pinArray.length > 0) {
                var selfOrder = this._orderArray.indexOf(item.id.toString());
                item.selfOrder = selfOrder;
                var pin = this._pinArray.indexOf(item.id.toString());
                if (pin !== -1)
                    item.pin = true;
                else
                    item.pin = false;
                return !item.pin ? item : false;
            }
            return true;
        },
        _pinnedFilter: function (item) {
            if (this._cachedToken && this._pinArray.length > 0) {
                var pin = this._pinArray.indexOf(item.id.toString());
                if (pin !== -1)
                    item.pin = true;
                else
                    item.pin = false;
                return item.pin ? item : false;
            }
            return false;
        },
        _selfSort: function (a, b) {
            if (this._cachedToken && this._orderArray.length > 0)
                return a.selfOrder < b.selfOrder ? -1 : 1;
            else a.order_id < b.order_id ? -1 : 1;
        },
        _componentRequest: function () {
            if (localStorage.getItem('secured') == null) {
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
                    token: e.target.value
                };
                this.$.AuthRequest.generateRequest();

            }
        },
        _handleAuthRequestResponse: function (response) {
            var ComponentUser = response.detail.response;
            console.log(ComponentUser);
            if (ComponentUser != null) {
                localStorage.setItem('cachedToken', ComponentUser.token);
                localStorage.setItem('cachedEmail', ComponentUser.email);
                this.$.GetDataResponse.generateRequest();
                this._retriveArray(ComponentUser.pin_string, ComponentUser.order_string);
                this._loadSortable();
            } else alert('Wrong token');
            if (this._cachedToken == null)
                location.reload();
        },
        _handleAuthRequestError: function (error) {
            console.log(error.detail);
        },
        _handleDataRequest: function (response) {
            console.log(response.detail.response);
        },
        _changesRequestSend: function () {
            var orderString = this._orderArray.toString();
            var pinString = this._pinArray.toString().replace(/e,/g, '').replace(/,e/g, '');
            this.$.ChangesRequest.body = {
                token: this._cachedToken,
                pin_string: pinString,
                order_string: orderString
            }
            this.$.ChangesRequest.generateRequest();
        },
        _handleChangesRequestResponse: function (response) {
            var responseDetail = response.detail.response;
            console.log(responseDetail);
            if (response != null) {
                location.reload();
            } else console.log('Something went wrong');
        },
        _handleChangesRequestError: function (error) {
            console.log(error.detail);
        },
        _showToggle: function () {
            var component = this.$$('#web-component-navbar');
            var componentOverflow = this.$$('#web-component-navbar .component-overflow');
            if (component.className.indexOf("visible") === -1) {
                component.className = component.className.replace(/c-hidden/g, 'visible');
                componentOverflow.className = componentOverflow.className.replace(/c-hidden/g, 'visible');
            } else {
                component.className = component.className.replace(/visible/g, 'c-hidden');
                componentOverflow.className = componentOverflow.className.replace(/visible/g, 'c-hidden');
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
            localStorage.removeItem('cachedToken');
            localStorage.removeItem('cachedEmail');
            location.reload();
        }
    });
}())
