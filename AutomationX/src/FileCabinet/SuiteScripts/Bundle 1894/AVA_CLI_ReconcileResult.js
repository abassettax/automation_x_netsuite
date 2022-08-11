/******************************************************************************************************
	Script Name - AVA_CLI_ReconcileResult.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/url', 'N/currentRecord', 'N/https'],
	function(url, currentRecord, https){
		function AVA_FieldChange(context){
			var cRecord = context.currentRecord;
			
			if(context.fieldId == 'ava_status'){
				setWindowChanged(window, false);
				
				var url1 = url.resolveScript({
					scriptId: 'customscript_ava_reconcilelist_suitelet',
					deploymentId: 'customdeploy_ava_reconcilelist'
				});
				url1 += '&ava_batchid=' + cRecord.getValue('ava_batchid') + '&ava_status=' + cRecord.getValue('ava_status');
				window.location = url1;
			}
		}
		
		function AVA_ExportCSV(){
			var cRecord = currentRecord.get();
			
			var response = https.get({
				url: url.resolveScript({
					scriptId: 'customscript_ava_recordload_suitelet',
					deploymentId: 'customdeploy_ava_recordload',
					params: {'type': 'reconcilecsv', 'batchId': cRecord.getValue('ava_batchid'), 'ava_status': cRecord.getValue('ava_status')}
				})
			});
			var fieldValues = response.body.split('+');
			window.open(fieldValues[1], '_blank');
			
			https.get({
				url: url.resolveScript({
					scriptId: 'customscript_ava_recordload_suitelet',
					deploymentId: 'customdeploy_ava_recordload',
					params: {'type': 'deletefile', 'FileId': fieldValues[0]}
				})
			});
		}
		
		return{
			fieldChanged: AVA_FieldChange,
			AVA_ExportCSV: AVA_ExportCSV
		};
	}
);