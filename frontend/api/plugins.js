define([
	"app",
	"api/api"
], function(app) {
	app.service("plugins", function(api) {
		this.plugins = {};
		var self = this;
		api.call({
			method:'listplugins'
		}).then( function (plugins) {
			plugins.forEach(function (p) {
				self.plugins[p.name] = p;
			});
		});

		return this;

	});
});

