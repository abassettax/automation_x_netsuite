/******************************************************************************************************
	Script Name - AVA_SUT_VoidedList.js
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
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 13);
			}
			
			if(checkServiceSecurity == 0){
				var form = ui.createForm({
					title: 'AvaTax Voided Transactions List'
				});
				
				form.addField({
					id: 'ava_star',
					label: '(*) indicates Transactions deleted from NetSuite',
					type: ui.FieldType.HELP
				});
				
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
				html += '<th>NETSUITE DOCUMENT NUMBER</th>';
				html += '<th>AVATAX DOCUMENT TYPE</th>';
				html += '<th>NETSUITE DOCUMENT TYPE</th>';
				html += '<th>TOTAL AMOUNT</th>';
				html += '<th>TOTAL DISCOUNT</th>';
				html += '<th>TOTAL NON-TAXABLE</th>';
				html += '<th>TOTAL TAXABLE</th>';
				html += '<th>TOTAL TAX</th>';
				html += '</tr>';
				html += '</thead>';
				html += '<tbody>';
				
				var recordObjArray = AVA_GetTransactionData();
				
				for(var i = 0; recordObjArray != null && i < recordObjArray.length; i++){
					html += '<tr>';
					html += '<td>' + recordObjArray[i].getValue('custrecord_ava_documentdate') + '</td>';
					
					var docType = (recordObjArray[i].getValue('custrecord_ava_documenttype') == 2) ? 'SalesInvoice' : 'ReturnInvoice';
					
					var netDocType;
					switch(recordObjArray[i].getValue('custrecord_ava_netsuitedoctype')){
						case '1':
							netDocType = 'Invoice';
							break;
							
						case '2':
							netDocType = 'Cash Sale';
							break;
							
						case '3':
							netDocType = 'Credit Memo';
							break;
							
						case '4':
							netDocType = 'Cash Refund';
							break;
							
						default:
							break;
					}
					
					if(recordObjArray[i].getValue('custrecord_ava_documentinternalid') != null && recordObjArray[i].getValue('custrecord_ava_documentinternalid').length > 0){
						var url1 = url.resolveScript({
							scriptId: 'customscript_avagettaxhistory_suitelet',
							deploymentId: 'customdeploy_gettaxhistory'
						});
						url1 += '&doctype=' + docType +'&doccode=' + recordObjArray[i].getValue('custrecord_ava_documentinternalid') + '&rectype=' + netDocType + '&ns_transid=' + recordObjArray[i].getValue('custrecord_ava_documentno');
						
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
					
					html += '<td>' + docType + '</td>';
					html += '<td>' + netDocType + '</td>';
					html += '<td>' + parseFloat(recordObjArray[i].getValue('custrecord_ava_totalamount')).toFixed(2) + '</td>';
					html += '<td>' + parseFloat(recordObjArray[i].getValue('custrecord_ava_totaldiscount')).toFixed(2) + '</td>';
					html += '<td>' + parseFloat(recordObjArray[i].getValue('custrecord_ava_totalnontaxable')).toFixed(2) + '</td>';
					html += '<td>' + parseFloat(recordObjArray[i].getValue('custrecord_ava_totaltaxable')).toFixed(2) + '</td>';
					html += '<td>' + parseFloat(recordObjArray[i].getValue('custrecord_ava_totaltax')).toFixed(2) + '</td>';
					
					html += '</tr>';
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
				
				context.response.writePage({
					pageObject: form
				});
			}
			else{
				context.response.write({
					output: checkServiceSecurity
				});
			}
		}
		
		function AVA_GetTransactionData(){
			var recordObjArray = new Array();
			
			var searchRecord = search.create({
				type: 'customrecord_avataxheaderdetails',
				filters: ['custrecord_ava_documentstatus', 'equalto', 4],
				columns:
					[
					 	'custrecord_ava_documentdate',
					 	'custrecord_ava_documentinternalid',
					 	'custrecord_ava_documentno',
					 	'custrecord_ava_documenttype',
					 	'custrecord_ava_documentstatus',
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