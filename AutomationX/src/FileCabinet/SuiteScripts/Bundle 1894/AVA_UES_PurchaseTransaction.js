/******************************************************************************************************
	Script Name - AVA_UES_PurchaseTransaction.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
*/

define(['N/ui/serverWidget', 'N/runtime', 'N/cache', './utility/AVA_Library', './utility/AVA_CommonServerFunctions', './utility/AVA_PurchaseFunctionsLibrary'],
	function(ui, runtime, cache, ava_library, ava_commonFunction, purchaseFunctions){
		function AVA_PurchaseTransactionTabBeforeLoad(context){
			var cForm = context.form;
			context.form.clientScriptModulePath = './AVA_CLI_Purchase.js';
			
			var avaConfigCache = cache.getCache({
				name: 'avaConfigCache',
				scope: cache.Scope.PROTECTED
			});
			var configCache = avaConfigCache.get({
				key: 'avaConfigObjRec',
				loader: ava_library.AVA_LoadValuesToGlobals
			});
			
			if(configCache != null && configCache.length > 0){
				var configObject = cForm.addField({
					id: 'custpage_ava_configobj',
					label: 'Config Object',
					type: ui.FieldType.LONGTEXT
				});
				configObject.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				configObject.defaultValue = configCache;
				configCache = JSON.parse(configCache);
				
				var details = cForm.addField({
					id: 'custpage_ava_details',
					label: 'Details',
					type: ui.FieldType.TEXT
				});
				details.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				
				if(configCache.AVA_AdditionalInfo != null && configCache.AVA_AdditionalInfo.length > 0){
					details.defaultValue = ava_commonFunction.mainFunction('AVA_General', (configCache.AVA_AccountValue + '+' + configCache.AVA_AdditionalInfo + '+' + configCache.AVA_AdditionalInfo1 + '+' + configCache.AVA_AdditionalInfo2));
				}
				
				if(context.newRecord.type == 'purchaseorder'){
					if(ava_library.mainFunction('AVA_CheckVatCountries', context.newRecord.getValue('nexus_country')) == 1){
						purchaseFunctions.AVA_PurchaseTransBeforeLoad(context, cForm, ui, configCache);
					}
					else{
						var invoiceMsg = cForm.getField('custbody_ava_invoicemessage');
						if(invoiceMsg != null){
							invoiceMsg.updateDisplayType({
								displayType: ui.FieldDisplayType.HIDDEN
							});
						}
						
						var middleManVatId = cForm.getField('custbody_ava_vatregno');
						if(middleManVatId != null){
							middleManVatId.updateDisplayType({
								displayType: ui.FieldDisplayType.HIDDEN
							});
						}
						
						var soRefNumber = cForm.getField('custbody_ava_created_from_so');
						if(soRefNumber != null){
							soRefNumber.updateDisplayType({
								displayType: ui.FieldDisplayType.HIDDEN
							});
						}
						
						var sendImportAddress = cForm.getField('custbody_ava_sendimportaddress');
						if(sendImportAddress != null){
							sendImportAddress.updateDisplayType({
								displayType: ui.FieldDisplayType.HIDDEN
							});
						}
					}
				}
				else{
					if(runtime.executionContext == 'USERINTERFACE' || runtime.executionContext == 'WEBSERVICES' || runtime.executionContext == 'CLIENT'){
						purchaseFunctions.AVA_PurchaseTransactionBeforeLoad(context, cForm, ui, configCache);
					}
				}
			}
		}
		
		function AVA_PurchaseTransactionTabBeforeSubmit(context){
			var connectorStartTime = new Date();
			
			var avaConfigCache = cache.getCache({
				name: 'avaConfigCache',
				scope: cache.Scope.PROTECTED
			});
			var configCache = avaConfigCache.get({
				key: 'avaConfigObjRec',
				loader: ava_library.AVA_LoadValuesToGlobals
			});
			
			if(configCache != null && configCache.length > 0){
				if(context.newRecord.type == 'purchaseorder'){
					if(ava_library.mainFunction('AVA_CheckVatCountries', context.newRecord.getValue('nexus_country')) == 1){
						purchaseFunctions.AVA_PurchaseTransBeforeSubmit(context, JSON.parse(configCache), connectorStartTime);
					}
				}
				else{
					purchaseFunctions.AVA_PurchaseTransactionBeforeSubmit(context, JSON.parse(configCache), connectorStartTime);
				}
			}
		}

		function AVA_PurchaseTransactionTabAfterSubmit(context){
			var connectorStartTime = new Date();
			
			var avaConfigCache = cache.getCache({
				name: 'avaConfigCache',
				scope: cache.Scope.PROTECTED
			});
			var configCache = avaConfigCache.get({
				key: 'avaConfigObjRec',
				loader: ava_library.AVA_LoadValuesToGlobals
			});
			
			if(configCache != null && configCache.length > 0){
				var details;
				configCache = JSON.parse(configCache);
				
				if(context.newRecord.type == 'purchaseorder'){
					if(ava_library.mainFunction('AVA_CheckVatCountries', context.newRecord.getValue('nexus_country')) == 1){
						purchaseFunctions.AVA_PurchaseTransAfterSubmit(context, configCache);
					}
				}
				else{
					if(configCache.AVA_AdditionalInfo != null && configCache.AVA_AdditionalInfo.length > 0){
						details = ava_commonFunction.mainFunction('AVA_General', (configCache.AVA_AccountValue + '+' + configCache.AVA_AdditionalInfo + '+' + configCache.AVA_AdditionalInfo1 + '+' + configCache.AVA_AdditionalInfo2));
					}
					
					purchaseFunctions.AVA_PurchaseTransactionAfterSubmit(context, configCache, connectorStartTime, details);
				}
			}
		}
		
		return{
			beforeLoad: AVA_PurchaseTransactionTabBeforeLoad,
			beforeSubmit: AVA_PurchaseTransactionTabBeforeSubmit,
			afterSubmit: AVA_PurchaseTransactionTabAfterSubmit
		};
	}
);