define([
	'app'
], function(app) {
	app.directive('cronsetting', [function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/cronsetting/cronsetting.html',
			scope: {
				ngModel: '='
			},
			replace: true,
			controller: function() {
			}
		};

	}]);

});
