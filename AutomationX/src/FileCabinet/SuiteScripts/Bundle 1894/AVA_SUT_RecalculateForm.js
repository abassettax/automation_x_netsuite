/******************************************************************************************************
	Script Name - 	AVA_SUT_RecalculateForm.js
	Company - 		Avalara Technologies Pvt Ltd.
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
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 20);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var form = ui.createForm({
						title: 'Recalculation Utility'
					});
					
					form.clientScriptModulePath = './AVA_CLI_RecalculateUtility.js';
					
					form = addFormFields(form);
					
					form.addSubmitButton({
						label: 'Submit'
					});
					
					form.addResetButton({
						label: 'Reset'
					});
					
					form.addPageLink({
						title: 'View Recalculation Batches',
						type: ui.FormPageLinkType.CROSSLINK,
						url: url.resolveScript({
							scriptId: 'customscript_ava_recalcbatches',
							deploymentId: 'customdeploy_ava_recalcbatches'
						})
					});
					
					context.response.writePage({
						pageObject: form
					});
				}
				else{
					var rec = record.create({
						type: 'customrecord_avarecalculatebatch',
					});
					
					rec = setRecordValues(rec, context);
					
					rec.save({
					});
					
					var searchRecord = search.create({
						type: 'customrecord_avarecalculatebatch',
						filters: ['custrecord_ava_recalcstatus', 'lessthan', 2]
					});
					var searchresult = searchRecord.run();
					searchresult = searchresult.getRange({
						start: 0,
						end: 5
					});
					
					if(searchresult != null && searchresult.length == 1){
						var scriptTask = task.create({
							taskType: task.TaskType.MAP_REDUCE,
							scriptId: 'customscript_avarecalctaxes_map',
							deploymentId: 'customdeploy_recalculatetaxes'
						});
						
						scriptTask.submit();
					}
					
					redirect.toSuitelet({
						scriptId: 'customscript_ava_recalcbatches',
						deploymentId: 'customdeploy_ava_recalcbatches'
					});
				}
			}
			else{
				context.response.write({
					output: checkServiceSecurity
				});
			}
		}
		
		function addFormFields(form){
			form.addFieldGroup({
				id: 'ava_batchdata',
				label: '<b>Batch Information</b>'
			});
			
			var AVA_BatchName = form.addField({
				id: 'ava_batchname',
				label: 'Batch Name',
				type: ui.FieldType.TEXT,
				container: 'ava_batchdata'
			});
			AVA_BatchName.isMandatory = true;
			
			form.addField({
				id: 'ava_batchdesc',
				label: 'Description',
				type: ui.FieldType.TEXT,
				container: 'ava_batchdata'
			});
			
			form.addField({
				id: 'ava_customer',
				label: 'Customer',
				type: ui.FieldType.SELECT,
				source: 'customer',
				container: 'ava_batchdata'
			});
			
			form.addFieldGroup({
				id: 'ava_recordtypes',
				label: '<b>Record Type(s)</b>'
			});
			
			var allTypesRecords = form.addField({
				id: 'ava_alltypes',
				label: 'All (Includes Estimates, Sales Orders, Invoices, Cash Sales, Return Authorizations, Cash Refunds & Credit Memos)',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_recordtypes'
			});
			allTypesRecords.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			
			form.addField({
				id: 'ava_estimate',
				label: 'Estimates',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_recordtypes'
			});
			
			form.addField({
				id: 'ava_salesorder',
				label: 'Sales Order',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_recordtypes'
			});
			
			form.addField({
				id: 'ava_invoice',
				label: 'Invoice',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_recordtypes'
			});
			
			var cashSale = form.addField({
				id: 'ava_cashsale',
				label: 'Cash Sale',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_recordtypes'
			});
			cashSale.updateLayoutType({
				layoutType: ui.FieldLayoutType.NORMAL
			});
			cashSale.updateBreakType({
				breakType: ui.FieldBreakType.STARTCOL
			});
			
			form.addField({
				id: 'ava_returnauth',
				label: 'Return Authorization',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_recordtypes'
			});
			
			form.addField({
				id: 'ava_creditmemo',
				label: 'Credit Memo',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_recordtypes'
			});
			
			form.addField({
				id: 'ava_cashrefund',
				label: 'Cash Refund',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_recordtypes'
			});
			
			form.addFieldGroup({
				id: 'ava_filter',
				label: '<b>Filter Criteria</b>'
			});
			
			var recalcBase = form.addField({
				id: 'ava_recalcbase',
				label: 'Perform Recalculation Based on:',
				type: ui.FieldType.LABEL,
				container: 'ava_filter'
			});
			recalcBase.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			
			var tDate = form.addField({
				id: 'ava_recalctype',
				label: 'Transaction Date',
				type: ui.FieldType.RADIO,
				source: 'td',
				container: 'ava_filter'
			});
			tDate.updateLayoutType({
				layoutType: ui.FieldLayoutType.MIDROW
			});
			
			var dateCreated = form.addField({
				id: 'ava_recalctype',
				label: 'Date Created',
				type: ui.FieldType.RADIO,
				source: 'dc',
				container: 'ava_filter'
			});
			dateCreated.updateLayoutType({
				layoutType: ui.FieldLayoutType.MIDROW
			});
			
			var dateModified = form.addField({
				id: 'ava_recalctype',
				label: 'Date Modified',
				type: ui.FieldType.RADIO,
				source: 'dm',
				container: 'ava_filter'
			});
			dateModified.updateLayoutType({
				layoutType: ui.FieldLayoutType.ENDROW
			});
			
			tDate.defaultValue = 'td';
			
			var fromDate = form.addField({
				id: 'ava_fromdate',
				label: 'From Date',
				type: ui.FieldType.DATE,
				container: 'ava_filter'
			});
			fromDate.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			fromDate.isMandatory = true;
			
			var toDate = form.addField({
				id: 'ava_todate',
				label: 'To Date',
				type: ui.FieldType.DATE,
				container: 'ava_filter'
			});
			toDate.updateLayoutType({
				layoutType: ui.FieldLayoutType.ENDROW
			});
			toDate.isMandatory = true;
			
			return form;
		}
		
		function setRecordValues(rec, context){
			rec.setValue({
				fieldId: 'name',
				value: context.request.parameters.ava_batchname
			});
			rec.setValue({
				fieldId: 'custrecord_ava_recalcbatchname',
				value: context.request.parameters.ava_batchname
			});
			rec.setValue({
				fieldId: 'custrecord_ava_recalcdesc',
				value: context.request.parameters.ava_batchdesc
			});
			rec.setValue({
				fieldId: 'custrecord_ava_customer',
				value: context.request.parameters.ava_customer
			});
			rec.setValue({
				fieldId: 'custrecord_ava_all',
				value: (context.request.parameters.ava_alltypes == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_estimate',
				value: (context.request.parameters.ava_estimate == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_salesorder',
				value: (context.request.parameters.ava_salesorder == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_invoice',
				value: (context.request.parameters.ava_invoice == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_cashsale',
				value: (context.request.parameters.ava_cashsale == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_returnauth',
				value: (context.request.parameters.ava_returnauth == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_creditmemo',
				value: (context.request.parameters.ava_creditmemo == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_cashrefund',
				value: (context.request.parameters.ava_cashrefund == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_recalcfromdate',
				value: ava_library.AVA_FormatDate(context.request.parameters.ava_fromdate)
			});
			rec.setValue({
				fieldId: 'custrecord_ava_recalctodate',
				value: ava_library.AVA_FormatDate(context.request.parameters.ava_todate)
			});
			rec.setValue({
				fieldId: 'custrecord_ava_recalctype',
				value: context.request.parameters.ava_recalctype
			});
			rec.setValue({
				fieldId: 'custrecord_ava_recalcstatus',
				value: 0
			});
			
			return rec;
		}
		
		return{
        	onRequest: onRequest
        };
	}
);