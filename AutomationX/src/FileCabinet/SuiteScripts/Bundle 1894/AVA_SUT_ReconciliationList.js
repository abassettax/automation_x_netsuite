/******************************************************************************************************
	Script Name - AVA_SUT_ReconciliationList.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/url', 'N/runtime', 'N/file', './utility/AVA_Library'],
	function(ui, record, search, url, runtime, file, ava_library){
		var recordObjArray;
		
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'TaxSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 7);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET' || context.request.method === 'POST'){
					var batchId = context.request.parameters.ava_batchid;
					var batchStatus = context.request.parameters.ava_status;
					var batchName = search.lookupFields({
						type: 'customrecord_avareconcilebatch',
						id: batchId,
						columns: 'custrecord_ava_batchname'
					});
					batchName = batchName.custrecord_ava_batchname;
					
					if(batchId == null || batchId == '' || batchStatus == null || batchStatus == ''){
						context.response.write({
							output: ava_library.mainFunction('AVA_NoticePage', 'Batch Name or Batch Status Missing')
						});
					}
					else{
						var form = ui.createForm({
							title: 'Reconciliation Results'
						});
						form.clientScriptModulePath = './AVA_CLI_ReconcileResult.js';
						
						var batchid = form.addField({
							id: 'ava_batchid',
							label: 'Batch ID',
							type: ui.FieldType.TEXT
						});
						batchid.updateDisplayType({
							displayType: ui.FieldDisplayType.HIDDEN
						});
						batchid.defaultValue = batchId;
						
						var batchname = form.addField({
							id: 'ava_batchname',
							label: 'Batch Name',
							type: ui.FieldType.TEXT
						});
						batchname.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						batchname.defaultValue = batchName;
						
						var dateRange = form.addField({
							id: 'ava_batchdaterange',
							label: 'Batch Date Range',
							type: ui.FieldType.TEXT
						});
						dateRange.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						var totalRecords = form.addField({
							id: 'ava_total',
							label: 'Total Records',
							type: ui.FieldType.INTEGER
						});
						totalRecords.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						var onlyAvaTax = form.addField({
							id: 'ava_onlyava',
							label: 'Only AvaTax',
							type: ui.FieldType.INTEGER
						});
						onlyAvaTax.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						var onlyNetSuite = form.addField({
							id: 'ava_onlyns',
							label: 'Only NetSuite',
							type: ui.FieldType.INTEGER
						});
						onlyNetSuite.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						var avataxNetSuite = form.addField({
							id: 'ava_avans',
							label: 'AvaTax & NetSuite',
							type: ui.FieldType.INTEGER
						});
						avataxNetSuite.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						var reconciled = form.addField({
							id: 'ava_reconciled',
							label: 'Reconciled Count',
							type: ui.FieldType.INTEGER
						});
						reconciled.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						
						var criteria = form.addField({
							id: 'ava_status',
							label: 'Sublist Criteria',
							type: ui.FieldType.SELECT
						});
						criteria.addSelectOption({
							value : '1',
							text: 'Only AvaTax'
						});
						criteria.addSelectOption({
							value : '2',
							text: 'Only NetSuite'
						});
						criteria.addSelectOption({
							value : '4',
							text: 'AvaTax & NetSuite'
						});
						criteria.addSelectOption({
							value : '8',
							text: 'Reconciled'
						});
						criteria.defaultValue = batchStatus;
						
						var batchRec = record.load({
							type: 'customrecord_avareconcilebatch',
							id: batchId
						});
						
						dateRange.defaultValue = batchRec.getText('custrecord_ava_batchstartdate') + ' - ' + batchRec.getText('custrecord_ava_batchenddate');

						var total = batchRec.getValue('custrecord_ava_totalrecords');
						totalRecords.defaultValue = total;
						
						var only_AVA = batchRec.getValue('custrecord_ava_onlyava');
						onlyAvaTax.defaultValue = only_AVA;
						
						var only_NS = batchRec.getValue('custrecord_ava_onlyns');
						onlyNetSuite.defaultValue = only_NS;
						
						var AVA_NS = batchRec.getValue('custrecord_ava_avans');
						avataxNetSuite.defaultValue = AVA_NS;
						
						var reconcile = batchRec.getValue('custrecord_ava_reconciled');
						reconciled.defaultValue = reconcile;
						
						var multiCurr = batchRec.getValue('custrecord_ava_multicurrencybatch');
						
						var flag = 0;
						if(only_AVA > 1000 || only_NS > 1000 || AVA_NS > 1000 || reconcile > 1000){
							flag = 1;
						}
						
						if(flag == 1){
							var limitText = form.addField({
								id: 'ava_limittext',
								label: '<b>Note</b> : Historical transactions details can be viewed only upto 10000 transactions\' due to limitation.<br>To view complete batch details please create batch with shorter date range which has less than 10000 transactions.',
								type: ui.FieldType.LABEL
							});
							limitText.updateLayoutType({
								layoutType: ui.FieldLayoutType.OUTSIDEBELOW
							});
							limitText.updateBreakType({
								breakType: ui.FieldBreakType.STARTROW
							});
						}
						
						AVA_GetReconcileRecords(batchName, batchStatus);
						
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
						
						if(multiCurr == true){
							html += '(*) indicates Multi-Currency Transactions';
						}
						
						html += '<table id="table_id" class="display" width="100%">';
						html += '<thead>';
						html += '<tr bgcolor="#D3D3D3">';
						html += '<th>DOCUMENT DATE</th>';
						html += '<th>DOCUMENT CODE</th>';
						
						if(multiCurr == true){
							html += '<th>MULTI-CURRENCY</th>';
						}
						
						html += '<th>DOCUMENT TYPE</th>';
						html += '<th>AVATAX SERVICE TOTAL AMOUNT</th>';
						html += '<th>AVATAX SERVICE TOTAL TAX</th>';
						html += '<th>NETSUITE TOTAL AMOUNT</th>';
						
						if(multiCurr == true){
							html += '<th>NETSUITE TOTAL AMOUNT (FOREIGN CURRENCY)</th>';
						}
						
						html += '<th>NETSUITE TOTAL TAX</th>';
						
						if(multiCurr == true){
							html += '<th>NETSUITE TOTAL TAX (FOREIGN CURRENCY)</th>';
						}
						
						html += '</tr>';
						html += '</thead>';
						html += '<tbody>';
						
						for(var i = 0; recordObjArray != null && i < recordObjArray.length; i++){
							html += '<tr>';
							html += '<td>' + AVA_GetDocDate(batchStatus, i) + '</td>';
							
							var doctype = recordObjArray[i].getValue('custrecord_ava_batchdoctype');
							doctype = (doctype == 2) ? 'SalesInvoice' : ((doctype == 6) ? 'ReturnInvoice' : ((doctype == 1) ? 'Invoice' : ((doctype == 3) ? 'Cash Sale' : ((doctype == 4) ? 'Cash Refund' : 'Credit Memo'))));
							
							if(batchStatus != 1 && batchStatus != 3 && batchStatus != 5){
								var docType = (doctype == 'Cash Sale') ? 'cashsale' : ((doctype == 'Credit Memo') ? 'creditmemo' : ((doctype == 'Cash Refund') ? 'cashrefund' : 'invoice'));
								
								var url1 = url.resolveRecord({
									isEditMode: false,
									recordId: recordObjArray[i].getValue('custrecord_ava_batchdocno'),
									recordType: docType
								});
								
								var finalURL = '<a href="' + url1 + '" target="_blank">' + recordObjArray[i].getValue('custrecord_ava_batchdocno') + '</a>';
								html += '<td>' + finalURL + '</td>';
							}
							else{
								html += '<td>' + recordObjArray[i].getValue('custrecord_ava_batchdocno') + '</td>';
							}
							
							if(multiCurr == true){
								html += '<td>*</td>';
							}
							
							html += '<td>' + doctype + '</td>';
							html += '<td>' + ((recordObjArray[i].getValue('custrecord_ava_avataxtotalamount') != null && recordObjArray[i].getValue('custrecord_ava_avataxtotalamount').length > 0) ? parseFloat(recordObjArray[i].getValue('custrecord_ava_avataxtotalamount')).toFixed(2) : '0.00') + '</td>';
							html += '<td>' + ((recordObjArray[i].getValue('custrecord_ava_avatotaltax') != null && recordObjArray[i].getValue('custrecord_ava_avatotaltax').length > 0) ? parseFloat(recordObjArray[i].getValue('custrecord_ava_avatotaltax')).toFixed(2) : '0.00') + '</td>';
							html += '<td>' + ((recordObjArray[i].getValue('custrecord_ava_netsuitetotalamount') != null && recordObjArray[i].getValue('custrecord_ava_netsuitetotalamount').length > 0) ? parseFloat(recordObjArray[i].getValue('custrecord_ava_netsuitetotalamount')).toFixed(2) : '0.00') + '</td>';
							
							if(multiCurr == true){
								html += '<td>' + ((recordObjArray[i].getValue('custrecord_ava_netsuitetotalamountfc') != null && recordObjArray[i].getValue('custrecord_ava_netsuitetotalamountfc').length > 0) ? parseFloat(recordObjArray[i].getValue('custrecord_ava_netsuitetotalamountfc')).toFixed(2) : '0.00') + '</td>';
							}
							
							html += '<td>' + ((recordObjArray[i].getValue('custrecord_ava_netsuitetotaltax') != null && recordObjArray[i].getValue('custrecord_ava_netsuitetotaltax').length > 0) ? parseFloat(recordObjArray[i].getValue('custrecord_ava_netsuitetotaltax')).toFixed(2) : '0.00') + '</td>';
							
							if(multiCurr == true){
								html += '<td>' + ((recordObjArray[i].getValue('custrecord_ava_netsuitetotaltaxfc') != null && recordObjArray[i].getValue('custrecord_ava_netsuitetotaltaxfc').length > 0) ? parseFloat(recordObjArray[i].getValue('custrecord_ava_netsuitetotaltaxfc')).toFixed(2) : '0.00') + '</td>';
							}
							
							html += '</tr>';
						}
						
						html += '</thead></tbody>';
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
						
						form.addButton({
							id: 'ava_exportcsv',
							label: 'Export CSV',
							functionName: 'AVA_ExportCSV'
						});
						
						context.response.writePage({
							pageObject: form
						});
					}
				}
			}
			else{
				context.response.write({
					output: checkServiceSecurity
				});
			}
		}
		
		function AVA_GetReconcileRecords(batchName, batchStatus){
			recordObjArray = new Array();
			
			var searchRecord = search.create({
				type: 'customrecord_avareconcilebatchrecords',
				filters:
					[
					 	['custrecord_ava_reconcilebatchname', 'is', batchName],
					 	'and',
						['custrecord_ava_statusflag', 'equalto', batchStatus]
					],
				columns:
					[
					 	'custrecord_ava_batchdocno',
					 	'custrecord_ava_avataxtotalamount',
					 	'custrecord_ava_avatotaltax',
					 	'custrecord_ava_netsuitetotalamount',
					 	'custrecord_ava_netsuitetotaltax',
					 	'custrecord_ava_statusflag',
					 	'custrecord_ava_avataxdocdate',
					 	'custrecord_ava_netsuitedocdate',
					 	'custrecord_ava_batchdoctype',
					 	'custrecord_ava_batchmulticurrency',
					 	'custrecord_ava_netsuitetotalamountfc',
					 	'custrecord_ava_netsuitetotaltaxfc'
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
		}
		
		function AVA_GetDocDate(batchStatus, i){
			var date = '';
			
			switch(batchStatus){
				case '1':
					date = recordObjArray[i].getValue('custrecord_ava_avataxdocdate');
					break;
					
				case '2':
					date = recordObjArray[i].getValue('custrecord_ava_netsuitedocdate');
					break;
						
				case '4':
					if(recordObjArray[i].getValue('custrecord_ava_avataxdocdate') != null && recordObjArray[i].getValue('custrecord_ava_avataxdocdate').length > 0){			
						date = recordObjArray[i].getValue('custrecord_ava_avataxdocdate');
					}
					else if(recordObjArray[i].getValue('custrecord_ava_netsuitedocdate') != null && recordObjArray[i].getValue('custrecord_ava_netsuitedocdate').length > 0){
						date = recordObjArray[i].getValue('custrecord_ava_netsuitedocdate');
					}
					break;
					
				default:
					if(recordObjArray[i].getValue('custrecord_ava_avataxdocdate') != null && recordObjArray[i].getValue('custrecord_ava_avataxdocdate').length > 0){
						date = recordObjArray[i].getValue('custrecord_ava_avataxdocdate');
					}
					else if(recordObjArray[i].getValue('custrecord_ava_netsuitedocdate') != null && recordObjArray[i].getValue('custrecord_ava_netsuitedocdate').length > 0){
						date = recordObjArray[i].getValue('custrecord_ava_netsuitedocdate');
					}
			}
			
			return date;
		}
		
		return{
			onRequest: onRequest
		};
	}
);