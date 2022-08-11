/******************************************************************************************************
	Script Name - 	AVA_UES_ExpenseCategory.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
*/

define(['N/ui/serverWidget', 'N/runtime', './utility/AVA_Library'],
	function(ui, runtime, ava_library){
		function AVA_ExpenseCategoriesBeforeLoad(context){
			var avaConfigObjRec = ava_library.mainFunction('AVA_ReadConfig', '0');
			var cForm = context.form;
			
			var serviceTypes = cForm.addField({
				id: 'custpage_ava_servicetypes',
				label: 'Service Types',
				type: ui.FieldType.TEXT
			});
			serviceTypes.updateDisplayType({
				displayType: ui.FieldDisplayType.HIDDEN
			});
			serviceTypes.defaultValue = avaConfigObjRec['AVA_ServiceTypes'];
			
			if(runtime.executionContext == runtime.ContextType.USER_INTERFACE){
				var taxcode = cForm.getField({
					id: 'custrecord_ava_taxcodes'
				});
				taxcode.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
			}
			
			if(avaConfigObjRec['AVA_ServiceTypes'] != null && avaConfigObjRec['AVA_ServiceTypes'].search('TaxSvc') != -1){
				cForm.addTab({
					id: 'custpage_avatab',
					label: 'AvaTax'
				});
				var taxCodeMapping = cForm.addField({
					id: 'custpage_ava_taxcodemapping',
					label: 'AvaTax Tax Code',
					type: ui.FieldType.TEXT,
					container: 'custpage_avatab'
				});
				taxCodeMapping.maxLength = 250;
				
				if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW || context.type == context.UserEventType.COPY || context.type == context.UserEventType.XEDIT){
					var nRecord = context.newRecord;
					var taxcode = nRecord.getValue({
						fieldId: 'custrecord_ava_taxcodes'
					});
					taxCodeMapping.defaultValue = (taxcode != null && taxcode.length > 0) ? taxcode : '';
				}
			}
		}
		
		function AVA_ExpenseCategoriesBeforeSubmit(context){
			var nRecord = context.newRecord;
			var serviceTypes = nRecord.getValue({
				fieldId: 'custpage_ava_servicetypes'
			});
			
			if(serviceTypes != null && serviceTypes.search('TaxSvc') != -1){
				if(runtime.executionContext != runtime.ContextType.CSV_IMPORT && runtime.executionContext != runtime.ContextType.WEBSERVICES){
					nRecord.setValue({
						fieldId: 'custrecord_ava_taxcodes',
						value: nRecord.getValue({
							fieldId: 'custpage_ava_taxcodemapping'
						})
					});
				}
			}
		}
		
		return{
			beforeLoad: AVA_ExpenseCategoriesBeforeLoad,
			beforeSubmit: AVA_ExpenseCategoriesBeforeSubmit
        };
	}
);