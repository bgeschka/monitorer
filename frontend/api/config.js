define([
	"app",
], function(app) {
	app.service("config", function($rootScope) {
		var cfg = {
			polltimeout : 1500
		};

		console.log("config:", cfg);
		window.cfg = cfg;
		return cfg;
	});
});
