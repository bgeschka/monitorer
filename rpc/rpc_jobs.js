const extend = require('../extend');
const Job = require('../Job');
const { jsonresponse, jsonresponseDone } = require('./rpc_common');

module.exports = async (jm,req,res) => {

	switch (req.body.method) {
		case 'listjobs':
			jsonresponse(res,await jm.listAllJobsFull());
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
		case 'lastresult':
			var job = jm.getJobByID(req.body.jobID);
			var lr = job.getLastResult();

			jsonresponse(res, {
				result: lr
			});
			break;

		case 'addjob':
			var n = new Job();
			n.create(req.body.data);
			await n.save();
			await jm.addJob(n.getjobID());
			jsonresponse(res, n.toJson() );
			break;

		case 'getjob':
			var job = jm.getJobByID(req.body.jobID);
			jsonresponse(res, {
				result: job.toJson()
			});
			break;

		case 'run':
			var job = jm.getJobByID(req.body.jobID);
			await job.runReal();
			jsonresponse(res, {
				result: job.getLastResult()
			});
			break;

		case 'jobhistory':
			var job = jm.getJobByID(req.body.jobID);
			var hist = await job.getHistory();

			jsonresponse(res, {
				result: hist
			});
			break;
	}
};
