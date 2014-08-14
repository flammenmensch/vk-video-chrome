(function () {
    "use strict";

    angular.module('vk.directives', [ 'vk.services' ])

        .directive('vkLogin', function () {
            return {
                restrict: 'E',
                scope: { },
                replace: true,
                templateUrl: '/templates/directives/vk-login.html',
                controller: [ '$scope', 'tokenStorage', 'authService', function ($scope, tokenStorage, authService) {
                    $scope.loggedIn = false;
                    $scope.loading = false;

                    $scope.login = function () {
                        $scope.loading = true;
                        authService.authorize().then(function (data) {
                            tokenStorage.set(data).then(function () {
                                $scope.loggedIn = true;
                                $scope.loading = false;
                            });
                        });
                    };

                    $scope.logout = function () {
                        tokenStorage.clear().then(function () {
                            $scope.loggedIn = false;
                            $scope.loading = false;
                        });
                    };
                } ]
            };
        })

        .directive('vkSearchForm', function () {
            return {
                restrict: 'E',
                scope: {
                    placeholder: '@',
                    searchHandler: '&'
                },
                replace: true,
                templateUrl: '/templates/directives/vk-search-form.html',
                controller: [ '$scope', function ($scope) {
                    $scope.query = '';

                    $scope.search = function () {
                        if ($scope.searchHandler !== undefined) {
                            $scope.searchHandler($scope.query);
                        }
                    };
                } ]
            }
        })

        .directive('vkSearchResults', function () {
            return {
                restrict: 'E',
                scope: {
                    items: '='
                },
                replace: true,
                templateUrl: '/templates/directives/vk-search-results.html',
                controller: [ '$scope', function ($scope) {

                } ]
            };
        });
} ());