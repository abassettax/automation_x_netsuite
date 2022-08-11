/******************************************************************************************************
	Script Name - 	AVA_SCH_DeleteAddressValidationRecords.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ScheduledScript
*/

define(['N/runtime', 'N/search', 'N/record', 'N/log', 'N/task'],
	function(runtime, search, record, log, task){
		var MinUsage = 300;
		function execute(context){
			var currentScript = runtime.getCurrentScript();
			
			while(currentScript.getRemainingUsage() > MinUsage){
				log.debug({
					title: 'Start Deletion'
				});
				
				var searchRecord = search.create({
					type: 'customrecord_avaaddressvalidationbatch',
					filters: ['custrecord_ava_status', 'equalto', 6]
				});
				var searchresult = searchRecord.run();
				searchresult = searchresult.getRange({
					start: 0,
					end: 1000
				});
				
				if(searchresult != null && searchresult.length > 0){
					for(var i = 0; currentScript.getRemainingUsage() > MinUsage && i < searchresult.length; i++){
						while(currentScript.getRemainingUsage() > MinUsage){
							var searchCust, searchCustResult;
							
							try{
								searchCust = search.create({
									type: 'customrecord_avaaddvalidationbatchrecord',
									filters: ['custrecord_ava_validationbatch', 'anyof', searchresult[i].id]
								});
								searchCustResult = searchCust.run();
								searchCustResult = searchCustResult.getRange({
									start: 0,
									end: 1000
								});
							}
							catch(err){
								log.debug({
									title: 'Search not success',
									details: err
								});
								log.debug({
									title: 'Error Details',
									details: err.message
								});
							}
							
							if(searchCustResult != null && searchCustResult.length > 0){
								try{
									log.debug({
										title: 'Batch records searchCustResult count',
										details: searchCustResult.length
									});
									
									for(var k = 0; currentScript.getRemainingUsage() > MinUsage && k < searchCustResult.length; k++){
										record.delete({
											type: 'customrecord_avaaddvalidationbatchrecord',
											id: searchCustResult[k].id
										});
										log.debug({
											title: 'Record deleted',
											details: searchCustResult[k].id
										});
									}
								}
								catch(err){
									log.debug({
										title: 'Deletion not successful',
										details: err
									});
									log.debug({
										title: 'Error Details',
										details: err.message
									});
								}
							}
							else if(searchCustResult == null || searchCustResult.length == 0){
								log.debug({
									title: 'Batch records searchCustResult is null'
								});
								record.delete({
									type: 'customrecord_avaaddressvalidationbatch',
									id: searchresult[i].id
								});
								break;
							}
						}
						
						if(currentScript.getRemainingUsage() <= MinUsage){
							var scriptTask = task.create({
								taskType: task.TaskType.SCHEDULED_SCRIPT,
								scriptId: currentScript.id,
								deploymentId: currentScript.deploymentId
							});
							
							scriptTask.submit();
						}
					}
				}
				else{
					break;
				}
			}
		}
		
		return{
			execute: execute
        };
	}
);