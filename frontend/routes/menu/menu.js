define([
	'app'
], function(app) {
	app.directive('menuitem', [function() {
		return {
			restrict: 'A',
			template: '<a ng-click="tc()" href="{{path}}"><ng-transclude/></a>',
			transclude: true,
			scope: {
				tc: '=',
				path: '@'
			}
		};
	}]);

	var name = "menu";
	app.controller(name, function($scope, api, config, $interval) {
		$scope.sitename = config.sitename;

		if (config.debug) $scope.sitename += " DEBUG";

		$scope.isCollapsed = true;
		$scope.tc = function() {
			$scope.isCollapsed = !$scope.isCollapsed;

		};


		var tick = function() {
			$scope.clock = Date.now();
		};
		tick();
		$interval(tick, 1000);

	});

	return {
		templateUrl: 'routes/' + name + '/' + name + '.html',
		controller: name
	};
});
