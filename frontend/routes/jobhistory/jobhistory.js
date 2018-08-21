define([
	'app',
	'directives/labledrow/labledrow',
	'directives/jobview/jobview',
], function(app) {
	var name = "jobhistory";
	app.controller(name, function($scope, $routeParams, api, poll, visuals) {
		$scope.jobid = $routeParams.jobid;

		$scope.history=[];

		api.call({
			method:'getjob',
			jobID:$scope.jobid
		}).then( function (res) {
			$scope.job = res.result;
		});

		$scope.p = poll.create();
		$scope.p.run(function(next) {
			api.call({
				method: "jobhistory",
				jobID: $scope.jobid
			}).then(function(result) {
				result.result.forEach(function(e) {
					e.$datenice = new Date(parseInt(e.time.replace(".out", "")));
				});

				angular.extend($scope.history, result.result);

				next();
			});
		});

		$scope.$on('$destroy', function() {
			$scope.p.stop();
		});


		$scope.showfull = function (job) {
			function cb() {
			}
			visuals.pushModal("Job info {{job.$datenice | date:'medium'}}", "<pre>{{job.data}}</pre>", "", cb, "lg", {
				job:job
			});
		};



	});

	return {
		templateUrl: 'routes/' + name + '/' + name + '.html',
		controller: name
	};

});
