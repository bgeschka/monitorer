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
