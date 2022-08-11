/******************************************************************************************************
	Script Name - 	AVA_CLI_RecalculateUtility.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/url', 'N/search', 'N/https'],
	function(url, search, https){
		function AVA_RecalculateSave(context){
			var cRecord = context.currentRecord;
			
			var batchName = cRecord.getValue({
				fieldId: 'ava_batchname'
			});
			if(batchName != null && batchName.length <= 0){
				alert('Please enter value(s) for Batch Name.');
				document.forms['main_form'].ava_batchname.focus();
				return false;
			}
			
			var allRecordTypes = cRecord.getValue({
				fieldId: 'ava_alltypes'
			});
			var estimate = cRecord.getValue({
				fieldId: 'ava_estimate'
			});
			var salesOrder = cRecord.getValue({
				fieldId: 'ava_salesorder'
			});
			var invoice = cRecord.getValue({
				fieldId: 'ava_invoice'
			});
			var cashSale = cRecord.getValue({
				fieldId: 'ava_cashsale'
			});
			var returnAuth = cRecord.getValue({
				fieldId: 'ava_returnauth'
			});
			var creditMemo = cRecord.getValue({
				fieldId: 'ava_creditmemo'
			});
			var cashRefund = cRecord.getValue({
				fieldId: 'ava_cashrefund'
			});
			if(allRecordTypes == false && estimate == false && salesOrder == false && invoice == false && cashSale == false && returnAuth == false && creditMemo == false && cashRefund == false){
				alert('Select any one record type to perform recalculation');
				return false;
			}
			
			var fromDate = cRecord.getValue({
				fieldId: 'ava_fromdate'
			});
			if(fromDate != null && fromDate.length <= 0){
				alert('Please enter value(s) for From Date.');
				document.forms['main_form'].ava_fromdate.focus();
				return false;
			}
			
			var toDate = cRecord.getValue({
				fieldId: 'ava_todate'
			});
			if(toDate != null && toDate.length <= 0){
				alert('Please enter value(s) for To Date.');
				document.forms['main_form'].ava_todate.focus();
				return false;
			}
			
			if(toDate < fromDate){
				alert('To Date should be greater than or equal to From Date');
				document.forms['main_form'].ava_todate.focus();
				return false;
			}
			
			var response = https.request({
				method: https.Method.GET,
				url: url.resolveScript({
					scriptId: 'customscript_ava_recordload_suitelet',
					deploymentId: 'customdeploy_ava_recordload',
					params: {'type': 'customrecord_avarecalculatebatch', 'batchname': batchName}
				})
			});
			
			if(response.body == '0'){ // Batch name already exists
				alert('Batch Name already Exists. Enter a new Batch Name');
				document.forms['main_form'].ava_batchname.focus();
				return false;
			}
			
			return true;
		}
		
		function AVA_RecalculateChange(context){
			if(context.fieldId == 'ava_alltypes'){
				var cRecord = context.currentRecord;
				
				var allRecordTypes = cRecord.getValue({
					fieldId: 'ava_alltypes'
				});
				var estimate = cRecord.getField({
					fieldId: 'ava_estimate'
				});
				var salesOrder = cRecord.getField({
					fieldId: 'ava_salesorder'
				});
				var invoice = cRecord.getField({
					fieldId: 'ava_invoice'
				});
				var cashSale = cRecord.getField({
					fieldId: 'ava_cashsale'
				});
				var returnAuth = cRecord.getField({
					fieldId: 'ava_returnauth'
				});
				var creditMemo = cRecord.getField({
					fieldId: 'ava_creditmemo'
				});
				var cashRefund = cRecord.getField({
					fieldId: 'ava_cashrefund'
				});
				
				estimate.isDisabled = allRecordTypes;
				salesOrder.isDisabled = allRecordTypes;
				invoice.isDisabled = allRecordTypes;
				cashSale.isDisabled = allRecordTypes;
				returnAuth.isDisabled = allRecordTypes;
				creditMemo.isDisabled = allRecordTypes;
				cashRefund.isDisabled = allRecordTypes;
			}
		}
		
		return{
			saveRecord: AVA_RecalculateSave,
			fieldChanged: AVA_RecalculateChange
		};
	}
);