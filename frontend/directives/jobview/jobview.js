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
	'directives/jobresult/jobresult',
], function(app) {
	app.directive('jobview', [function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/jobview/jobview.html',
			scope: {
				job : '=ngModel'
			},
			replace: true,
			controller: function($scope, api, visuals) {
				$scope.run = function(job,silent) {
					if(!silent) visuals.pushSpinner();
					api.call({
						method: 'run',
						jobID: job.jobID
					}).then(function(res) {
						if(!silent) visuals.popSpinner();
						console.log(res);
						//visuals.pushModal('result of:' + job.name, res.result);

						visuals.pushModal('result of:' + job.name, "<pre>{{result}}</pre>", "", function () {
						}, "lg", {
							result:res.result
						});
					}).catch( function (err) {
						if(!silent) visuals.popSpinner();
						if(!silent) visuals.pushModal('faild to run:' + job.name, err);
					});
				};
			}
		};
	}]);
});
