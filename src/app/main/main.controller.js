(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', '$timeout', '$mdToast', 'CanvasService', MainController]);


	function MainController($scope, $timeout, $mdToast, CanvasService) {
		var self = this;
		var canvas = CanvasService.getCanvas('canvasid');

		$scope.region = CanvasService.getScopeRegion();
		
		$scope.regiontypeLabel = "Region Editor";
		$scope.targetopt = CanvasService.getOptions();
		$scope.regionsimages = CanvasService.getImages();
		$scope.isCanvasVisible = false;
		$scope.activated = true;
		$scope.filename = "1-regions";
		$scope.imgpath = './assets/images/1.jpg';

		/*
		* load regions from json.
		*/
		CanvasService.getRegionData($scope.filename).then(function(res){
			CanvasService.loadJson(canvas, res.data);
			$scope.activated = false;
		});

		$timeout(function(){
			$(".widget .carousel").jCarouselLite({
				btnNext: ".widget .next",
				btnPrev: ".widget .prev",
				speed: 300,
				circular: false,
				visible: 1,
				easing: "easeOutBounce",
				beforeStart: function(item){
					CanvasService.beforeStart(angular.element(item).find('img')[0], canvas);
				},
				afterEnd: function(item){
					CanvasService.afterEnd(angular.element(item).find('img')[0], canvas);
				}
			});

			//make actions panels draggable
			$('.properties-panel').draggable();
		})

		canvas.on('object:selected', function(e){
			e.target.bringToFront();
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
			CanvasService.saveRegion(json, $scope.filename);
		};

		var CANCELRESET = function(){
		 	// canvas.clear();
		    $scope.isCanvasVisible = false;
		};

		$scope.saveRegion = SAVEREGION;

		$scope.cancelReset = CANCELRESET;
		
		$scope.setOptionsObject = function(type){
			var options = CanvasService.getRegionOptions(type);
			$scope.region["target"] = options.extraoptions.target;
			$scope.region["regiontype"] = options.extraoptions.regiontype;
			CanvasService.addRegion(canvas, options);
		}

		$scope.changeall = function(val){
			if(canvas.getActiveObject()){
				canvas.getActiveObject().setOptions({"target": val})
			}
		};

		$scope.loadregion = function(ind){
			$scope.activated = true;
			canvas.clear();
			$scope.imgpath = this.imgs.img;
			$scope.filename = ind+"-regions";
			$scope.isCanvasVisible = false;
			CanvasService.getRegionData($scope.filename).then(function(res){
				CanvasService.loadJson(canvas, res.data);
				$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Filled Canvas').position('top right').hideDelay(3000) );
				$scope.activated = false;
			}, function (err) {
				$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
				$scope.activated = false;
			});
		}

	}


})();
