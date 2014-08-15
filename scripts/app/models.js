(function () {
	"use strict";

	angular.module('vk.models', [ ])

		.factory('AuthModel', function () {
			return {
				user_id: '',
				user_name: '',
				access_token: ''
			};
		})

		.factory('VideoCollection', function () {
			return [ ];
		});
} ());