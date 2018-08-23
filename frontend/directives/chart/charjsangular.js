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
/*global Chart*/
define([
	'app',
], function(app) {
	app.directive('chart', function($timeout, config) {
		return {
			restrict: 'EA',
			replace: true,
			template: "<canvas>Your browser doesn't support HTML5</canvas>",

			scope: {
				width: "@",
				height: "@",
				type: "@",
				data: "="
			},

			link: function(scope, element, attrs) {
				var type = "Line";
				var opts = angular.extend({}, scope.$eval(attrs.options));
				opts.title = {
					display: true
				};
				opts.tooltips = {
					enabled: false
				};
				opts.showTooltips = false;
				opts.elements = {
					point: {
						radius: 0
					}
				};
				opts.animation = true;
				opts.animationSteps = 30;

				opts.responsive = true;
				Chart.defaults.Line.pointDot = false;


				scope.needsdraw = true;
				scope.$watch('data', function() {
					if (scope.needsdraw) {
						scope.needsdraw = false;
						draw(function() {
							scope.needsdraw = true;
						});
					}
				}, true);

				if (!scope.g) scope.g = new Chart(element[0].getContext("2d"))[type](scope.data, opts);

				var doneTimeo = 100;
				var maxpoints = config.maxchartdata;

				function draw(done) {
					if (scope.data.datasets[0].data.length == 0) {
						$timeout(done, doneTimeo);
						return;
					}

					var last = scope.data.datasets.map(function(ds) {
						return ds.data[ds.data.length - 1];
					});
					scope.g.addData(last, '.');
					if (scope.data.datasets[0].data.length >= maxpoints) scope.g.removeData();

					$timeout(done, doneTimeo);
				}
			}
		};
	});

});
