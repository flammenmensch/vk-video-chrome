(function () {
    "use strict";

    angular.module('vk.filters', [ ])
        .filter('duration', [ '$filter', function ($filter) {
            var mmss = 'm:ss';
            var hhmmss = 'H:mm:ss';
            var dateFilter = $filter('date');

            return function(seconds) {
                if (seconds == null || Number.isNaN(seconds)) {
                    return '--:--';
                }

                var date = new Date(1970, 0, 1, 0, 0, seconds);
                var format = seconds < 3600 ? mmss : hhmmss;

                return dateFilter(date, format);
            };
        } ]);
} ());