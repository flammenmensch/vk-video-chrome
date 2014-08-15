(function () {
    "use strict";

    angular.module('vk.services', [ 'vk.util' ])

        .factory('tokenStorage', [ '$q', function ($q) {
            function TokenStorage() {

            }

            TokenStorage.prototype = {
                get: function () {
                    var deferred = $q.defer();

                    chrome.storage.local.get('auth', function (data) {
                        if (chrome.runtime.lastError) {
                            return deferred.reject(new Error(chrome.runtime.lastError));
                        }

                        deferred.resolve(data);
                    });

                    return deferred.promise;
                },

                set: function (data) {
                    var deferred = $q.defer();

                    chrome.storage.local.set({ auth: data }, function () {
                        if (chrome.runtime.lastError) {
                            return deferred.reject(new Error(chrome.runtime.lastError));
                        }
                        deferred.resolve(true);
                    });

                    return deferred.promise;
                },

                clear: function () {
                    var deferred = $q.defer();

                    chrome.storage.local.clear(function () {
                        if (chrome.runtime.lastError) {
                            return deferred.reject(new Error(chrome.runtime.lastError));
                        }
                        deferred.resolve(true);
                    });

                    return deferred.promise;
                }
            };

            return new TokenStorage();
        } ])

        .factory('authService', [ '$q', 'urlUtil', function ($q, urlUtil) {
            function AuthService() {

            }

            AuthService.prototype.authorize = function () {
                var deferred = $q.defer();

                var manifest = chrome.runtime.getManifest();
                var redirectUri = chrome.identity.getRedirectURL('/callback');
                var url = 'https://oauth.vk.com/authorize?display=page&v=5.24&response_type=token&client_id=' + manifest.oauth2.client_id + '&scope=' + manifest.oauth2.scopes.join(',') + '&redirect_uri=' + redirectUri;

                chrome.identity.launchWebAuthFlow({
                    url: url,
                    interactive: true
                }, function (redirectUri) {
                    if (chrome.runtime.lastError) {
                        return deferred.reject(new Error(chrome.runtime.lastError));
                    }

                    var params = urlUtil.extractHash(redirectUri);

                    deferred.resolve(params);
                });

                return deferred.promise;
            };

            return new AuthService();
        } ])

        .factory('vk', [ '$q', '$http', function ($q, $http) {
			function VK() { }

			var makeApiRequest = function (method, params) {
				var deferred = $q.defer();

				$http({
					method: 'GET',
					url: 'https://api.vk.com/method/' + method,
					params: params || { },
					cache: true,
					responseType: 'json'
				}).success(function (response) {
					if (response.error) {
						return deferred.reject(response.data.error);
					}

					deferred.resolve(response.response);
				});

				return deferred.promise;
			};

			VK.prototype = {
				getUserInfo: function (user_id) {
					return makeApiRequest('users.get', {
						user_id: user_id
					});
				},
				searchVideos: function (access_token, q, offset) {
					return makeApiRequest('video.search', {
						access_token: access_token,
						q: q,
						adult: 1,
						filters: 'long,mp4',
						sort: '1',
						count: 50,
						offset: offset || 0
					});
				}
			};

			return new VK();
        } ]);
} ());