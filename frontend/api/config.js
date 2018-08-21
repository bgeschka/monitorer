define([
	"app",
], function(app) {
	app.service("config", function($rootScope) {
		var cfg = {
		};

		console.log("config:", cfg);
		window.cfg = cfg;
		return cfg;
	});
});
