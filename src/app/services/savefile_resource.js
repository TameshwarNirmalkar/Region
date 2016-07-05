(function(){
	'use strict';
	
	angular.module('regionapp.resouces', [])
	.factory('SavefileResourceGateway', ['$resource', function($resource) {
		//../../server_script/save_json.php
		var regionDataResource = $resource('../services/mockupdata.json', {}, {
			getRegionData: {method: 'GET'}
		});

		return {
			getRegionData: regionDataResource.getRegionData
		};
	}])

	
})();