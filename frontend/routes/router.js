console.log("loading router");

define(
	[
		'app',
		'routes/logout/logout',
		'routes/login/login',
		'routes/jobs/jobs',
		'routes/dashboard/dashboard',
		'routes/jobhistory/jobhistory',
		'routes/settings/settings',

	],
	function(
		app,
		logout,
		login,
		jobs,
		dashboard,
		jobhistory,
		settings
	) {
		app.config(['$routeProvider', '$locationProvider', function($routeProvider) {
			$routeProvider
				.when('/logout', logout)
				.when('/login', login)
				.when('/jobs', jobs)
				.when('/dashboard', dashboard)
				.when('/jobhistory/:jobid', jobhistory)
				.when('/settings', settings)
				.otherwise({
					redirectTo: '/login'
				});
		}]);

	}
);
