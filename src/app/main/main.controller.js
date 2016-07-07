(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', '$timeout', 'CanvasService', MainController]);


	function MainController($scope, $timeout, CanvasService) {
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
		$scope.targetopt = CanvasService.getOptions();
		$scope.regionsimages = CanvasService.getImages();
		
		$timeout(function(){
			$(".widget .carousel").jCarouselLite({
				btnNext: ".widget .next",
				btnPrev: ".widget .prev",
				speed: 300,
				circular: false,
				visible: 1,
				beforeStart: function(item){
					CanvasService.beforeStart(item);
				},
				afterEnd: function(item){
					CanvasService.afterEnd(item);
				}
			});

			$(".widget img").click(function() {
			   $(".widget .mid img").attr("src", $(this).attr("src"));
			});
		})
		//make actions panels draggable
		$('.properties-panel').draggable();

		// Do some initializing stuff
		var canvas = new fabric.Canvas('canvasid');

		canvas.on('object:selected', function(e){
			//e.target.setOptions({"internal": true, "target": "blank" });
			console.log( e.target.get('type'), e.target.target );
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
					"target": v.target,
					"options": {
						"target": v.options 
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
			var options = CanvasService.getRegionOptions().internal;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};
		$scope.website = function(){
			var options = CanvasService.getRegionOptions().website;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};
		$scope.email = function(){
			var options = CanvasService.getRegionOptions().email;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};
		$scope.phone = function(){
			var options = CanvasService.getRegionOptions().phone;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};
		$scope.video = function(){
			var options = CanvasService.getRegionOptions().video;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};
		$scope.iframe = function(){
			var options = CanvasService.getRegionOptions().iframe;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			addRegion(options);
		};

		$scope.changeall = function(val){ 
			if(canvas.getActiveObject()){
				canvas.getActiveObject().setOptions({"target": val})
			}
		};

	}


})();
