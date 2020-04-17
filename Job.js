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
/*
 * job handles:
 *	running the given plugin with pluginname
 *	archive results
 *	store/load
 *
 */


const rand = require('./rand');
const fs = require('fs');
const Log = require('./Log')('Job');
const config = require("./config");
const Schedule = require('./schedule');
const JOBIDLEN = 24;
const extend = require('./extend');
const rimraf = require('rimraf');
const promise_io = require('./promise_io');
const Mail = require('./mail');
const path = require('path');
const userconfig = require('./userconfig');

require('./runtime');

const E_BAD = "BAD";

function lsdir(dir) {
	return fs.readdirSync(dir);
}


function cleandir(dir, olderthanhours) {
	fs.readdir(dir, function(err, files) {
		if (err) return;

		files.forEach(function(file) {
			fs.stat(path.join(dir, file), function(err, stat) {
				var endTime, now;
				if (err) {
					return console.error(err);
				}
				now = new Date().getTime();
				endTime = new Date(stat.ctime).getTime() + (olderthanhours * 3600000);
				if (now > endTime) {
					return rimraf(path.join(dir, file), function(err) {
						if (err) {
							return console.error(err);
						}
					});
				}
			});
		});
	});
}


class Job {
	constructor() {
		Log.silly("create Job object");
		this.$lastresult = "__WAITING__";
		this.transportname = 'local';
		this.$badcount = 0;
		this.badthreshold = 0;
	}

	clean() {
		Log.silly('performing clean on:', this.getHistoryPath());
		var usercfg = userconfig.get();
		cleandir(this.getHistoryPath(), usercfg.logkeep || 1);
	}

	resetLastResult() {
		this.$lastresult = "__WAITING__";
	}

	loadPlugin() {
		if (this.$plugin) return;
		var pp = './plugins/' + this.pluginname;
		Log.silly("load plugin:", pp);
		this.$plugin = require(pp);
	}

	loadTransport() {
		if (this.$transport) return;
		var pp = './transports/' + this.transportname;
		Log.silly("load transport:", pp);
		this.$transport = require(pp);
	}

	loadSched() {
		if (this.$sched) return;
		this.$sched = new Schedule();
		this.$sched.set(this.sched);
	}

	/*create a new one*/
	create(opts) {
		Log.silly("create new Job");
		extend(this, opts);

		this.jobID = rand(JOBIDLEN);
		this.active = true;
		this.loadSched();
		this.save();
	}

	compile(cmdtemplate, args) {
		Log.silly("compile");
		var cpy = cmdtemplate;
		for (var tn in args) {
			cpy = cpy.replace('{' + tn + '}', args[tn]);
		}
		return cpy;
	}

	compileCommand() {
		this.loadPlugin();
		var compiled = this.compile(this.$plugin.command, this.args);
		return compiled;
	}

	getJobIdentifier() {
		return this.name + ' ' + this.pluginname + ' ' + this.getjobID();
	}

	getjobID() {
		return this.jobID;
	}

	composeMail(ident, headline, result) {
		var msg = `
		<html>
			<h3>` + headline + ` ` + ident + `</h3>

			Result:
			<pre>` + result + `</pre>
		</html>
		`;
		return msg;
	}

	async notifyBad(result) {
		Log.silly("mailing bad status");
		var ident = this.getJobIdentifier();
		await Mail(config.systemname + " [BAD]: " + ident, this.composeMail(ident, "Job Gone Bad", result));
	}

	async goneBad(result) {
		this.$badcount++;
		Log.error("service going bad:", this.$badcount);
		if (this.$badcount > this.badthreshold) {
			if (!this.$bad) {
				this.$bad = true;
				Log.error("notify about bad state");
				await this.notifyBad(result);
			} else {
				Log.silly("bad already mailed");
			}
		}

		return E_BAD + '\n' + result;
	}

	async goneGood(result) {
		this.$badcount=0;
		if (this.$bad) {
			this.$bad = false;
			var ident = this.getJobIdentifier();
			await Mail(config.systemname + " [GOOD]: " + ident, this.composeMail(ident, "Job Gone Good", result));
		}
	}

	async runReal() {
		this.loadTransport();
		var cmd = this.compileCommand();
		Log.silly("run:", cmd);
		var result = '';
		try {
			result = await this.$transport.exec(this.transportargs, cmd);
		} catch (e) {
			Log.error('failed on executing', cmd, e.toString());
			result = await this.goneBad(e.toString());
		}
		var _result = result;

		Log.silly("[" + cmd + "] result:", result.substring(0, 40));
		if (!result) result = await this.goneBad(_result);

		try {
			if (this.$plugin.parse) {
				result = this.$plugin.parse(result, this.args);
			}

			if (this.$plugin.bad) {
				if (this.$plugin.bad(result, this.args)) {
					Log.error("plugin returned bad status");
					result = await this.goneBad(_result);
				}
			}
		} catch (e) {
			Log.error('Failed in plugin functions', e);
			result = await this.goneBad(_result);
		}

		if (!result.match(E_BAD)) await this.goneGood(result);

		this.$lastresult = result;
		this.archiveResult(result);
	}

	async run() {
		if (!this.active) {
			Log.silly("inactive", this.getjobID());
			return;
		}

		if (!this.$sched.check()) {
			return;
		}

		await this.runReal();
	}

	getFileName() {
		return config.jobsdir + "/" + this.jobID + ".json";
	}

	getHistoryPath() {
		var d = config.jobsdir + "/" + this.jobID;
		try {
			fs.mkdirSync(d);
		} catch (e) {
			//Log.error("failed to mkdir", e);
		}
		return d;
	}

	//load and instantiate from disk
	load(jobID) {
		this.jobID = jobID;
		Log.silly("load", jobID);
		var srcfile = this.getFileName();
		var self = this;

		return new Promise((resolve, reject) => {
			fs.readFile(srcfile, (err, data) => {
				if (err) {
					Log.error("failed to load:", err, srcfile);
					reject(err);
				} else {
					var d = data.toString();
					Log.silly("reconstruct from:", d);
					try {
						self.fromJsonString(d);
					} catch (e) {
						Log.error("failed to json parse:", e, "data:", d, "buffer:", data, "readreturn", err);
					}
					resolve(data);
				}

			});
		});
	}

	async reload() {
		Log.debug("reloading job");
		await this.load(this.getjobID());
		this.$plugin = null;
		this.$transport = null;
		this.$sched = null;
		this.loadPlugin();
		this.loadTransport();
		this.loadSched();
	}

	//parse and set the values from str
	fromJsonString(str) {
		var jso = JSON.parse(str);
		for (var f in jso) this[f] = jso[f];
		this.loadSched();
	}

	//store current state to disk
	async save() {
		var self = this;
		return new Promise((resolve, reject) => {
			var dstfile = self.getFileName();
			var data = self.toJsonString(); //JSON.stringify(this);
			fs.writeFile(dstfile, data, function(err) {
				if (err) {
					Log.error("failed to load:", err, dstfile);
					reject(err);
				} else {
					resolve();
				}
			});
		});

	}
	//store to history disk
	archiveResult(result) {
		var dst = this.getHistoryPath();
		var cd = new Date();

		this.clean();
		fs.writeFile(dst + "/" + cd.getTime() + ".out", result, function() {
			Log.silly("wrote file");
		});
	}

	toJson() {
		var cpy = JSON.parse(JSON.stringify(this));
		for (var f in cpy) {
			if (f.match(/^\$/)) delete cpy[f];
		}
		return cpy;
	}

	toJsonString() {
		var cpy = this.toJson();
		return JSON.stringify(cpy);
	}

	getLastResult() {
		return this.$lastresult || 'none';
	}

	//get the history n times back
	async getHistory() {
		var histp = this.getHistoryPath();
		var files = lsdir(histp);
		var ret = [];
		for (var i = 0; i < files.length; i++) {
			var o = {
				time: files[i],
				data: await promise_io.promiseFileRead(histp + "/" + files[i])
			};
			ret.push(o);
		}
		return ret;
	}

	//delete everthing of the job
	remove() {
		rimraf(this.getHistoryPath(), function() {
			Log.silly('deleted all history');
		});
		fs.unlinkSync(this.getFileName());
		this.active = false;
	}
}

module.exports = Job;
