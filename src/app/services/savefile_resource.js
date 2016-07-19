(function(){
	'use strict';
	angular.module('regionapp')
		.factory('SavefileResourceGateway', ['$resource', SavefileResourceGateway]);

		function SavefileResourceGateway($resource) {
			
			var regiongetDataResource = $resource('./app/services/mockupdata.json', {}, {
				getRegionData: {method: 'GET'}
			});
			
			var regionpostRegionData = $resource('./server_script/save_json.php', {param: '@myParam'}, {
				postRegionData: {method: 'POST'}
			});

			return {
				getRegionData: regiongetDataResource.getRegionData,
				postRegionData: regionpostRegionData.postRegionData
			};
		}

})();