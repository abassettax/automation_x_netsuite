/******************************************************************************************************
	Script Name - AVA_SUT_RecordLoadSuitelet.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/record', 'N/search', 'N/log', 'N/file'],
	function(record, search, log, file){
		function onRequest(context){
			try{
				var recordValues = ' ';
				var cols = new Array();
				var bundleId = 'Bundle 1894';
				
				switch(context.request.parameters.type){
					case 'location':
						var j = 0;
						var locationDetails = [];
						
						var searchRecord = search.create({
							type: search.Type.LOCATION,
							filters: ['isinactive', 'is', 'F'],
							columns:
								[
									'name',
									'address1',
									'address2',
									'city',
									'state',
									'zip',
									'country',
									'custrecord_ava_ispos',
									search.createColumn({
										name: 'internalid',
										sort: search.Sort.ASC
									})
								]
						});
						searchRecord = searchRecord.run();
						var searchResult = searchRecord.getRange({
							start: 0,
							end: 1000
						});
						
						while(searchResult != null && searchResult.length > 0){
							for(var i = 0; i < searchResult.length; i++){
								locationDetails.push(searchResult[i]);
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
						
						recordValues = JSON.stringify(locationDetails);
						break;
						
					case 'customer':
						var rec = record.load({
							type: record.Type.CUSTOMER,
							id: context.request.parameters.id
						});
						
						cols[0] = rec.getValue('isperson');
						cols[1] = rec.getValue('firstname');
						cols[2] = rec.getValue('middlename');
						cols[3] = rec.getValue('lastname');
						cols[4] = rec.getValue('companyname');
						cols[5] = rec.getValue('entityid');
						cols[6] = rec.getValue('partner');
						cols[7] = rec.getValue('entitytitle');
						cols[8] = rec.getValue('externalid');
						
						recordValues = cols[0] + '+' + cols[1] + '+' + cols[2] + '+' + cols[3] + '+' + cols[4] + '+' + cols[5] + '+' + cols[6] + '+' + cols[7] + '+' + cols[8];
						break;
						
					case 'partner':
						if(context.request.parameters.recordopr == 'load'){
							var rec = record.load({
								type: record.Type.PARTNER,
								id: context.request.parameters.id
							});
							
							cols[0] = rec.getValue('isperson');
							cols[1] = rec.getValue('firstname');
							cols[2] = rec.getValue('middlename');
							cols[3] = rec.getValue('lastname');
							cols[4] = rec.getValue('companyname');
							cols[5] = rec.getValue('entityid');
							cols[6] = rec.getValue('externalid');
							cols[7] = rec.getValue('entitytitle');
							
							recordValues = cols[0] + '+' + cols[1] + '+' + cols[2] + '+' + cols[3] + '+' + cols[4] + '+' + cols[5] + '+' + cols[6] + '+' + cols[7];
						}
						else{
							var searchRecord = search.create({
								type: search.Type.PARTNER,
								filters: ['internalid', 'anyof', context.request.parameters.id],
								columns:
									[
									 	'isperson',
									 	'firstname',
									 	'middlename',
									 	'lastname',
									 	'companyname',
									 	'entityid'
									]
							});
							searchRecord = searchRecord.run();
							var searchResult = searchRecord.getRange({
								start: 0,
								end: 5
							});
							
							if(searchResult != null && searchResult.length > 0){
								recordValues = searchResult[0].getValue('isperson') + '+' + searchResult[0].getValue('firstname') + '+' + searchResult[0].getValue('middlename') + '+' + searchResult[0].getValue('lastname') + '+' + searchResult[0].getValue('companyname') + '+' + searchResult[0].getValue('entityid');
							}
						}
						
						break;
						
					case 'customrecord_avacustomerexemptmapping':
						var searchRecord = search.create({
							type: 'customrecord_avacustomerexemptmapping',
							filters: ['custrecord_ava_exemptcustomerid', 'anyof', context.request.parameters.id],
							columns: 'custrecord_ava_exemptno'
						});
						searchRecord = searchRecord.run();
						var searchResult = searchRecord.getRange({
							start: 0,
							end: 5
						});
						
						if(searchResult != null && searchResult.length > 0){
							recordValues = searchResult[0].getValue('custrecord_ava_exemptno');
						}
						
						break;
						
					case 'customrecord_avaentityusemapping_new':
						var searchRecord = search.create({
							type: 'customrecord_avaentityusemapping_new',
							filters: ['custrecord_ava_customerid_new', 'anyof', context.request.parameters.custid],
							columns: ['custrecord_ava_customerid_new', 'custrecord_ava_addressid_new', 'custrecord_ava_entityusemap_new']
						});
						searchRecord = searchRecord.run();
						var searchResult = searchRecord.getRange({
							start: 0,
							end: 1000
						});
						
						for(var i = 0; searchResult != null && i < searchResult.length; i++){
							if(searchResult[i].getValue('custrecord_ava_addressid_new') == context.request.parameters.addid){
								recordValues = searchResult[i].getText('custrecord_ava_entityusemap_new');
								break;
							}
						}
						
						break;
						
					case 'employee':
						var employeeDetails = search.lookupFields({
							type: search.Type.EMPLOYEE,
							id: context.request.parameters.id,
							columns: ['firstname', 'middlename', 'lastname', 'entityid']
						});
						
						recordValues = (employeeDetails.firstname != null && employeeDetails.firstname.length > 0) ? (employeeDetails.firstname + ((employeeDetails.middlename != null && employeeDetails.middlename.length > 0) ? ( ' ' + employeeDetails.middlename + ' ' ) : ' ') + employeeDetails.lastname) : employeeDetails.entityid;
						break;
						
					case 'customrecord_avareconcilebatch':
						var searchRecord = search.create({
							type: 'customrecord_avareconcilebatch',
							filters: ['custrecord_ava_batchname', 'is', context.request.parameters.batchname]
						});
						searchRecord = searchRecord.run();
						var searchResult = searchRecord.getRange({
							start: 0,
							end: 5
						});
						
						recordValues = (searchResult != null && searchResult.length > 0) ? '0' : '1';
						break;
						
					case 'customrecord_avarecalculatebatch':
					case 'customrecord_avaaddressvalidationbatch':
						var searchRecord = search.create({
							type: context.request.parameters.type,
							filters: ['name', 'is', context.request.parameters.batchname]
						});
						searchRecord = searchRecord.run();
						var searchResult = searchRecord.getRange({
							start: 0,
							end: 5
						});
						
						recordValues = (searchResult != null && searchResult.length > 0) ? '0' : '1';
						break;
						
					case 'item':
						cols[0] = 'itemid';
						cols[1] = 'custitem_ava_udf1';
						cols[2] = 'custitem_ava_udf2';
						cols[3] = 'custitem_ava_taxcode';
						cols[4] = 'incomeaccount';
						if(context.request.parameters.upccodeflag == 'T'){
							cols[5] = 'upccode';
						}
						
						var itemRec = search.lookupFields({
							type: search.Type.ITEM,
							id: context.request.parameters.id,
							columns: cols
						});
						var incomeAccount = null;
						
						try{
							var incomeAcc = itemRec.incomeaccount[0].value;
							if(incomeAcc != null && incomeAcc.length > 0){
								incomeAccount = search.lookupFields({
									type: search.Type.ACCOUNT,
									id: incomeAcc,
									columns: 'acctname'
								});
								incomeAccount = incomeAccount.acctname;
							}
						}
						catch(err){
							incomeAccount = itemRec.incomeaccount[0].text;
						}
						
						recordValues = itemRec.itemid + '+' + itemRec.custitem_ava_udf1 + '+' + itemRec.custitem_ava_udf2 + '+' + itemRec.custitem_ava_taxcode + '+' + incomeAccount + '+' + itemRec.upccode;
						break;
						
					case 'customeraddr':
						var custRec = record.load({
							type: record.Type.CUSTOMER,
							id: context.request.parameters.id
						});
						
						for(var addr = 0; custRec.getLineCount('addressbook') != null && addr < custRec.getLineCount('addressbook'); addr++){
							if(custRec.getSublistValue('addressbook', 'addressid', addr) == context.request.parameters.addid){
								var addressBookRecord = custRec.getSublistSubrecord({
									sublistId: 'addressbook',
									fieldId: 'addressbookaddress',
									line: addr
								});
								addressBookRecord.setValue('addr1',   context.request.parameters.line1, true);
								addressBookRecord.setValue('addr2',   context.request.parameters.line2, true);
								addressBookRecord.setValue('city',    context.request.parameters.city, true);
								addressBookRecord.setValue('state',   context.request.parameters.state, true);
								addressBookRecord.setValue('zip', 	  context.request.parameters.zipcode, true);
								addressBookRecord.setValue('country', context.request.parameters.country, true);
								custRec.save();
								break;
							}
						}
						
						recordValues = 'T';
						break;
						
					case 'createcsv':
						var folderId;
						
						var searchFolder = search.create({
							type: search.Type.FOLDER,
							filters: ['name', 'is', bundleId]
						});
						searchFolder = searchFolder.run();
						var searchFolderResult = searchFolder.getRange({
							start: 0,
							end: 5
						});
						
						if(searchFolderResult != null && searchFolderResult.length > 0){
							folderId = searchFolderResult[0].id;
						}
						
						var filter = new Array();
						filter[filter.length] = search.createFilter({
							name: 'custrecord_ava_validationbatch',
							operator: search.Operator.ANYOF,
							values:  context.request.parameters.batchId
						});
						
						if(context.request.parameters.ava_status == '1'){
							filter[filter.length] = search.createFilter({
								name: 'custrecord_ava_validationstatus',
								operator: search.Operator.ISNOT,
								values: '2'
							});
							filter[filter.length] = search.createFilter({
								name: 'custrecord_ava_validationstatus',
								operator: search.Operator.ISNOT,
								values: '4'
							});
						}
						else if(context.request.parameters.ava_status == '2'){
							filter[filter.length] = search.createFilter({
								name: 'custrecord_ava_validationstatus',
								operator: search.Operator.IS,
								values: '2'
							});
						}
						else if(context.request.parameters.ava_status == '3'){
							filter[filter.length] = search.createFilter({
								name: 'custrecord_ava_validationstatus',
								operator: search.Operator.IS,
								values: '4'
							});
						}
						else if(context.request.parameters.ava_status == '4'){
							filter[filter.length] = search.createFilter({
								name: 'custrecord_ava_validationstatus',
								operator: search.Operator.IS,
								values: '5'
							});
						}
						
						var cols = [
								 	search.createColumn({
								 		name: 'internalid',
								 		sort: search.Sort.ASC
						            }),
								 	'custrecord_ava_recordname',
								 	'custrecord_ava_validatedrecordtype',
								 	'custrecord_ava_origline1',
								 	'custrecord_ava_origline2',
								 	'custrecord_ava_origline3',
								 	'custrecord_ava_origcity',
								 	'custrecord_ava_origstate',
								 	'custrecord_ava_origzip',
								 	'custrecord_ava_origcountry',
								 	'custrecord_ava_validatedline1',
								 	'custrecord_ava_validatedline2',
								 	'custrecord_ava_validatedline3',
								 	'custrecord_ava_validatedcity',
								 	'custrecord_ava_validatedstate',
								 	'custrecord_ava_validatedzip',
								 	'custrecord_ava_validatedcountry',
								 	'custrecord_ava_errormsg',
								 	'custrecord_ava_validationstatus',
								 	'custrecord_ava_addresstype'
							 	];
						
						var searchRecord = search.create({
							type: 'customrecord_avaaddvalidationbatchrecord',
							filters: filter,
							columns: cols
								
						});
						searchRecord = searchRecord.run();
						var searchResult = searchRecord.getRange({
							start: 0,
							end: 1000
						});
						
						var fileContent;
						if(searchResult != null && searchResult.length > 0){
							if(searchResult[0].getValue('custrecord_ava_validatedrecordtype') == 'l'){
								fileContent = 'Name,Original Address,Validated Address,Status,Message\n';
							}
							else{
								fileContent = 'Name,Address Type,Original Address,Validated Address,Status,Message\n';
							}
						}
						
						var j = 0;
						while(searchResult != null && searchResult.length > 0){
							for(var i = 0; i < searchResult.length; i++){
								var recType = searchResult[i].getValue('custrecord_ava_validatedrecordtype');
								var addType = searchResult[i].getValue('custrecord_ava_addresstype');
								addType = (recType == 'c') ? (addType == 'd' ? 'Default Billing & Shipping' : (addType == 'b' ? 'Default Billing' : (addType == 's' ? 'Default Shipping' : ''))) : (addType == 'm' ? 'Main' : 'Return');
								recType = (recType == 'c' ? 'customer' : 'location');
								
								fileContent += '"' + searchResult[i].getValue('custrecord_ava_recordname') + '",';
								fileContent += addType + ',';
								
								var orgAdd = (searchResult[i].getValue('custrecord_ava_origline1') != null && searchResult[i].getValue('custrecord_ava_origline1') != '') ? searchResult[i].getValue('custrecord_ava_origline1') + '-' : '';
								orgAdd += (searchResult[i].getValue('custrecord_ava_origline2') != null && searchResult[i].getValue('custrecord_ava_origline2') != '') ? searchResult[i].getValue('custrecord_ava_origline2') + '-' : '';
								orgAdd += (searchResult[i].getValue('custrecord_ava_origline3') != null && searchResult[i].getValue('custrecord_ava_origline3') != '') ? searchResult[i].getValue('custrecord_ava_origline3') + '-' : '';
								orgAdd += (searchResult[i].getValue('custrecord_ava_origcity') != null && searchResult[i].getValue('custrecord_ava_origcity') != '') ? searchResult[i].getValue('custrecord_ava_origcity') + '-' : '';
								orgAdd += (searchResult[i].getValue('custrecord_ava_origstate') != null && searchResult[i].getValue('custrecord_ava_origstate') != '') ? searchResult[i].getValue('custrecord_ava_origstate') + '-' : '';
								orgAdd += (searchResult[i].getValue('custrecord_ava_origzip') != null && searchResult[i].getValue('custrecord_ava_origzip') != '') ? searchResult[i].getValue('custrecord_ava_origzip') + '-' : '';
								orgAdd += searchResult[i].getValue('custrecord_ava_origcountry');
								
								fileContent += '"' + orgAdd + '",';
								
								var valAdd = (searchResult[i].getValue('custrecord_ava_validatedline1') != null && searchResult[i].getValue('custrecord_ava_validatedline1') != '') ? searchResult[i].getValue('custrecord_ava_validatedline1') + '-' : '';
								valAdd += (searchResult[i].getValue('custrecord_ava_validatedline2') != null && searchResult[i].getValue('custrecord_ava_validatedline2') != '') ? searchResult[i].getValue('custrecord_ava_validatedline2') + '-' : '';
								valAdd += (searchResult[i].getValue('custrecord_ava_validatedline3') != null && searchResult[i].getValue('custrecord_ava_validatedline3') != '') ? searchResult[i].getValue('custrecord_ava_validatedline3') + '-' : '';
								valAdd += (searchResult[i].getValue('custrecord_ava_validatedcity') != null && searchResult[i].getValue('custrecord_ava_validatedcity') != '') ? searchResult[i].getValue('custrecord_ava_validatedcity') + '-' : '';
								valAdd += (searchResult[i].getValue('custrecord_ava_validatedstate') != null && searchResult[i].getValue('custrecord_ava_validatedstate') != '') ? searchResult[i].getValue('custrecord_ava_validatedstate') + '-' : '';
								valAdd += (searchResult[i].getValue('custrecord_ava_validatedzip') != null && searchResult[i].getValue('custrecord_ava_validatedzip') != '') ? searchResult[i].getValue('custrecord_ava_validatedzip') + '-' : '';
								valAdd += searchResult[i].getValue('custrecord_ava_validatedcountry');
								
								fileContent += '"' + valAdd + '",';
								
								var valStatus = searchResult[i].getValue('custrecord_ava_validationstatus');
								var status = ((valStatus == '1') ? 'Validated' : ((valStatus == '2') ? 'Error' : ((valStatus == '3') ? 'To be Saved' : 'Validation Saved')));
								fileContent += status + ',';
								fileContent += '"' + searchResult[i].getValue('custrecord_ava_errormsg') + '"\n';
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
						
						var fileObj = file.create({
							 name: 'AVA_AddressValExport.csv',
							 fileType: file.Type.CSV,
							 contents: fileContent,
							 folder: folderId,
							 isOnline: true
						});
						var fileId = fileObj.save();
						
						fileObj = file.load({
						    id: fileId
						});
						recordValues = fileId + '+' + fileObj.url;
						
						break;
						
					case 'reconcilecsv':
						var folderId;
						
						var searchFolder = search.create({
							type: search.Type.FOLDER,
							filters: ['name', 'is', bundleId]
						});
						searchFolder = searchFolder.run();
						var searchFolderResult = searchFolder.getRange({
							start: 0,
							end: 5
						});
						
						if(searchFolderResult != null && searchFolderResult.length > 0){
							folderId = searchFolderResult[0].id;
						}
						
						var fileContent = 'Document Date,Document Code,Document Type,AvaTax Service Total Amount,AvaTax Service Total Tax,NetSuite Total Amount,NetSuite Total Tax\n';
						
						var batchname = search.lookupFields({
							type: 'customrecord_avareconcilebatch',
							id: context.request.parameters.batchId,
							columns: 'custrecord_ava_batchname'
						});
						
						var searchRecord = search.create({
							type: 'customrecord_avareconcilebatchrecords',
							filters:
								[
								 	['custrecord_ava_reconcilebatchname', 'is', batchname.custrecord_ava_batchname],
								 	'and',
									['custrecord_ava_statusflag', 'equalto', context.request.parameters.ava_status]
								],
							columns:
								[
									search.createColumn({
											name: 'internalid',
											sort: search.Sort.ASC
									}),
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
							for(var k = 0; searchResult != null && k < searchResult.length; k++){
								var avaDate = null;
								
								switch(context.request.parameters.ava_status){
									case '1':
										avaDate = searchResult[k].getValue('custrecord_ava_avataxdocdate');
										break;
											
									case '2':
										avaDate = searchResult[k].getValue('custrecord_ava_netsuitedocdate');
										break;
											
									case '4':
										if(searchResult[k].getValue('custrecord_ava_avataxdocdate') != null && searchResult[k].getValue('custrecord_ava_avataxdocdate').length > 0){
											avaDate = searchResult[k].getValue('custrecord_ava_avataxdocdate');
										}
										else if(searchResult[k].getValue('custrecord_ava_netsuitedocdate') != null && searchResult[k].getValue('custrecord_ava_netsuitedocdate').length > 0){
											avaDate = searchResult[k].getValue('custrecord_ava_netsuitedocdate');
										}
										break;
											
									default:
										if(searchResult[k].getValue('custrecord_ava_avataxdocdate') != null && searchResult[k].getValue('custrecord_ava_avataxdocdate').length > 0){
											avaDate = searchResult[k].getValue('custrecord_ava_avataxdocdate');
										}
										else if(searchResult[k].getValue('custrecord_ava_netsuitedocdate') != null && searchResult[k].getValue('custrecord_ava_netsuitedocdate').length > 0){
											avaDate = searchResult[k].getValue('custrecord_ava_netsuitedocdate');
										}
								}
								
								fileContent += avaDate + ',';
								fileContent += searchResult[k].getValue('custrecord_ava_batchdocno') + ',';
								var doctype = searchResult[k].getValue('custrecord_ava_batchdoctype');
								doctype = (doctype == 2)? 'SalesInvoice': ((doctype == 6)? 'ReturnInvoice': ((doctype == 1)? 'Invoice':((doctype == 3)? 'Cash Sale':((doctype == 4)? 'Cash Refund':'Credit Memo'))));
								fileContent += doctype + ',';
								fileContent += ((searchResult[k].getValue('custrecord_ava_avataxtotalamount') != null && searchResult[k].getValue('custrecord_ava_avataxtotalamount').length > 0) ? parseFloat(searchResult[k].getValue('custrecord_ava_avataxtotalamount')).toFixed(2) : '0') + ',';
								fileContent += ((searchResult[k].getValue('custrecord_ava_avatotaltax') != null && searchResult[k].getValue('custrecord_ava_avatotaltax').length > 0) ? parseFloat(searchResult[k].getValue('custrecord_ava_avatotaltax')).toFixed(2) : '0') + ',';
								fileContent += ((searchResult[k].getValue('custrecord_ava_netsuitetotalamount') != null && searchResult[k].getValue('custrecord_ava_netsuitetotalamount').length > 0) ? parseFloat(searchResult[k].getValue('custrecord_ava_netsuitetotalamount')).toFixed(2) : '0') + ',';
								fileContent += ((searchResult[k].getValue('custrecord_ava_netsuitetotaltax') != null && searchResult[k].getValue('custrecord_ava_netsuitetotaltax').length > 0) ? parseFloat(searchResult[k].getValue('custrecord_ava_netsuitetotaltax')).toFixed(2) : '0') + '\n';
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
						
						var fileObj = file.create({
							 name: 'AVA_ReconcileExport.csv',
							 fileType: file.Type.CSV,
							 contents: fileContent,
							 folder: folderId,
							 isOnline: true
						});
						var fileId = fileObj.save();
						
						fileObj = file.load({
						    id: fileId
						});
						recordValues = fileId + '+' + fileObj.url;
						
						break;
						
					case 'deletefile':
						file.delete({
						    id: context.request.parameters.FileId
						});
						recordValues = 'fileDeleted';
						break;
						
					case 'createtaxcode':
						try{
							var rec = record.create({
								type: record.Type.SALES_TAX_ITEM,
								defaultValues: {nexuscountry: 'US'}
							});
							rec.setValue({
								fieldId: 'itemid',
								value: 'AVATAX'
							});
							rec.setValue({
								fieldId: 'rate',
								value: '0'
							});
							rec.setValue({
								fieldId: 'taxagency',
								value: context.request.parameters.taxagencyid
							});
							rec.setValue({
								fieldId: 'taxaccount',
								value: context.request.parameters.taxcontrolacct
							});
							var id = rec.save();
							recordValues = id;
						}
						catch(err){
							var error = err.message;
							log.debug({
								title: 'Tax code Error Details',
								details: error
							});
							
							if(error.search('Invalid taxaccount') != -1){
								recordValues = 0;
							}
						}
						
						break;
						
					default:
						break;
				}
				
				context.response.write({
					output: recordValues.toString()
				});
			}
			catch(err){
				log.debug({
					title: 'Error code',
					details: err.code
				});
				log.debug({
					title: 'Error message',
					details: err.message
				});
			}
		}
		
		return{
			onRequest: onRequest
		};
	}
);