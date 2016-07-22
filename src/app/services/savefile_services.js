(function(){
	'use strict';
	//'SavefileResourceGateway', 
	angular.module('regionapp')
	.factory('CanvasService', ['$timeout', '$window', '$http', '$mdToast', 'SavefileResourceGateway', function($timeout, $window, $http, $mdToast, SavefileResourceGateway) {
		
		function getImages(){
			return [
					{img: 'assets/images/1.jpg', description: 'Image 1'},
					{img: 'assets/images/2.jpg', description: 'Image 2'},
					{img: 'assets/images/2.jpg', description: 'Image 3'},
					{img: 'assets/images/3.jpg', description: 'Image 4'},
					{img: 'assets/images/3.jpg', description: 'Image 5'},
					{img: 'assets/images/7.jpg', description: 'Image 6'},
					{img: 'assets/images/8.jpg', description: 'Image 7'},
					{img: 'assets/images/8.jpg', description: 'Image 8'},
					{img: 'assets/images/9.jpg', description: 'Image 9'},
					{img: 'assets/images/10.jpg', description: 'Image 10'},
					{img: 'assets/images/1.jpg', description: 'Image 1'},
					{img: 'assets/images/2.jpg', description: 'Image 2'},
					{img: 'assets/images/2.jpg', description: 'Image 3'},
					{img: 'assets/images/3.jpg', description: 'Image 4'},
					{img: 'assets/images/3.jpg', description: 'Image 5'},
					{img: 'assets/images/7.jpg', description: 'Image 6'},
					{img: 'assets/images/8.jpg', description: 'Image 7'},
					{img: 'assets/images/8.jpg', description: 'Image 8'},
					{img: 'assets/images/9.jpg', description: 'Image 9'},
					{img: 'assets/images/10.jpg', description: 'Image 10'}
			];
		}

		function getOptions(){
			return ('blank self').split(' ').map(function (op) { return { abbrev: op }; });
		}

		function addRegion(canvas, options){
			var region = new fabric.Rect({
					left: 75,
					top: 60,
					width: 250,
					height: 60,
					fill: 'rgba(63,81,181,0.8)',
					transparentCorners: false,
					hasRotatingPoint: false,
					centeredScaling: false,
					type: 'rect',
					regiontype: options.extraoptions.regiontype,
					target: options.extraoptions.target,
					elementlabel: options.extraoptions.elementlabel,
					newregion: true
			  });
			$timeout(function(){
				region.setOptions(options);
				canvas.add(region).setActiveObject(region);
			})
		}

		function getRegionOptions(type){
			var obj = {
				"internal": { "extraoptions": {"target": "", "regiontype": "internal" , "elementlabel": "Page Number"} },
				"website" : {"extraoptions": { "target": "" , "regiontype": "website", "options": "blank", "elementlabel": "Url"} },
				"email" : { "extraoptions": { "target": "", "regiontype": "email", "elementlabel": "Email Address"} },
				"phone" : { "extraoptions": {"target": "", "regiontype": "phone", "elementlabel": "Phone Number"} },
				"video": { "extraoptions": {"target": "", "regiontype": "video", "elementlabel": "Video Embded Code"} },
				"iframe" : { "extraoptions": {"target": "", "regiontype": "iframe", "elementlabel": "Iframe URL"} }
			}
			return obj[type];
		}

		function beforeStart(item, canvas){
			canvas.clear();
			angular.element(".widget .mid img").attr("src", angular.element(item).find('img').attr('src') );
		}

		function afterEnd(item, canvas){
			canvas.clear();
			angular.element(".widget .mid img").attr("src", angular.element(item).attr('src') );
		}

		function formateJson(canvas, model){
			//var group = canvas.getActiveGroup();
			var canvasObject = canvas.getObjects();
			var jsonArray = [];
			angular.forEach(canvasObject, function(v,k){
				var region = {
					"x": Math.floor(v.left),
					"y": Math.floor(v.top),
					"width": Math.floor(v.width),
					"height": Math.floor(v.height),
					"pageWidth": $window.innerWidth,
					"pageHeight": $window.innerHeight,
					"type": v.regiontype,
					"target": v.target,
					"options": {
						"target": (v.type === 'website') ? model : null 
					}
				};
				jsonArray.push(region);
				//console.log(canvas.getActiveObject().get('type'));				
			});
			return jsonArray;
		}

		function getCanvas(id){
			return new fabric.Canvas(id);
		}

		function displayFormat(data){
			var x = [];
			angular.forEach(data, function(v){
				var y = {
					"fill": "rgba(63,81,181,0.8)",
					"transparentCorners": false,
					"hasRotatingPoint": false,
					"type": 'rect',
					"left": v.x,
					"top": v.y,
					"target": v.target,
					"options":{
						"target": v.options.target
					},
					"pageWidth": v.pageWidth,
					"pageHeight": v.pageHeight,
					"regiontype": v.type,
					"width": v.width,
					"height": v.height
				}
				x.push(y);
			})
			return x;
		}

		function loadJson(canvas, data){
			var objects = {"objects": displayFormat(data.objects)};
			// SavefileResourceGateway.getRegionData().$promise.then(function(res) {
				canvas.loadFromJSON(objects, canvas.renderAll.bind(canvas), function(o, object) {});
			// });
		}

		function saveRegion(data, filename) {
			var objects = {"objects": data,"filename": filename};
			$http({
					url: "./server_script/save_json.php",
					method: "POST",
					headers: {'Content-Type': 'application/json; charset=UTF-8'},
					data: objects
				}).success(function(data, status, headers, config) {
					$mdToast.show( $mdToast.simple().theme("success-toast").textContent('Save successfull').position('top right') );
				}).error(function(data, status, headers, config) {
					$mdToast.show( $mdToast.simple().theme("error-toast").textContent('Error on file save').position('top right') );
			});
		}

		// function testGetR(filename) {
		// 	var objects = {"filename": filename};
		// 	console.log( objects );
		// 	$http({
		// 			url: "./server_script/get_json.php",
		// 			method: "POST",
		// 			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
		// 			data: 'filedata='+JSON.stringify(objects)
		// 		}).success(function(data, status, headers, config) {
		// 			console.log(data);
		// 		}).error(function(data, status, headers, config) {
		// 			console.log(status);
		// 		});
		// }

		function getRegionData(filename) {
			// return $http.get('./stored_files/'+filename+'.json');
			var objects = {"filename": filename};
			return $http({
					url: "./server_script/get_json.php",
					method: "POST",
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					data: 'filedata='+JSON.stringify(objects)
				});
		}

		function scopeRegion(){
			return {
				"left":0,
				"top":0,
				"width":100,
				"height":100,
				"pageWidth": $window.innerWidth,
				"pageHeight": $window.innerHeight,
				"type": "rect",
				"regiontype": "",
				"target": "",
				"options": {
					"target": "blank"
				}
			};
		}

		return {
			getRegionData: getRegionData,
			getImages: getImages,
			getOptions: getOptions,
			addRegion: addRegion,
			getRegionOptions: getRegionOptions,
			beforeStart: beforeStart,
			afterEnd: afterEnd,
			formateJson: formateJson,
			getCanvas: getCanvas,
			loadJson: loadJson,
			getScopeRegion: scopeRegion,
			saveRegion: saveRegion,
			getRegionData: getRegionData
		};
	}])

	
})();