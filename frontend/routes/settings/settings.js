define([
	'app',
	'directives/labledrow/labledrow',
	'directives/panel/panel',
], function(app) {
	var name = "settings";
	app.controller(name, function($scope, api) {
		api.call({
			method:"getconfig"
		}).then( function (res) {
			$scope.config = res.config;
		});

		$scope.save = function (frm) {
			api.call({
				method:"setconfig",
				config : $scope.config
			}).then( function (res) {
				frm.$setPristine();
				$scope.config = res.config;
			});
		};
	});

	return {
		templateUrl: 'routes/' + name + '/' + name + '.html',
		controller: name
	};

});
