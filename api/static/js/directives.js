(function () {
    var app = angular.module("directives", []);
    app.directive('linkFormat', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, mCtrl) {
                function linkvalidate(value) {
                    if (/^(http\:\/\/www+\.+[a-z0-9]+\.+[a-z0-9])/.test(value)) {
                        mCtrl.$setValidity('linkformat', true);
                    } else {
                        mCtrl.$setValidity('linkformat', false);
                    }
                    return value;
                }
                mCtrl.$parsers.push(linkvalidate);
            }
        };
    });

})();
