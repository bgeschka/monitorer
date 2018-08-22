

define([
	'app',
	'api/session',
	'routes/router',
	'routes/menu/menu',
	'api/api',
	'api/poll',
	'api/config',
	'api/visuals',
	'api/plugins',
	'api/transports',
	'directives/labledrow/labledrow'
], function() {
	return angular.bootstrap(document.getElementsByTagName("body")[0], ['MONITORER']);
});
