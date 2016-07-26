;(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$rootScope','$scope', '$timeout', '$mdToast', '$document', 'CanvasService', MainController]);


	function MainController($rootScope, $scope, $timeout, $mdToast, $document, CanvasService) {
		$rootScope.$emit('selectiveLoad');
		var self = this;
		var canvas = CanvasService.getCanvas('canvasid');

		// get default scope for regions
		$scope.region = CanvasService.getScopeRegion();
		
		// Selectbox field options for website
		$scope.targetopt = CanvasService.getOptions();
		$scope.regiontypeLabel = "Region Editor";
		$scope.regionsimages = null;
		$scope.isCanvasVisible = false;
		$scope.activated = true;
		$scope.filename = "1-regions";
		$scope.imgpath = './assets/images/1.jpg';
		$scope.storedImageResources = null;
		$scope.initialval = 0;
		$scope.increment = 10;
		CanvasService.getImages().$promise.then(function(res){
			$scope.storedImageResources = res.imageoject;
			// console.log( $scope.storedImageResources.slice(0,10) );
			$scope.regionsimages = $scope.storedImageResources.slice($scope.initialval, $scope.increment);
			console.log( $scope.regionsimages );
			/* Initialize carousel code*/
			// $timeout(function(){
			// 	$(".widget .carousel").jCarouselLite({
			// 		btnNext: ".widget .next",
			// 		btnPrev: ".widget .prev",
			// 		speed: 300,
			// 		circular: false,
			// 		visible: 10,
			// 		scroll:10,
			// 		easing: "easeOutBounce",
			// 		beforeStart: function(item){
			// 			$scope.activated = true;
			// 			canvas.clear();
			// 		},
			// 		afterEnd: function(item){
			// 			// console.log('after: ',item.data('pageid') );
			// 			$timeout(function(){
			// 				$scope.imgpath = item.find('img').attr('src');
			// 				CanvasService.resizeCanvas(canvas, angular.element('.mid').width(), angular.element('.mid').height());
			// 				console.log( $scope.initialval, ":", $scope.increment );

			// 				$scope.initialval = $scope.increment;
			// 				$scope.increment = $scope.increment+10;
							
							
			// 				$scope.regionsimages = $scope.storedImageResources.slice($scope.initialval, $scope.increment);
			// 				console.log( $scope.regionsimages );
			// 			})
			// 			// CanvasService.afterEnd(angular.element(item).find('img')[0], canvas);
						
			// 			var pageid = item.data('pageid');
			// 			$scope.filename = pageid.match(/\d+/)[0]+'-regions';
			// 			CanvasService.getRegionData($scope.filename).then(function(res){
			// 				if(res.data != undefined && res.data != ''){
			// 					CanvasService.loadJson(canvas, res.data);
			// 					$scope.activated = false;
			// 					$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Filled Canvas').position('top right').hideDelay(3000) );
			// 				}else{
			// 					$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
			// 					$scope.activated = false;
			// 				}					
			// 			}, function (err) {
			// 				$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
			// 				$scope.activated = false;
			// 			});
			// 		}
			// 	});
			// })
			

			CanvasService.resizeCanvas(canvas, angular.element('.mid').width(), angular.element('.mid').height());
		})


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

		canvas.on('object:selected', function(e){
			e.target.bringToFront();
			$timeout(function(){
				$scope.regiontypeLabel = e.target.regiontype;
				$scope.regiontype = e.target.regiontype; // this is to check on keypress evnet.
				$scope.region.target = e.target.target;
				$scope.isCanvasVisible = true;
			})
			// console.log(e.target);
		});

		canvas.on('before:selection:cleared', function(e){
			$timeout(function(){
				$scope.isCanvasVisible = false;
			})
		});

		$scope.saveRegion = function(){
			var formatjson = CanvasService.formateJson(canvas, $scope.region.options.target);
			CanvasService.saveRegion(formatjson, $scope.filename, canvas);
		};

		$scope.cancelReset = function(){
			$scope.isCanvasVisible = false;
			var activeobject = canvas.getActiveObject();
			if(activeobject.newregion && activeobject.newregion !== undefined){
				canvas.getActiveObject().remove();
			}
			canvas.discardActiveObject();
		};
		
		$scope.setOptionsObject = function(type){
			var options = CanvasService.getRegionOptions(type);
			CanvasService.addRegion(canvas, options);
		}

		$scope.keyPressFunc = function(val){
			if(canvas.getActiveObject()){
				if($scope.regiontype === 'website'){
					// console.log("Type: ", canvas.getActiveObject());
					canvas.getActiveObject().setOptions({"options":{"target": $scope.region.options.target} });
				}
				canvas.getActiveObject().setOptions({"target": val});
			}
		};

		$scope.loadregion = function(ind){
			canvas.clear();
			$scope.activated = true;
			$scope.imgpath = this.imgs.img;
			$scope.filename = ind+"-regions";
			$scope.isCanvasVisible = false;
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
			$timeout(function(){
				CanvasService.resizeCanvas(canvas, angular.element('.mid').width(), angular.element('.mid').height());
			})
		}

		$scope.previousthumb = function(){
			if($scope.initialval > 0){
				$scope.initialval = $scope.initialval - 10;
				$scope.increment = $scope.increment - 10;
				$scope.regionsimages = $scope.storedImageResources.slice($scope.initialval, $scope.increment);
			}else{
				$scope.initialval = $scope.initialval;
				$scope.increment = $scope.increment;
				return false;
			}
			console.log( $scope.initialval,":", $scope.increment);
		}

		$scope.nextthumb = function(){
			if($scope.increment <= $scope.storedImageResources.length ){
				$scope.initialval = $scope.increment;
				$scope.increment = $scope.increment+10;
				$scope.regionsimages = $scope.storedImageResources.slice($scope.initialval, $scope.increment);
			}
			else{
				$scope.initialval = $scope.initialval;
				$scope.increment = $scope.increment;
				return false;
			}
			console.log( $scope.initialval,":", $scope.increment );
		}

	}

})();
