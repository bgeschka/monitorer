const Log = require('../Log')('TEST-JOB');
const Job = require('../Job');


(async () => {
	Log.debug("creating a new ping job");
	var n = new Job();

	n.create({
		pluginname:"curl",
		args:{"host":"google.com"},
		active:true,
		sched:"0 * * * * *"
	});


	await n.run();
	Log.debug("done");
})();
