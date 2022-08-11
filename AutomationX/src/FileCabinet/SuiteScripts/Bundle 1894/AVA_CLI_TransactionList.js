/******************************************************************************************************
	Script Name - AVA_CLI_TransactionList.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/log'],
	function(log){
		function AVA_ValidateDates(context){
			var cRecord = context.currentRecord;
			
			var dateFrom = cRecord.getValue({
				fieldId: 'ava_datefrom'
			});
			if(dateFrom != null && dateFrom.length <= 0){
				alert('Please select Starting Date.');
				return false;
			}
			
			var dateTo = cRecord.getValue({
				fieldId: 'ava_dateto'
			});
			if(dateTo != null && dateTo.length <= 0){
				alert('Please select Ending Date.');
				return false;
			}
			
			if(dateTo < dateFrom){
				alert('Ending Date should be greater than or equal to Start Date.');
				return false;
			}
			
			return true;
		}
		
		return{
			saveRecord: AVA_ValidateDates
		};
	}
);