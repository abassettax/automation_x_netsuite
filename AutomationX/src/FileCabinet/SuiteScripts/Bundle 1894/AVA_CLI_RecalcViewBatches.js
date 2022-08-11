/******************************************************************************************************
	Script Name - 	AVA_CLI_RecalcViewBatches.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/url'],
	function(url){
		function AVA_SaveRecord(context){
			var cRecord = context.currentRecord;
			var alertFlag = 'F', alertMsg = '';
			
			var lineCount = cRecord.getLineCount({
				sublistId: 'custpage_avabatchlist'
			});
			
			for(var i = 0; i < lineCount; i++){
				var apply = cRecord.getSublistValue({
					sublistId: 'custpage_avabatchlist',
					fieldId: 'apply',
					line: i
				});
				
				if(apply == true){
					var BatchStatus = cRecord.getSublistValue({
						sublistId: 'custpage_avabatchlist',
						fieldId: 'ava_batchstatus',
						line: i
					});
					
					if(BatchStatus == 'In Progress'){
						var BatchName = cRecord.getSublistValue({
							sublistId: 'custpage_avabatchlist',
							fieldId: 'ava_batchname',
							line: i
						});
						
						alertFlag = 'T';
						alertMsg += BatchName + '\n';
					}
				}
			}
			
			if(alertFlag == 'T'){
				alert('Following Batches are in Progress and cannot be deleted: \n' + alertMsg);
				return false;
			}
			
			return true;
		}
		
		function AVA_RecalcRefreshPage(){
			window.location = url.resolveScript({
				scriptId: 'customscript_ava_recalcbatches',
				deploymentId: 'customdeploy_ava_recalcbatches'
			});
		}
		
		function AVA_ReconcileRefreshPage(){
			window.location = url.resolveScript({
				scriptId: 'customscript_ava_reconciliation_suitelet',
				deploymentId: 'customdeploy_ava_reconcileresult'
			});
		}
		
		function AVA_AddrRefreshPage(){
			window.location = url.resolveScript({
				scriptId: 'customscript_avaaddvalidresults_suitelet',
				deploymentId: 'customdeploy_avaaddressvalidationresults'
			});
		}
		
		return{
			saveRecord: AVA_SaveRecord,
			AVA_RecalcRefreshPage: AVA_RecalcRefreshPage,
			AVA_ReconcileRefreshPage: AVA_ReconcileRefreshPage,
			AVA_AddrRefreshPage: AVA_AddrRefreshPage
		};
	}
);