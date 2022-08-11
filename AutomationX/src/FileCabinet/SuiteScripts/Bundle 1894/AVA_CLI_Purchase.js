/******************************************************************************************************
	Script Name - AVA_CLI_Purchase.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/currentRecord', 'N/search', './utility/AVA_PurchaseFunctionsLibrary'],
	function(currentRecord, search, purchaseFunctions){
		var RecordMode = '';
		
		function AVA_PurchaseTransactionFieldChanged(context){
			purchaseFunctions.AVA_PurchaseTransactionFieldChangedEvent(context);
		}
		
		function AVA_PurchaseTransactionPageInit(context){
			RecordMode = context.mode;
			var cRecord = context.currentRecord;
			
			if(cRecord.type == 'purchaseorder' && context.mode == 'create'){
				try{
					var soId = cRecord.getValue('custbody_ava_created_from_so');
					
					if(soId){
						cRecord.setValue({
							fieldId: 'shipto',
							value: cRecord.getValue('custpage_ava_soentity')
						});
					}
				}
				catch(err){
					log.debug({
						title: 'AVA_PurchaseTransactionPageInit - Error',
						details: err.message
					});
				}
			}
		}
		
		function AVA_PurchaseTransactionPostSourcing(context){
			var cRecord = context.currentRecord;
			
			if(cRecord.type == 'purchaseorder'){
				try{
					 if(RecordMode == 'create' && context.fieldId == 'shipto'){
						 var soId = cRecord.getValue('custbody_ava_created_from_so');
						 
						 if(soId){
							var soShipAddressList = cRecord.getValue('custpage_ava_soshipaddresslist');	 
							
							if(soShipAddressList){
								cRecord.setValue({
									fieldId: 'shipaddresslist',
									value: soShipAddressList
								});
							}
							else{
								cRecord.setValue({
									fieldId: 'shipaddresslist',
									value: -2,
									ignoreFieldChange: true,
									
								});
								
								var searchRecord = search.create({
									type: search.Type.SALES_ORDER,
									filters:
										[
											['mainline', 'is', 'T'],
											'and',
											['internalid', 'anyof', soId]
										],
									columns:
										[
											'shipaddress1',
											'shipaddress2',
											'shipcity',
											'shipstate',
											'shipzip',
											'shipcountrycode',
											'shipaddress'
										]
								});
								var searchResult = searchRecord.run();
								searchResult = searchResult.getRange({
									start: 0,
									end: 5
								});
								
								if(searchResult != null && searchResult.length > 0){
									cRecord.setValue({
										fieldId: 'shipoverride',
										value: 'T'
									});
									cRecord.setValue({
										fieldId: 'shipcountry',
										value: searchResult[0].getValue('shipcountrycode')
									});
									
									if(AVA_Validation(searchResult[0].getValue('shipaddress1'))){
										cRecord.setValue({
											fieldId: 'shipaddr1',
											value: searchResult[0].getValue('shipaddress1')
										});
									}
									
									if(AVA_Validation(searchResult[0].getValue('shipaddress2'))){
										cRecord.setValue({
											fieldId: 'shipaddr2',
											value: searchResult[0].getValue('shipaddress2')
										});
									}
									
									if(AVA_Validation(searchResult[0].getValue('shipcity'))){
										cRecord.setValue({
											fieldId: 'shipcity',
											value: searchResult[0].getValue('shipcity')
										});
									}
									
									if(AVA_Validation(searchResult[0].getValue('shipstate'))){
										cRecord.setValue({
											fieldId: 'shipstate',
											value: searchResult[0].getValue('shipstate')
										});
									}
									
									if(AVA_Validation(searchResult[0].getValue('shipzip'))){
										cRecord.setValue({
											fieldId: 'shipzip',
											value: searchResult[0].getValue('shipzip')
										});
									}
									
									if(AVA_Validation(searchResult[0].getValue('shipaddress'))){
										cRecord.setValue({
											fieldId: 'shipaddress',
											value: searchResult[0].getValue('shipaddress')
										});
									}
								}
							}
						 }
					 }
				}
				catch(err){
					log.debug({
						title: 'AVA_PurchaseTransactionPostSourcing - Error',
						details: err.message
					});
				}
			}
		}
		
		function AVA_PurchaseTransactionSave(context){
			return purchaseFunctions.AVA_PurchaseTransactionSaveEvent(context);
		}
		
		function AVA_VerifyTax(){
			var connectorStartTime = new Date();
			var cRecord = currentRecord.get();
			purchaseFunctions.AVA_VerifyTaxOnDemand(cRecord, connectorStartTime);
		}
		
		function AVA_Validation(value){
			if(value != 'null' && value != '' && value != undefined && value != 'NaN' && value != 'undefined' && value != '- None -'){
				return true;
			} 
			else{
				return false;
			}
		}
		
		return{
			fieldChanged: AVA_PurchaseTransactionFieldChanged,
			pageInit: AVA_PurchaseTransactionPageInit,
			postSourcing: AVA_PurchaseTransactionPostSourcing,
			saveRecord: AVA_PurchaseTransactionSave,
			AVA_VerifyTax: AVA_VerifyTax
		};
	}
);