define([
	'app'
], function(app) {
	app.directive('labledrow', [function() {
		return {
			restrict: 'EA',
			templateUrl: 'directives/labledrow/labledrow.html',
			transclude: true,
			replace: false,
			scope: {
				txt: '@'
			}
		};

	}]);

});
