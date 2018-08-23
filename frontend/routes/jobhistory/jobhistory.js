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
	'directives/jobview/jobview',
	'directives/spinner/spinner',
], function(app) {
	var name = "jobhistory";
	app.controller(name, function($scope, $routeParams, api, poll, visuals) {
		$scope.jobid = $routeParams.jobid;

		$scope.history=[];

		$scope.loading = true;

		api.call({
			method:'getjob',
			jobID:$scope.jobid
		}).then( function (res) {
			$scope.job = res.result;
		});

		$scope.p = poll.create();
		$scope.p.run(function(next) {
			api.call({
				method: "jobhistory",
				jobID: $scope.jobid
			}).then(function(result) {
				$scope.loading = false;
				result.result.forEach(function(e) {
					e.$datenice = new Date(parseInt(e.time.replace(".out", "")));
				});

				angular.extend($scope.history, result.result);

				next();
			}).catch( function (err) {
				$scope.loading = false;
				$scope.error = err;
				console.error(err);
			});
		});

		$scope.$on('$destroy', function() {
			$scope.p.stop();
		});


		$scope.showfull = function (job) {
			function cb() {
			}
			visuals.pushModal("Job info {{job.$datenice | date:'medium'}}", "<pre>{{job.data}}</pre>", "", cb, "lg", {
				job:job
			});
		};



	});

	return {
		templateUrl: 'routes/' + name + '/' + name + '.html',
		controller: name
	};

});
