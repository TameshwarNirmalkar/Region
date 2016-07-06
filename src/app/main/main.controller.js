(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', 'canvasservice', '$timeout', MainController]);


	function MainController($scope, canvasservice, $timeout) {
		var self = this;
		$scope.region = {
			"x":0,
			"y":0,
			"width":100,
			"height":100,
			"pageWidth":1024,
			"pageHeight":768,
			"type": "",
			"target": "",
			"options": {
				"target": "blank"
			}
		};
		$scope.elementlabel = '';
		$scope.regiontypeLabel = 'Region Editor';
		$scope.targetopt = ('blank self').split(' ').map(function (op) { return { abbrev: op }; });
		$scope.regionsimages = [
			{img: 'assets/images/1.jpg', description: 'Image 1'},
			{img: 'assets/images/2.jpg', description: 'Image 2'},
			{img: 'assets/images/3.jpg', description: 'Image 3'},
			{img: 'assets/images/4.jpg', description: 'Image 4'},
			{img: 'assets/images/5.jpg', description: 'Image 5'},
			{img: 'assets/images/6.jpg', description: 'Image 6'},
			{img: 'assets/images/7.jpg', description: 'Image 7'},
			{img: 'assets/images/8.jpg', description: 'Image 8'},
			{img: 'assets/images/9.jpg', description: 'Image 9'},
			{img: 'assets/images/10.jpg', description: 'Image 10'},
			{img: 'assets/images/1.jpg', description: 'Image 1'},
			{img: 'assets/images/2.jpg', description: 'Image 2'},
			{img: 'assets/images/3.jpg', description: 'Image 3'},
			{img: 'assets/images/4.jpg', description: 'Image 4'},
			{img: 'assets/images/5.jpg', description: 'Image 5'},
			{img: 'assets/images/6.jpg', description: 'Image 6'},
			{img: 'assets/images/7.jpg', description: 'Image 7'},
			{img: 'assets/images/8.jpg', description: 'Image 8'},
			{img: 'assets/images/9.jpg', description: 'Image 9'},
			{img: 'assets/images/10.jpg', description: 'Image 10'},
			{img: 'assets/images/1.jpg', description: 'Image 1'},
			{img: 'assets/images/2.jpg', description: 'Image 2'},
			{img: 'assets/images/3.jpg', description: 'Image 3'},
			{img: 'assets/images/4.jpg', description: 'Image 4'},
			{img: 'assets/images/5.jpg', description: 'Image 5'},
			{img: 'assets/images/6.jpg', description: 'Image 6'},
			{img: 'assets/images/7.jpg', description: 'Image 7'},
			{img: 'assets/images/8.jpg', description: 'Image 8'},
			{img: 'assets/images/9.jpg', description: 'Image 9'},
			{img: 'assets/images/10.jpg', description: 'Image 10'},
			{img: 'assets/images/1.jpg', description: 'Image 1'},
			{img: 'assets/images/2.jpg', description: 'Image 2'},
			{img: 'assets/images/3.jpg', description: 'Image 3'},
			{img: 'assets/images/4.jpg', description: 'Image 4'},
			{img: 'assets/images/5.jpg', description: 'Image 5'},
			{img: 'assets/images/6.jpg', description: 'Image 6'},
			{img: 'assets/images/7.jpg', description: 'Image 7'},
			{img: 'assets/images/8.jpg', description: 'Image 8'},
			{img: 'assets/images/9.jpg', description: 'Image 9'},
			{img: 'assets/images/10.jpg', description: 'Image 10'}
		];



		function sliderInitialize(){
			$(".widget .carousel").jCarouselLite({
				btnNext: ".widget .next",
				btnPrev: ".widget .prev",
				speed: 200,
				circular: false,
				visible: 16,
				beforeStart: function(item){
					console.log('beforeStart');
				},
				afterEnd: function(item){
					console.log('afterEnd');
				}
			});

			$(".widget img").click(function() {
			   $(".widget .mid img").attr("src", $(this).attr("src"));
			});
		}
		$timeout(function(){
			sliderInitialize();
		})
		//make actions panels draggable
		$('.properties-panel').draggable();

		// Do some initializing stuff
		var canvas = new fabric.Canvas('canvasid');

		canvas.on('object:selected', function(e){
			//e.target.setOptions({"internal": true, "target": "blank" });
			console.log( e.target.get('type'), e.target );
			$timeout(function(){
				$scope.regiontypeLabel = e.target.type;
				$scope.region.target = e.target.target;
				$scope.elementlabel = e.target.elementlabel;
			})
		});

		var SAVEREGION = function(){
			var group = canvas.getActiveGroup();
			var canvasObject = canvas.getObjects();
			var jsonArray = [];
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
			//canvas.getActiveGroup().each(function(o){ canvas.remove(o) });
			//console.log( canvas.getObjects().length );
			var curSelectedObjects = canvas.getObjects();
			// for (var i = 0; i < curSelectedObjects.length; i++)
			// {
			// 	canvas.remove(curSelectedObjects[i]);
			// }
		 	canvas.clear();
		    $scope.regiontypeLabel = 'Region Editor';
		    $scope.elementlabel = '';
		};

		$scope.saveRegion = SAVEREGION;

		$scope.cancelReset = CANCELRESET;

		function addRegion(options){
			var region = new fabric.Rect({
					left: 75,
					top: 60,
					width: 250,
					height: 60,
					fill: 'rgba(63,81,181,0.8)',
					transparentCorners: false,
					hasRotatingPoint: false,
					type: options.extraoptions.type,
					target: options.extraoptions.target,
					elementlabel: options.extraoptions.elementlabel
			  });
			$timeout(function(){
				region.setOptions(options);
				canvas.add(region).setActiveObject(region);
				$scope.regiontypeLabel = options.extraoptions.type;
			})
		}
		$scope.internal = function(){
			var options = { "extraoptions": {"type": "internal","target": 1, "elementlabel": "Page Number"} };
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};
		$scope.website = function(){
			var options = {"extraoptions": {"type":"website", "target": "http://logostudio.papionne.com/?p=1363", "options": "blank", "elementlabel": "Url"} };
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};
		$scope.email = function(){
			var options = { "extraoptions": {"type":"email", "target": "tameshwar.nirmalkar@gmail.com", "elementlabel": "Email Address"} };
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};
		$scope.phone = function(){
			var options = { "extraoptions": {"type":"phone","target": "000-000-0000", "elementlabel": "Phone Number"} };
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};
		$scope.video = function(){
			var options = { "extraoptions": {"type":"video","target": "<iframe></iframe>", "elementlabel": "Video Embded Code"} };
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};
		$scope.iframe = function(){
			var options = { "extraoptions": {"target": "http://logostudio.papionne.com/?p=1363", "elementlabel": "Iframe URL"} };
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion('iframe', options);
		};

		$scope.changeall = function(val){ 
			if(canvas.getActiveObject()){
				canvas.getActiveObject().setOptions({"target": val})
			}
		};

	}


})();
