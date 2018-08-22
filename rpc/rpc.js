const Log = require('../Log')('Router');
const extend = require('../extend');
const Job = require('../Job');
const fs = require('fs');
const config = require("../config");


function jsonresponse(res,jso) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(jso));
}

function jsonresponseDone(res) {
	jsonresponse(res, { code: 0 });
}


module.exports = function(app, jm) {
	app.post('/rpc', async (req, res) => {

		switch (req.body.method) {
			case 'listjobs':
				jsonresponse(res,await jm.listAllJobsFull());
				break;
			case 'listplugins':
				jsonresponse(res,await jm.listAvailablePlugins());
				break;
			case 'deletejob':
				var data = req.body.data;
				var job = jm.getJobByID(data.jobID);
				jm.removeJobByID(job.getjobID());
				job.remove();
				jsonresponseDone(res);
				break;
			case 'updatejob':
				var data = req.body.data;
				var job = jm.getJobByID(data.jobID);
				extend(job, data);
				job.resetLastResult();
				job.save();
				jsonresponseDone(res);
				break;
			case 'addjob':
				var n = new Job();
				n.create(req.body.data);
				await n.save();
				await jm.addJob(n.getjobID());
				jsonresponse(res, n.toJsonString() );
				break;
			case 'lastresult':
				var job = jm.getJobByID(req.body.jobID);
				var lr = job.getLastResult();

				jsonresponse(res, {
					result: lr
				});
				break;

			case 'getjob':
				var job = jm.getJobByID(req.body.jobID);
				jsonresponse(res, {
					result: job.toJson()
				});
				break;

			case 'jobhistory':
				var job = jm.getJobByID(req.body.jobID);
				var hist = await job.getHistory();

				jsonresponse(res, {
					result: hist
				});
				break;

			case 'setconfig':
				fs.writeFileSync(config.configpath, JSON.stringify(req.body.config) );
			case 'getconfig':
                                var conf = {};
				try {
					conf = JSON.parse(fs.readFileSync(config.configpath).toString());
				} catch (e) {
					conf = {};
					Log.debug("no config present, using", conf);
				}

				if (conf === "") conf = {};

				jsonresponse(res, {
					config : conf
				});
				break;

			default:
				jsonresponse(res, {
					result: 'no method found ' + req.body.method
				});
				break;

		}

		res.end();
		Log.silly("post to rpc", req.body);
	});
};
