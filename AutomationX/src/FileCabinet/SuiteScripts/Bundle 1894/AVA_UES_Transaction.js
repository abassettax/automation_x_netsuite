/******************************************************************************************************
	Script Name - 	AVA_UES_Transaction.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
*/

define(['N/ui/serverWidget', 'N/runtime', 'N/cache', './utility/AVA_Library', './utility/AVA_CommonServerFunctions', './utility/AVA_TaxLibrary'],
	function(ui, runtime, cache, ava_library, ava_commonFunction, taxLibrary){
		function AVA_TransactionTabBeforeLoad(context){
			var connectorStartTime = new Date();
			var cForm = context.form;
			var nRecord = context.newRecord;
			context.form.clientScriptModulePath = './AVA_CLI_Transaction.js';
			
			if(runtime.executionContext == runtime.ContextType.WEBSTORE && nRecord.getValue('entity') <= 0){
				return;
			}
			
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
				
				taxLibrary.AVA_TransactionBeforeLoad(context, cForm, ui, nRecord, configCache, connectorStartTime);
			}
		}
		
		function AVA_TransactionTabBeforeSubmit(context){
			var connectorStartTime = new Date();
			var nRecord = context.newRecord;
			
			var avaConfigCache = cache.getCache({
				name: 'avaConfigCache',
				scope: cache.Scope.PROTECTED
			});
			var configCache = avaConfigCache.get({
				key: 'avaConfigObjRec',
				loader: ava_library.AVA_LoadValuesToGlobals
			});
			
			if(configCache != null && configCache.length > 0){
				taxLibrary.AVA_TransactionBeforeSubmit(context, nRecord, JSON.parse(configCache), connectorStartTime);
			}
		}
		
		function AVA_TransactionTabAfterSubmit(context){
			var connectorStartTime = new Date();
			var nRecord = context.newRecord;
			
			if((runtime.executionContext == runtime.ContextType.WEBAPPLICATION || runtime.executionContext == runtime.ContextType.PAYMENTPOSTBACK) && (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT || context.type == context.UserEventType.XEDIT)){
				return;
			}
			
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
				
				if(configCache.AVA_AdditionalInfo != null && configCache.AVA_AdditionalInfo.length > 0){
					details = ava_commonFunction.mainFunction('AVA_General', (configCache.AVA_AccountValue + '+' + configCache.AVA_AdditionalInfo + '+' + configCache.AVA_AdditionalInfo1 + '+' + configCache.AVA_AdditionalInfo2));
				}
				
				taxLibrary.AVA_TransactionAfterSubmit(context, nRecord, configCache, connectorStartTime, details);
			}
		}
		
		return{
			beforeLoad: AVA_TransactionTabBeforeLoad,
			beforeSubmit: AVA_TransactionTabBeforeSubmit,
			afterSubmit: AVA_TransactionTabAfterSubmit
		};
	}
);