/******************************************************************************************************
	Script Name - 	AVA_CLI_Transaction.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/currentRecord', './utility/AVA_TaxLibrary', './utility/AVA_Library'],
	function(currentRecord, taxLibrary, ava_library){
		function AVA_TransactionInit(context){
			taxLibrary.AVA_TransactionPageInitEvent(context);
		}
		
		function AVA_TransactionFieldChanged(context){
			taxLibrary.AVA_TransactionFieldChangedEvent(context);
		}
		
		function AVA_TransactionPostSourcing(context){
			try{
				var cRecord = context.currentRecord;
				
				if(cRecord.getValue('custpage_ava_context') == 'WEBSTORE'){
					var configCache = JSON.parse(cRecord.getValue('custpage_ava_configobj'));
					
					if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
						if(context.fieldId == 'couponcode' || (context.fieldId == 'shipmethod' && cRecord.getValue('shipmethod') != null && cRecord.getValue('shipmethod').length > 0)){ // Recalculate tax if coupon code is applied or shipping method is changed.
							taxLibrary.AVA_CalculateTaxOnDemand(cRecord, new Date());
						}
					}
				}
			}
			catch(err){
				log.debug({
					title: 'AVA_TransactionPostSourcing - Error',
					details: err.message
				});
			}
		}
		
		function AVA_TransactionSublistChanged(context){
			taxLibrary.AVA_TransactionSublistChangedEvent(context);
		}
		
		function AVA_TransactionSave(context){
			return taxLibrary.AVA_TransactionSaveEvent(context);
		}
		
		function AVA_CalculateOnDemand(){
			var connectorStartTime = new Date();
			var cRecord = currentRecord.get();
			taxLibrary.AVA_CalculateTaxOnDemand(cRecord, connectorStartTime);
		}
		
		function AVA_ValidateAddress(mode){
			var cRecord = currentRecord.get();
			
			if(cRecord.getValue('custpage_ava_configobj') != null && cRecord.getValue('custpage_ava_configobj').length > 0){
				var configCache = JSON.parse(cRecord.getValue('custpage_ava_configobj'));
				ava_library.AVA_ValidateAddress(cRecord, configCache, mode);
			}
		}
		
		function AVA_OpenPurchaseOrder(entityid, recTransId){
			window.open('/app/accounting/transactions/purchord.nl?cf=78&entity=&whence=&entityid=' + entityid + '&recordId=' + recTransId + '');
		}
		
		return{
			pageInit: AVA_TransactionInit,
			fieldChanged: AVA_TransactionFieldChanged,
			postSourcing: AVA_TransactionPostSourcing,
			sublistChanged: AVA_TransactionSublistChanged,
			saveRecord: AVA_TransactionSave,
			AVA_CalculateOnDemand: AVA_CalculateOnDemand,
			AVA_ValidateAddress: AVA_ValidateAddress,
			AVA_OpenPurchaseOrder: AVA_OpenPurchaseOrder
		};
	}
);