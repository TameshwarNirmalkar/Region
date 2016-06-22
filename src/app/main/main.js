(function(){

	'use strict';

	angular.module('regionapp',['ngMaterial','ui.router', 'jkuri.gallery', 'main.controller'])
		.config(['$stateProvider','$urlRouterProvider', routeConfig])
		.run(['$templateRequest', runConfig]);
		//.controller('MainCntrl' ['$scope', MainCntrl]);

		function routeConfig($stateProvider, $urlRouterProvider) {
			console.log('reoute start');
			$urlRouterProvider.otherwise('/');
			$stateProvider
		        .state('home', {
		            url: '/',
		            templateUrl: 'app/main/main.temp.html',
		            controller: 'MainController'
		        })
		        
		}
		/*Run config*/
		function runConfig($templateRequest) {
		    var urls = [];
		    angular.forEach(urls, function(url) {
		      $templateRequest(url);
		    });
		}


})();