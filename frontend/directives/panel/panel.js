define([
	'app'
], function(app) {
	app.directive('panel', [function() {
		return {
			restrict: 'EA',
			templateUrl: 'directives/panel/panel.html',
			transclude: true,
			replace: false,
			scope: {
				txt: '@'
			}
		};

	}]);

});
