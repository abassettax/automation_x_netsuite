/******************************************************************************************************
	Script Name - 	AVA_CLI_ReconcileUtility.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/url', 'N/https'],
	function(url, https){
		function AVA_BatchSaveRecord(context){
			var cRecord = context.currentRecord;
			
			var BatchName = cRecord.getValue({
				fieldId: 'ava_batchname'
			});
			
			var StartDate = cRecord.getValue({
				fieldId: 'ava_datefrom'
			});
			
			var EndDate = cRecord.getValue({
				fieldId: 'ava_dateto'
			});
			
			if(StartDate == null || StartDate.length == 0){
				alert('Please select Starting Date');
				document.forms['main_form'].ava_datefrom.focus();
				return false;
			}
			
			if(EndDate == null || EndDate.length == 0){
				alert('Please select Ending Date');
				document.forms['main_form'].ava_dateto.focus();
				return false;
			}
			
			if(BatchName == null || BatchName.length == 0){
				alert('Please enter a Batch Name');
				document.forms['main_form'].ava_batchname.focus();
				return false;
			}
			
			if(EndDate < StartDate){
				alert('Ending Date should be greater than or equal to Start Date');
				document.forms['main_form'].ava_dateto.focus();
				return false;
			}
			
			var response = https.get({
				method: https.Method.GET,
				url: url.resolveScript({
					scriptId: 'customscript_ava_recordload_suitelet',
					deploymentId: 'customdeploy_ava_recordload',
					params: {'type': 'customrecord_avareconcilebatch', 'batchname': BatchName}
				})
			});
			
			if(response.body == '0'){ // Batch name already exists
				alert('Batch Name already Exists. Enter a new Batch Name');
				document.forms['main_form'].ava_batchname.focus();
				return false;
			}
			
			return true;
		}
		
		return{
			saveRecord: AVA_BatchSaveRecord
		};
	}
);