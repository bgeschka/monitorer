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
define([
	'app',
	'directives/labledrow/labledrow',
	'directives/cronsetting/cronsetting'
], function(app) {
	var name = "jobs";
	app.controller(name, function($scope,api,visuals,plugins,transports,session,config) {
		$scope.config = config;
		$scope.session=session;
		$scope.plugins = plugins;
		$scope.transports = transports;

		$scope.searchtext="";
		$scope.defaultjob = {
			$new: true,
			$edit: true,
			pluginname : 'ping',
			transportname : 'local',
			sched: '0 * * * * *',
			args : {},
			active: true
		};

		$scope.getDefaultJob = function() {
			return JSON.parse(JSON.stringify($scope.defaultjob));
		};

		$scope.jobs = [];
		api.call({
			method: 'listjobs'
		}).then(function(jobs) {
			jobs.forEach(function(job) {
				var a = [];

				for (var f in job.args) a.push(job.args[f]);

				job.$argsnice = a.join(",");
			});

			angular.extend($scope.jobs, jobs);
		});

		$scope.runAll = function () {
			$scope.jobs.forEach( j => $scope.run(j));
		};

		$scope.run = function(job) {
			visuals.pushSpinner();
			api.call({
				method: 'run',
				jobID: job.jobID
			}).then(function(res) {
				visuals.popSpinner();
				console.log(res);
				//visuals.pushModal('result of:' + job.name, res.result);

				visuals.pushModal('result of:' + job.name, "<pre>{{result}}</pre>", "", function () {
				}, "lg", {
					result:res.result
				});
			}).catch( function (err) {
				visuals.popSpinner();
				visuals.pushModal('faild to run:' + job.name, err);
			});
		};

		$scope.save = function(job, frm) {
			var m = job.$new ? 'addjob' : 'updatejob';
			api.call({
				method: m,
				data: job
			}).then(function(res) {

				if (job.$new) {
					angular.extend(job, res);
					job.$new = false;
				}

				if(frm) frm.$setPristine();
				console.log(m, "job");
			});
		};

		$scope.remove = function(job) {
			if(job.$new) {
				var idx = $scope.jobs.indexOf(job);
				if (idx !== -1) {
					$scope.jobs.splice(idx, 1);
				}
				return;
			}

			api.call({
				method: 'deletejob',
				data: job
			}).then(function() {
				var idx = $scope.jobs.indexOf(job);
				if (idx !== -1) {
					$scope.jobs.splice(idx, 1);
				}
			});
		};

		//create dummy jobs
		$scope.createDummyJobs = function() {
			var jobscount = 10;
			for(var i = 0 ; i < jobscount; i++)
			{
				var nj = $scope.getDefaultJob();
				nj.$edit= false;
				$scope.jobs.push(nj);
				nj.args["host"]="127.0.0.1";
				nj.args["count"]="1";
				nj.name = api.rand(10);
				$scope.save(nj);

			}

			for(var i = 0 ; i < jobscount ; i++)
			{
				var nj = $scope.getDefaultJob();
				nj.$edit= false;
				$scope.jobs.push(nj);
				nj.pluginname = "disk";
				nj.args["disk"]="/";
				nj.name = api.rand(10);
				$scope.save(nj);

			}

			for(var i = 0 ; i < jobscount ; i++)
			{
				var nj = $scope.getDefaultJob();
				nj.$edit= false;
				$scope.jobs.push(nj);
				nj.pluginname = "curl";
				nj.args["host"]="www.google.com";
				nj.args["expectstring"]="";
				nj.name = api.rand(10);
				$scope.save(nj);

			}
		};
	});

	return {
		templateUrl: 'routes/' + name + '/' + name + '.html',
		controller: name
	};

});
