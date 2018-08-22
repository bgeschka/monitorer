const Log = require('../Log')('Router');
const config = require("../config");

const { jsonresponse } = require('./rpc_common');

const rpc_jobs = require('./rpc_jobs');
const rpc_config = require('./rpc_config');
const rpc_transport = require('./rpc_transport');

module.exports = function(app, jm) {
	app.post('/rpc', async (req, res) => {

		await rpc_jobs(jm,req,res);
		rpc_config(config,req,res);
		await rpc_transport(req,res);


		switch (req.body.method) {
			case 'listplugins':
				jsonresponse(res,await jm.listAvailablePlugins());
				break;
		}

		res.end();
		Log.silly("post to rpc", req.body);
	});
};
