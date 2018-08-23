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
	'app'
], function(app) {
	app.directive('menuitem', [function() {
		return {
			restrict: 'A',
			template: '<a ng-click="tc()" href="{{path}}"><ng-transclude/></a>',
			transclude: true,
			scope: {
				tc: '=',
				path: '@'
			}
		};
	}]);

	var name = "menu";
	app.controller(name, function($scope, api, config, $interval) {
		$scope.sitename = config.sitename;

		if (config.debug) $scope.sitename += " DEBUG";

		$scope.isCollapsed = true;
		$scope.tc = function() {
			$scope.isCollapsed = !$scope.isCollapsed;

		};


		var tick = function() {
			$scope.clock = Date.now();
		};
		tick();
		$interval(tick, 1000);

	});

	return {
		templateUrl: 'routes/' + name + '/' + name + '.html',
		controller: name
	};
});
