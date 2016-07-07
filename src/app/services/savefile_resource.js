(function(){
	'use strict';
	
	angular.module('regionapp')
	.factory('SavefileResourceGateway', ['$resource', SavefileResourceGateway]);

	function SavefileResourceGateway($resource) {
		//../../server_script/save_json.php
		var regionDataResource = $resource('../services/mockupdata.json', {}, {
			getRegionData: {method: 'GET'}
		});

		return {
			getRegionData: regionDataResource.getRegionData
		};
	}

	
})();