const Log = require('./Log')('Main');
const config = require("./config");
const JobManager = require('./JobManager');
const express = require('express');
const rpc = require('./rpc/rpc');
const bodyParser = require('body-parser');

(async () => {

	Log.info("Starting JobManager");
	var jm = new JobManager();
	Log.info("Loading existing jobs");
	await jm.loadExistingJobs();
	jm.runFree();

	var app = express();
	app.use(bodyParser());
	/*static hosting files*/

        rpc(app,jm);

	app.use(express.static(__dirname + config.frontenddir));
	app.listen(config.listenport,config.listenip);

	Log.info("listening for connections from:", config.listenip, "on port:", config.listenport);
})();
