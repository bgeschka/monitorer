const Log = require('../Log')('TEST-JOBMANAGER');
const JobManager = require('../JobManager');


(async() => {
	Log.debug("start");
	try {
		var n = new JobManager();
                Log.silly("list of plugins:", n.listAvailablePlugins());
		var jobs = await n.listAllJobsFull();
		Log.silly("list of jobs:", jobs);
		await n.loadExistingJobs();

		//setTimeout( function () {
		//	n.removeJobByID(jobs[0].jobID);
		//}, 5000);
		//

		//var pingjob = n.getJobByID("ZctnHncvgaRhE3PgYDp8OHmX");
		//setTimeout( function () {
		//	Log.debug("set ping Job to inactive");
		//	pingjob.active=true;
		//	pingjob.args.host="dd-wrt.com";
		//	pingjob.save();
		//}, 5000);

		setInterval(function() {
			n.run();
		}, 500);

		Log.debug("done the run");
	} catch (e) {
		Log.error("an error occured", e);
	}
	Log.debug("end");
})();
