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
