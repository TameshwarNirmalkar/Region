(function(){

	'use strict';

	angular.module('regionapp', ['ngMaterial', 'ui.router', 'ngResource', 'main.controller'])
		.config(['$stateProvider','$urlRouterProvider', '$mdThemingProvider', routeConfig])
		.run(['$templateRequest', runConfig]);
		//.controller('MainCntrl' ['$scope', MainCntrl]);

		function routeConfig($stateProvider, $urlRouterProvider, $mdThemingProvider) {
			$mdThemingProvider.theme('success-toast');
			$mdThemingProvider.theme('error-toast');
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