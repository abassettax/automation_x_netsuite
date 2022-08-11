/******************************************************************************************************
	Script Name - AVA_CLI_AddressValidationResult.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/url', 'N/currentRecord', 'N/runtime', 'N/record', 'N/https', './utility/AVA_Library'],
	function(url, currentRecord, runtime, record, https, ava_library){
		function AVA_BatchFormFieldChange(context){
			var cRecord = context.currentRecord;
			
			if(context.fieldId == 'ava_status'){
				setWindowChanged(window, false);
				
				var url1 = url.resolveScript({
					scriptId: 'customscript_avaaddvalidlist_suitelet',
					deploymentId: 'customdeploy_avaaddressvalidlist'
				});
				url1 += '&ava_batchid=' + cRecord.getValue('ava_batchid') + '&ava_status=' + cRecord.getValue('ava_status') + '&ava_mode=view&ava_page=f';
				window.location = url1 + '&compid=' + runtime.accountId + '&whence=';;
			}
		}
		
		function AVA_PagingLinkClick(){
			var cRecord = currentRecord.get();
			
			// If record status sublist selection is Validated
			if(cRecord.getValue('ava_status') == 1 && cRecord.getLineCount('custpage_avaresults') > 0){
				var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
				
				if(avaConfigObjRec.AVA_AddBatchProcessing == 0){
					for(var i = 0; i < cRecord.getLineCount('custpage_avaresults'); i++){
						var oldStatus = search.lookupFields({
							type: 'customrecord_avaaddvalidationbatchrecord',
							id: cRecord.getSublistValue('custpage_avaresults', 'ava_id', i),
							columns: 'custrecord_ava_validationstatus'
						});
						
						if(cRecord.getSublistValue('custpage_avaresults', 'ava_update', i) == true && oldStatus.custrecord_ava_validationstatus != '3'){
							record.submitFields({
								type: 'customrecord_avaaddvalidationbatchrecord',
								id: cRecord.getSublistValue('custpage_avaresults', 'ava_id', i),
								values: {'custrecord_ava_validationstatus': '3'}
							});
						}
						else if(cRecord.getSublistValue('custpage_avaresults', 'ava_update', i) == false && oldStatus.custrecord_ava_validationstatus == '3'){
							record.submitFields({
								type: 'customrecord_avaaddvalidationbatchrecord',
								id: cRecord.getSublistValue('custpage_avaresults', 'ava_id', i),
								values: {'custrecord_ava_validationstatus': '1'}
							});
						}
					}
				}
			}
			
			setWindowChanged(window, false);
		}
		
		function AVA_UpdateBatchRecords(){
			var cRecord = currentRecord.get();
			
			if(cRecord.getLineCount('custpage_avaresults') > 0){
				record.submitFields({
					type: 'customrecord_avaaddressvalidationbatch',
					id: cRecord.getValue('ava_batchid'),
					values: {'custrecord_ava_status': 3}
				});
			}
			
			var url1 = url.resolveScript({
				scriptId: 'customscript_avaaddvalidlist_suitelet',
				deploymentId: 'customdeploy_avaaddressvalidlist'
			});
			url1 += '&ava_batchid=' + cRecord.getValue('ava_batchid') + '&ava_status=' + cRecord.getValue('ava_status') + '&ava_mode=edit&ava_page=f';
			window.location = url1;
		}
		
		function AVA_ExportCSV(){
			var cRecord = currentRecord.get();
			
			if(cRecord.getLineCount('custpage_avaresults') == 0){
				return;
			}
			
			var response = https.get({
				url: url.resolveScript({
					scriptId: 'customscript_ava_recordload_suitelet',
					deploymentId: 'customdeploy_ava_recordload',
					params: {'type': 'createcsv', 'batchId': cRecord.getValue('ava_batchid'), 'ava_status': cRecord.getValue('ava_status')}
				})
			});
			var fieldValues = response.body.split('+');
			window.open(fieldValues[1], '_blank');
			
			https.get({
				url: url.resolveScript({
					scriptId: 'customscript_ava_recordload_suitelet',
					deploymentId: 'customdeploy_ava_recordload',
					params: {'type': 'deletefile', 'FileId': fieldValues[0]}
				})
			});
		}
		
		return{
			fieldChanged: AVA_BatchFormFieldChange,
			AVA_PagingLinkClick: AVA_PagingLinkClick,
			AVA_UpdateBatchRecords: AVA_UpdateBatchRecords,
			AVA_ExportCSV: AVA_ExportCSV
		};
	}
);