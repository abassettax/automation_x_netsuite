/******************************************************************************************************
	Script Name - AVA_BIS_BundleInstallation.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType BundleInstallationScript
*/

define(['N/search', 'N/record'],
	function(search, record){
		function afterUpdate(params){
			var searchRecord = search.create({
				type: 'customrecord_avaconfig'
			});
			var searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 5
			});
			
			if(searchResult != null && searchResult.length > 0){
				for(var i = 0; i < searchResult.length; i++){
					var configRecord = record.load({
						type: 'customrecord_avaconfig',
						id: searchResult[i].id
					});
					
					var serviceUrl = configRecord.getValue('custrecord_ava_url');
					if(serviceUrl != null && serviceUrl.length > 1){
						serviceUrl = (serviceUrl.search('development') != -1) ? '1' : '0';
						configRecord.setValue({
							fieldId: 'custrecord_ava_url',
							value: serviceUrl
						});
					}
					
					configRecord.save();
				}
			}
		}
		
		return{
			afterUpdate: afterUpdate
		};
	}
);