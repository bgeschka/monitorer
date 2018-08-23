define([
	'app'
], function(app) {
	app.directive('keyTrap', function() {
		return function(scope, elem) {
			elem.bind('keydown', function(event) {
				scope.$broadcast('keydown', {
					code: event.keyCode
				});
			});
		};
	});
});
