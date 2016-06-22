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
		// monika js code
		//make actions panels draggable
	    $('.properties-panel').draggable();

	    // Do some initializing stuff
		var canvas = this.__canvas = new fabric.Canvas('c');

		  var rect = new fabric.Rect({
		    left: 150,
		    top: 200,
		    originX: 'left',
		    originY: 'top',
		    width: 150,
		    height: 120,
		    angle: -10,
		    fill: 'rgba(000,000,000,0.8)',
		    transparentCorners: false,
		    hasRotatingPoint: false
		  });

		  

		  function observeBoolean(property) {
		    document.getElementById(property).onclick = function() {
		      canvas.item(0)[property] = this.checked;
		      canvas.renderAll();
		    };
		  }

		  function observeNumeric(property) {
		    document.getElementById(property).onchange = function() {
		      canvas.item(0)[property] = this.value;
		      canvas.renderAll();
		    };
		  }

		  function observeOptionsList(property) {
		    var list = document.querySelectorAll('#' + property + 
		    ' [type="checkbox"]');
		    for (var i = 0, len = list.length; i < len; i++) {
		      list[i].onchange = function() {
		        canvas.item(0)[property](this.name, this.checked);
		        canvas.renderAll();
		      };
		    };
		  }
	    // monika js code end

		var SAVEREGION = function(){
			console.log($scope.region);
		};

		var CANCELRESET = function(){
			$scope.region = {};
		};

		$scope.saveRegion = SAVEREGION;

		$scope.cancelReset = CANCELRESET;

		$scope.website = function(){
			canvas.add(rect).setActiveObject(rect);
		}
	}


})();
