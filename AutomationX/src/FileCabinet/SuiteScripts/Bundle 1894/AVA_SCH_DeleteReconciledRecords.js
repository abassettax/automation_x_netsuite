/******************************************************************************************************
	Script Name - 	AVA_SCH_DeleteReconciledRecords.js
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
					type: 'customrecord_avareconcilebatch',
					filters: ['custrecord_ava_batchstatus', 'equalto', 3],
					columns: ['custrecord_ava_totalrecords', 'custrecord_ava_avacr', 'custrecord_ava_batchname']
				});
				var searchresult = searchRecord.run();
				searchresult = searchresult.getRange({
					start: 0,
					end: 1000
				});
				
				if(searchresult != null && searchresult.length > 0){
					for(var i = 0; currentScript.getRemainingUsage() > MinUsage && i < searchresult.length; i++){
						record.submitFields({
							type: 'customrecord_avareconcilebatch',
							id: searchresult[i].id,
							values: {
								'custrecord_ava_batchprogress': 1
							},
							options: {
						        enableSourcing: false
						    }
						});
						
						while(currentScript.getRemainingUsage() > MinUsage){
							var searchCust, searchCustResult, delCtr = 0;
							log.debug({
								title: 'Batch',
								details: searchresult[i].id
							});
							
							try{
								searchCust = search.create({
									type: 'customrecord_avareconcilebatchrecords',
									filters: ['custrecord_ava_reconcilebatchname', 'is', searchresult[i].getValue('custrecord_ava_batchname')]
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
									var TotalRecs = parseInt(searchresult[i].getValue('custrecord_ava_totalrecords'));
									log.debug({
										title: 'Batch records searchCustResult count',
										details: searchCustResult.length
									});
									
									for(var k = 0; currentScript.getRemainingUsage() > MinUsage && k < searchCustResult.length; k++){
										record.delete({
											type: 'customrecord_avareconcilebatchrecords',
											id: searchCustResult[k].id
										});
										log.debug({
											title: 'Record deleted',
											details: searchCustResult[k].id
										});
										delCtr++;
									}
									
									record.submitFields({
										type: 'customrecord_avareconcilebatch',
										id: searchresult[i].id,
										values: {
											'custrecord_ava_batchprogress': Math.floor(((parseFloat(delCtr) + parseFloat((searchresult[i].getValue('custrecord_ava_avacr') != null && searchresult[i].getValue('custrecord_ava_avacr').length > 0 ? searchresult[i].getValue('custrecord_ava_avacr') : 0))) / parseFloat(TotalRecs)) * 100),
											'custrecord_ava_avacr': parseFloat(searchresult[i].getValue('custrecord_ava_avacr')) + parseFloat(delCtr)
										},
										options: {
									        enableSourcing: false
									    }
									});
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
									type: 'customrecord_avareconcilebatch',
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