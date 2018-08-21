define(['app'], function (app) {
	var name = "logout";
	app.controller(name, function ($scope, rpcd, visuals, $location) {
                rpcd.logout().then( function () {
			rpcd.initSessionId();
			$location.path('/status');
                });
	});

	return { templateUrl: 'routes/'+name+'/'+name+'.html',controller: name };

});
