(function(){
	console.log('test');
	'use strict';
	
	angular.module('regionapp')
	.service('canvasservice', ['$rootScope', '$mdDialog', function($rootScope) {

		var canvas = {

	        original: {},

	        //store window width and height so we don't execute
	        //functions unnecessarily on resize event if they didn't change
	        oldWindowDimensions: {
	            width: window.innerWidth,
	            height: window.innerHeight
	        },

			mainImage: false,
			fabric: false,
			ctx: false,
			container: false,
			viewport: false,
			offset: false,
			element: false,

	        minWidth: 50,
	        minHeight: 50,

			imageStatic: {
	            locked: true,
				selectable: false,
		      	evented: false,
		      	lockMovementX: true,
		      	lockMovementY: true,
		      	lockRotation: true,
		      	lockScalingX: true,
		      	lockScalingY: true,
		      	lockUniScaling: true,
		      	hasControls: false,
		      	hasBorders: false
			},

	        destroy: function() {
	            this.fabric.dispose();
	            this.mainImage = false;
	            this.fabric = false;
	            this.ctx = false;
	            this.container = false;
	            this.viewport = false;
	            this.offset = false;
	            this.element = false;
	            this.original = {};
	            this.currentZoom = 1;
	            $rootScope.editorCustomActions = {};
	            $(window).off('resize');
	        },

			start: function() {
	            this.element = document.getElementById('canvasid');
	            this.fabric = new fabric.Canvas('canvasid');
	            this.ctx = this.fabric.getContext('2d');
	            this.container = $('.canvas-container');
	            //this.viewport = document.getElementById('viewport');
	            $rootScope.editorCustomActions = {};

	            this.fabric.selection = false;
	            this.fabric.renderOnAddRemove = false;

	            fabric.Object.prototype.borderColor = '#2196F3';
	            fabric.Object.prototype.cornerColor = '#2196F3';
	            fabric.Object.prototype.transparentCorners = false;

	            // if (url) {
	            //     this.loadMainImage(url);
	            //     $rootScope.started = true;
	            // }

	            $(window).off('resize').on('resize', function(e) {
	                if (canvas.oldWindowDimensions.height !== e.target.innerHeight ||
	                    canvas.oldWindowDimensions.width !== e.target.innerWidth) {

	                    canvas.fitToScreen();
	                }

	                canvas.oldWindowDimensions.width = e.target.innerWidth;
	                canvas.oldWindowDimensions.height = e.target.innerHeight;
	            });

	            //http://stackoverflow.com/questions/22910496/move-object-within-canvas-boundary-limit
	            // keep the text logos in bounds
	            this.fabric.observe("object:moving", function (e) {
	                var obj = e.target;
	                if(obj.type != "i-text")
	                    return;

	                if(obj.getHeight() > obj.canvas.height || obj.getWidth() > obj.canvas.width){
	                    obj.setScaleY(obj.originalState.scaleY);
	                    obj.setScaleX(obj.originalState.scaleX);
	                }
	                obj.setCoords();
	                if(obj.getBoundingRect().top - (obj.cornerSize / 2) < 0 ||
	                    obj.getBoundingRect().left -  (obj.cornerSize / 2) < 0) {
	                    obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top + (obj.cornerSize / 2));
	                    obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left + (obj.cornerSize / 2));
	                }
	                if(obj.getBoundingRect().top+obj.getBoundingRect().height + obj.cornerSize  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width + obj.cornerSize  > obj.canvas.width) {

	                    obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top - obj.cornerSize / 2);
	                    obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left - obj.cornerSize /2);
	                }
	            });

	            this.fabric.observe('object:scaling', function (e) {
	                var obj = e.target;
	                if(obj.type != "i-text")
	                    return;

	                if(obj.getHeight() > obj.canvas.height || obj.getWidth() > obj.canvas.width){
	                    obj.setScaleY(obj.originalState.scaleY);
	                    obj.setScaleX(obj.originalState.scaleX);
	                }
	                obj.setCoords();
	                if(obj.getBoundingRect().top - (obj.cornerSize / 2) < 0 ||
	                    obj.getBoundingRect().left -  (obj.cornerSize / 2) < 0) {
	                    obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top + (obj.cornerSize / 2));
	                    obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left + (obj.cornerSize / 2));
	                }
	                if(obj.getBoundingRect().top+obj.getBoundingRect().height + obj.cornerSize  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width + obj.cornerSize  > obj.canvas.width) {

	                    obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top - obj.cornerSize / 2);
	                    obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left - obj.cornerSize /2);
		                }
	            });

	            $rootScope.$emit('canvas.init');
	        },

	        hideModals: function() {
	            $mdDialog.hide();
	        },

	        mergeObjects: function() {
	            canvas.zoom(1);
	            this.fabric.deactivateAll();
	            var data = this.fabric.toDataURL();
	            this.fabric.clear();
	            this.loadMainImage(data);
	        },

	        /**
	         * Create a new image with given dimensions.
	         *
	         * @param {int|string} width
	         * @param {int|string} height
	         * @param {string|undefined} name
	         */
	        openNew: function(width, height, name) {
	            width = width < this.minWidth ? this.minWidth : width;
	            height = height < this.minHeight ? this.minHeight : height;

	            this.fabric.clear();
	            this.fabric.setWidth(width);
	            this.fabric.setHeight(height);
	            this.fabric.renderAll();

	            canvas.fitToScreen();

	            //save the dimensions so we can scale images opened later to them
	            $rootScope.userPreset = {
	                width: width,
	                height: height,
	                name: name
	            };

	            canvas.original.height = height;
	            canvas.original.width = width;

	            $rootScope.$emit('canvas.openedNew');
	        },

	        center: function(obj) {
	            obj.center();

	            if (canvas.zoom > 100) {
	                obj.setLeft(10);
	                obj.setTop(35);
	            }

	            obj.setCoords();
	        },

	        serialize: function() {
	            // remove all selections
	            this.fabric.deactivateAll();
	            return this.fabric.toJSON(['selectable', 'name']);
	        },

	        getActiveObject:function() {
	            return canvas.fabric.getActiveObject();
	        },

	        getDataURL: function(options) {
	            if ( ! options) options = {};

	            //ignore zoom when getting data url
	            options.multiplier = 1 / canvas.currentZoom;

	            return this.fabric.toDataURL(options);
	        },

	        currentZoom: 1,

	        zoom: function(scaleFactor) {
	            this.fabric.setZoom(scaleFactor);
	            this.fabric.setHeight(this.original.height * scaleFactor);
	            this.fabric.setWidth(this.original.width * scaleFactor);

	            this.currentZoom = scaleFactor;
	        },

	        fitToScreen: function () {
	            var maxWidth  = canvas.viewport.offsetWidth - 40,
	                maxHeight = canvas.viewport.offsetHeight - 120,
	                outter    = canvas.mainImage || canvas.fabric,
	            	scale     = Math.min(maxHeight / outter.getHeight(), maxWidth / outter.getWidth());

	            if (outter.getHeight() > maxHeight || outter.getWidth() > maxWidth) {
	                canvas.zoom(scale); 
	            }
	        }
		};

		return canvas;
	}]);
})();