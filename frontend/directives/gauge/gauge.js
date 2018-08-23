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
/*global Gauge*/
define([
	'app',
], function(app) {
	app.directive('gauge', function($timeout) {
		return {
			restrict: 'EA',
			replace: true,
			template: '<div class="gauge-container"><div ng-transclude></div></div>',
			transclude: true,

			scope: {
				gmin: "=",
				gbad: "=",
				gmax: "=",
				gdata: "="
			},

			link: function(scope, element) {
				function init() {
					if (!scope.g && scope.gdata && scope.gmin && scope.gmax ) {
						scope.g = Gauge(element[0], {
							min: parseInt(scope.gmin),
							max: parseInt(scope.gmax),
							dialStartAngle: 180,
							dialEndAngle: 0,
							value: -100,
							color: function(value) {
								if (value > scope.gbad)
									return "red";

								return "green";
							}
						});
					}
				};
				init();

				scope.needsdraw = true;
				scope.$watch('gdata', function() {
					if (scope.needsdraw) {
						scope.needsdraw = false;
						draw(function() {
							scope.needsdraw = true;
						});
					}
				});


				var doneTimeo = 100;

				function draw(done) {
					var val = parseInt(scope.gdata); //-80;
					if (!scope.g) {
						init();
						$timeout(function () { //Retry 
							draw(done);
						}, 300);
						return;
					}

					console.log("draw set val : ", val);
					scope.g.setValueAnimated(val, 1 /*animation duration*/ );
					$timeout(done, doneTimeo);
				}
			}
		};
	});

});
