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
	'api/poll',
	'directives/panel/panel',
	'directives/gauge/gauge',
	'directives/spinner/spinner',
], function(app) {
	app.directive('jobview', [function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/jobview/jobview.html',
			scope: {
				job : '=ngModel'
			},
			replace: true,
			controller: function($scope,api,poll, plugins) {
				$scope.plugins = plugins;
				$scope.p = poll.create();
				$scope.p.run(function(next) {
					api.call({
						method:"lastresult",
						jobID: $scope.job.jobID
					}).then(function(result) {
						$scope.lastresult = result;
						$scope.waiting = !!($scope.lastresult.result.match(/__WAITING__/));
						console.log("set waiting:",$scope.waiting);
						next();
					}).catch( function (err) {
						console.err("failed:", err);
						next();
					});

				});

				$scope.$on('$destroy', function () {
					$scope.p.stop();
				});
			}
		};
	}]);
});
