/******************************************************************************************************
	Script Name - AVA_MAP_RecalculateTaxes.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType MapReduceScript
*/

define(['N/search', 'N/record', 'N/log', 'N/task'],
	function(search, record, log, task){
		function getInputData(context){
			// Batch Statuses:
			// 0 = not started / In Queue
			// 1 = In Progress
			// 2 = Completed
			// 3 = Error
			
			var transactionArray = new Array();
			
			var searchRecord = search.create({
				type: 'customrecord_avarecalculatebatch',
				filters: ['custrecord_ava_recalcstatus', 'lessthan', 2],
				columns:
					[
					 	'custrecord_ava_all',
					 	'custrecord_ava_estimate',
					 	'custrecord_ava_salesorder',
					 	'custrecord_ava_invoice',
					 	'custrecord_ava_cashsale',
					 	'custrecord_ava_returnauth',
					 	'custrecord_ava_creditmemo',
					 	'custrecord_ava_cashrefund',
					 	'custrecord_ava_recalcfromdate',
					 	'custrecord_ava_recalctodate',
					 	'custrecord_ava_recalcstatus',
					 	'custrecord_ava_recalctype',
					 	'custrecord_ava_customer'
					]
			});
			var searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 1000
			});
			
			for(var i = 0; i < searchResult.length; i++){
				var batchId = searchResult[i].id;
				var rec_All = searchResult[i].getValue('custrecord_ava_all');
				var rec_Estimate = searchResult[i].getValue('custrecord_ava_estimate');
				var rec_SalesOrder = searchResult[i].getValue('custrecord_ava_salesorder');
				var rec_Invoice = searchResult[i].getValue('custrecord_ava_invoice');
				var rec_CashSale = searchResult[i].getValue('custrecord_ava_cashsale');
				var rec_RetuAuth = searchResult[i].getValue('custrecord_ava_returnauth');
				var rec_CreditMemo = searchResult[i].getValue('custrecord_ava_creditmemo');
				var rec_CashRefund = searchResult[i].getValue('custrecord_ava_cashrefund');
				var fromDate = searchResult[i].getValue('custrecord_ava_recalcfromdate');
				var toDate = searchResult[i].getValue('custrecord_ava_recalctodate');
				var batchStatus = searchResult[i].getValue('custrecord_ava_recalcstatus');
				var recalcType = searchResult[i].getValue('custrecord_ava_recalctype');
				var batchCustomer = searchResult[i].getValue('custrecord_ava_customer');
				
				if(batchStatus == 0){
					record.submitFields({
						type: 'customrecord_avarecalculatebatch',
						id: batchId,
						values: {'custrecord_ava_recalcstatus': 1}
					});
					
					var filter = new Array();
					filter[filter.length] = search.createFilter({
						name: 'mainline',
						operator: search.Operator.IS,
						values: 'T'
					});
					
					if(recalcType == 'td'){
						//Filter Based on Transaction Date
						filter[filter.length] = search.createFilter({
							name: 'trandate',
							operator: search.Operator.WITHIN,
							values: [fromDate, toDate]
						});
					}
					else if(recalcType == 'dc'){
						//Filter Based on Date created
						filter[filter.length] = search.createFilter({
							name: 'datecreated',
							operator: search.Operator.WITHIN,
							values: [fromDate, toDate]
						});
					}
					else{
						//Filter Based on Date modified
						filter[filter.length] = search.createFilter({
							name: 'lastmodifieddate',
							operator: search.Operator.WITHIN,
							values: [fromDate, toDate]
						});
					}
					
					if(rec_All == true){
						var typeArray = new Array('Estimate','SalesOrd','CustInvc','CashSale','RtnAuth','CashRfnd','CustCred');
						filter[filter.length] = search.createFilter({
							name: 'type',
							operator: search.Operator.ANYOF,
							values: typeArray
						});
					}
					else{
						var typeArray = new Array();
						if(rec_Estimate == true) typeArray[typeArray.length] = 'Estimate';
						if(rec_SalesOrder == true) typeArray[typeArray.length] = 'SalesOrd';
						if(rec_Invoice == true) typeArray[typeArray.length] = 'CustInvc';
						if(rec_CashSale == true) typeArray[typeArray.length] = 'CashSale';
						if(rec_RetuAuth == true) typeArray[typeArray.length] = 'RtnAuth';
						if(rec_CreditMemo == true) typeArray[typeArray.length] = 'CustCred';
						if(rec_CashRefund == true) typeArray[typeArray.length] = 'CashRfnd';
						
						filter[filter.length] = search.createFilter({
							name: 'type',
							operator: search.Operator.ANYOF,
							values: typeArray
						});
					}
					
					filter[filter.length] = search.createFilter({
						name: 'voided',
						operator: search.Operator.IS,
						values: 'F'
					});
					
					if(batchCustomer != null && batchCustomer > 0){
						filter[filter.length] = search.createFilter({
							name: 'entity',
							operator: search.Operator.IS,
							values: batchCustomer
						});
					}
					
					var searchTransaction = search.create({
						type: 'transaction',
						filters: filter
					});
					searchTransaction = searchTransaction.run();
					var searchTransactionResult = searchTransaction.getRange({
						start: 0,
						end: 1000
					});
					
					var j = 0;
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
				}
				
				break;
			}
			
			log.debug({
				title: 'Batch ID',
				details: batchId
			});
			log.debug({
				title: 'Records found',
				details: transactionArray.length
			});
			
			return transactionArray;
		}
		
		function map(context){
			var value = JSON.parse(context.value);
			
			try{
				var rec = record.load({
					type: value.recordType,
					id: value.id
				});
				rec.save();
				log.debug({
					title: 'Record Processed',
					details: 'RecordId-' + value.id + ', RecordType-' + value.recordType
				});
			}
			catch(err){
				log.debug({
					title: 'Try/Catch Error',
					details: err.message
				});
				log.error({
					title: 'Error',
					details: 'RecordId-' + value.id + ', RecordType-' + value.recordType
				});
			}
		}
		
		function summarize(context){
			var searchRecord = search.create({
				type: 'customrecord_avarecalculatebatch',
				filters: ['custrecord_ava_recalcstatus', 'equalto', 1]
			});
			var searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 5
			});
			
			if(searchResult != null && searchResult.length > 0){
				record.submitFields({
					type: 'customrecord_avarecalculatebatch',
					id: searchResult[0].id,
					values: {'custrecord_ava_recalcstatus': 2}
				});
			}
			
			searchRecord = search.create({
				type: 'customrecord_avarecalculatebatch',
				filters: ['custrecord_ava_recalcstatus', 'lessthan', 2]
			});
			searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 5
			});
			
			if(searchResult != null && searchResult.length > 0){
				var scriptTask = task.create({
					taskType: task.TaskType.MAP_REDUCE,
					scriptId: 'customscript_avarecalctaxes_map',
					deploymentId: 'customdeploy_recalculatetaxes'
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