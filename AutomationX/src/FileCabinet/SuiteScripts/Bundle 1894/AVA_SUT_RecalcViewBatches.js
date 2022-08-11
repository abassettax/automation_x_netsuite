/******************************************************************************************************
	Script Name - 	AVA_SUT_RecalcViewBatches.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/url', 'N/record', 'N/search', 'N/redirect', './utility/AVA_Library'],
	function(ui, url, record, search, redirect, ava_library){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'TaxSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 21);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var AVA_RecalcBatchForm = ui.createForm({
						title: 'Recalculate Tax Batches'
					});
					
					AVA_RecalcBatchForm.clientScriptModulePath = './AVA_CLI_RecalcViewBatches.js';
					
					AVA_RecalcBatchForm.addField({
						id: 'ava_helptext',
						label: '* All - Includes Estimates, Sales Orders, Invoices, Cash Sales, Return Authorizations, Cash Refunds & Credit Memos',
						type: ui.FieldType.LABEL
					});
					
					var AVA_RecalcBatchList = AVA_RecalcBatchForm.addSublist({
						id: 'custpage_avabatchlist',
						label: 'Select Batches',
						type: ui.SublistType.LIST
					});
					
					AVA_RecalcBatchList = addSublistFields(AVA_RecalcBatchList);
					AVA_RecalcBatchList = setSublistFieldsValue(AVA_RecalcBatchList);
					
					AVA_RecalcBatchForm.addSubmitButton({
						label: 'Submit'
					});
					
					AVA_RecalcBatchForm.addButton({
						id: 'ava_refresh',
						label: 'Refresh',
						functionName: 'AVA_RecalcRefreshPage'
					});
					
					AVA_RecalcBatchForm.addPageLink({
						title: 'Create Recalculation Batch',
						type: ui.FormPageLinkType.CROSSLINK,
						url: url.resolveScript({
							scriptId: 'customscript_ava_recalcutility',
							deploymentId: 'customdeploy_recalcform'
						})
					});
					
					context.response.writePage({
						pageObject: AVA_RecalcBatchForm
					});
				}
				else{
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
								name: 'ava_recalcbatid'
							});
							
							record.delete({
								type: 'customrecord_avarecalculatebatch',
								id: BatchId
							});
						}
					}
					
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
		
		function addSublistFields(AVA_RecalcBatchList){
			var batchId = AVA_RecalcBatchList.addField({
				id: 'ava_recalcbatid',
				label: 'Batch ID',
				type: ui.FieldType.TEXT
			});
			batchId.updateDisplayType({
				displayType: ui.FieldDisplayType.HIDDEN
			});
			AVA_RecalcBatchList.addField({
				id: 'apply',
				label: 'Delete',
				type: ui.FieldType.CHECKBOX
			});
			AVA_RecalcBatchList.addField({
				id: 'ava_batchname',
				label: 'Name',
				type: ui.FieldType.TEXT
			});
			AVA_RecalcBatchList.addField({
				id: 'ava_recordtypes',
				label: 'Record Type(s)*',
				type: ui.FieldType.TEXT
			});
			AVA_RecalcBatchList.addField({
				id: 'ava_fromdate',
				label: 'From Date',
				type: ui.FieldType.DATE
			});
			AVA_RecalcBatchList.addField({
				id: 'ava_todate',
				label: 'To Date',
				type: ui.FieldType.DATE
			});
			AVA_RecalcBatchList.addField({
				id: 'ava_batchstatus',
				label: 'Batch Status',
				type: ui.FieldType.TEXT
			});
			
			return AVA_RecalcBatchList;
		}
		
		function setSublistFieldsValue(AVA_RecalcBatchList){
			var searchRecord = search.create({
				type: 'customrecord_avarecalculatebatch',
				columns: ['name', 'custrecord_ava_recalcbatchname', 'custrecord_ava_all', 'custrecord_ava_estimate', 'custrecord_ava_salesorder', 'custrecord_ava_invoice', 'custrecord_ava_cashsale', 'custrecord_ava_returnauth', 'custrecord_ava_creditmemo', 'custrecord_ava_cashrefund', 'custrecord_ava_recalcfromdate', 'custrecord_ava_recalctodate', 'custrecord_ava_recalcstatus']
			});
			var searchresult = searchRecord.run();
			
			var i = 0;
			searchresult.each(function(result){
				AVA_RecalcBatchList.setSublistValue({
					id: 'ava_recalcbatid',
					line: i,
					value: result.id
				});
				
				AVA_RecalcBatchList.setSublistValue({
					id: 'ava_batchname',
					line: i,
					value: result.getValue('name')
				});
				
				var RecordTypes = '';
				if(result.getValue('custrecord_ava_all') == true){
					RecordTypes = 'All';
				}
				else{
					RecordTypes = (result.getValue('custrecord_ava_estimate') == true) ? RecordTypes + 'Estimates\n' : RecordTypes;
					RecordTypes = (result.getValue('custrecord_ava_salesorder') == true) ? RecordTypes + 'Sales Order\n' : RecordTypes;
					RecordTypes = (result.getValue('custrecord_ava_invoice') == true) ? RecordTypes + 'Invoice\n' : RecordTypes;
					RecordTypes = (result.getValue('custrecord_ava_cashsale') == true) ? RecordTypes + 'CashSale\n' : RecordTypes;
					RecordTypes = (result.getValue('custrecord_ava_returnauth') == true) ? RecordTypes + 'Return Authorization\n' : RecordTypes;
					RecordTypes = (result.getValue('custrecord_ava_creditmemo') == true) ? RecordTypes + 'Credit Memo\n' : RecordTypes;
					RecordTypes = (result.getValue('custrecord_ava_cashrefund') == true) ? RecordTypes + 'Cash Refund' : RecordTypes;
				}
				
				AVA_RecalcBatchList.setSublistValue({
					id: 'ava_recordtypes',
					line: i,
					value: RecordTypes
				});
				
				AVA_RecalcBatchList.setSublistValue({
					id: 'ava_fromdate',
					line: i,
					value: result.getValue('custrecord_ava_recalcfromdate')
				});
				
				AVA_RecalcBatchList.setSublistValue({
					id: 'ava_todate',
					line: i,
					value: result.getValue('custrecord_ava_recalctodate')
				});
				
				var BatchStatus = result.getValue('custrecord_ava_recalcstatus');
				BatchStatus = (BatchStatus == 0) ? 'In Queue' : ((BatchStatus == 1) ? 'In Progress' : ((BatchStatus == 2) ? 'Completed' : 'Error'));
				
				AVA_RecalcBatchList.setSublistValue({
					id: 'ava_batchstatus',
					line: i,
					value: BatchStatus
				});
				
				i++;
				return true;
			});
			
			return AVA_RecalcBatchList;
		}
		
		return{
        	onRequest: onRequest
        };
	}
);