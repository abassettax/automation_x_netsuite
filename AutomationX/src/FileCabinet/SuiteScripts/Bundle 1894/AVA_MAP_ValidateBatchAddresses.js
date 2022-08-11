/******************************************************************************************************
	Script Name - AVA_MAP_ValidateBatchAddresses.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType MapReduceScript
*/

define(['N/search', 'N/record', 'N/log', 'N/task', 'N/https', './utility/AVA_Library', './utility/AVA_CommonServerFunctions'],
	function(search, record, log, task, https, ava_library, ava_commonFunction){
		var validatedLine1,	validatedLine2, validatedLine3, validatedCity, validatedRegion, validatedPostalCode, validatedCounty, validatedCountry;
		
		function getInputData(context){
			var batchId;
			var recordArray = new Array();
			
			var searchRecord = search.create({
				type: 'customrecord_avaaddressvalidationbatch',
				filters: ['custrecord_ava_status', 'lessthan', 2],
				columns: ['custrecord_ava_recordtype', 'custrecord_ava_customerstartdate', 'custrecord_ava_customerenddate']
			});
			var searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 1000
			});
			
			for(var i = 0; searchResult != null && i < searchResult.length; i++){
				batchId = searchResult[i].id;
				
				record.submitFields({
					type: 'customrecord_avaaddressvalidationbatch',
					id: batchId,
					values: {'custrecord_ava_status': 1}
				});
				
				try{
					if(searchResult[i].getValue('custrecord_ava_recordtype') == 'c'){
						log.debug({
							title: 'Record Type',
							details: 'Customer'
						});
						recordArray = AVA_ValidateCustomerAddress(batchId, searchResult[i].getValue('custrecord_ava_customerstartdate'), searchResult[i].getValue('custrecord_ava_customerenddate'));
					}
					else if(searchResult[i].getValue('custrecord_ava_recordtype') == 'l'){
						log.debug({
							title: 'Record Type',
							details: 'Location'
						});
						recordArray = AVA_ValidateLocationAddress(batchId);
					}
				}
				catch(err){
					log.debug({
						title: 'getInputData catch err.code',
						details: err.code
					});
					log.debug({
						title: 'getInputData catch err.message',
						details: err.message
					});
				}
				
				break;
			}
			
			log.debug({
				title: 'Batch ID',
				details: batchId
			});
			log.debug({
				title: 'Records found',
				details: recordArray.length
			});
			
			return recordArray;
		}
		
		function AVA_ValidateCustomerAddress(batchId, startDate, endDate){
			var recordArray = new Array();
			var recordFilter = new Array();
			
			var batchRecord = record.load({
				type: 'customrecord_avaaddressvalidationbatch',
				id: batchId
			});
			
			//filter only active records
			if(batchRecord.getValue('custrecord_ava_onlyactive') == true){
				recordFilter[recordFilter.length] = search.createFilter({
					name: 'isinactive',
					operator: search.Operator.IS,
					values: 'F'
				});
				log.debug({
					title: 'isinactive: F'
				});
			}
			
			//filter as per customer type: Individual or Company
			if(batchRecord.getValue('custrecord_ava_customertype') != 'b'){
				var isPerson = batchRecord.getValue('custrecord_ava_customertype') == 'i' ? 'T' : 'F';
				recordFilter[recordFilter.length] = search.createFilter({
					name: 'isperson',
					operator: search.Operator.IS,
					values: isPerson
				});
				log.debug({
					title: 'isPerson: ' + isPerson
				});
			}
			
			//filter for customer name starts with
			if(batchRecord.getValue('custrecord_ava_custname') != null && batchRecord.getValue('custrecord_ava_custname').length > 0){
				recordFilter[recordFilter.length] = search.createFilter({
					name: 'entityid',
					operator: search.Operator.STARTSWITH,
					values: batchRecord.getValue('custrecord_ava_custname')
				});
				log.debug({
					title: 'Customer Name Starts with: ' + batchRecord.getValue('custrecord_ava_custname')
				});
			}
			
			if(startDate != null && startDate.length > 0 && endDate != null && endDate.length > 0){
				recordFilter[recordFilter.length] = search.createFilter({
					name: 'datecreated',
					operator: search.Operator.WITHIN,
					values: [startDate, endDate]
				});
				log.debug({
					title: 'datecreated: ' + startDate + ' - ' + endDate
				});
			}
			
			var searchRecord = search.create({
				type: search.Type.CUSTOMER,
				filters: recordFilter,
				columns: search.createColumn({
			 		name: 'internalid',
			 		sort: search.Sort.ASC
	            })
					
			});
			searchRecord = searchRecord.run();
			var searchResult = searchRecord.getRange({
				start: 0,
				end: 1000
			});
			
			var j = 0;
			while(searchResult != null && searchResult.length > 0){
				for(var i = 0; searchResult != null && i < searchResult.length; i++){
					var arrLength = recordArray.length;
					recordArray[arrLength] = new Array();
					
					recordArray[arrLength][0] = batchId;
					recordArray[arrLength][1] = 'c';
					recordArray[arrLength][2] = searchResult[i].id;
					j++;
				}
				
				if(searchResult.length == 1000){
					searchResult = searchRecord.getRange({
						start: j,
						end: j + 1000
					});
				}
				else{
					break;
				}
			}
			
			return recordArray;
		}
		
		function AVA_ValidateLocationAddress(batchId){
			var recordArray = new Array();
			var recordFilter = new Array();
			
			var batchRecord = record.load({
				type: 'customrecord_avaaddressvalidationbatch',
				id: batchId
			});
			
			//filter only active records
			if(batchRecord.getValue('custrecord_ava_onlyactive') == true){
				recordFilter[recordFilter.length] = search.createFilter({
					name: 'isinactive',
					operator: search.Operator.IS,
					values: 'F'
				});
				log.debug({
					title: 'isinactive: F'
				});
			}
			
			//filter for specific locations
			if(batchRecord.getValue('custrecord_ava_locationaddresstype') == 'p'){
				recordFilter[recordFilter.length] = search.createFilter({
					name: 'internalid',
					operator: search.Operator.ANYOF,
					values: batchRecord.getValue('custrecord_ava_locationlist')
				});
				log.debug({
					title: 'location: ' + batchRecord.getValue('custrecord_ava_locationlist')
				});
			}
			
			var searchRecord = search.create({
				type: search.Type.LOCATION,
				filters: recordFilter,
				columns: search.createColumn({
			 		name: 'internalid',
			 		sort: search.Sort.ASC
	            })
					
			});
			searchRecord = searchRecord.run();
			var searchResult = searchRecord.getRange({
				start: 0,
				end: 1000
			});
			
			var j = 0;
			while(searchResult != null && searchResult.length > 0){
				for(var i = 0; searchResult != null && i < searchResult.length; i++){
					var arrLength = recordArray.length;
					recordArray[arrLength] = new Array();
					
					recordArray[arrLength][0] = batchId;
					recordArray[arrLength][1] = 'l';
					recordArray[arrLength][2] = searchResult[i].id;
					j++;
				}
				
				if(searchResult.length == 1000){
					searchResult = searchRecord.getRange({
						start: j,
						end: j + 1000
					});
				}
				else{
					break;
				}
			}
			
			return recordArray;
		}
		
		function reduce(context){
			var values = JSON.parse(context.values[0]);
			var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
			var details = ava_commonFunction.mainFunction('AVA_General', (avaConfigObjRec.AVA_AccountValue + '+' + avaConfigObjRec.AVA_AdditionalInfo + '+' + avaConfigObjRec.AVA_AdditionalInfo1 + '+' + avaConfigObjRec.AVA_AdditionalInfo2));
			
			var batchRecord = record.load({
				type: 'customrecord_avaaddressvalidationbatch',
				id: values[0]
			});
			
			if(values[1] == 'c'){
				try{
					var rectype;
					
					switch(batchRecord.getValue('custrecord_ava_customersubtype')){
						case 'c':
							rectype = 'customer';
							break;
							
						case 'l':
							rectype = 'lead';
							break;
							
						default:
							rectype = 'prospect';
							break;
					}
					
					var customer = record.load({
						type: rectype,
						id: values[2]
					});
					
					log.debug({
						title: 'Customer ID: ' + values[2] + ' Stage: ' + customer.getValue('stage')
					});

					var recordType = batchRecord.getValue('custrecord_ava_customersubtype');
					recordType = (recordType == 'l' ? 'LEAD' : (recordType == 'p' ? 'PROSPECT' : 'CUSTOMER'));
					
					if(customer.getValue('stage') == recordType){
						log.debug({
							title: 'Record Type Match'
						});
						var addType = batchRecord.getValue('custrecord_ava_custaddresstype');
						
						for(var addr = 0; customer.getLineCount('addressbook') != null && addr < customer.getLineCount('addressbook'); addr++){
							var createFlag = (addType == 'a' || ((addType == 'bs' || addType == 'b') && customer.getSublistValue('addressbook', 'defaultbilling', addr) == true) || ((addType == 'bs' || addType == 's') && customer.getSublistValue('addressbook', 'defaultshipping', addr) == true)) ? true : false;
							
							if(createFlag){
								var addressBookRecord = customer.getSublistSubrecord({
									sublistId: 'addressbook',
									fieldId: 'addressbookaddress',
									line: addr
								});
								
								if(addressBookRecord.getValue('country') == 'US' || addressBookRecord.getValue('country') == 'CA'){
									var detailRecord = record.create({
										type: 'customrecord_avaaddvalidationbatchrecord'
									});
									detailRecord.setValue({
										fieldId: 'custrecord_ava_validationbatch',
										value: batchRecord.id
									});
									
									var custAddType = (customer.getSublistValue('addressbook', 'defaultbilling', addr) == true && customer.getSublistValue('addressbook', 'defaultshipping', addr) == true) ? 'd' : ((customer.getSublistValue('addressbook', 'defaultbilling', addr) == true) ? 'b' : ((customer.getSublistValue('addressbook', 'defaultshipping', addr) == true) ? 's' : ''));
									
									//save values based on record type
									detailRecord.setValue('custrecord_ava_validationaddressid', customer.getSublistValue('addressbook', 'addressid', addr));
									detailRecord.setValue('custrecord_ava_addresstype', custAddType);
									detailRecord.setValue('custrecord_ava_recordname', customer.getValue('entityid'));
									detailRecord.setValue('custrecord_ava_validatedrecordtype', batchRecord.getValue('custrecord_ava_recordtype'));
									detailRecord.setValue('custrecord_ava_validatedrecordid', values[2]);
									
									//Original Address
									detailRecord.setValue('custrecord_ava_origline1', addressBookRecord.getValue('addr1'));
									detailRecord.setValue('custrecord_ava_origline2', addressBookRecord.getValue('addr2'));
									detailRecord.setValue('custrecord_ava_origcity', addressBookRecord.getValue('city'));
									detailRecord.setValue('custrecord_ava_origstate', addressBookRecord.getValue('state'));
									detailRecord.setValue('custrecord_ava_origzip', addressBookRecord.getValue('zip'));
									detailRecord.setValue('custrecord_ava_origcountry', addressBookRecord.getValue('country'));
									
									//Validate the above address and save it in the record
									var msg = AVA_ValidateAddress(avaConfigObjRec.AVA_ServiceUrl, avaConfigObjRec.AVA_AddUpperCase, details, addressBookRecord.getValue('addr1'), addressBookRecord.getValue('addr2'), '', addressBookRecord.getValue('city'), addressBookRecord.getValue('state'), addressBookRecord.getValue('zip'), addressBookRecord.getValue('country'));
									
									var country;
									if(msg == null || (msg != null && msg.length == 0)){
										detailRecord.setValue('custrecord_ava_validatedline1', ((validatedLine1 != null) ? validatedLine1 : ' '));
										detailRecord.setValue('custrecord_ava_validatedline2', ((validatedLine2 != null) ? validatedLine2 : ' '));
										detailRecord.setValue('custrecord_ava_validatedcity', validatedCity);
										detailRecord.setValue('custrecord_ava_validatedstate', validatedRegion);
										detailRecord.setValue('custrecord_ava_validatedzip', validatedPostalCode);
										
										var stateCheck = ava_library.mainFunction('AVA_CheckCountryName', validatedRegion);
										country = (stateCheck[0] == 0 ? validatedRegion : validatedCountry);
										detailRecord.setValue('custrecord_ava_validatedcountry', country);
										detailRecord.setValue('custrecord_ava_validationstatus', '1'); //Validated
									}
									else{
										detailRecord.setValue('custrecord_ava_errormsg', msg);
										detailRecord.setValue('custrecord_ava_validationstatus', '2'); //Error
									}
									
									var detailRecId = detailRecord.save();
									
									// Auto update customer addresses if Automatic is selected in config				
									if(avaConfigObjRec.AVA_AddBatchProcessing == 1 && detailRecord.getValue('custrecord_ava_validationstatus') == '1'){
										try{
											addressBookRecord.setValue('addr1',   validatedLine1, true);
											addressBookRecord.setValue('addr2',   validatedLine2, true);
											addressBookRecord.setValue('city',	  validatedCity, true);
											addressBookRecord.setValue('state',   validatedRegion, true);
											addressBookRecord.setValue('zip',	  validatedPostalCode, true);
											addressBookRecord.setValue('country', country, true);
											
											record.submitFields({
												type: 'customrecord_avaaddvalidationbatchrecord',
												id: detailRecId,
												values: {'custrecord_ava_validationstatus': '4'}
											});
										}
										catch(err){
											//Updation Failed
											record.submitFields({
												type: 'customrecord_avaaddvalidationbatchrecord',
												id: detailRecId,
												values: {'custrecord_ava_validationstatus': '5'}
											});
										}
									}
								}
							}
						}
						
						if(avaConfigObjRec.AVA_AddBatchProcessing == 1){
							customer.save();
						}
					}
				}
				catch(err){
					log.error({
						title: 'Got Error while processing records for Customer: ' + values[2],
						details: err.message
					});
				}
			}
			else{
				try{
					var locationRecord = record.load({
						type: record.Type.LOCATION,
						id: values[2]
					});
					
					if(batchRecord.getValue('custrecord_ava_includesublocations') == true){
						var sublocation = locationRecord.getValue('parent');
						
						if(sublocation != null && sublocation > 0){
							var locRecord = record.load({
								type: record.Type.LOCATION,
								id: sublocation
							});
							
							for(var i = 0; i < 2; i++){
								var addrType = (i == 0) ? 'mainaddress' : 'returnaddress';
								var addressBookRecord = locRecord.getSubrecord({
									fieldId: addrType
								});
								
								if(addressBookRecord.getValue('country') == 'US' || addressBookRecord.getValue('country') == 'CA'){
									AVA_ValidateLocAddr(avaConfigObjRec.AVA_ServiceUrl, avaConfigObjRec.AVA_AddUpperCase, avaConfigObjRec.AVA_AddBatchProcessing, details, batchRecord, locRecord, addressBookRecord, addrType);
								}
							}
						}
					}
					
					for(var i = 0; i < 2; i++){
						var addrType = (i == 0) ? 'mainaddress' : 'returnaddress';
						var addressBookRecord = locationRecord.getSubrecord({
							fieldId: addrType
						});
						
						if(addressBookRecord.getValue('country') == 'US' || addressBookRecord.getValue('country') == 'CA'){
							AVA_ValidateLocAddr(avaConfigObjRec.AVA_ServiceUrl, avaConfigObjRec.AVA_AddUpperCase, avaConfigObjRec.AVA_AddBatchProcessing, details, batchRecord, locationRecord, addressBookRecord, addrType);
						}
					}
				}
				catch(err){
					log.error({
						title: 'Got Error while processing records for Location: ' + values[2],
						details: err.message
					});
				}
			}
		}
		
		function AVA_ValidateAddress(serviceUrl, addrUpperCase, details, addr1, addr2, addr3, city, state, zip, country){
			var error = '';
			
			var AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', serviceUrl);
			var address = AVA_ValidateAddressBody(addrUpperCase, addr1, addr2, addr3, city, state, zip, country, AvaTax);
			var validate = address.validate(details);
			
			try{
				var response = https.post({
					url: validate.url,
					body: validate.data,
					headers: validate.headers
				});
				
				if(response.code == 200){
					var responseBody = JSON.parse(response.body);
					var messages = responseBody.messages;
					
					if(messages == null || messages.length == 0){
						var validatedAddress = responseBody.validatedAddresses[0];
						
						validatedLine1      = validatedAddress.line1;
						validatedLine2      = validatedAddress.line2;
						validatedLine2      = validatedAddress.line2;
						validatedCity       = validatedAddress.city;
						validatedRegion     = validatedAddress.region;
						validatedPostalCode = validatedAddress.postalCode;
						validatedCountry    = validatedAddress.country;
					}
					else{
						if(messages.length > 0){
							if(messages[0].details != null && (messages[0].details).length > 0){
								error = messages[0].details;
							}
							else{
								error = messages[0].summary;
							}
						}
					}
				}
				else{
					var responseError = JSON.parse(response.body);
					error = responseError.error.message;
				}
			}
			catch(err){
				error = err.message;
			}
			
			return error;
		}
		
		function AVA_ValidateAddressBody(addrUpperCase, addr1, addr2, addr3, city, state, zip, country, AvaTax){
			var address = new AvaTax.address();
		 	address.textCase = (addrUpperCase == true) ? 'Upper' : 'Mixed';
		 	
			address.line1	   = (addr1 != null) ? addr1 : '';
			address.line2	   = (addr2 != null) ? addr2 : '';
			address.line3	   = (addr3 != null) ? addr3 : '';
			address.city	   = (city != null) ? city : '';
			address.region	   = (state != null) ? state : '';
			address.postalCode = (zip != null) ? zip : '';
			
			var returnCountryName = ava_library.mainFunction('AVA_CheckCountryName', ((country != null) ? country : ''));
			address.country = returnCountryName[1];
		 	
		 	return address;
		}
		
		function AVA_ValidateLocAddr(serviceUrl, addrUpperCase, addrBatchProcessing, details, batchRecord, locationRec, addressBookRecord, addrType){
			var detailRecord = record.create({
				type: 'customrecord_avaaddvalidationbatchrecord'
			});
			detailRecord.setValue({
				fieldId: 'custrecord_ava_validationbatch',
				value: batchRecord.id
			});
			
			if(addrType == 'mainaddress'){
				detailRecord.setValue({
					fieldId: 'custrecord_ava_addresstype',
					value: 'm'
				});
			}
			else{
				detailRecord.setValue({
					fieldId: 'custrecord_ava_addresstype',
					value: 'r'
				});
			}
			
			//save values based on record type
			detailRecord.setValue('custrecord_ava_recordname', locationRec.getValue('name'));
			detailRecord.setValue('custrecord_ava_validatedrecordtype', batchRecord.getValue('custrecord_ava_recordtype'));
			detailRecord.setValue('custrecord_ava_validatedrecordid', locationRec.id);
			
			//Original Address
			detailRecord.setValue('custrecord_ava_origline1', addressBookRecord.getValue('addr1'));
			detailRecord.setValue('custrecord_ava_origline2', addressBookRecord.getValue('addr2'));
			detailRecord.setValue('custrecord_ava_origcity', addressBookRecord.getValue('city'));
			detailRecord.setValue('custrecord_ava_origstate', addressBookRecord.getValue('state'));
			detailRecord.setValue('custrecord_ava_origzip', addressBookRecord.getValue('zip'));
			detailRecord.setValue('custrecord_ava_origcountry', addressBookRecord.getValue('country'));
			
			//Validate the above address and save it in the record
			var msg = AVA_ValidateAddress(serviceUrl, addrUpperCase, details, addressBookRecord.getValue('addr1'), addressBookRecord.getValue('addr2'), '', addressBookRecord.getValue('city'), addressBookRecord.getValue('state'), addressBookRecord.getValue('zip'), addressBookRecord.getValue('country'));
			
			var country;
			if(msg == null || (msg != null && msg.length == 0)){
				detailRecord.setValue('custrecord_ava_validatedline1', ((validatedLine1 != null) ? validatedLine1 : ' '));
				detailRecord.setValue('custrecord_ava_validatedline2', ((validatedLine2 != null) ? validatedLine2 : ' '));
				detailRecord.setValue('custrecord_ava_validatedcity', validatedCity);
				detailRecord.setValue('custrecord_ava_validatedstate', validatedRegion);
				detailRecord.setValue('custrecord_ava_validatedzip', validatedPostalCode);
				
				var stateCheck = ava_library.mainFunction('AVA_CheckCountryName', validatedRegion);
				country = (stateCheck[0] == 0 ? validatedRegion : validatedCountry);
				detailRecord.setValue('custrecord_ava_validatedcountry', country);
				detailRecord.setValue('custrecord_ava_validationstatus', '1'); //Validated
			}
			else{
				detailRecord.setValue('custrecord_ava_errormsg', msg);
				detailRecord.setValue('custrecord_ava_validationstatus', '2'); //Error
			}
			
			var detailRecId = detailRecord.save();
			
			// Auto update location addresses if Automatic is selected in config				
			if(addrBatchProcessing == 1 && detailRecord.getValue('custrecord_ava_validationstatus') == '1'){
				try{
					addressBookRecord.setValue('addr1',   validatedLine1, true);
					addressBookRecord.setValue('addr2',   validatedLine2, true);
					addressBookRecord.setValue('city',	  validatedCity, true);
					addressBookRecord.setValue('state',   validatedRegion, true);
					addressBookRecord.setValue('zip',	  validatedPostalCode, true);
					addressBookRecord.setValue('country', country, true);
					
					locationRec.save();
					record.submitFields({
						type: 'customrecord_avaaddvalidationbatchrecord',
						id: detailRecId,
						values: {'custrecord_ava_validationstatus': '4'}
					});
				}
				catch(err){
					//Updation Failed
					record.submitFields({
						type: 'customrecord_avaaddvalidationbatchrecord',
						id: detailRecId,
						values: {'custrecord_ava_validationstatus': '5'}
					});
				}
			}
		}
		
		function summarize(context){
			var searchRecord = search.create({
				type: 'customrecord_avaaddressvalidationbatch',
				filters: ['custrecord_ava_status', 'equalto', 1]
			});
			var searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 5
			});
			
			if(searchResult != null && searchResult.length > 0){
				var srchRecord = search.create({
					type: 'customrecord_avaaddvalidationbatchrecord',
					filters: ['custrecord_ava_validationbatch', 'anyof', searchResult[0].id],
					columns: 'custrecord_ava_validationstatus'
				});
				srchRecord = srchRecord.run();
				var srchResult = srchRecord.getRange({
					start: 0,
					end: 1000
				});
				
				var j = 0, valCorrect = 0, valFail = 0, totalRec = 0;
				while(srchResult != null && srchResult.length > 0){
					for(var i = 0; srchResult != null && i < srchResult.length; i++){
						if(srchResult[i].getValue('custrecord_ava_validationstatus') == '1' || srchResult[i].getValue('custrecord_ava_validationstatus') == '4'){
							valCorrect++;
						}
						else{
							valFail++;
						}
						
						totalRec++;
						j++;
					}
					
					if(srchResult.length == 1000){
						srchResult = srchRecord.getRange({
							start: j,
							end: j + 1000
						});
					}
					else{
						break;
					}
				}
				
				var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
				
				record.submitFields({
					type: 'customrecord_avaaddressvalidationbatch',
					id: searchResult[0].id,
					values: {'custrecord_ava_status': (avaConfigObjRec.AVA_AddBatchProcessing == 1) ? 5 : 2, 'custrecord_ava_totaladdresses': totalRec, 'custrecord_ava_validaddresses': valCorrect, 'custrecord_ava_invalidaddresses': valFail}
				});
			}
			
			searchRecord = search.create({
				type: 'customrecord_avaaddressvalidationbatch',
				filters: ['custrecord_ava_status', 'lessthan', 2]
			});
			searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 5
			});
			
			if(searchResult != null && searchResult.length > 0){
				var scriptTask = task.create({
					taskType: task.TaskType.MAP_REDUCE,
					scriptId: 'customscript_avaaddressvalidation_sched',
					deploymentId: 'customdeploy_addressvalidate'
				});
				
				scriptTask.submit();
			}
			
			log.debug('summarize', context);
		}
		
		return{
			getInputData: getInputData,
			reduce: reduce,
			summarize: summarize
		};
	}
);