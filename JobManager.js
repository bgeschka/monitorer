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
const Log = require('./Log')('JobManager');
const config = require("./config");
const Job = require('./Job');
const fs = require('fs');
require('./runtime');

const promise_io = require('./promise_io');

function lsdir(dir) {
	return fs.readdirSync(dir);
}

class JobManager {

	constructor() {
		Log.silly("start");
		this.jobs = [];
	}

	getJobByID(jobID) {
		var ret = this.jobs.filter( j => {
			return (j.jobID === jobID);
		})[0];
		if (!ret) Log.error("could not get job with id:",jobID);

		return ret;
	}
	removeJobByID(jobID) {
		this.jobs = this.jobs.filter( j => {
			return (j.jobID !== jobID);
		});
	}

	getJobsIDList() {
		var files = [];
		try {
			files = lsdir(config.jobsdir);
		} catch (e) {
			Log.warn("no existing jobs to read in", e);
		}

		files = files.filter( (e) => e.match(/\.json/));
		return files.map( f => f.replace(".json", ""));
	}

	async addJob(jid) {
		Log.silly('adding job:', jid);
		var nj = new Job();
		await nj.load(jid);
		this.jobs.push(nj);
	}

	async loadExistingJobs() {
		var self = this;
		var jids = this.getJobsIDList();

		for (var i = 0; i < jids.length; i++) {
			var jid = jids[i];
			await self.addJob(jid);
		}

		Log.silly("done loading existing jobs");
	}

	run() {
		this.jobs.filter( j => j.active ).forEach(j => {
			//Log.silly("running:", j.getjobID());
			j.run();
		});
	}

	async listAvailablePlugins(){
		var pfiles = lsdir(config.plugindir);

		var ret = [];
		for(var i = 0 ; i < pfiles.length; i++)
		{
			var pf = pfiles[i];
			var plugin = require(config.plugindir + '/' + pf);
			plugin.name = pf.replace(".js", "");
			ret.push(plugin);
		}

		return ret;
	}

	async listAllJobsFull() {
		var jids = this.getJobsIDList();
		var ret = [];
		for (var i = 0; i < jids.length; i++) {
			var fname = config.jobsdir + '/' + jids[i] + ".json";
			try {
				var data = await promise_io.promiseFileRead(fname);
				var j = JSON.parse(data);
				ret.push(j);
			} catch (e) {
				Log.error("failed to read", fname, e);
			}
		}

		return ret;
	}

	runFree(){
		var self = this;
		setInterval(function() {
			self.run();
		}, config.JobManagerLoopInterval);
	}

}

module.exports = JobManager;
