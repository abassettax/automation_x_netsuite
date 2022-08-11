/******************************************************************************************************
	Script Name - AVA_MAP_ReconcileTax.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType MapReduceScript
*/

define(['N/search', 'N/record', 'N/log', 'N/task', 'N/runtime', 'N/https', 'N/format', './AVA_Signature2_0', './utility/AVA_Library', './utility/AVA_CommonServerFunctions'],
	function(search, record, log, task, runtime, https, format, ava_signature, ava_library, ava_commonFunction){
		var reconcileTax, AVAIds = [];
		
		function getInputData(context){
			var batchId;
			var recordArray = new Array();
			
			var searchRecord = search.create({
				type: 'customrecord_avareconcilebatch',
				filters: ['custrecord_ava_batchstatus', 'lessthan', 2],
				columns: ['custrecord_ava_batchstartdate', 'custrecord_ava_batchenddate']
			});
			var searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 1000
			});
			
			for(var i = 0; searchResult != null && i < searchResult.length; i++){
				batchId = searchResult[i].id;
				var typeArray = new Array('CustInvc', 'CashSale', 'CustCred', 'CashRfnd');
				
				record.submitFields({
					type: 'customrecord_avareconcilebatch',
					id: batchId,
					values: {'custrecord_ava_batchstatus': 1}
				});
				
				var batchRecord = record.load({
					type: 'customrecord_avareconcilebatch',
					id: batchId
				});
				
				recordArray = AVA_GetAvaTaxTransactions(batchRecord);
				
				var searchTransaction = search.create({
					type: 'transaction',
					filters:
						[
						 	['mainline', 'is', 'T'],
						 	'and',
						 	['type', 'anyof', typeArray],
						 	'and',
						 	['trandate', 'within', [searchResult[i].getValue('custrecord_ava_batchstartdate'), searchResult[i].getValue('custrecord_ava_batchenddate')]],
						 	'and',
						 	['voided', 'is', 'F'],
						 	'and',
						 	['memorized', 'is', 'F']
						],
					columns:
						[
						 	search.createColumn({
						 		name: 'internalid',
						 		sort: search.Sort.ASC
						 	}),
						 	search.createColumn({
						 		name: 'type'
						 	})
						]
				});
				searchTransaction = searchTransaction.run();
				var searchTransactionResult = searchTransaction.getRange({
					start: 0,
					end: 1000
				});
				
				var j = 0, transactionArray = new Array();
				while(searchTransactionResult != null && searchTransactionResult.length > 0){
					for(var i = 0; i < searchTransactionResult.length; i++){
						transactionArray[transactionArray.length] = searchTransactionResult[i];
						j++;
					}
					
					if(searchTransactionResult.length == 1000){
						searchTransactionResult = searchTransaction.getRange({
							start: j,
							end: j + 1000
						});
					}
					else{
						break;
					}
				}
				
				log.debug({
					title: 'transactionArray length',
					details: transactionArray.length
				});
				
				for(var k = 0; transactionArray != null && k < transactionArray.length; k++){
					if(AVAIds.indexOf(transactionArray[k].id) == -1){
						var arrLength = recordArray.length;
						recordArray[arrLength] = new Array();

						recordArray[arrLength][0] = 'netsuite';
						recordArray[arrLength][1] = batchRecord.getValue('custrecord_ava_batchname');
						recordArray[arrLength][2] = transactionArray[k];
					}
				}
				
				break;
			}
			
			log.debug({
				title: 'Batch ID',
				details: batchId
			});
			log.debug({
				title: 'Total Records',
				details: recordArray.length
			});
			
			return recordArray;
		}
		
		function AVA_GetAvaTaxTransactions(batchRecord){
			log.debug({
				title: 'In AVA_GetAvataxTransactions'
			});
			var lastDocCode;
			var recordArray = new Array();
			
			var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
			var details = ava_commonFunction.mainFunction('AVA_General', (avaConfigObjRec.AVA_AccountValue + '+' + avaConfigObjRec.AVA_AdditionalInfo + '+' + avaConfigObjRec.AVA_AdditionalInfo1 + '+' + avaConfigObjRec.AVA_AdditionalInfo2));
			
			var AvaTax = AVA_InitSignatureObj(avaConfigObjRec.AVA_ServiceUrl);
			reconcileTax = new AvaTax.reconcileTax();
			
			while(true){
				AVA_ReconcileTaxBody(lastDocCode, batchRecord, avaConfigObjRec.AVA_DefCompanyCode);
				var reconcile = reconcileTax.reconcile(details);
				
				try{
					var response = https.get({
						url: reconcile.url,
						headers: reconcile.headers
					});
					
					if(response.code == 200){
						var responseBody = JSON.parse(response.body);
						var resultValue = responseBody.value;
						
						if(resultValue != null && resultValue.length > 0){
							log.debug({
								title: 'resultValue length',
								details: resultValue.length
							});
							
							for(var i = 0; i < resultValue.length; i++){
								if(resultValue[i].type == 'SalesInvoice' || resultValue[i].type == 'ReturnInvoice'){
									var arrLength = recordArray.length;
									recordArray[arrLength] = new Array();

									recordArray[arrLength][0] = 'avatax';
									recordArray[arrLength][1] = batchRecord.getValue('custrecord_ava_batchname');
									recordArray[arrLength][2] = resultValue[i];
									
									AVAIds.push(resultValue[i].code);
								}
								
								lastDocCode = resultValue[i].code;
							}
						}
						else{
							log.debug({
								title: 'No records found on AvaTax side.'
							});
							
							break;
						}
					}
					else{
						log.error({
							title: 'Please contact the administrator.',
							details: 'Reconciliation Tax History call was not successful.'
						});
						log.debug({
							title: 'Error response code',
							details: response.code
						});
						log.debug({
							title: 'Error response body',
							details: response.body
						});
						
						break;
					}
				}
				catch(err){
					log.debug({
						title: 'Try/Catch error code',
						details: err.code
					});
					log.debug({
						title: 'Try/Catch error message',
						details: err.message
					});
					
					break;
				}
			}
			
			return recordArray;
		}
		
		function AVA_InitSignatureObj(serviceUrl){
    	 	var AvaTax = {};
        	AvaTax = ava_signature.initAvaTax();
        	AvaTax.environment = (serviceUrl == '1') ? 'Sandbox' : 'Production';
        	AvaTax.clientProfile.Name = '6.0';
        	AvaTax.clientProfile.Client = 'NetSuite OneWorld ' + runtime.version + ' || ' + ava_library.mainFunction('AVA_ClientAtt', '').substr(18);
        	return AvaTax;
        }
		
		function AVA_ReconcileTaxBody(lastDocCode, batchRecord, defCompanyCode){
			reconcileTax.companyCode = (defCompanyCode != null && defCompanyCode.length > 0) ? defCompanyCode : runtime.accountId;
			
			if(lastDocCode != 0 && lastDocCode != null){
				log.debug({
					title: 'lastDocCode added'
				});
				reconcileTax.lastDocCode = lastDocCode;
			}
			
			reconcileTax.startDate = ava_library.mainFunction('AVA_ConvertDate', batchRecord.getValue('custrecord_ava_batchstartdate'));
			reconcileTax.endDate = ava_library.mainFunction('AVA_ConvertDate', batchRecord.getValue('custrecord_ava_batchenddate'));
			reconcileTax.docStatus = '3';
		}
		
		function map(context){
			var multiCurrBatch;
			var value = JSON.parse(context.value);
			
			if(value[0] == 'avatax'){
				try{
					log.debug('Processing DocCode', value[2].code);
					var nsRecord, nsTranExist = 'F', nsRecordType;
					var docType = (value[2].type == 'SalesInvoice') ? 2 : 6;
					
					var batchChildRecord = record.create({
						type: 'customrecord_avareconcilebatchrecords'
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_reconcilebatchname',
						value: value[1]
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_avataxdoctype',
						value: docType
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_batchdoctype',
						value: docType
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_avataxdocdate',
						value: ava_library.AVA_FormatDate(ava_library.mainFunction('AVA_DateFormat', value[2].date))
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_avataxdocstatus',
						value: 3
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_avataxtotalamount',
						value: format.parse({
							value: value[2].totalAmount,
							type: format.Type.CURRENCY
						})
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_avataxtotaldiscount',
						value: format.parse({
							value: value[2].totalDiscount,
							type: format.Type.CURRENCY
						})
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_avatotalexemption',
						value: format.parse({
							value: value[2].totalExempt,
							type: format.Type.CURRENCY
						})
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_avatotaltaxable',
						value: format.parse({
							value: value[2].totalTaxable,
							type: format.Type.CURRENCY
						})
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_avatotaltax',
						value: format.parse({
							value: value[2].totalTax,
							type: format.Type.CURRENCY
						})
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_avataxdocdate',
						value: ava_library.AVA_FormatDate(ava_library.mainFunction('AVA_DateFormat', value[2].taxDate))
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_batchdocno',
						value: value[2].code
					});
					
					if(docType == 2){
						try{
							nsRecord = record.load({
								type: 'invoice',
								id: value[2].code
							});
							nsTranExist = 'T';
							docType = 1;
						}
						catch(err){
							try{
								nsRecord = record.load({
									type: 'cashsale',
									id: value[2].code
								});
								nsTranExist = 'T';
								docType = 3;
							}
							catch(err){
								nsTranExist = 'F';
							}
						}
					}
					else if(docType == 6){
						try{
							nsRecord = record.load({
								type: 'cashrefund',
								id: value[2].code
							});
							nsTranExist = 'T';
							docType = 4;
						}
						catch(err){
							try{
								nsRecord = record.load({
									type: 'creditmemo',
									id: value[2].code
								});
								nsTranExist = 'T';
								docType = 5;
							}
							catch(err){
								nsTranExist = 'F';
							}
						}
					}
					
					if(nsTranExist == 'T'){
						var multiplier = (nsRecord.type == 'invoice' || nsRecord.type == 'cashsale') ? 1 : -1;
						nsRecordType = (nsRecord.type == 'invoice' || nsRecord.type == 'cashsale') ? 1 : 2;
						
						batchChildRecord.setValue({
							fieldId: 'custrecord_ava_batchdoctype',
							value: docType
						});
						batchChildRecord.setValue({
							fieldId: 'custrecord_ava_netsuitedocno',
							value: value[2].code
						});
						batchChildRecord.setValue({
							fieldId: 'custrecord_ava_netsuitedoctyp',
							value: nsRecordType
						});
						batchChildRecord.setValue({
							fieldId: 'custrecord_ava_netsuitedocdate',
							value: nsRecord.getValue('trandate')
						});
						
						var subtotal;
						if(nsRecord.getValue('subtotal') != null && nsRecord.getValue('subtotal').toString().length > 0){
							subtotal = format.parse({
								value: nsRecord.getValue('subtotal'),
								type: format.Type.CURRENCY
							});
						}
						else{
							subtotal = 0;
						}
						
						var shippingCost;
						if(nsRecord.getValue('shippingcost') != null && nsRecord.getValue('shippingcost').toString().length > 0){
							shippingCost = format.parse({
								value: nsRecord.getValue('shippingcost'),
								type: format.Type.CURRENCY
							});
						}
						else{
							shippingCost = 0;
						}
						
						var handlingCost;
						if(nsRecord.getValue('handlingcost') != null && nsRecord.getValue('handlingcost').toString().length > 0){
							handlingCost = format.parse({
								value: nsRecord.getValue('handlingcost'),
								type: format.Type.CURRENCY
							});
						}
						else{
							handlingCost = 0;
						}
						
						var giftcert;
						if(nsRecord.getValue('giftcertapplied') != null && nsRecord.getValue('giftcertapplied').toString().length > 0){
							giftcert = format.parse({
								value: nsRecord.getValue('giftcertapplied'),
								type: format.Type.CURRENCY
							});
						}
						else{
							giftcert = 0;
						}
						
						var exchangeRate = nsRecord.getValue('exchangerate');
						var totalAmount = parseFloat(subtotal * exchangeRate) + parseFloat(shippingCost * exchangeRate) + parseFloat(handlingCost * exchangeRate) + parseFloat(giftcert * exchangeRate);
						batchChildRecord.setValue({
							fieldId: 'custrecord_ava_netsuitetotalamount',
							value: parseFloat(totalAmount * multiplier)
						});
						
						var discount;
						if(nsRecord.getValue('discountamount') != null && nsRecord.getValue('discountamount').toString().length > 0){
							discount = format.parse({
								value: nsRecord.getValue('discountamount'),
								type: format.Type.CURRENCY
							});
						}
						else{
							discount = 0;
						}
						
						batchChildRecord.setValue({
							fieldId: 'custrecord_ava_netsuitetotaldiscount',
							value: discount
						});
						
						var taxTotal;
						if(nsRecord.getValue('taxtotal') != null && nsRecord.getValue('taxtotal').toString().length > 0){
							taxTotal = format.parse({
								value: nsRecord.getValue('taxtotal'),
								type: format.Type.CURRENCY
							});
						}
						else{
							taxTotal = 0;
						}
						
						taxTotal = taxTotal * exchangeRate;
						batchChildRecord.setValue({
							fieldId: 'custrecord_ava_netsuitetotaltax',
							value: format.parse({
								value: (taxTotal * multiplier),
								type: format.Type.CURRENCY
							})
						});
					}
					
					if(nsTranExist == 'F'){
						//Only AVATAX
						batchChildRecord.setValue({
							fieldId: 'custrecord_ava_statusflag',
							value: 1
						});
					}
					else{
						//For Total Amount comparison
						var avaTotalAmount = format.parse({
							value: batchChildRecord.getValue('custrecord_ava_avataxtotalamount'),
							type: format.Type.CURRENCY
						});
						var nsTotalAmount = format.parse({
							value: batchChildRecord.getValue('custrecord_ava_netsuitetotalamount'),
							type: format.Type.CURRENCY
						});
						
						//For Total Tax comparison
						var avaTotalTax = format.parse({
							value: batchChildRecord.getValue('custrecord_ava_avatotaltax'),
							type: format.Type.CURRENCY
						});
						var nsTotalTax = format.parse({
							value: batchChildRecord.getValue('custrecord_ava_netsuitetotaltax'),
							type: format.Type.CURRENCY
						});
						
						if((avaTotalAmount == nsTotalAmount) && (avaTotalTax == nsTotalTax)){
							//RECONCILED
							batchChildRecord.setValue({
								fieldId: 'custrecord_ava_statusflag',
								value: 8
							});
						}
						else{
							//Exists in AVATAX & NETSUITE
							batchChildRecord.setValue({
								fieldId: 'custrecord_ava_statusflag',
								value: 4
							});
						}
					}
					
					batchChildRecord.save();
				}
				catch(err){
					log.error('Got Error on Record Submit for DocCode: ' + value[2].code, err.message);
					log.debug('err.stack', err.stack);
				}
			}
			else{
				try{
					log.debug('Processing DocId', value[2].id);
					var nsRecord = record.load({
						type: value[2].recordType,
						id: value[2].id
					});
					
					var batchChildRecord = record.create({
						type: 'customrecord_avareconcilebatchrecords'
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_reconcilebatchname',
						value: value[1]
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_batchdocno',
						value: value[2].id
					});
					
					var nsRecordType = (nsRecord.type == 'invoice' || nsRecord.type == 'cashsale') ? 1 : 2;
					var docType = (nsRecord.type == 'invoice') ? 1 : ((nsRecord.type == 'cashsale') ? 3 : ((nsRecord.type == 'cashrefund') ? 4 : 5));
					var multiplier = (nsRecordType == 1) ? 1 : -1;
					
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_batchdoctype',
						value: docType
					});
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_netsuitedoctyp',
						value: nsRecordType
					});
					
					var multiCurr = (nsRecord.getValue('isbasecurrency') == false) ? true : false;
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_batchmulticurrency',
						value: multiCurr
					});
					
					if(multiCurr == true){
						multiCurrBatch = 'T';
					}
					
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_netsuitedocdate',
						value: nsRecord.getValue('trandate')
					});
					
					var subtotal;
					if(nsRecord.getValue('subtotal') != null && nsRecord.getValue('subtotal').toString().length > 0){
						subtotal = format.parse({
							value: nsRecord.getValue('subtotal'),
							type: format.Type.CURRENCY
						});
					}
					else{
						subtotal = 0;
					}
					
					var shippingCost;
					if(nsRecord.getValue('shippingcost') != null && nsRecord.getValue('shippingcost').toString().length > 0){
						shippingCost = format.parse({
							value: nsRecord.getValue('shippingcost'),
							type: format.Type.CURRENCY
						});
					}
					else{
						shippingCost = 0;
					}
					
					var handlingCost;
					if(nsRecord.getValue('handlingcost') != null && nsRecord.getValue('handlingcost').toString().length > 0){
						handlingCost = format.parse({
							value: nsRecord.getValue('handlingcost'),
							type: format.Type.CURRENCY
						});
					}
					else{
						handlingCost = 0;
					}
					
					var giftcert;
					if(nsRecord.getValue('giftcertapplied') != null && nsRecord.getValue('giftcertapplied').toString().length > 0){
						giftcert = format.parse({
							value: nsRecord.getValue('giftcertapplied'),
							type: format.Type.CURRENCY
						});
					}
					else{
						giftcert = 0;
					}
					
					var exchangeRate = nsRecord.getValue('exchangerate');
					var totalAmount = parseFloat(subtotal * exchangeRate) + parseFloat(shippingCost * exchangeRate) + parseFloat(handlingCost * exchangeRate) + parseFloat(giftcert * exchangeRate);
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_netsuitetotalamount',
						value: parseFloat(totalAmount * multiplier)
					});
					
					var discount;
					if(nsRecord.getValue('discountamount') != null && nsRecord.getValue('discountamount').toString().length > 0){
						discount = format.parse({
							value: nsRecord.getValue('discountamount'),
							type: format.Type.CURRENCY
						});
					}
					else{
						discount = 0;
					}
					
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_netsuitetotaldiscount',
						value: discount
					});
					
					var taxTotal;
					if(nsRecord.getValue('taxtotal') != null && nsRecord.getValue('taxtotal').toString().length > 0){
						taxTotal = format.parse({
							value: nsRecord.getValue('taxtotal'),
							type: format.Type.CURRENCY
						});
					}
					else{
						taxTotal = 0;
					}
					
					taxTotal = taxTotal * exchangeRate;
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_netsuitetotaltax',
						value: format.parse({
							value: (taxTotal * multiplier),
							type: format.Type.CURRENCY
						})
					});
					
					//Only NetSuite
					batchChildRecord.setValue({
						fieldId: 'custrecord_ava_statusflag',
						value: 2
					});
					
					batchChildRecord.save();
				}
				catch(err){
					log.error('Got Error on Record Submit for NetSuite DocId: ' + value[2].id, err.message);
					log.debug('err.stack', err.stack);
				}
			}
		}
		
		function summarize(context){
			var searchRecord = search.create({
				type: 'customrecord_avareconcilebatch',
				filters: ['custrecord_ava_batchstatus', 'equalto', 1],
				columns: 'custrecord_ava_batchname'
			});
			var searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 5
			});
			
			if(searchResult != null && searchResult.length > 0){
				var srchRecord = search.create({
					type: 'customrecord_avareconcilebatchrecords',
					filters: ['custrecord_ava_reconcilebatchname', 'is', searchResult[0].getValue('custrecord_ava_batchname')],
					columns: 'custrecord_ava_statusflag'
				});
				srchRecord = srchRecord.run();
				var srchResult = srchRecord.getRange({
					start: 0,
					end: 1000
				});
				
				var j = 0, onlyAvaTax = 0, onlyNetSuite = 0, avaNS = 0, reconciled = 0, totalRec = 0;
				while(srchResult != null && srchResult.length > 0){
					for(var i = 0; srchResult != null && i < srchResult.length; i++){
						if(srchResult[i].getValue('custrecord_ava_statusflag') == 1){
							onlyAvaTax++;
						}
						else if(srchResult[i].getValue('custrecord_ava_statusflag') == 2){
							onlyNetSuite++;
						}
						else if(srchResult[i].getValue('custrecord_ava_statusflag') == 4){
							avaNS++;
						}
						else if(srchResult[i].getValue('custrecord_ava_statusflag') == 8){
							reconciled++;
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
				
				record.submitFields({
					type: 'customrecord_avareconcilebatch',
					id: searchResult[0].id,
					values: {'custrecord_ava_batchstatus': 2, 'custrecord_ava_totalrecords': totalRec, 'custrecord_ava_onlyava': onlyAvaTax, 'custrecord_ava_onlyns': onlyNetSuite, 'custrecord_ava_avans': avaNS, 'custrecord_ava_reconciled': reconciled}
				});
			}
			
			searchRecord = search.create({
				type: 'customrecord_avareconcilebatch',
				filters: ['custrecord_ava_batchstatus', 'lessthan', 2]
			});
			searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 5
			});
			
			if(searchResult != null && searchResult.length > 0){
				var scriptTask = task.create({
					taskType: task.TaskType.MAP_REDUCE,
					scriptId: 'customscript_ava_reconcileavatax_sched',
					deploymentId: 'customdeploy_reconciletax'
				});
				
				scriptTask.submit();
			}
			
			log.debug('summarize', context);
		}
		
		return{
			getInputData: getInputData,
			map: map,
			summarize: summarize
		};
	}
);