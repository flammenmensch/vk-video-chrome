(function () {
	"use strict";

	angular.module('vk.models', [ ])
        .factory('LoginModel', [ function () {
            function LoginModel() {
               this.__loggedIn = false;
            }

            LoginModel.prototype = {
               get loggedIn() { return this.__loggedIn; },
               setLoggedIn: function (value) { this.__loggedIn = value; return this; }
            };

            return new LoginModel();
        } ])

        .factory('TokenModel', function () {
            function TokenModel() {
                this.__token = null;
                this.__expirationDate = null;
            }

            TokenModel.prototype = {
                get token() { return this.__token; },
                get expirationDate() { return this.__expirationDate; },

                setToken: function (value) { this.__token = value; return this; },
                setExpirationDate: function (value) { this.__expirationDate = value; return this; },

                clear: function () {
                    return this.setToken(null).setExpirationDate(null);
                },

                deserialize: function (props) {
                    return this
                        .setToken(props.token || null)
                        .setExpirationDate(props.expirationDate ? new Date(props.expirationDate) : null);
                },

                serialize: function () {
                    return {
                        token: this.token,
                        expirationDate: this.expirationDate
                    };
                }
            };

            return new TokenModel();
        })

		.factory('UserModel', [ function () {
            function UserModel() {
                this.__id = '';
                this.__name = '';
            }

            UserModel.prototype = {
                get id() { return this.__id; },
                get name() { return this.__name; },

                setId: function (value) { this.__id = value; return this; },
                setName: function (value) { this.__name = value; return this; },

                clear: function () {
                    return this
                        .setId('')
                        .setName('');
                },

                deserialize: function (props) {
                    return this
                        .setId(props.id || '')
                        .setName(props.name || '');
                },

                serialize: function () {
                    return {
                        id: this.id,
                        name: this.name
                    };
                }
            };

            return new UserModel();
		} ]);
} ());