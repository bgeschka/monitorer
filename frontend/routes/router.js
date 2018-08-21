console.log("loading router");

define(
	[
		'app',
		'routes/jobs/jobs',
		'routes/dashboard/dashboard',
		'routes/jobhistory/jobhistory',
		'routes/settings/settings',

	],
	function(
		app,
		jobs,
		dashboard,
		jobhistory,
		settings
	) {
		app.config(['$routeProvider', '$locationProvider', function($routeProvider) {
			$routeProvider
				.when('/jobs', jobs)
				.when('/dashboard', dashboard)
				.when('/jobhistory/:jobid', jobhistory)
				.when('/settings', settings)
				.otherwise({
					redirectTo: '/dashboard'
				});
		}]);

	}
);
