define([
	"app",
	"api/api"
], function(app) {
	app.service("transports", function(api) {
		this.transports = {};
		var self = this;
		api.call({
			method:'listtransports'
		}).then( function (transports) {
			transports.forEach(function (p) {
				self.transports[p.name] = p;
			});

			console.log(self.transports);
		});

		return this;

	});
});


