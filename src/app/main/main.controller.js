(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', MainController]);


	function MainController($scope, canvas, $mdDialog, imageshapes) {
		console.log('controller initialize');
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
		    speed: 200,
		    circular: false,
		    visible: 16
		});

		$(".widget img").click(function() {
		   $(".widget .mid img").attr("src", $(this).attr("src"));
		});
		// monika js code
		//make actions panels draggable
	    $('.properties-panel').draggable();

	    // Do some initializing stuff
		var canvas = this.__canvas = new fabric.Canvas('c');

	    // monika js code end

		var SAVEREGION = function(){
			console.log($scope.region);
			var group = canvas.getActiveGroup();
			console.log(canvas);
		};

		var CANCELRESET = function(){
			$scope.region = {};
		};

		$scope.saveRegion = SAVEREGION;

		$scope.cancelReset = CANCELRESET;

		$scope.website = function(){
			var rect = new fabric.Rect({
			    left: 75,
			    top: 60,
			    originX: 'left',
			    originY: 'top',
			    width: 150,
			    height: 120,
			    fill: 'rgba(000,000,000,0.8)',
			    transparentCorners: false,
			    hasRotatingPoint: false
			  });
			canvas.add(rect).setActiveObject(rect);
		}
		$scope.email = function(){
			var rect = new fabric.Rect({
			    left: 75,
			    top: 60,
			    originX: 'left',
			    originY: 'top',
			    width: 150,
			    height: 120,
			    fill: 'rgba(000,000,000,0.8)',
			    transparentCorners: false,
			    hasRotatingPoint: false
			  });
			canvas.add(rect).setActiveObject(rect);
		}
	}


})();
