(function () {
    var app = angular.module("directives", []);
    app.directive('linkRequired', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, mCtrl) {
                function linkvalidate(value) {
                    if (/^(htt+(p|ps)+\:\/\/www+\.+[a-z0-9]+\.+[a-z0-9])/.test(value)) {
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