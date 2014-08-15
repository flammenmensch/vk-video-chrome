(function () {
    "use strict";

    angular.module('vk', [ 'vk.directives', 'vk.services' ])

        .controller('AppCtrl', [ '$scope', 'vk', 'LoginModel', 'TokenModel', 'UserModel', function ($scope, vk, loginModel, tokenModel, userModel) {
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

                vk.searchVideos($scope.tokenModel.token, query)
                    .then(function (response) {
                        console.log(response);
                        $scope.videos = response;
                    })
                    .finally(function () {
                        $scope.searching = false;
                    });
            };
        } ])

        .config([ '$compileProvider', function ($compileProvider) {
            var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
            var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)+'|filesystem:chrome-extension:'+'|blob:chrome-extension%3A'+currentImgSrcSanitizationWhitelist.toString().slice(-1);

            $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
        } ]);
}());
