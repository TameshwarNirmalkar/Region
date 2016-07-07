(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', '$timeout', 'CanvasService', MainController]);


	function MainController($scope, $timeout, CanvasService) {
		var self = this;
		var canvas = new fabric.Canvas('canvasid');
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
		$scope.isCanvasVisible = false;

		$timeout(function(){
			$(".widget .carousel").jCarouselLite({
				btnNext: ".widget .next",
				btnPrev: ".widget .prev",
				speed: 300,
				circular: false,
				visible: 1,
				easing: "easeOutBounce",
				beforeStart: function(item, canvas){
					console.log( item.length );
					CanvasService.beforeStart(angular.element(item).find('img')[0], canvas);
				},
				afterEnd: function(item, canvas){
					console.log( item.length );
					CanvasService.afterEnd(angular.element(item).find('img')[0], canvas);
				}
			});

			$(".widget img").click(function() {
			   $(".widget .mid img").attr("src", $(this).attr("src"));
			});
			
			//make actions panels draggable
			$('.properties-panel').draggable();
		})

		canvas.on('object:selected', function(e){
			//e.target.setOptions({"internal": true, "target": "blank" });
			// console.log( e.target.get('type'), e.target.target );
			$timeout(function(){
				$scope.regiontypeLabel = e.target.type;
				$scope.region.target = e.target.target;
				$scope.elementlabel = e.target.elementlabel;
				$scope.isCanvasVisible = true;
			})
		});

		canvas.on('before:selection:cleared', function(e){
			$timeout(function(){
				$scope.isCanvasVisible = false;
			})
		});

		var SAVEREGION = function(){
			var group = canvas.getActiveGroup();
			var canvasObject = canvas.getObjects();
			var jsonArray = [];
			angular.forEach(canvasObject, function(v,k){
				var region = {
					"x": v.left,
					"y": v.top,
					"width": v.width,
					"height": v.height,
					"pageWidth": window.innerWidth,
					"pageHeight": window.innerHeight,
					"type": v.type,
					"target": v.target,
					"options": {
						"target": (v.type === 'website') ? $scope.region.options.target : null 
					}
				};
				jsonArray.push(region);
						
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
		    $scope.isCanvasVisible = false;
		};

		$scope.saveRegion = SAVEREGION;

		$scope.cancelReset = CANCELRESET;
		
		$scope.internal = function(){
			var options = CanvasService.getRegionOptions().internal;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			CanvasService.addRegion(canvas, options);
		};
		$scope.website = function(){
			var options = CanvasService.getRegionOptions().website;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			CanvasService.addRegion(canvas, options);
		};
		$scope.email = function(){
			var options = CanvasService.getRegionOptions().email;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			CanvasService.addRegion(canvas, options);
		};
		$scope.phone = function(){
			var options = CanvasService.getRegionOptions().phone;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			CanvasService.addRegion(canvas, options);
		};
		$scope.video = function(){
			var options = CanvasService.getRegionOptions().video;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			CanvasService.addRegion(canvas, options);
		};
		$scope.iframe = function(){
			var options = CanvasService.getRegionOptions().iframe;
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			CanvasService.addRegion(canvas, options);
		};

		$scope.changeall = function(val){
			if(canvas.getActiveObject()){
				canvas.getActiveObject().setOptions({"target": val})
			}
		};

	}


})();
