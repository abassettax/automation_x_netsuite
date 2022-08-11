/******************************************************************************************************
	Script Name - AVA_SUT_AddressValidationBatches.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/url', 'N/record', 'N/search', 'N/redirect', 'N/task', './utility/AVA_Library'],
	function(ui, url, record, search, redirect, task, ava_library){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'AddressSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 17);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var AVA_AddressForm = ui.createForm({
						title: 'Address Validation Batches'
					});
					
					AVA_AddressForm.clientScriptModulePath = './AVA_CLI_RecalcViewBatches.js';
					
					var AVA_AddressList = AVA_AddressForm.addSublist({
						id: 'custpage_avabatchlist',
						label: 'Batches',
						type: ui.SublistType.LIST
					});
					
					AVA_AddressList = addSublistFields(AVA_AddressList);
					AVA_AddressList = setSublistFieldsValue(AVA_AddressList);
					
					AVA_AddressForm.addSubmitButton({
						label: 'Submit'
					});
					
					AVA_AddressForm.addButton({
						id: 'ava_refresh',
						label: 'Refresh',
						functionName: 'AVA_AddrRefreshPage'
					});
					
					AVA_AddressForm.addPageLink({
						title: 'Create Address Validation Batch',
						type: ui.FormPageLinkType.CROSSLINK,
						url: url.resolveScript({
							scriptId: 'customscript_avaddressvalidation_suitlet',
							deploymentId: 'customdeploy_avaaddressvalidation'
						})
					});
					
					context.response.writePage({
						pageObject: AVA_AddressForm
					});
				}
				else{
					//set batch status field value to 6 for deletion
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
								type: 'customrecord_avaaddressvalidationbatch',
								id: BatchId,
								values: {
									'custrecord_ava_status': 6
								}
							});
						}
					}
					
					var scriptTask = task.create({
						taskType: task.TaskType.SCHEDULED_SCRIPT,
						scriptId: 'customscript_avadeleteaddvalbatch_sched',
						deploymentId: 'customdeploy_avadeladdvalbatch_deploy1'
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
		
		function addSublistFields(AVA_AddressList){
			var batchId = AVA_AddressList.addField({
				id: 'ava_batchid',
				label: 'Batch ID',
				type: ui.FieldType.TEXT
			});
			batchId.updateDisplayType({
				displayType: ui.FieldDisplayType.HIDDEN
			});
			AVA_AddressList.addField({
				id: 'apply',
				label: 'Delete',
				type: ui.FieldType.CHECKBOX
			});
			AVA_AddressList.addField({
				id: 'ava_batchname',
				label: 'Name',
				type: ui.FieldType.TEXT
			});
			AVA_AddressList.addField({
				id: 'ava_batchtype',
				label: 'Record Type',
				type: ui.FieldType.TEXT
			});
			AVA_AddressList.addField({
				id: 'ava_batchdate',
				label: 'Created On',
				type: ui.FieldType.DATE
			});
			AVA_AddressList.addField({
				id: 'ava_batchstatus',
				label: 'Status',
				type: ui.FieldType.TEXT
			});
			AVA_AddressList.addField({
				id: 'ava_viewdetails',
				label: 'Details',
				type: ui.FieldType.TEXT
			});
			
			return AVA_AddressList;
		}
		
		function setSublistFieldsValue(AVA_AddressList){
			var searchRecord = search.create({
				type: 'customrecord_avaaddressvalidationbatch',
				columns: ['name', 'custrecord_ava_recordtype', 'created', 'custrecord_ava_status']
			});
			var searchresult = searchRecord.run();
			
			var i = 0;
			searchresult.each(function(result){
				AVA_AddressList.setSublistValue({
					id: 'ava_batchid',
					line: i,
					value: result.id
				});
				
				AVA_AddressList.setSublistValue({
					id: 'ava_batchname',
					line: i,
					value: result.getValue('name')
				});
				
				var recordType = result.getValue('custrecord_ava_recordtype');
				recordType = ((recordType == 'l') ? 'Location' : 'Customer');
				
				AVA_AddressList.setSublistValue({
					id: 'ava_batchtype',
					line: i,
					value: recordType
				});
				
				AVA_AddressList.setSublistValue({
					id: 'ava_batchdate',
					line: i,
					value: ava_library.mainFunction('AVA_DateFormat', ava_library.mainFunction('AVA_ConvertDate', result.getValue('created')))
				});
				
				var BatchStatus = result.getValue('custrecord_ava_status');
				
				switch(BatchStatus)
				{
					case '0':
							BatchStatus = 'In Queue';
							break;
					case '1':
							BatchStatus = 'In Progress';
							break;
					case '2':
							BatchStatus = 'Validation Completed';
							break;
					case '3':
							BatchStatus = 'Marking Records for Update';
							break;
					case '4':
							BatchStatus = 'Records Marked for Update';
							break; 
					case '5':
							BatchStatus = 'Update Completed';
							break;
					case '6':
							BatchStatus = 'Deletion';
							break;
					default:
							BatchStatus = 'Error';
							break;				
				}
				
				AVA_AddressList.setSublistValue({
					id: 'ava_batchstatus',
					line: i,
					value: BatchStatus
				});
				
				if(result.getValue('custrecord_ava_status') == 2 || result.getValue('custrecord_ava_status') == 3 || result.getValue('custrecord_ava_status') == 4 || result.getValue('custrecord_ava_status') == 5){
					var URL1 = url.resolveScript({
						scriptId: 'customscript_avaaddvalidlist_suitelet',
						deploymentId: 'customdeploy_avaaddressvalidlist'
					});
					
					URL1 = URL1 + '&ava_batchid=' + result.id + '&ava_status=0&ava_mode=view&ava_page=f';
					var FinalURL = '<a href="' + URL1 + '" target="_blank">View Details</a>';
					
					AVA_AddressList.setSublistValue({
						id: 'ava_viewdetails',
						line: i,
						value: FinalURL
					});
				}
				
				i++;
				return true;
			});
			
			return AVA_AddressList;
		}
		
		return{
			onRequest: onRequest
		};
	}
);