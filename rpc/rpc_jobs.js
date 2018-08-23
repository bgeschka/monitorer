/*
 * Copyright 2018 Björn Geschka <bjoern@geschka.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
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
			if(!job) return;
			jm.removeJobByID(job.getjobID());
			job.remove();
			jsonresponseDone(res);
			break;
		case 'updatejob':
			var data = req.body.data;
			var job = jm.getJobByID(data.jobID);
			if(!job) return;
			extend(job, data);
			job.resetLastResult();
			job.save();
			jsonresponseDone(res);
			break;
		case 'lastresult':
			var job = jm.getJobByID(req.body.jobID);
			if(!job) return;
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
			if(!job) return;
			jsonresponse(res, {
				result: job.toJson()
			});
			break;

		case 'run':
			var job = jm.getJobByID(req.body.jobID);
			if(!job) return;
			await job.runReal();
			jsonresponse(res, {
				result: job.getLastResult()
			});
			break;

		case 'jobhistory':
			var job = jm.getJobByID(req.body.jobID);
			if(!job) return;
			var hist = await job.getHistory();

			jsonresponse(res, {
				result: hist
			});
			break;
	}
};
