(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', '$timeout', 'CanvasService', MainController]);


	function MainController($scope, $timeout, CanvasService) {
		var self = this;
		var canvas = CanvasService.getCanvas('canvasid');

		CanvasService.loadJson(canvas);

		$scope.region = {
			"x":0,
			"y":0,
			"width":100,
			"height":100,
			"pageWidth":1024,
			"pageHeight":768,
			"type": "",
			"regiontype": "",
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
					CanvasService.beforeStart(angular.element(item).find('img')[0], canvas);
				},
				afterEnd: function(item, canvas){
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
				$scope.regiontypeLabel = e.target.regiontype;
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

		canvas.on('object:scaling', function(){
			var obj = canvas.getActiveObject();
			obj.setWidth( obj.getWidth() );
		});

		var SAVEREGION = function(){
			var json = CanvasService.formateJson(canvas, $scope.region.options.target);
			console.log(json);
		};

		var CANCELRESET = function(){
		 	canvas.clear();
		    $scope.isCanvasVisible = false;
			// $scope.region = {};
			// $scope.regiontypeLabel = 'Region Editor';
			// $scope.elementlabel = '';
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
