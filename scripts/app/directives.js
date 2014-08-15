(function () {
    "use strict";

    angular.module('vk.directives', [ 'vk.models', 'vk.services', 'vk.filters' ])

        .directive('vkNotAuthorized', function () {
            return {
                template: '<div class="alert alert-warning"><strong>Внимание!</strong> Вы не авторизованы.</div>',
                restrict: 'E',
                replace: true,
                scope: { }
            };
        })

        .directive('vkLogin', function () {
            return {
                restrict: 'E',
                scope: { },
                replace: true,
                templateUrl: '/templates/directives/vk-login.html',
                controller: [ '$scope', 'TokenModel', 'UserModel', 'LoginModel', 'tokenStorage', 'authService', 'vk', function ($scope, tokenModel, userModel, loginModel, tokenStorage, authService, vk) {
                    $scope.loading = false;

                    $scope.userModel = userModel;
                    $scope.tokenModel = tokenModel;
                    $scope.loginModel = loginModel;

                    $scope.checkAuthorization = function () {
                        tokenStorage.get().then(function (savedInfo) {
                            if (!savedInfo.auth) {
                                return;
                            }

                            var auth = savedInfo.auth;

                            var now = new Date();

                            if (now.getTime() > auth.expirationDate) {
                                return;
                            }

                            $scope.userModel.deserialize(auth);
                            $scope.tokenModel.deserialize(auth);

                            $scope.loginModel.setLoggedIn(true);
                        });
                    };

                    $scope.login = function () {
                        $scope.loading = true;

                        authService.authorize()
                            .then(function (authInfo) {
                                var now = new Date();
                                var expirationDate = now.setSeconds(now.getSeconds() + authInfo.expires_in);

                                $scope.tokenModel
                                    .setToken(authInfo.access_token)
                                    .setExpirationDate(expirationDate);

                                return vk.getUserInfo(authInfo.user_id);
                            })
                            .then(function (response) {
                                var userInfo = response[0];

                                $scope.userModel
                                    .setId(userInfo.id)
                                    .setName(userInfo.first_name + ' ' + userInfo.last_name);

                                return tokenStorage.set(angular.extend({}, $scope.tokenModel.serialize(), userModel.serialize()));
                            })
                            .then(function () {
                                $scope.loginModel.setLoggedIn(true);
                                $scope.loading = false;
                            });
                    };

                    $scope.logout = function () {
                        $scope.loading = true;

                        authService
                            .deauthorize($scope.tokenModel.token)
                            .finally(function () {
                                return tokenStorage.clear();
                            })
                            .finally(function () {
                                $scope.loading = false;

                                $scope.userModel.clear();
                                $scope.tokenModel.clear();
                                $scope.loginModel.setLoggedIn(false);
                            });
                    };

                    $scope.checkAuthorization();
                } ]
            };
        })

        .directive('vkSearchForm', function () {
            return {
                restrict: 'E',
                scope: {
                    inactive: '=',
                    placeholder: '@',
                    searchHandler: '&'
                },
                replace: true,
                templateUrl: '/templates/directives/vk-search-form.html',
                controller: [ '$scope', function ($scope) {
                    $scope.query = '';

                    $scope.search = function () {
                        if ($scope.searchHandler !== undefined) {
                            $scope.searchHandler({ query: $scope.query });
                        }
                    };
                } ]
            }
        })

        .directive('cspSrc', [ 'imageLoader', function (imageLoader) {
            return {
                restrict: 'A',
                scope: { },
                priority: 99,
                link: function (scope, element, attributes) {
                    imageLoader.load(attributes['cspSrc']).then(function (blob) {
                        attributes.$set('src', blob);
                    });

                    scope.$on('$destroy', function () {
                        imageLoader.unload(attributes['src']);
                    });
                }
            };
        } ])

        .directive('vkVideoThumbnail', function () {
            return {
                restrict: 'E',
                scope: {
                    video: '='
                },
                replace: true,
                templateUrl: '/templates/directives/vk-video-thumbnail.html'
            };
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
                    $scope.open = function (video) {
                        // Create player window here
                    };
                } ]
            };
        });
} ());