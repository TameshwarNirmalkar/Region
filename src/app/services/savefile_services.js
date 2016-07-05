(function(){
	'use strict';
	
	angular.module('regionapp.services', [])
	.factory('SavefileService', ['SavefileResourceGateway', function(SavefileResourceGateway) {
		
		function getRegionData() {
            return SavefileResourceGateway.getAnalysisDetails();
        }

		return {
			getRegionData: getRegionData
		};
	}])

	
})();