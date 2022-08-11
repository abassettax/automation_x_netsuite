/******************************************************************************************************
	Script Name - AVA_SUT_ViewTransactions.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/search', 'N/url', 'N/runtime', 'N/file', './utility/AVA_Library'],
	function(ui, search, url, runtime, file, ava_library){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'TaxSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 12);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET' || context.request.method === 'POST'){
					var form = ui.createForm({
						title: 'AvaTax Transactions'
					});
					form.clientScriptModulePath = './AVA_CLI_TransactionList.js';
					
					var dateFrom = form.addField({
						id: 'ava_datefrom',
						label: 'Starting Date',
						type: ui.FieldType.DATE
					});
					dateFrom.isMandatory = true;
					
					if(context.request.parameters.ava_datefrom != null && (context.request.parameters.ava_datefrom).length > 0){
						dateFrom.defaultValue = context.request.parameters.ava_datefrom;
					}
					
					var dateTo = form.addField({
						id: 'ava_dateto',
						label: 'Ending Date',
						type: ui.FieldType.DATE
					});
					dateTo.isMandatory = true;
					
					if(context.request.parameters.ava_dateto != null && (context.request.parameters.ava_dateto).length > 0){
						dateTo.defaultValue = context.request.parameters.ava_dateto;
					}
					
					var documentType = form.addField({
						id: 'ava_doctype',
						label: 'Document Type',
						type: ui.FieldType.SELECT
					});
					documentType.addSelectOption({
						value : '1',
						text: 'All'
					});
					documentType.addSelectOption({
						value : '2',
						text: 'SalesInvoice'
					});
					documentType.addSelectOption({
						value : '6',
						text: 'ReturnInvoice'
					});
					documentType.isMandatory = true;
					
					if(context.request.parameters.ava_doctype != null && (context.request.parameters.ava_doctype).length > 0){
						documentType.defaultValue = context.request.parameters.ava_doctype;
					}
					
					var documentStatus = form.addField({
						id: 'ava_docstatus',
						label: 'Document Status',
						type: ui.FieldType.SELECT
					});
					documentStatus.addSelectOption({
						value : '1',
						text: 'All'
					});
					documentStatus.addSelectOption({
						value : '3',
						text: 'Committed'
					});
					documentStatus.addSelectOption({
						value : '4',
						text: 'Voided'
					});
					documentStatus.isMandatory = true;
					
					if(context.request.parameters.ava_docstatus != null && (context.request.parameters.ava_docstatus).length > 0){
						documentStatus.defaultValue = context.request.parameters.ava_docstatus;
					}
					
					var cssFile = file.load({
						id: './utility/jquery/1.10.21.css.jquery.dataTables.min.css'
					});
					var jsFile = file.load({
						id: './utility/jquery/jquery-3.5.1.js'
					});
					var jsFile1 = file.load({
						id: './utility/jquery/1.10.22.js.jquery.dataTables.min.js'
					});
					
					var html = '<table><tr><td>&nbsp;</td></tr></table>';
					html += '<link rel="stylesheet" type="text/css" href=' + cssFile.url + '">';
					html += '<table id="table_id" class="display" width="100%">';
					html += '<thead>';
					html += '<tr bgcolor="#D3D3D3">';
					html += '<th>DOCUMENT DATE</th>';
					html += '<th>AVATAX DOCUMENT NUMBER</th>';
					html += '<th>NETSUITE TRANSACTION NUMBER</th>';
					html += '<th>AVATAX DOCUMENT TYPE</th>';
					html += '<th>AVATAX DOCUMENT STATUS</th>';
					html += '<th>TAX CALCULATION DATE</th>';
					html += '<th>TOTAL AMOUNT</th>';
					html += '<th>TOTAL DISCOUNT</th>';
					html += '<th>TOTAL NON-TAXABLE</th>';
					html += '<th>TOTAL TAXABLE</th>';
					html += '<th>TOTAL TAX</th>';
					html += '</tr>';
					html += '</thead>';
					html += '<tbody>';
					
					if(context.request.parameters.ava_datefrom != null && (context.request.parameters.ava_datefrom).length > 0){
						var recordObjArray = AVA_GetTransactionData(context.request.parameters.ava_datefrom, context.request.parameters.ava_dateto, context.request.parameters.ava_doctype, context.request.parameters.ava_docstatus);
						
						for(var i = 0; recordObjArray != null && i < recordObjArray.length; i++){
							html += '<tr>';
							html += '<td>' + recordObjArray[i].getValue('custrecord_ava_documentdate') + '</td>';
							
							var docType = (recordObjArray[i].getValue('custrecord_ava_documenttype') == 2) ? 'SalesInvoice' : 'ReturnInvoice';
							
							if(recordObjArray[i].getValue('custrecord_ava_documentinternalid') != null && recordObjArray[i].getValue('custrecord_ava_documentinternalid').length > 0){
								var url1 = url.resolveScript({
									scriptId: 'customscript_avagettaxhistory_suitelet',
									deploymentId: 'customdeploy_gettaxhistory'
								});
								url1 += '&doctype=' + docType +'&doccode=' + recordObjArray[i].getValue('custrecord_ava_documentinternalid') + '&ns_transid=' + recordObjArray[i].getValue('custrecord_ava_documentno');
								
								var finalURL = '<a href="' + url1 + '" target="_blank">' + recordObjArray[i].getValue('custrecord_ava_documentinternalid') + '</a>';
								html += '<td>' + finalURL + '</td>';
								
								var doctype = recordObjArray[i].getValue('custrecord_ava_netsuitedoctype');
								doctype = (doctype == 2) ? 'cashsale': ((doctype == 3) ? 'creditmemo' : ((doctype == 4) ? 'cashrefund' : 'invoice'));
								
								var url2 = url.resolveRecord({
									isEditMode: false,
									recordId: recordObjArray[i].getValue('custrecord_ava_documentinternalid'),
									recordType: doctype
								});
								
								var finalURL1 = '<a href="' + url2 + '" target="_blank">' + recordObjArray[i].getValue('custrecord_ava_documentno') + '</a>';
								html += '<td>' + finalURL1 + '</td>';
							}
							else{
								html += '<td>*</td>';
								html += '<td>' + recordObjArray[i].getValue('custrecord_ava_documentno') + '</td>';
							}
							
							var docStatus = recordObjArray[i].getValue('custrecord_ava_documentstatus');
							switch(docStatus){
								case '1':
									docStatus = 'Saved';
									break;
									
								case '3':
									docStatus = 'Committed';
									break;
									
								case '4':
									docStatus = 'Voided';
									break;
									
								default:
									docStatus = '0';
									break;
							}
							
							html += '<td>' + docType + '</td>';
							html += '<td>' + docStatus + '</td>';
							html += '<td>' + recordObjArray[i].getValue('custrecord_ava_taxcalculationdate') + '</td>';
							html += '<td>' + parseFloat(recordObjArray[i].getValue('custrecord_ava_totalamount')).toFixed(2) + '</td>';
							html += '<td>' + parseFloat(recordObjArray[i].getValue('custrecord_ava_totaldiscount')).toFixed(2) + '</td>';
							html += '<td>' + parseFloat(recordObjArray[i].getValue('custrecord_ava_totalnontaxable')).toFixed(2) + '</td>';
							html += '<td>' + parseFloat(recordObjArray[i].getValue('custrecord_ava_totaltaxable')).toFixed(2) + '</td>';
							html += '<td>' + parseFloat(recordObjArray[i].getValue('custrecord_ava_totaltax')).toFixed(2) + '</td>';
							
							html += '</tr>';
						}
					}
					
					html += '</tbody></table>';
					html += '<script src="' + jsFile.url + '"></script>';
					html += '<script src="' + jsFile1.url + '"></script>';
					html += '<script> jQuery("#table_id").DataTable( {"iDisplayLength": ' + runtime.getCurrentUser().getPreference('LISTSEGMENTSIZE') + ', dom: "Bfrtip"} ); </script>';
					
					var transactionDetailsHtml = form.addField({
						id: 'ava_transactiondetails',
						label: ' ',
						type: ui.FieldType.INLINEHTML
					});
					transactionDetailsHtml.updateLayoutType({
						layoutType: ui.FieldLayoutType.OUTSIDEBELOW
					});
					transactionDetailsHtml.updateBreakType({
						breakType: ui.FieldBreakType.STARTROW
					});
					transactionDetailsHtml.defaultValue = html;
					
					form.addSubmitButton({
						label: 'Get Records'
					});
					
					context.response.writePage({
						pageObject: form
					});
				}
			}
			else{
				context.response.write({
					output: checkServiceSecurity
				});
			}
		}
		
		function AVA_GetTransactionData(startDate, endDate, docType, docStatus){
			var filter = new Array();
			var recordObjArray = new Array();
			
			if(docType == 1 && docStatus == 1){
				filter[0] = search.createFilter({
					name: 'custrecord_ava_documentdate',
					operator: search.Operator.WITHIN,
					values: [startDate, endDate]
				});
			}
			else if(docType == 1 && docStatus > 1){
				filter[0] = search.createFilter({
					name: 'custrecord_ava_documentdate',
					operator: search.Operator.WITHIN,
					values: [startDate, endDate]
				});
				
				docStatus = (docStatus == 2) ? 1 : docStatus;
				filter[1] = search.createFilter({
					name: 'custrecord_ava_documentstatus',
					operator: search.Operator.EQUALTO,
					values: docStatus
				});
			}
			else{
				filter[0] = search.createFilter({
					name: 'custrecord_ava_documentdate',
					operator: search.Operator.WITHIN,
					values: [startDate, endDate]
				});
				filter[1] = search.createFilter({
					name: 'custrecord_ava_documenttype',
					operator: search.Operator.EQUALTO,
					values: docType
				});
				
				if(docStatus > 1){
					docStatus = (docStatus == 2) ? 1 : docStatus;
					filter[2] = search.createFilter({
						name: 'custrecord_ava_documentstatus',
						operator: search.Operator.EQUALTO,
						values: docStatus
					});
				}
			}
			
			var searchRecord = search.create({
				type: 'customrecord_avataxheaderdetails',
				filters: filter,
				columns:
					[
					 	'custrecord_ava_documentdate',
					 	'custrecord_ava_documentinternalid',
					 	'custrecord_ava_documentno',
					 	'custrecord_ava_documenttype',
					 	'custrecord_ava_documentstatus',
					 	'custrecord_ava_taxcalculationdate',
					 	'custrecord_ava_totalamount',
					 	'custrecord_ava_totaldiscount',
					 	'custrecord_ava_totalnontaxable',
					 	'custrecord_ava_totaltaxable',
					 	'custrecord_ava_totaltax',
					 	'custrecord_ava_netsuitedoctype'
					]
			});
			searchRecord = searchRecord.run();
			var searchResult = searchRecord.getRange({
				start: 0,
				end: 1000
			});
			
			var j = 0;
			while(searchResult != null && searchResult.length > 0){
				for(var i = 0; i < searchResult.length; i++){
					recordObjArray[recordObjArray.length] = searchResult[i];
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
			
			return recordObjArray;
		}
		
		return{
			onRequest: onRequest
		};
	}
);