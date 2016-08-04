(function(){
	'use strict';
	angular.module('regionapp')
		.factory('SavefileResourceGateway', ['$resource', SavefileResourceGateway]);

		function SavefileResourceGateway($resource) {
			
			var pageImageResource = $resource('./app/services/image_resp.json', {}, {
				getPageImages: {method: 'GET'}
			});
			
			var thumbImageResource = $resource('./app/services/thumb_resp.json', {}, {
				getThumbImages: {method: 'GET'}
			});

			var regionpostRegionData = $resource('./server_script/save_json.php', {param: '@myParam'}, {
				postRegionData: {method: 'POST'}
			});

			return {
				getPageImages: pageImageResource.getPageImages,
				getThumbImages: thumbImageResource.getThumbImages,
				postRegionData: regionpostRegionData.postRegionData
			};
		}

})();