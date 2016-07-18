(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', '$timeout', 'CanvasService', MainController]);


	function MainController($scope, $timeout, CanvasService) {
		var self = this;
		var canvas = CanvasService.getCanvas('canvasid');

		/*
		* load regions from json.
		*/
		CanvasService.loadJson(canvas);

		$scope.region = CanvasService.getScopeRegion();
		
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
				visible: 20,
				easing: "easeOutBounce",
				beforeStart: function(item){
					CanvasService.beforeStart(angular.element(item).find('img')[0], canvas);
				},
				afterEnd: function(item){
					CanvasService.afterEnd(angular.element(item).find('img')[0], canvas);
				}
			});

			$(document).on('click', ".widget img", function() {
				$(".widget .mid img").attr("src", $(this).attr("src"));
				canvas.clear();
				$timeout(function(){
					$scope.isCanvasVisible = false;
				});
			});
			
			//make actions panels draggable
			$('.properties-panel').draggable();
		})

		canvas.on('object:selected', function(e){
			//e.target.setOptions({"internal": true, "target": "blank" });
			// console.log( e.target.get('type'), e.target.target );
			$timeout(function(){
				$scope.regiontypeLabel = e.target.regiontype;
				$scope.region.target = e.target.target;
				$scope.isCanvasVisible = true;
			})
		});

		canvas.on('before:selection:cleared', function(e){
			$timeout(function(){
				$scope.isCanvasVisible = false;
			})
		});

		canvas.on('object:scaling', function(e){
			var target = e.target;
			var sX = target.scaleX;
			var sY = target.scaleY;
			target.width =  Math.floor(target.width*=sX);
			target.height = Math.floor(target.height*=sY);
			target.scaleX = 1;
			target.scaleY = 1;
		});

		var SAVEREGION = function(){
			var json = CanvasService.formateJson(canvas, $scope.region.options.target);
			console.log(json);
			CanvasService.saveRegion(json);
		};

		var CANCELRESET = function(){
		 	canvas.clear();
		    $scope.isCanvasVisible = false;
			// $scope.region = {};
			// $scope.regiontypeLabel = 'Region Editor';
		};

		$scope.saveRegion = SAVEREGION;

		$scope.cancelReset = CANCELRESET;
		
		$scope.setOptionsObject = function(type){
			var options = CanvasService.getRegionOptions(type);
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["type"] = options.extraoptions.type;
			CanvasService.addRegion(canvas, options);
		}

		$scope.changeall = function(val){
			if(canvas.getActiveObject()){
				canvas.getActiveObject().setOptions({"target": val})
			}
		};

	}


})();
