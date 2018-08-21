define([
	'app',
], function(app) {
	var name = "login";
	app.controller(name, function($scope, api, visuals, $location, config) {
		$scope.config = config;

		$scope.creds = {
			username : "",
			password : "",
			timeout: config.defaultubussessiontimeout
		};

		$scope.login = function() {
		};
	});

	return {
		templateUrl: 'routes/' + name + '/' + name + '.html',
		controller: name
	};

});
