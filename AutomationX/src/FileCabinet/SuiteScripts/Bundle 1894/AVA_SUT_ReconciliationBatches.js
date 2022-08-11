/******************************************************************************************************
	Script Name - AVA_SUT_ReconciliationBatches.js
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
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 8);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var AVA_TransactionForm = ui.createForm({
						title: 'Reconciliation Batches'
					});
					
					AVA_TransactionForm.clientScriptModulePath = './AVA_CLI_RecalcViewBatches.js';
					
					var AVA_TransactionList = AVA_TransactionForm.addSublist({
						id: 'custpage_avabatchlist',
						label: 'Select Batches',
						type: ui.SublistType.LIST
					});
					
					AVA_TransactionList = addSublistFields(AVA_TransactionList);
					AVA_TransactionList = setSublistFieldsValue(AVA_TransactionList);
					
					AVA_TransactionForm.addSubmitButton({
						label: 'Submit'
					});
					
					AVA_TransactionForm.addButton({
						id: 'ava_refresh',
						label: 'Refresh',
						functionName: 'AVA_ReconcileRefreshPage'
					});
					
					AVA_TransactionForm.addPageLink({
						title: 'Create Reconciliation Batch',
						type: ui.FormPageLinkType.CROSSLINK,
						url: url.resolveScript({
							scriptId: 'customscript_avareconcilelist_suitelet',
							deploymentId: 'customdeploy_avareconcilelist'
						})
					});
					
					context.response.writePage({
						pageObject: AVA_TransactionForm
					});
				}
				else{
					//set batch status field value to 3 for deletion
					var LineCount = context.request.getLineCount({
						group: 'custpage_avabatchlist'
					});
					
					for(var i = 0; i < LineCount; i++){
						var apply = context.request.getSublistValue({
							group: 'custpage_avabatchlist',
							line: i,
							name: 'apply'
						});
						
						if(apply == 'T'){
							var BatchId = context.request.getSublistValue({
								group: 'custpage_avabatchlist',
								line: i,
								name: 'ava_batchid'
							});
							
							record.submitFields({
								type: 'customrecord_avareconcilebatch',
								id: BatchId,
								values: {
									'custrecord_ava_batchstatus': 3,
									'custrecord_ava_batchphase': 0,
									'custrecord_ava_onlyava': 0
								}
							});
						}
					}
					
					var scriptTask = task.create({
						taskType: task.TaskType.SCHEDULED_SCRIPT,
						scriptId: 'customscript_avadeletebatch_sched',
						deploymentId: 'customdeploy_avadeletebatch_deploy1'
					});
					scriptTask.submit();
					
					redirect.toTaskLink({
						id: 'CARD_-29'
					});
				}
			}
			else{
				context.response.write({
					output: checkServiceSecurity
				});
			}
		}
		
		function addSublistFields(AVA_TransactionList){
			var batchId = AVA_TransactionList.addField({
				id: 'ava_batchid',
				label: 'Batch ID',
				type: ui.FieldType.TEXT
			});
			batchId.updateDisplayType({
				displayType: ui.FieldDisplayType.HIDDEN
			});
			AVA_TransactionList.addField({
				id: 'apply',
				label: 'Delete',
				type: ui.FieldType.CHECKBOX
			});
			AVA_TransactionList.addField({
				id: 'ava_batchname',
				label: 'Name',
				type: ui.FieldType.TEXT
			});
			AVA_TransactionList.addField({
				id: 'ava_batchdate',
				label: 'Batch Date',
				type: ui.FieldType.DATE
			});
			AVA_TransactionList.addField({
				id: 'ava_startdate',
				label: 'Start Date',
				type: ui.FieldType.DATE
			});
			AVA_TransactionList.addField({
				id: 'ava_enddate',
				label: 'End Date',
				type: ui.FieldType.DATE
			});
			AVA_TransactionList.addField({
				id: 'ava_batchstatus',
				label: 'Batch Status',
				type: ui.FieldType.TEXT
			});
			AVA_TransactionList.addField({
				id: 'ava_viewdetails',
				label: 'Details',
				type: ui.FieldType.TEXT
			});
			
			return AVA_TransactionList;
		}
		
		function setSublistFieldsValue(AVA_TransactionList){
			var searchRecord = search.create({
				type: 'customrecord_avareconcilebatch',
				columns: ['custrecord_ava_batchname', 'custrecord_ava_batchdate', 'custrecord_ava_batchstartdate', 'custrecord_ava_batchenddate', 'custrecord_ava_batchstatus', 'custrecord_ava_batchphase']
			});
			var searchresult = searchRecord.run();
			
			var i = 0;
			searchresult.each(function(result){
				AVA_TransactionList.setSublistValue({
					id: 'ava_batchid',
					line: i,
					value: result.id
				});
				
				AVA_TransactionList.setSublistValue({
					id: 'ava_batchname',
					line: i,
					value: result.getValue('custrecord_ava_batchname')
				});
				
				AVA_TransactionList.setSublistValue({
					id: 'ava_batchdate',
					line: i,
					value: result.getValue('custrecord_ava_batchdate')
				});
				
				AVA_TransactionList.setSublistValue({
					id: 'ava_startdate',
					line: i,
					value: result.getValue('custrecord_ava_batchstartdate')
				});
				
				AVA_TransactionList.setSublistValue({
					id: 'ava_enddate',
					line: i,
					value: result.getValue('custrecord_ava_batchenddate')
				});
				
				var BatchStatus = result.getValue('custrecord_ava_batchstatus');
				
				if(BatchStatus == 3){
					var BatchPhase = result.getValue('custrecord_ava_batchphase');
					BatchStatus = (BatchPhase == 0) ? 'In Queue for Deletion' : ((BatchPhase == 1) ? 'In Progress...Deleting Records' : 'Error');
				}
				else{
					BatchStatus = (BatchStatus == 0) ? 'In Queue' : ((BatchStatus == 1) ? 'In Progress' : ((BatchStatus == 2) ? 'Completed' : 'Error'));
				}
				
				AVA_TransactionList.setSublistValue({
					id: 'ava_batchstatus',
					line: i,
					value: BatchStatus
				});
				
				if(result.getValue('custrecord_ava_batchstatus') == 2){
					var URL1 = url.resolveScript({
						scriptId: 'customscript_ava_reconcilelist_suitelet',
						deploymentId: 'customdeploy_ava_reconcilelist'
					});
					
					URL1 = URL1 + '&ava_batchid=' + result.id + '&ava_status=2';
					var FinalURL = '<a href="' + URL1 + '" target="_blank">View Details</a>';
					
					AVA_TransactionList.setSublistValue({
						id: 'ava_viewdetails',
						line: i,
						value: FinalURL
					});
				}
				
				i++;
				return true;
			});
			
			return AVA_TransactionList;
		}
		
		return{
			onRequest: onRequest
		};
	}
);