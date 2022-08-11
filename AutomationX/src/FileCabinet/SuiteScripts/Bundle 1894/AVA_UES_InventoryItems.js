/******************************************************************************************************
	Script Name - 	AVA_UES_InventoryItems.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
*/

define(['N/ui/serverWidget', 'N/runtime', 'N/search', 'N/record', './utility/AVA_Library'],
	function(ui, runtime, search, record, ava_library){
		function AVA_InventoryTabBeforeLoad(context){
			var cForm = context.form;
			var nRecord = context.newRecord;
			var avaConfigObjRec = ava_library.mainFunction('AVA_ReadConfig', '0');
			
			var serviceTypes = cForm.addField({
				id: 'custpage_ava_servicetypes',
				label: 'Service Types',
				type: ui.FieldType.TEXT
			});
			serviceTypes.updateDisplayType({
				displayType: ui.FieldDisplayType.HIDDEN
			});
			serviceTypes.defaultValue = avaConfigObjRec['AVA_ServiceTypes'];
			
			// Flag identification to decide on which Inventory Item screen to add the tab.
			// Default Value 'F' - No adding of tab and 'T' for adding tab. 
			var AVA_DesignTab = 'F';
			var subtype = nRecord.getValue({
				fieldId: 'subtype'
			});
			
			if(subtype != 'Purchase' && runtime.executionContext == runtime.ContextType.USER_INTERFACE){
				var udf1 = cForm.getField({
					id: 'custitem_ava_udf1'
				});
				udf1.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				var udf2 = cForm.getField({
					id: 'custitem_ava_udf2'
				});
				udf2.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				var taxcode = cForm.getField({
					id: 'custitem_ava_taxcode'
				});
				taxcode.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
			}
			
			if(avaConfigObjRec['AVA_ServiceTypes'] != null && avaConfigObjRec['AVA_ServiceTypes'].search('TaxSvc') != -1){
				switch(nRecord.type){
					case 'inventoryitem':
					case 'lotnumberedinventoryitem':
					case 'serializedinventoryitem':
					case 'assemblyitem':
					case 'lotnumberedassemblyitem':
					case 'serializedassemblyitem':
					case 'kititem':
					case 'downloaditem':
					case 'giftcertificateitem':
						AVA_DesignTab = 'T'; 
						break;
					
					case 'noninventoryitem':
					case 'otherchargeitem':
					case 'serviceitem':
						if(subtype != 'Purchase'){
							AVA_DesignTab = 'T'; 
						}
						break;
							
					default:
						break;
				}
				
				if(AVA_DesignTab == 'T'){
					cForm.addTab({
						id: 'custpage_avatab',
						label: 'AvaTax'
					});
					var udf1 = cForm.addField({
						id: 'custpage_ava_udf1',
						label: 'User Defined 1',
						type: ui.FieldType.TEXT,
						container: 'custpage_avatab'
					});
					udf1.maxLength = 250;
					var udf2 = cForm.addField({
						id: 'custpage_ava_udf2',
						label: 'User Defined 2',
						type: ui.FieldType.TEXT,
						container: 'custpage_avatab'
					});
					udf2.maxLength = 250;
					var taxcodeMapping = cForm.addField({
						id: 'custpage_ava_taxcodemapping',
						label: 'AvaTax Tax Code',
						type: ui.FieldType.TEXT,
						container: 'custpage_avatab'
					});
					taxcodeMapping.maxLength = 25;
					var itemMapId = cForm.addField({
						id: 'custpage_ava_itemmapid',
						label: 'AVA Item Mapping ID',
						type: ui.FieldType.TEXT,
						container: 'custpage_avatab'
					});
					itemMapId.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW || context.type == context.UserEventType.XEDIT){
						var searchRecord = search.create({
							type: 'customrecord_avaitemmapping',
							filters: ['custrecord_ava_itemid', 'anyof', nRecord.id],
							columns: ['custrecord_ava_itemudf1', 'custrecord_ava_itemudf2', 'custrecord_ava_itemtaxcodemapping']
						});
						var searchresult = searchRecord.run();
						searchresult = searchresult.getRange({
							start: 0,
							end: 5
						});
						
						if(searchresult != null && searchresult.length > 0){
							for(var i = 0; i < searchresult.length; i++){
								itemMapId.defaultValue = searchresult[i].id;
								udf1.defaultValue = searchresult[i].getValue('custrecord_ava_itemudf1');
								udf2.defaultValue = searchresult[i].getValue('custrecord_ava_itemudf2');
								taxcodeMapping.defaultValue = searchresult[i].getValue('custrecord_ava_itemtaxcodemapping');
							}
						}
						else{
							var avaUdf1 = nRecord.getValue({
								fieldId: 'custitem_ava_udf1'
							});
							udf1.defaultValue = (avaUdf1 != null && avaUdf1.length > 0) ? avaUdf1 : '';
							var avaUdf2 = nRecord.getValue({
								fieldId: 'custitem_ava_udf2'
							});
							udf2.defaultValue = (avaUdf2 != null && avaUdf2.length > 0) ? avaUdf2 : '';
							var taxcode = nRecord.getValue({
								fieldId: 'custitem_ava_taxcode'
							});
							taxcodeMapping.defaultValue = (taxcode != null && taxcode.length > 0) ? taxcode : '';
						}
					}
					else if(context.type == context.UserEventType.COPY){
						var avaUdf1 = nRecord.getValue({
							fieldId: 'custitem_ava_udf1'
						});
						udf1.defaultValue = (avaUdf1 != null && avaUdf1.length > 0) ? avaUdf1 : '';
						var avaUdf2 = nRecord.getValue({
							fieldId: 'custitem_ava_udf2'
						});
						udf2.defaultValue = (avaUdf2 != null && avaUdf2.length > 0) ? avaUdf2 : '';
						var taxcode = nRecord.getValue({
							fieldId: 'custitem_ava_taxcode'
						});
						taxcodeMapping.defaultValue = (taxcode != null && taxcode.length > 0) ? taxcode : '';
					}
				}
			}
		}
		
		function AVA_InventoryTabBeforeSubmit(context){
			var nRecord = context.newRecord;
			var serviceTypes = nRecord.getValue({
				fieldId: 'custpage_ava_servicetypes'
			});
			
			if(serviceTypes != null && serviceTypes.search('TaxSvc') != -1){
				if(runtime.executionContext != runtime.ContextType.CSV_IMPORT && runtime.executionContext != runtime.ContextType.WEBSERVICES){
					nRecord.setValue({
						fieldId: 'custitem_ava_udf1',
						value: nRecord.getValue({
							fieldId: 'custpage_ava_udf1'
						})
					});
					nRecord.setValue({
						fieldId: 'custitem_ava_udf2',
						value: nRecord.getValue({
							fieldId: 'custpage_ava_udf2'
						})
					});
					nRecord.setValue({
						fieldId: 'custitem_ava_taxcode',
						value: nRecord.getValue({
							fieldId: 'custpage_ava_taxcodemapping'
						})
					});
				}
			}
		}
		
		function AVA_InventoryTabAfterSubmit(context){
			var nRecord = context.newRecord;
			var serviceTypes = nRecord.getValue({
				fieldId: 'custpage_ava_servicetypes'
			});
			
			if(serviceTypes != null && serviceTypes.search('TaxSvc') != -1){
				var itemMapId = nRecord.getValue({
					fieldId: 'custpage_ava_itemmapid'
				});
				
				if(itemMapId != null && itemMapId.length > 0){
					record.delete({
						type: 'customrecord_avaitemmapping',
						id: itemMapId
					});
				}
			}
		}
		
		return{
			beforeLoad: AVA_InventoryTabBeforeLoad,
			beforeSubmit: AVA_InventoryTabBeforeSubmit,
			afterSubmit: AVA_InventoryTabAfterSubmit
        };
	}
);