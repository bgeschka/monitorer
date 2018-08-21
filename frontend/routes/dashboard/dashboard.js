define([
	'app',
	'directives/labledrow/labledrow',
	'directives/jobview/jobview',
], function(app) {
	var name = "dashboard";
	app.controller(name, function($scope, api, session) {
		$scope.session = session;
		api.call({
			method:'listjobs'
		}).then( function (jobs) {
			$scope.jobs = jobs.filter( function (j) {
				return j.active;
			});
		});
	});

	return {
		templateUrl: 'routes/' + name + '/' + name + '.html',
		controller: name
	};

});
