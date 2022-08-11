/******************************************************************************************************
	Script Name - 	AVA_SCH_UpdateValidatedAddress.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ScheduledScript
*/

define(['N/runtime', 'N/search', 'N/record', 'N/log'],
	function(runtime, search, record, log){
		var MinUsage = 300;
		function execute(context){
			// Fetch batches with status 4.
			// Filter detail records which are marked as To be Saved status of 3.
			// Update the validated addresses into main records one by one.
			
			var currentScript = runtime.getCurrentScript();
			
			var searchRecord = search.create({
				type: 'customrecord_avaaddressvalidationbatch',
				filters: ['custrecord_ava_status', 'equalto', 4],
				columns: ['custrecord_ava_recordtype']
			});
			var searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 1000
			});
			
			for(var i = 0; currentScript.getRemainingUsage() > MinUsage && searchResult != null && i < searchResult.length; i++){
				var searchBatchRecord = search.create({
					type: 'customrecord_avaaddvalidationbatchrecord',
					filters: [['custrecord_ava_validationbatch', 'anyof', searchResult[i].id], 'and', ['custrecord_ava_validationstatus', 'is', '3']],
					columns: 
						[
						 	'custrecord_ava_validatedrecordid',
						 	'custrecord_ava_validationaddressid',
						 	'custrecord_ava_validatedline1',
						 	'custrecord_ava_validatedline2',
						 	'custrecord_ava_validatedline3',
						 	'custrecord_ava_validatedcity',
						 	'custrecord_ava_validatedstate',
						 	'custrecord_ava_validatedzip',
						 	'custrecord_ava_validatedcountry',
						 	'custrecord_ava_validationstatus',
						 	'custrecord_ava_addresstype'
						]
				});
				var searchBatchResult = searchBatchRecord.run();
				searchBatchResult = searchBatchResult.getRange({
					start: 0,
					end: 1000
				});
				
				if(searchBatchResult != null){
					log.debug({
						title: 'Batch records search length',
						details: searchBatchResult.length
					});
					
					var j = 0;
					for(j = 0; currentScript.getRemainingUsage() > MinUsage && j < searchBatchResult.length; j++){
						try{
							log.debug({
								title: 'searchResult: ' + i,
								details: 'ID: ' + searchResult[i].id
							});
							
							if(searchResult[i].getValue('custrecord_ava_recordtype') == 'c'){
								log.debug({
									title: 'Record type',
									details: 'Customer'
								});
								var customer = record.load({
									type: record.Type.CUSTOMER,
									id: searchBatchResult[j].getValue('custrecord_ava_validatedrecordid')
								});
								
								for(var addr = 0; customer.getLineCount('addressbook') != null && addr < customer.getLineCount('addressbook'); addr++){
									if(customer.getSublistValue('addressbook', 'addressid', addr) == searchBatchResult[j].getValue('custrecord_ava_validationaddressid')){
										var addressBookRecord = customer.getSublistSubrecord({
											sublistId: 'addressbook',
											fieldId: 'addressbookaddress',
											line: addr
										});
										addressBookRecord.setValue('addr1',   searchBatchResult[j].getValue('custrecord_ava_validatedline1'), true);
										addressBookRecord.setValue('addr2',   searchBatchResult[j].getValue('custrecord_ava_validatedline2'), true);
										addressBookRecord.setValue('city',    searchBatchResult[j].getValue('custrecord_ava_validatedcity'), true);
										addressBookRecord.setValue('state',   searchBatchResult[j].getValue('custrecord_ava_validatedstate'), true);
										addressBookRecord.setValue('zip', 	  searchBatchResult[j].getValue('custrecord_ava_validatedzip'), true);
										addressBookRecord.setValue('country', searchBatchResult[j].getValue('custrecord_ava_validatedcountry'), true);
										break;
									}
								}
								
								var custId = customer.save();
							}
							else if(searchResult[i].getValue('custrecord_ava_recordtype') == 'l'){
								log.debug({
									title: 'Record type',
									details: 'Location'
								});
								var locationRec = record.load({
									type: record.Type.LOCATION,
									id: searchBatchResult[j].getValue('custrecord_ava_validatedrecordid')
								});
								
								var addressBookRecord;
								if(searchBatchResult[j].getValue('custrecord_ava_addresstype') == 'm'){
									addressBookRecord = locationRec.getSubrecord({
										fieldId: 'mainaddress'
									});
								}
								else{
									addressBookRecord = locationRec.getSubrecord({
										fieldId: 'returnaddress'
									});
								}

								addressBookRecord.setValue('addr1',	  searchBatchResult[j].getValue('custrecord_ava_validatedline1'), true);
								addressBookRecord.setValue('addr2',	  searchBatchResult[j].getValue('custrecord_ava_validatedline2'), true);
								addressBookRecord.setValue('city',	  searchBatchResult[j].getValue('custrecord_ava_validatedcity'), true);
								addressBookRecord.setValue('state',	  searchBatchResult[j].getValue('custrecord_ava_validatedstate'), true);
								addressBookRecord.setValue('zip',	  searchBatchResult[j].getValue('custrecord_ava_validatedzip'), true);
								addressBookRecord.setValue('country', searchBatchResult[j].getValue('custrecord_ava_validatedcountry'), true);
								
								var locId = locationRec.save();
							}	
							
							record.submitFields({
								type: 'customrecord_avaaddvalidationbatchrecord',
								id: searchBatchResult[j].id,
								values: {'custrecord_ava_validationstatus' : '4'}
							});
						}
						catch(err){
							log.debug({
								title: 'Updation of Record: ' + searchResult[i].getValue('custrecord_ava_recordtype') + ' with ID: ' + searchBatchResult[j].getValue('custrecord_ava_validatedrecordid') + ' was not successful.'
							});
							log.debug({
								title: 'err',
								details: err.message
							});
						}
					}
					
					if(currentScript.getRemainingUsage() > MinUsage && (searchBatchResult == null || j == searchBatchResult.length)){
						record.submitFields({
							type: 'customrecord_avaaddressvalidationbatch',
							id: searchResult[i].id,
							values: {'custrecord_ava_status' : '5'}
						});
					}
				}
			}
		}
		
		return{
			execute: execute
        };
	}
);