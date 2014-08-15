(function () {
    "use strict";

    angular.module('vk', [ 'vk.directives', 'vk.services' ])

        .controller('AppCtrl', [ '$scope', '$timeout', 'vk', 'LoginModel', 'TokenModel', 'UserModel', function ($scope, $timeout, vk, loginModel, tokenModel, userModel) {
            $scope.userModel = userModel;
            $scope.tokenModel = tokenModel;
            $scope.loginModel = loginModel;

            $scope.videos = [ ];
            $scope.searching = false;

            $scope.search = function (query) {
                if ($scope.searching) {
                    return;
                }

                $scope.searching = true;

                $timeout(function () {
                    vk.searchVideos($scope.tokenModel.token, query).then(function (response) {
                        $scope.videos = response;
                    }).finally(function () {
                        $scope.searching = false;
                    });
                }, 3000);
            };
        } ])

        .config([ '$compileProvider', function ($compileProvider) {
            var whitelist = /^\s*(https?|ftp|mailto|chrome-extension):/;

            $compileProvider.aHrefSanitizationWhitelist(whitelist);
            $compileProvider.imgSrcSanitizationWhitelist(whitelist);
        } ]);
}());
