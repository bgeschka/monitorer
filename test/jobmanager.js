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
