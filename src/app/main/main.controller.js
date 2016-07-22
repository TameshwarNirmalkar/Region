(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', '$timeout', '$mdToast', '$document', 'CanvasService', MainController]);


	function MainController($scope, $timeout, $mdToast, $document, CanvasService) {
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
			if(res.data != undefined && res.data != ''){
				CanvasService.loadJson(canvas, res.data);
				$scope.activated = false;
				$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Filled Canvas').position('top right').hideDelay(3000) );
			}else{
				$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
				$scope.activated = false;
			}
		}, function (err) {
			$mdToast.show( $mdToast.simple().theme("error-toast").textContent('File not found').position('top right').hideDelay(3000) );
			$scope.activated = false;
		});

		$document.bind('keydown', function(e) {
          if(e.which === 46 && canvas.getActiveObject()){
          	canvas.getActiveObject().remove();
          }
        });

		$timeout(function(){
			$(".widget .carousel").jCarouselLite({
				btnNext: ".widget .next",
				btnPrev: ".widget .prev",
				speed: 300,
				circular: false,
				visible: 10,
				scroll:10,
				easing: "easeOutBounce",
				beforeStart: function(item){
					$scope.activated = true;
					canvas.clear();
				},
				afterEnd: function(item){
					// console.log('after: ',item.data('pageid') );
					$timeout(function(){
						$scope.imgpath = item.find('img').attr('src');
					})
					// CanvasService.afterEnd(angular.element(item).find('img')[0], canvas);
					var pageid = item.data('pageid');
					$scope.filename = pageid.match(/\d+/)[0]+'-regions';
					CanvasService.getRegionData($scope.filename).then(function(res){
						if(res.data != undefined && res.data != ''){
							CanvasService.loadJson(canvas, res.data);
							$scope.activated = false;
							$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Filled Canvas').position('top right').hideDelay(3000) );
						}else{
							$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
							$scope.activated = false;
						}					
					}, function (err) {
						$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
						$scope.activated = false;
					});
				}
			});
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
			target.width =  target.width*=sX;
			target.height = target.height*=sY;
			target.scaleX = 1;
			target.scaleY = 1;
		});

		$scope.saveRegion = function(){
			var json = CanvasService.formateJson(canvas, $scope.region.options.target);
			CanvasService.saveRegion(json, $scope.filename, canvas);
			// console.log( canvas.getObjects() );
		};

		$scope.cancelReset = function(){
			$scope.isCanvasVisible = false;
			var activeobject = canvas.getActiveObject();
			if(activeobject.newregion && activeobject.newregion !== undefined){
				canvas.getActiveObject().remove();
			}
		};
		
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
			canvas.clear();
			$scope.activated = true;
			$scope.imgpath = this.imgs.img;
			$scope.filename = ind+"-regions";
			$scope.isCanvasVisible = false;
			CanvasService.getRegionData($scope.filename).then(function(res){
				console.log("response: ", res);
				if(res.data != undefined && res.data != ''){
					CanvasService.loadJson(canvas, res.data);
					$scope.activated = false;
					$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Filled Canvas').position('top right').hideDelay(3000) );
				}else{
					$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
					$scope.activated = false;
				}
			}, function (err) {
				$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
				$scope.activated = false;
			});
		}

	}


})();
