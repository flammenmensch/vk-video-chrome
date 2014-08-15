(function () {
    "use strict";

    angular.module('vk.directives', [ 'vk.services' ])

        .directive('vkLogin', function () {
            return {
                restrict: 'E',
                scope: { },
                replace: true,
                templateUrl: '/templates/directives/vk-login.html',
                controller: [ '$scope', 'tokenStorage', 'authService', 'vk', function ($scope, tokenStorage, authService, vk) {
                    $scope.loggedIn = false;
                    $scope.loading = false;
					$scope.username = '';

                    $scope.login = function () {
                        $scope.loading = true;
                        authService.authorize().then(function (data) {
                            tokenStorage.set(data).then(function () {
                                $scope.loggedIn = true;

								vk.getUserInfo(data.user_id).then(function (data) {
									var user = data[0];

									$scope.username = user.first_name + ' ' + user.last_name;
									$scope.loading = false;
								});
                            });
                        });
                    };

                    $scope.logout = function () {
                        tokenStorage.clear().then(function () {
                            $scope.loggedIn = false;
                            $scope.loading = false;
							$scope.username = '';
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