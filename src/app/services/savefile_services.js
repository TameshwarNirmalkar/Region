(function(){
    "use strict";
    angular.module("regionapp")
    .factory("CanvasService", ["$timeout", "$window", "$http", "$mdToast", "SavefileResourceGateway", function($timeout, $window, $http, $mdToast, SavefileResourceGateway) {
        
        function getPageImages(){
            return SavefileResourceGateway.getPageImages();
        }

        function getThumbImages(){
            return SavefileResourceGateway.getThumbImages();
        }

        function getOptions(){
            return ("blank self").split(" ").map(function (op) { return { abbrev: op }; });
        }

        function addRegion(canvas, regionconfig){
            var region = new fabric.Rect({
                    left: 75,
                    top: 60,
                    width: 100,
                    height: 100,
                    type: "rect",
                    regiontype: regionconfig.regiontype,
                    target: "",
                    newregion: true,
                    pageWidth: regionconfig.pageWidth,
                    pageHeight: regionconfig.pageHeight
              });
            $timeout(function(){
                if(regionconfig.regiontype === "website"){
                    region.setOptions({"options": {"target": regionconfig.options.options}} );
                }
                canvas.add(region).setActiveObject(region);
            })
        }

        function getRegionOptions(type){
            var aobject = angular.element("#canvasid");
            var obj = {
                "internal": { "pageHeight": aobject.height(), "pageWidth": aobject.width(),"regiontype": "internal"},
                "website" : { "pageHeight": aobject.height(), "pageWidth": aobject.width(),"regiontype": "website", "options": {"target": "_blank"} },
                "email" : { "pageHeight": aobject.height(), "pageWidth": aobject.width(),"regiontype": "email"},
                "phone" : { "pageHeight": aobject.height(), "pageWidth": aobject.width(),"regiontype": "phone"},
                "video": { "pageHeight": aobject.height(), "pageWidth": aobject.width(),"regiontype": "video"},
                "iframe" : { "pageHeight": aobject.height(), "pageWidth": aobject.width(),"regiontype": "iframe"}
            }
            return obj[type];
        }

        function formateJson(canvas, selectedval){
            //var group = canvas.getActiveGroup();
            var canvasObject = canvas.getObjects();
            var angularObj = angular.element('.mid img');
            var jsonArray = [];
            angular.forEach(canvasObject, function(v,k){
                var region = {
                    "x": Math.floor(v.left),
                    "y": Math.floor(v.top),
                    "width": Math.floor(v.width),
                    "height": Math.floor(v.height),
                    "pageWidth": angularObj.width(),
                    "pageHeight": angularObj.height(),
                    "type": v.regiontype,
                    "target": v.target
                };
                if(v.regiontype === "website"){
                    region.options = { "target": "_"+selectedval }
                }
                jsonArray.push(region);
                // console.log(canvas.getActiveObject().get("type"));                
            });
            
            return jsonArray;
        }

        function getCanvas(id){
            var cnv = new fabric.Canvas(id);
            cnv.uniScaleTransform = true;
            return cnv;
        }

        function displayFormat(data){
            var x = [];
            angular.forEach(data, function(v){
                var y = {
                    "fill": "rgba(63,81,181,0.8)",
                    "transparentCorners": false,
                    "hasRotatingPoint": false,
                    "type": "rect",
                    "left": v.x,
                    "top": v.y,
                    "target": v.target,
                    "pageWidth": v.pageWidth,
                    "pageHeight": v.pageHeight,
                    "regiontype": v.type,
                    "width": v.width,
                    "height": v.height
                }
                if(v.type === "website"){
                    y["options"] = {
                        "target": v.options.target.replace("_","")
                    };
                }
                x.push(y);
            })
            return x;
        }

        function loadJson(canvas, data){
            var objects = {"objects": displayFormat(data)};
            canvas.loadFromJSON(objects, canvas.renderAll.bind(canvas), function(o, object) {});
        }

        function saveRegion(data, filename, canvas) {
            var objects = {"objects": data,"filename": filename};
            $http({
                    url: "./server_script/save_json.php",
                    method: "POST",
                    headers: {"Content-Type": "application/json; charset=UTF-8"},
                    data: objects
                }).success(function(data, status, headers, config) {
                    $mdToast.show( $mdToast.simple().theme("success-toast").textContent("Save successfull").position("top right") );
                    angular.forEach(canvas.getObjects(), function(v){
                        v.newregion = false;
                    });
                }).error(function(data, status, headers, config) {
                    $mdToast.show( $mdToast.simple().theme("error-toast").textContent("Error on file save").position("top right") );
            });
        }

        function getRegionData(filename) {
            // return $http.get("./stored_files/"+filename+".json");
            var objects = {"filename": filename};
            return $http({
	            url: "./server_script/get_json.php",
	            method: "POST",
	            headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
	            data: "filedata="+JSON.stringify(objects)
            });
        }

        function scopeRegion(){
            return {
                "pageWidth": 0,
                "pageHeight": 0,
                "type": "rect",
                "regiontype": "",
                "target": "",
                "options": {
                    "target": "blank"
                }
            };
        }

        function resizeCanvas(canvas, imgwidth, imgheight){
            // maintain height and width of canvas
            canvas.setDimensions({width: imgwidth, height: imgheight});
        }
        return {
            getPageImages: getPageImages,
            getOptions: getOptions,
            addRegion: addRegion,
            getRegionOptions: getRegionOptions,
            formateJson: formateJson,
            getCanvas: getCanvas,
            loadJson: loadJson,
            getScopeRegion: scopeRegion,
            saveRegion: saveRegion,
            getRegionData: getRegionData,
            resizeCanvas: resizeCanvas,
            getThumbImages: getThumbImages
        };
    }])

    
})();