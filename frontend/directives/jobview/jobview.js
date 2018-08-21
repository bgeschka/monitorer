define([
	'app',
	'api/poll',
	'directives/panel/panel',
	'directives/gauge/gauge',
	'directives/spinner/spinner',
], function(app) {
	app.directive('jobview', [function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/jobview/jobview.html',
			scope: {
				job : '=ngModel'
			},
			replace: true,
			controller: function($scope,api,poll, plugins) {
				$scope.plugins = plugins;
				$scope.p = poll.create();
				$scope.p.run(function(next) {
					api.call({
						method:"lastresult",
						jobID: $scope.job.jobID
					}).then(function(result) {
						$scope.lastresult = result;
						$scope.waiting = !!($scope.lastresult.result.match(/__WAITING__/));
						console.log("set waiting:",$scope.waiting);
						next();
					}).catch( function (err) {
						console.err("failed:", err);
						next();
					});

				});

				$scope.$on('$destroy', function () {
					$scope.p.stop();
				});
			}
		};
	}]);
});
