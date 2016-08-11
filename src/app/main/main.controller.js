;(function() {
	'use strict';
	angular
		.module('main.controller', [])
		.controller('MainController', ['$scope', '$window', '$timeout', '$mdToast', '$document', 'CanvasService', MainController]);


	function MainController($scope, $window, $timeout, $mdToast, $document, CanvasService) {
		var self = this;
		var canvas = CanvasService.getCanvas('canvasid');

		// get default scope for regions
		$scope.region = CanvasService.getScopeRegion();
		
		// Selectbox field options for website
		$scope.targetopt = CanvasService.getOptions();
		$scope.regiontypeLabel = "Region Editor";
		$scope.isCanvasVisible = false;
		$scope.activated = true;
		$scope.filename = "page1";
		$scope.imgpath = '';
		$scope.regionsimages = null;
		$scope.thumbImages = null;
		$scope.initialval = 0;
		$scope.increment = 10;
		
		/* 
		* Get Page Images from service 
		*/
		CanvasService.getPageImages().$promise.then(function(res){
			$scope.pageImages = res.imageoject;
			$scope.imgpath = res.imageoject[0].img;
			console.log( 'Page Ready', res.imageoject[0].img );
			let wdht = angular.element('.mid img');
			$timeout(function(){
				angular.element('.canvas-container,canvas').css({width:wdht.width()+'px', height:wdht.height()+'px'});
			},300);
		})
		/* 
		* Get Thumbnails Images from service
		*/
		CanvasService.getThumbImages().$promise.then(function(res){
			$scope.thumbImages = res.thumbimageobject;
			$scope.regionsimages = $scope.thumbImages.slice($scope.initialval, $scope.increment);
		})
		/*
		* load regions from service.
		*/
		CanvasService.getRegionData($scope.filename).then(function(res){
			if(res.data != undefined && res.data != ''){
				CanvasService.loadJson(canvas, res.data);
				$scope.activated = false;
				$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Filled Canvas').position('top right').hideDelay(3000) );
				// console.log('on load calling data');

				$timeout(function(){
					var wd = angular.element('.mid img').width();
		   			var ht = angular.element('.mid img').height();
					angular.element('.canvas-container,canvas').css({width:wd+'px', height:ht+'px'});
					console.log(wd,':',ht);
				},400);

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
		  	console.log( canvas.getActiveObject().newregion );
			if(!canvas.getActiveObject().newregion){
				var formatjson = CanvasService.formateJson(canvas, $scope.region.options.target);
				CanvasService.saveRegion(formatjson, $scope.filename, canvas);
			}
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

		canvas.on("object:scaling", function(e){
            var target = e.target;
            var sX = target.scaleX;
            var sY = target.scaleY;
            target.width =  target.width*=sX;
            target.height = target.height*=sY;
            target.scaleX = 1;
            target.scaleY = 1;
        });

		$scope.saveRegion = function(){
			var formatjson = CanvasService.formateJson(canvas, $scope.region.options.target);
			// console.log( formatjson );
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
					canvas.getActiveObject().setOptions({"options":{"target": $scope.region.options.target} });
				}
				canvas.getActiveObject().setOptions({"target": val});
			}
		};

		/*
		* Load region when you click on small thumbnails.
		*/
		$scope.loadregion = function(ind){
			canvas.clear();
			$scope.activated = true;
			// let pageImg = _.where($scope.pageImages, {"imageid": ind});
			$scope.imgpath = $scope.pageImages[ind-1].img;
			$scope.filename = "page"+ind;
			// $scope.filename = "page"+ind;
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
		}

		$scope.previousthumb = function(){
			if($scope.initialval > 0){
				$scope.initialval = $scope.initialval - 10;
				$scope.increment = $scope.increment - 10;
				$scope.regionsimages = $scope.thumbImages.slice($scope.initialval, $scope.increment);
				$scope.filename = 'page'+$scope.initialval;

				var wd = angular.element('.mid img').width();
		   		var ht = angular.element('.mid img').height();
				$timeout(function(){
					angular.element('.canvas-container,canvas').css({width:wd+'px', height:ht+'px'});
				},300);
				// $scope.imgpath = $scope.regionsimages[0].img;
				// $timeout(function(){
				// 	CanvasService.resizeCanvas(canvas, angularEle.width(), angularEle.height());
				// },200);
				// CanvasService.getRegionData($scope.filename).then(function(res){
				// 	if(res.data != undefined && res.data != ''){
				// 		CanvasService.loadJson(canvas, res.data);
				// 		$scope.activated = false;
				// 		$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Filled Canvas').position('top right').hideDelay(3000) );
				// 	}else{
				// 		$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
				// 		$scope.activated = false;
				// 	}					
				// }, function (err) {
				// 	$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
				// 	$scope.activated = false;
				// });
			}else{
				canvas.clear();
				$scope.initialval = $scope.initialval;
				$scope.increment = $scope.increment;
				return false;
			}
		}

		$scope.nextthumb = function(){
			if($scope.increment < $scope.thumbImages.length ){
				$scope.initialval = $scope.increment;
				$scope.increment = $scope.increment+10;
				$scope.regionsimages = $scope.thumbImages.slice($scope.initialval, $scope.increment);
				$scope.filename = 'page'+$scope.initialval;
				var wd = angular.element('.mid img').width();
		   		var ht = angular.element('.mid img').height();
				$timeout(function(){
					angular.element('.canvas-container,canvas').css({width:wd+'px', height:ht+'px'});
					//////console.log(wd,':',ht);
				},300);
				// canvas.clear();
				// $scope.imgpath = $scope.regionsimages[0].img;
				// $timeout(function(){
				// 	CanvasService.resizeCanvas(canvas, angularEle.width(), angularEle.height());
				// },200);
				 // CanvasService.getRegionData($scope.filename).then(function(res){
				// 	if(res.data !== undefined && res.data !== ''){
				// 		CanvasService.loadJson(canvas, res.data);
				// 		$scope.activated = false;
				// 		$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Filled Canvas').position('top right').hideDelay(3000) );
				// 	}else{
				// 		$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
				// 		$scope.activated = false;
				// 	}					
				// }, function (err) {
				// 	$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
				// 	$scope.activated = false;
				// });
			}
			else{
					canvas.clear();
					$scope.initialval = $scope.initialval;
					$scope.increment = $scope.increment;
					return false;
				}
		}

		$scope.previousRegion = function(filename){
			let getPath = parseInt(filename.match(/\d+/)[0]) - 1;
			if(getPath > 0){
				canvas.clear();
				$scope.filename = 'page'+getPath;
				$scope.imgpath = $scope.pageImages[getPath-1].img; // getPath-1: Due to array starts from 0;
				CanvasService.getRegionData($scope.filename).then(function(res){
					if(res.data !== undefined && res.data !== ''){
						CanvasService.loadJson(canvas, res.data);

						let wd = angular.element('.mid img').width();
				   		let ht = angular.element('.mid img').height();
						$timeout(function(){
							angular.element('.canvas-container,canvas').css({width:wd+'px', height:ht+'px'});
						},300);

						$scope.activated = false;
						$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Filled Canvas').position('top right').hideDelay(3000) );
					}else{
						$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
						$scope.activated = false;
					}					
				}, function (err) {
					$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
					$scope.activated = false;
				})
			}else{
				$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Below range page limit').position('top right').hideDelay(3000) );	
				return false;
			}
		}

		$scope.nextRegion = function(filename){
			let getPath = parseInt(filename.match(/\d+/)[0]) + 1;
			if(getPath <= $scope.pageImages.length){
				canvas.clear();
				$scope.filename = 'page'+getPath;
				$scope.imgpath = $scope.pageImages[getPath-1].img; // getPath-1: Due to array starts from 0
				CanvasService.getRegionData($scope.filename).then(function(res){
					if(res.data !== undefined && res.data !== ''){
						CanvasService.loadJson(canvas, res.data);
						let wdht = angular.element('.mid img');
				   		// var ht = angular.element('.mid img').height();
						$timeout(function(){
							angular.element('.canvas-container,canvas').css({width:wdht.width()+'px', height:wdht.height()+'px'});
						},300);
						$scope.activated = false;
						$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Filled Canvas').position('top right').hideDelay(3000) );
					}else{
						$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
						$scope.activated = false;
					}					
				}, function (err) {
					$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Empty Canvas').position('top right').hideDelay(3000) );
					$scope.activated = false;
				})
			}else{
				$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Exceeded page limit').position('top right').hideDelay(3000) );
			}
		}

		angular.element($window).bind('resize', function(){
			let wdht = angular.element('.mid img');
	   		// var ht = angular.element('.mid img').height();
	   		var originalState = angular.element($window).width();
			if(originalState < $window.screen.width){
				console.log( 'resize decreasing...' );
				// resizeCan(canvas);
			}else{
				// resizeCan(canvas);
				console.log( 'resize increasing...' );
			}
			$timeout(function(){
				angular.element('.canvas-container,canvas').css({width:wdht.width()+'px', height:wdht.height()+'px'});
			},300);
		});
	}

})();

