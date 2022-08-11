/******************************************************************************************************
	Script Name - AVA_UES_Vendor.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
*/

define(['N/ui/serverWidget', 'N/runtime', 'N/search', 'N/record', 'N/cache', './utility/AVA_Library'],
	function(ui, runtime, search, record, cache, ava_library){
		function AVA_VendorBeforeLoad(context){
			try{
				var cForm = context.form;
				var nRecord = context.newRecord;
				var executionContext = runtime.executionContext;
				
				if(executionContext == 'USERINTERFACE'){  
					var avaConfigCache = cache.getCache({
						name: 'avaConfigCache',
						scope: cache.Scope.PROTECTED
					});
					
					var configCache = avaConfigCache.get({
						key: 'avaConfigObjRec',
						loader: ava_library.AVA_LoadValuesToGlobals
					});
					
					if(configCache != null && configCache.length > 0){
						configCache = JSON.parse(configCache);
					}
					
					if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1 && configCache.AVA_DisableTax == false){
						var addressBookSublist = cForm.getSublist({
							id: 'addressbook'
						});
						
						if(addressBookSublist != null){
							addressBookSublist.addField({
								id: 'custpage_ava_poa',
								type: ui.FieldType.CHECKBOX,
								label: 'Point of Order Acceptance'
							});
							addressBookSublist.addField({
								id: 'custpage_ava_import',
								type: ui.FieldType.CHECKBOX,
								label: 'Import Address'
							});
						}
						
						if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW){
							var searchRecordVatAddresses = search.create({
								type: 'customrecord_vendorvataddresses',
								filters: ['custrecord_ava_vatvendorid', 'anyof', nRecord.id],
								columns: ['custrecord_ava_poaaddid', 'custrecord_ava_poaflag', 'custrecord_ava_importaddrid', 'custrecord_ava_importaddrflag']
							});
							var searchResultVatAddresses = searchRecordVatAddresses.run();
							searchResultVatAddresses = searchResultVatAddresses.getRange({
								start: 0,
								end: 1000
							});
							
							var addressLineCount = nRecord.getLineCount({
								sublistId: 'addressbook'
							});
							
							for(var i = 0; i < addressLineCount && searchResultVatAddresses != null && searchResultVatAddresses.length > 0; i++){
								var addId = nRecord.getSublistValue({
									sublistId: 'addressbook',
									fieldId: 'id',
									line: i
								});
								
								for(var j = 0; j < searchResultVatAddresses.length; j++){
									if(searchResultVatAddresses[j].getValue('custrecord_ava_poaaddid') == addId){
										nRecord.setSublistValue({
											sublistId: 'addressbook',
											fieldId: 'custpage_ava_poa',
											line: i,
											value: searchResultVatAddresses[j].getValue('custrecord_ava_poaflag')
										});
									}
									
									if(searchResultVatAddresses[j].getValue('custrecord_ava_importaddrid') == addId){
										nRecord.setSublistValue({
											sublistId: 'addressbook',
											fieldId: 'custpage_ava_import',
											line: i,
											value: searchResultVatAddresses[j].getValue('custrecord_ava_importaddrflag')
										});
									}
								}
							}
						}
					}
				}
			}
			catch(err){
                log.debug({
                    title: 'AVA_VendorBeforeLoad Try/Catch Error',
                    details: err.message
                });
            }
		}
		
		function AVA_VendorAfterSubmit(context){
			try{
				var nRecord = context.newRecord;
				var executionContext = runtime.executionContext;
				
				if(executionContext == 'USERINTERFACE'){
					var avaConfigCache = cache.getCache({
						name: 'avaConfigCache',
						scope: cache.Scope.PROTECTED
					});
					
					var configCache = avaConfigCache.get({
						key: 'avaConfigObjRec',
						loader: ava_library.AVA_LoadValuesToGlobals
					});
					
					if(configCache != null && configCache.length > 0){
						configCache = JSON.parse(configCache);
					}
					
					if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
						if(context.type == context.UserEventType.CREATE && nRecord.getValue('isinactive') == false){
							var custRec = record.load({
								type: record.Type.VENDOR,
								id: nRecord.id
							}); 
							
							var rec = record.create({
								type: 'customrecord_vendorvataddresses'
							});
							rec.setValue({
								fieldId: 'custrecord_ava_vatvendorid',
								value: nRecord.id
							});
							rec.setValue({
								fieldId: 'custrecord_ava_vatvendorinternalid',
								value: nRecord.id
							});
							
							var lineItemCount = custRec.getLineCount({
								sublistId: 'addressbook'
							}); 
							
							for(var i = 0; i < lineItemCount; i++){
								var addId = custRec.getSublistValue({
									sublistId: 'addressbook',
									fieldId: 'id',
									line: i
								});
								
								var poaAddressFlag = nRecord.getSublistValue({
									sublistId: 'addressbook',
									fieldId: 'custpage_ava_poa',
									line: i
								});
								var importAddressFlag = nRecord.getSublistValue({
									sublistId: 'addressbook',
									fieldId: 'custpage_ava_import',
									line: i
								});
								
								if(poaAddressFlag == 'T'){
									var address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', i);
									
									rec.setValue({
										fieldId: 'custrecord_ava_poaflag',
										value: true
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poaaddid',
										value: addId
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poaaddr1',
										value: address.getValue('addr1')
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poaaddr2',
										value: address.getValue('addr2')
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poacity',
										value: address.getValue('city')
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poastate',
										value: address.getValue('state')
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poazip',
										value: address.getValue('zip')
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poacountry',
										value: address.getValue('country')
									});
								}
								
								if(importAddressFlag == 'T'){
									var address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', i);
									
									rec.setValue({
										fieldId: 'custrecord_ava_importaddrflag',
										value: true
									});
									rec.setValue({
										fieldId: 'custrecord_ava_importaddrid',
										value: addId
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impaddr1',
										value: address.getValue('addr1')
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impaddr2',
										value: address.getValue('addr2')
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impcity',
										value: address.getValue('city')
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impstate',
										value: address.getValue('state')
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impzip',
										value: address.getValue('zip')
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impcountry',
										value: address.getValue('country')
									});
								}
							}
							
							rec.save({
								enableSourcing: false,
								ignoreMandatoryFields: true
							});
						} 
						else if(context.type == context.UserEventType.EDIT){
							var address, poaFlag, flagPoa = 0, importFlag, flagImport = 0;
							
							var searchRecord = search.create({
								type: 'customrecord_vendorvataddresses',
								filters: ['custrecord_ava_vatvendorid', 'anyof', nRecord.id],
								columns: ['custrecord_ava_poaaddid', 'custrecord_ava_importaddrid', 'custrecord_ava_vatvendorinternalid']
							});
							var searchResult = searchRecord.run();
							searchResult = searchResult.getRange({
								start: 0,
								end: 1000
							});
							
							var custRec = record.load({
								type: record.Type.VENDOR,
								id: nRecord.id
							});
							
							var lineCount = custRec.getLineCount({
								sublistId: 'addressbook'
							});
							
							if(searchResult != null && searchResult.length > 0){
								var rec = record.load({
									type: 'customrecord_vendorvataddresses',
									id: searchResult[0].id
								});
								
								for(var iii = 0; iii < lineCount; iii++){
									var addId = custRec.getSublistValue({
										sublistId: 'addressbook',
										fieldId: 'id',
										line: iii
									});
									
									poaFlag = nRecord.getSublistValue({
										sublistId: 'addressbook',
										fieldId: 'custpage_ava_poa',
										line: iii
									});
									importFlag = nRecord.getSublistValue({
										sublistId: 'addressbook',
										fieldId: 'custpage_ava_import',
										line: iii
									});
									
									if(poaFlag == 'T' && flagPoa == 0){
										flagPoa = 1;
										address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', iii);
										
										rec.setValue({
											fieldId: 'custrecord_ava_poaflag',
											value: true
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poaaddid',
											value: addId
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poaaddr1',
											value: address.getValue('addr1')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poaaddr2',
											value: address.getValue('addr2')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poacity',
											value: address.getValue('city')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poastate',
											value: address.getValue('state')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poazip',
											value: address.getValue('zip')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poacountry',
											value: address.getValue('country')
										});
									}
									
									if(importFlag == 'T' && flagImport == 0){
										flagImport = 1;
										address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', iii);
										
										rec.setValue({
											fieldId: 'custrecord_ava_importaddrflag',
											value: true
										});
										rec.setValue({
											fieldId: 'custrecord_ava_importaddrid',
											value: addId
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impaddr1',
											value: address.getValue('addr1')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impaddr2',
											value: address.getValue('addr2')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impcity',
											value: address.getValue('city')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impstate',
											value: address.getValue('state')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impzip',
											value: address.getValue('zip')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impcountry',
											value: address.getValue('country')
										});
									}
								}
								
								if(flagPoa == 0){
									rec.setValue({
										fieldId: 'custrecord_ava_poaflag',
										value: false
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poaaddid',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poaaddr1',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poaaddr2',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poacity',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poastate',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poazip',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_poacountry',
										value: ''
									});
								}
								
								if(flagImport == 0){
									rec.setValue({
										fieldId: 'custrecord_ava_importaddrflag',
										value: false
									});
									rec.setValue({
										fieldId: 'custrecord_ava_importaddrid',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impaddr1',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impaddr2',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impcity',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impstate',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impzip',
										value: ''
									});
									rec.setValue({
										fieldId: 'custrecord_ava_impcountry',
										value: ''
									});
								}
								
								rec.save({
									enableSourcing: false,
									ignoreMandatoryFields: true
								});
							}
							else if(nRecord.getValue('isinactive') == false){
								var rec = record.create({
									type: 'customrecord_vendorvataddresses'
								});
								rec.setValue({
									fieldId: 'custrecord_ava_vatvendorid',
									value: nRecord.id
								});
								rec.setValue({
									fieldId: 'custrecord_ava_vatvendorinternalid',
									value: nRecord.id
								});
								
								for(var iii = 0; iii < lineCount; iii++){
									var addId = custRec.getSublistValue({
										sublistId: 'addressbook',
										fieldId: 'id',
										line: iii
									});
									poaFlag = nRecord.getSublistValue({
										sublistId: 'addressbook',
										fieldId: 'custpage_ava_poa',
										line: iii
									});
									importFlag = nRecord.getSublistValue({
										sublistId: 'addressbook',
										fieldId: 'custpage_ava_import',
										line: iii
									});
									
									if(poaFlag == 'T'){
										address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', iii);
										
										rec.setValue({
											fieldId: 'custrecord_ava_poaflag',
											value: true
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poaaddid',
											value: addId
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poaaddr1',
											value: address.getValue('addr1')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poaaddr2',
											value: address.getValue('addr2')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poacity',
											value: address.getValue('city')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poastate',
											value: address.getValue('state')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poazip',
											value: address.getValue('zip')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_poacountry',
											value: address.getValue('country')
										});
									}
									
									if(importFlag == 'T'){
										address = nRecord.getSublistSubrecord('addressbook', 'addressbookaddress', iii);
										
										rec.setValue({
											fieldId: 'custrecord_ava_importaddrflag',
											value: true
										});
										rec.setValue({
											fieldId: 'custrecord_ava_importaddrid',
											value: addId
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impaddr1',
											value: address.getValue('addr1')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impaddr2',
											value: address.getValue('addr2')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impcity',
											value: address.getValue('city')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impstate',
											value: address.getValue('state')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impzip',
											value: address.getValue('zip')
										});
										rec.setValue({
											fieldId: 'custrecord_ava_impcountry',
											value: address.getValue('country')
										});
									}
								}
								
								rec.save({
									enableSourcing: false,
									ignoreMandatoryFields: true
								});
							}
						}
						else if(context.type == context.UserEventType.DELETE){
							var searchRecord = search.create({
								type: 'customrecord_vendorvataddresses',
								filters: ['custrecord_ava_vatvendorinternalid', 'equalto', nRecord.id]
							});
							var searchResult = searchRecord.run();
							searchResult = searchResult.getRange({
								start : 0,
								end : 1000
							});
							
							for(var k = 0; searchResult != null && k < searchResult.length; k++){
								record.delete({
									type : 'customrecord_vendorvataddresses',
									id : searchResult[k].id
								});
							}
						}
					}
				}
			}
			catch(err){
                log.debug({
                    title: 'AVA_VendorAfterSubmit Try/Catch Error',
                    details: err.message
                });
            }
		}
		
		return{
			beforeLoad: AVA_VendorBeforeLoad,
			afterSubmit: AVA_VendorAfterSubmit
		};
	}
);