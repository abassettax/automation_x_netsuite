/******************************************************************************************************
	Script Name - AVA_SUT_ReconcileTransactions.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/url', 'N/record', 'N/search', 'N/redirect', 'N/task', './utility/AVA_Library'],
	function(ui, url, record, search, redirect, task, ava_library){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'TaxSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 9);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var AVA_TransactionForm = ui.createForm({
						title: 'Create Reconciliation Batch'
					});
					
					AVA_TransactionForm.clientScriptModulePath = './AVA_CLI_ReconcileUtility.js';
					
					var DateFrom = AVA_TransactionForm.addField({
						id: 'ava_datefrom',
						label: 'Starting Date',
						type: ui.FieldType.DATE
					});
					DateFrom.isMandatory = true;
					
					var DateTo = AVA_TransactionForm.addField({
						id: 'ava_dateto',
						label: 'Ending Date',
						type: ui.FieldType.DATE
					});
					DateTo.isMandatory = true;
					
					var BatchName = AVA_TransactionForm.addField({
						id: 'ava_batchname',
						label: 'Batch Name',
						type: ui.FieldType.TEXT
					});
					BatchName.isMandatory = true;
					
					var BatchHelp = AVA_TransactionForm.addField({
						id: 'ava_batchhelp',
						label: 'NOTE: If the date range selected contains more than 10000 transactions, it will result in increased processing time.',
						type: ui.FieldType.HELP
					});
					BatchHelp.updateLayoutType({
						layoutType: ui.FieldLayoutType.OUTSIDEBELOW
					});
					
					AVA_TransactionForm.addSubmitButton({
						label: 'Submit'
					});
					
					AVA_TransactionForm.addPageLink({
						title: 'View Reconciliation Results',
						type: ui.FormPageLinkType.CROSSLINK,
						url: url.resolveScript({
							scriptId: 'customscript_ava_reconciliation_suitelet',
							deploymentId: 'customdeploy_ava_reconcileresult'
						})
					});
					
					context.response.writePage({
						pageObject: AVA_TransactionForm
					});
				}
				else{
					var rec = record.create({
						type: 'customrecord_avareconcilebatch',
					});
					
					rec.setValue({
						fieldId: 'custrecord_ava_batchname',
						value: context.request.parameters.ava_batchname
					});
					rec.setValue({
						fieldId: 'custrecord_ava_batchstartdate',
						value: ava_library.AVA_FormatDate(context.request.parameters.ava_datefrom)
					});
					rec.setValue({
						fieldId: 'custrecord_ava_batchenddate',
						value: ava_library.AVA_FormatDate(context.request.parameters.ava_dateto)
					});
					rec.setValue({
						fieldId: 'custrecord_ava_batchstatus',
						value: 0
					});
					rec.setValue({
						fieldId: 'custrecord_ava_batchprogress',
						value: 0
					});
					
					rec.save({
					});
					
					var searchRecord = search.create({
						type: 'customrecord_avareconcilebatch',
						filters: ['custrecord_ava_batchstatus', 'lessthan', 2]
					});
					var searchresult = searchRecord.run();
					searchresult = searchresult.getRange({
						start: 0,
						end: 5
					});
					
					if(searchresult != null && searchresult.length == 1){
						var scriptTask = task.create({
							taskType: task.TaskType.MAP_REDUCE,
							scriptId: 'customscript_ava_reconcileavatax_sched',
							deploymentId: 'customdeploy_reconciletax'
						});
						
						scriptTask.submit();
					}
					
					redirect.toSuitelet({
						scriptId: 'customscript_ava_reconciliation_suitelet',
						deploymentId: 'customdeploy_ava_reconcileresult'
					});
				}
			}
			else{
				context.response.write({
					output: checkServiceSecurity
				});
			}
		}
		
		return{
			onRequest: onRequest
		};
	}
);