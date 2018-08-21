define(['app'], function (app) {
    app.directive('spinner'  , [  function(){
        return {
            restrict: 'A',
            templateUrl: 'directives/spinner/spinner.html',
            transclude: true
        };

    }] );

});
