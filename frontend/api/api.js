define([
	"app",
], function(app) {
	app.service("api", function($http, $q) {
		this.loggedin=false;

		this._call = function (args) {
			return $q( function (resolve,reject) {
				$http.post('/rpc', args).then( function (res) {
					resolve(res.data);
				}).catch(reject);
			});
			
		};

		this.call = function (args) {
			return this._call(args);
		};


		return this;
	});
});
