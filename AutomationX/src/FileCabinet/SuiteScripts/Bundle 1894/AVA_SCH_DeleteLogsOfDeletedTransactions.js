/******************************************************************************************************
	Script Name - 	AVA_SCH_DeleteLogsOfDeletedTransactions.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ScheduledScript
*/

define(['N/search', 'N/record'],
	function(search, record){
		var MinUsage = 300;
		function execute(context){
			var AVA_DelMax = 200;
			var StartTime = new Date();
			StartTime.setMinutes(StartTime.getMinutes() + 9);
			
			var searchRecord = search.create({
				type: 'customrecord_avatransactionlogs',
				filters: ['custrecord_ava_transaction', 'anyof', '@NONE@']
			});
			var searchresult = searchRecord.run();
			searchresult = searchresult.getRange({
				start: 0,
				end: 1000
			});
			
			for(var i = 0; searchresult != null && i < Math.min(AVA_DelMax, searchresult.length); i++){
				var CurrTime = new Date();
				
				if(CurrTime < StartTime){
					record.delete({
						type: 'customrecord_avatransactionlogs',
						id: searchresult[i].id
					});
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