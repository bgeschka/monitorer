define([
	"app",
	"api/config"
], function(app) {
	app.service("poll", function(config, $timeout) {
		this.create = function () {
			return {
				run : function (pollfn) {
					var self = this;
					self.pollfn = pollfn;
					pollfn(function () {
						if (!self.stopped) {
							$timeout( function () {
								self.run(self.pollfn);
							},config.polltimeout);
						}
					});
				},
				stop : function () {
					this.stopped = true;
				}
			};
		};
	});
});
