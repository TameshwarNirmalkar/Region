(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', 'canvasservice', MainController]);


	function MainController($scope, canvasservice) {
		console.log('controller initialize' );
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

		$scope.regiontype = 'Region Editor';

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
			//e.target.setOptions({"internal": true, "target": "blank" });
			console.log( e.target.get('type'), e.target );
		});
		// monika js code end

		var SAVEREGION = function(){
			var group = canvas.getActiveGroup();
			var canvasObject = canvas.getObjects();
			var jsonArray = []
			angular.forEach(canvasObject, function(v,k){
				$scope.region = {
					"x": v.left,
					"y": v.top,
					"width": v.width,
					"height": v.height,
					"pageWidth": window.innerWidth,
					"pageHeight": window.innerHeight,
					"type": v.type,
					"target": v.extraoptions.target,
					"options": {
					    "target": v.extraoptions.options 
					}

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

		function addRegion(type, options){
			var region = new fabric.Rect({
					left: 75,
					top: 60,
					originX: 'left',
					originY: 'top',
					width: 150,
					height: 120,
					fill: 'rgba(0,0,255,0.4)',
					transparentCorners: false,
					hasRotatingPoint: false,
					type: type
			  });
			region.setOptions(options);
			canvas.add(region).setActiveObject(region);
			$scope.regiontype = type;
		}

		$scope.website = function(){
			var options = {"extraoptions": {"target": "http://logostudio.papionne.com/?p=1363", "options": "blank"} };
			addRegion('website', options);
		}
		$scope.email = function(){
			var options = { "extraoptions": {"target": "tameshwar.nirmalkar@gmail.com"} };
			addRegion('email', options);
		}
		$scope.internal = function(){
			var options = { "extraoptions": {"target": "8"} };
			addRegion('internal', options);
		}
		$scope.phone = function(){
			var options = { "extraoptions": {"target": "000-000-0000"} };
			addRegion('phone', options);
		}
		$scope.video = function(){
			var options = { "extraoptions": {"target": "<iframe></iframe>"} };
			addRegion('video', options);
		}
		$scope.iframe = function(){
			var options = { "extraoptions": {"target": "http://logostudio.papionne.com/?p=1363"} };
			addRegion('iframe', options);
		}

	}


})();
