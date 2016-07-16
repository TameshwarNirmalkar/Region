(function(){
	'use strict';
	//'SavefileResourceGateway', 
	angular.module('regionapp')
	.factory('CanvasService', ['$timeout', '$window', function($timeout, $window) {
		console.log('services ready', $window);
		function getRegionData() {
            return '';//SavefileResourceGateway.getAnalysisDetails();
        }

		function getImages(){
			return [
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
					type: options.extraoptions.type,
					regiontype: options.extraoptions.type,
					target: options.extraoptions.target,
					elementlabel: options.extraoptions.elementlabel
			  });
			$timeout(function(){
				region.setOptions(options);
				canvas.add(region).setActiveObject(region);
			})
		}

		function getRegionOptions(type){
			var obj = {
				"internal": { "extraoptions": {"type": "internal","target": 1, "regiontype": "internal" , "elementlabel": "Page Number"} },
				"website" : {"extraoptions": {"type":"website", "target": "http://logostudio.papionne.com/?p=1363" , "regiontype": "website", "options": "blank", "elementlabel": "Url"} },
				"email" : { "extraoptions": {"type":"email", "target": "tameshwar.nirmalkar@gmail.com", "regiontype": "email", "elementlabel": "Email Address"} },
				"phone" : { "extraoptions": {"type":"phone","target": "000-000-0000", "regiontype": "phone", "elementlabel": "Phone Number"} },
				"video": { "extraoptions": {"type":"video","target": "<iframe></iframe>", "regiontype": "iframe", "elementlabel": "Video Embded Code"} },
				"iframe" : { "extraoptions": {"type":"iframe","target": "http://logostudio.papionne.com/?p=1363", "regiontype": "iframe", "elementlabel": "Iframe URL"} }
			}
			return obj[type];
		}

		function beforeStart(item, canvas){
			angular.element(".widget .mid img").attr("src", angular.element(item).attr('src') );
		}

		function afterEnd(item, canvas){
			angular.element(".widget .mid img").attr("src", angular.element(item).attr('src') );
		}

		function formateJson(canvas, model){
			//var group = canvas.getActiveGroup();
			var canvasObject = canvas.getObjects();
			var jsonArray = [];
			angular.forEach(canvasObject, function(v,k){
				var region = {
					"x": v.left,
					"y": v.top,
					"width": v.width,
					"height": v.height,
					"pageWidth": $window.innerWidth,
					"pageHeight": $window.innerHeight,
					"type": v.type,
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

		function loadJson(canvas){
			var json = {"objects":[{
							"type":"rect",
							"regiontype":"internal",
							"left":100,
							"top":0,
							"width":80,
							"height":80,
							"fill":"#29477F",
							"target":16,
							"transparentCorners": false,
							"hasRotatingPoint": false,
							"target":"http://logostudio.papionne.com/?p=1363",
							"options": {
								"target": "_self"
							}
						},{
							"type":"rect",
							"regiontype":"website",
							"left":10,
							"top":0,
							"width":50,
							"height":50,
							"transparentCorners": false,
							"hasRotatingPoint": false,
							"fill":"rgb(166,111,213)",
							"target":20,
							"target":"http://google.com",
							"options": {
								"target": "_self"
							}
						}]
					};
			
			canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function(o, object) {});
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
			loadJson: loadJson
		};
	}])

	
})();