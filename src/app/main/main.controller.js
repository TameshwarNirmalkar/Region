(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', 'canvas', '$mdDialog',MainController]);


	function MainController($scope, canvas) {
		console.log('controller initialize', canvas);
		var self = this;
		$scope.region = {};
	    $scope.regionsimages = [
	        {thumb: 'assets/images/1.jpg', img: 'assets/images/1.jpg', description: 'Image 1'},
	        {thumb: 'assets/images/2.jpg', img: 'assets/images/2.jpg', description: 'Image 2'},
	        {thumb: 'assets/images/3.jpg', img: 'assets/images/3.jpg', description: 'Image 3'},
	        {thumb: 'assets/images/3.jpg', img: 'assets/images/4.jpg', description: 'Image 4'}
	    ];

	    $(".widget .carousel").jCarouselLite({
		    btnNext: ".widget .next",
		    btnPrev: ".widget .prev",
		    speed: 800,
		    circular: false
		});

		$(".widget img").click(function() {
		   $(".widget .mid img").attr("src", $(this).attr("src"));
		});

		var SAVEREGION = function(){
			console.log($scope.region);
		};

		var CANCELRESET = function(){
			$scope.region = {};
		};

		$scope.saveRegion = SAVEREGION;

		$scope.cancelReset = CANCELRESET;
	}


})();
