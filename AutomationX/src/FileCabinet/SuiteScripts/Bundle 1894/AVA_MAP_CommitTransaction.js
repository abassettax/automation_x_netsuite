/******************************************************************************************************
	Script Name - AVA_MAP_CommitTransaction.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType MapReduceScript
*/

define(['N/search', 'N/log', './utility/AVA_TaxLibrary'],
	function(search, log, taxLibrary){
		function getInputData(context){
			var transactionArray = new Array();
			var typeArray = new Array('Estimate', 'CustInvc', 'CashSale', 'RtnAuth', 'CashRfnd', 'CustCred');
			
			try{
				var searchRecord = search.create({
					type: search.Type.TRANSACTION,
					filters:
						[
							['voided', 'is', 'F'],
							'and',
							['mainline', 'is', 'T'],
							'and',
							['custbody_ava_scis_trans_flag', 'is', 'T'],
							'and',
							['custbody_avalara_status', 'is', 1],
							'and',
							['custbody_ns_pos_transaction_status', 'noneof', [1, 2, 9]],
							'and',
							['type', 'anyof', typeArray]
						]
				});
				var searchResult = searchRecord.run();
				
				var i = 0;
				searchResult.each(function(result){
					transactionArray[transactionArray.length] = result;
					
					if(i == 3999){
						return false;
					}
					else{
						i++;
						return true;
					}
				});
			}
			catch(err){
				log.debug({
				   title: 'error',
				   details: err.message
				});
			}
			
			log.debug({
				title: 'Records found',
				details: transactionArray.length
			});
			
			return transactionArray;
		}
		
		function map(context){
			var value = JSON.parse(context.value);
			
			taxLibrary.AVA_CommitTransaction(value);
		}
		
		function summarize(context){
			log.debug('summarize', context);
		}
		
		return{
			getInputData: getInputData,
			map: map,
			summarize: summarize
		};
	}
);