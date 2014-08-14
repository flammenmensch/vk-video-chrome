(function () {
    "use strict";

    angular.module('vk.util', [ ])
        .factory('urlUtil', function () {
            return {
                extractHash: function (url) {
                    var hash = url.split('#')[1];

                    var params = hash
                        .split('&')
                        .map(function (pair) {
                            var split = pair.split('=');
                            return { key: split[0], value: split[1] };
                        })
                        .reduce(function (prev, next) {
                            prev[next.key] = next.value;
                            return prev;
                        }, { });

                    return params;
                }
            };
        });
} ());