(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', 'canvasservice', MainController]);


	function MainController($scope, canvasservice) {
		console.log('controller initialize');
		var self = this;
		$scope.region = {
			"x":0,
			"y":0,
			"width":100,
			"height":100,
			"pageWidth":1024,
			"pageHeight":768,
			"type": "",
			"target": ""
		};
		$scope.regionsimages = [
			{thumb: 'assets/images/1.jpg', img: 'assets/images/1.jpg', description: 'Image 1'},
			{thumb: 'assets/images/2.jpg', img: 'assets/images/2.jpg', description: 'Image 2'},
			{thumb: 'assets/images/3.jpg', img: 'assets/images/3.jpg', description: 'Image 3'},
			{thumb: 'assets/images/3.jpg', img: 'assets/images/4.jpg', description: 'Image 4'}
		];

		//canvasservice.start();

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
		var canvas = new fabric.Canvas('canvasid');

		canvas.on('object:selected', function(e){
			console.log( e.target.get('type') );
		});
		// monika js code end

		var SAVEREGION = function(){
			console.log($scope.region);
			var group = canvas.getActiveGroup();
			var canvasObject = canvas.getObjects();
			var jsonArray = []
			angular.forEach(canvasObject, function(v,k){
				//console.log(v, k);
				$scope.region = {
					"x": v.left,
					"y": v.top,
					"width": v.width,
					"height": v.height,
					"pageWidth": window.innerWidth,
					"pageHeight": window.innerHeight
				};
				jsonArray.push($scope.region);
						
			});
			console.log( jsonArray );
			//console.log(canvas.getActiveObject().get('type'));
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
			var email = new fabric.Rect({
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
			canvas.add(email).setActiveObject(email);
		}
		$scope.text = function(){
			var text = new fabric.IText('hello world',{
				left: 75,
				top: 60,
				fontFamily: 'Courier',
				fill: '#333'
			  });
			canvas.add(text).setActiveObject(text);
		}
		$scope.link = function(){
			var link = new fabric.Rect({
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
			canvas.add(link).setActiveObject(link);
		}
		$scope.video = function(){
			var video = new fabric.Rect({
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
			canvas.add(video).setActiveObject(video);
		}
		$scope.image = function(){
			var image = new fabric.Image($('#jcl-demo img')[0],{
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
			canvas.add(image).setActiveObject(image);
		}

	}


})();
