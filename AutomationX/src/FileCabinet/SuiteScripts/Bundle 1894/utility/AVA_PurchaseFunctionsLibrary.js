/******************************************************************************************************
	Script Name - AVA_PurchaseFunctionsLibrary.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
* @NApiVersion 2.0
* @NModuleScope Public
*/

define(['N/runtime', 'N/log', 'N/search', 'N/record', 'N/https', 'N/format', 'N/url', './AVA_TaxLibrary', './AVA_Library'],
	function(runtime, log, search, record, https, format, url, taxLibrary, ava_library){
		var ResponseLineArray, AVA_ExpenseCategoriesTaxCodes;
		var ExpenseAccountName; //Stores GL account name of Expense item.
		var ExpenseItemFlag = 'F'; // Flag to identify if there is atleast an item existing in the tab.
		var JournalEntryId, VendorValues, InputTax = 0, OutputTax = 0, TaxItemCnt, VendorChargedTax, AVA_FoundVatCountry, AVA_TriangulationFlag = 0;
		
		function AVA_PurchaseTransactionBeforeLoad(context, cForm, ui, configCache){
			try{
				if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
					var nRecord = context.newRecord;
					var executionContextValue = runtime.executionContext;
					AVA_FoundVatCountry = ava_library.mainFunction('AVA_CheckVatCountries', nRecord.getValue('nexus_country'));
					
					var executionContext = cForm.addField({
						id: 'custpage_ava_context',
						label: 'Execution Context',
						type: ui.FieldType.TEXT
					});
					executionContext.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					executionContext.defaultValue = executionContextValue;
					
					var lineLocation = cForm.addField({
						id: 'custpage_ava_lineloc',
						label: 'LineLoc',
						type: ui.FieldType.CHECKBOX
					});
					lineLocation.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var lineClass = cForm.addField({
						id: 'custpage_ava_lineclass',
						label: 'LineClass',
						type: ui.FieldType.CHECKBOX
					});
					lineClass.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var lineDept = cForm.addField({
						id: 'custpage_ava_linedep',
						label: 'LineDept',
						type: ui.FieldType.CHECKBOX
					});
					lineDept.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var itemSublist = cForm.getSublist({
						id: 'item'
					});
					
					if(AVA_FoundVatCountry == 1){
						//EVAT fields
						var transportList = cForm.addField({
							id: 'custpage_ava_transportlist',
							label: 'Transport',
							type: ui.FieldType.SELECT
						});
						transportList.addSelectOption({
							value: '0',
							text: ''
						});
						transportList.addSelectOption({
							value: '1',
							text: 'None'
						});
						transportList.addSelectOption({
							value: '2',
							text: 'Seller'
						});
						transportList.addSelectOption({
							value: '3',
							text: 'Buyer'
						});
						transportList.addSelectOption({
							value: '4',
							text: 'ThirdPartyForSeller'
						});
						transportList.addSelectOption({
							value: '5',
							text: 'ThirdPartyForBuyer'
						});
						transportList.defaultValue = '0';
						
						if(nRecord.getValue('custbody_ava_transport') != null && nRecord.getValue('custbody_ava_transport').toString().length > 0){
							transportList.defaultValue = (nRecord.getValue('custbody_ava_transport') == 6 || nRecord.getValue('custbody_ava_transport') == '' || nRecord.getValue('custbody_ava_transport') == ' ') ? '0' : nRecord.getValue('custbody_ava_transport').toString();
						}
						
						if(itemSublist != null){
							var itemTransportList = itemSublist.addField({
								id: 'custpage_ava_transportlist',
								label: 'Transport',
								type: ui.FieldType.SELECT
							});
							itemTransportList.addSelectOption({
								value: '0',
								text: ''
							});
							itemTransportList.addSelectOption({
								value: '1',
								text: 'None'
							});
							itemTransportList.addSelectOption({
								value: '2',
								text: 'Seller'
							});
							itemTransportList.addSelectOption({
								value: '3',
								text: 'Buyer'
							});
							itemTransportList.addSelectOption({
								value: '4',
								text: 'ThirdPartyForSeller'
							});
							itemTransportList.addSelectOption({
								value: '5',
								text: 'ThirdPartyForBuyer'
							});
							
							if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW){
								for(var i = 0; i < nRecord.getLineCount('item'); i++){
									var transport = nRecord.getSublistValue({
										sublistId: 'item',
										fieldId: 'custcol_ava_transport',
										line: i
									});
									
									if(transport != null && transport.toString().length > 0){
										nRecord.setSublistValue({
											sublistId: 'item',
											fieldId: 'custpage_ava_transportlist',
											line: i,
											value: (transport == 6 || transport == '' || transport == ' ') ? '0' : transport.toString()
										});
									}
								}
							}
						}
					}
					
					if(cForm.getField('custbody_ava_created_from_so') != null){
						var createdFromSO = cForm.getField({
							id: 'custbody_ava_created_from_so'
						});
						createdFromSO.updateDisplayType({
							displayType: ui.FieldDisplayType.HIDDEN
						});
					}
					
					if(AVA_FoundVatCountry == 0){
						var invoiceMsg = cForm.getField('custbody_ava_invoicemessage');
						if(invoiceMsg != null){
							invoiceMsg.updateDisplayType({
								displayType: ui.FieldDisplayType.HIDDEN
							});
						}
						
						var middleManVatId = cForm.getField('custbody_ava_vatregno');
						if(middleManVatId != null){
							middleManVatId.updateDisplayType({
								displayType: ui.FieldDisplayType.HIDDEN
							});
						}
						
						var sendImportAddress = cForm.getField('custbody_ava_sendimportaddress');
						if(sendImportAddress != null){
							sendImportAddress.updateDisplayType({
								displayType: ui.FieldDisplayType.HIDDEN
							});
						}
					}
					
					if(executionContextValue == 'USERINTERFACE'){
						if(configCache.AVA_UDF1 == false){
							if(nRecord.getSublistField('item', 'custcol_ava_udf1', 0) != null){
								var udf1 = itemSublist.getField({
									id: 'custcol_ava_udf1'
								});
								udf1.updateDisplayType({
									displayType: ui.FieldDisplayType.HIDDEN
								});
							}
						}
						
						if(configCache.AVA_UDF2 == false){
							if(nRecord.getSublistField('item', 'custcol_ava_udf2', 0) != null){
								var udf2 = itemSublist.getField({
									id: 'custcol_ava_udf2'
								});
								udf2.updateDisplayType({
									displayType: ui.FieldDisplayType.HIDDEN
								});
							}
						}
					}
					
					if(nRecord.getSublistField('item', 'location', 0) != null){
						lineLocation.defaultValue = 'T'; //Line-level locations
					}
					
					if(runtime.getCurrentUser().getPreference('CLASSESPERLINE') == true){ // Check Line level Class
						lineClass.defaultValue = 'T';
					}
					
					if(runtime.getCurrentUser().getPreference('DEPTSPERLINE') == true){ // Check Line level Department
						lineDept.defaultValue = 'T';
					}
					
					var taxCodeStatus = cForm.addField({
						id: 'custpage_ava_taxcodestatus',
						label: 'TaxCode Status',
						type: ui.FieldType.INTEGER
					});
					taxCodeStatus.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					taxCodeStatus.defaultValue = 0;
					
					var taxHeaderId = cForm.addField({
						id: 'custpage_ava_headerid',
						label: 'TaxHeader Id',
						type: ui.FieldType.INTEGER
					});
					taxHeaderId.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var avataxDoc = cForm.addField({
						id: 'custpage_ava_document',
						label: 'AvaTax Document',
						type: ui.FieldType.CHECKBOX
					});
					avataxDoc.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var noteMsg = cForm.addField({
						id: 'custpage_ava_notemsg',
						label: 'Note Message',
						type: ui.FieldType.LONGTEXT
					});
					noteMsg.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var journalEntryId = cForm.addField({
						id: 'custpage_ava_journalentryid',
						label: 'Journal Entry ID',
						type: ui.FieldType.TEXT
					});
					journalEntryId.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var taxOverrideFlag = cForm.addField({
						id: 'custpage_ava_taxoverrideflag',
						label: 'Tax Override Flag',
						type: ui.FieldType.CHECKBOX
					});
					taxOverrideFlag.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT || context.type == context.UserEventType.COPY){
						if((nRecord.getValue('nexus_country') == 'US' && configCache.AVA_EnableUseTax == true) || configCache.AVA_EnableVatIn == true){
							cForm.addButton({
								id: 'custpage_ava_verifytax',
								label: 'Verify Tax',
								functionName: 'AVA_VerifyTax'
							});
						}
						
						var vendorId = cForm.addField({
							id: 'custpage_ava_vendorid',
							label: 'Vendor ID',
							type: ui.FieldType.TEXT
						});
						vendorId.updateDisplayType({
							displayType: ui.FieldDisplayType.HIDDEN
						});
						
						if(nRecord.getValue('entity') != null && nRecord.getValue('entity').length > 0){
							AVA_GetVendorDetails(nRecord);
						}
					}
					
					cForm.addTab({
						id: 'custpage_avatab',
						label: 'AvaTax'
					});
					
					var accruedUseTax, avaTax, accruedTax;
					if(nRecord.getValue('nexus_country') == 'US'){
						accruedUseTax = cForm.addField({
							id: 'custpage_ava_accruedusetax',
							label: 'Accrue Use Tax',
							type: ui.FieldType.CHECKBOX,
							container: 'custpage_avatab'
						});
						
						if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.COPY){
							accruedUseTax.updateDisplayType({
								displayType: ui.FieldDisplayType.DISABLED
							});
						}
						
						avaTax = cForm.addField({
							id: 'custpage_ava_avatax',
							label: 'Tax Calculated By AvaTax',
							type: ui.FieldType.CURRENCY,
							container: 'custpage_avatab'
						});
						avaTax.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						avaTax.defaultValue = 0;
						
						accruedTax = cForm.addField({
							id: 'custpage_ava_accruedtaxamount',
							label: 'Accrued Tax Amount',
							type: ui.FieldType.CURRENCY,
							container: 'custpage_avatab'
						});
						accruedTax.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						accruedTax.defaultValue = 0;
						
						var docStatus = cForm.addField({
							id: 'custpage_ava_docstatus',
							label: 'Document Status',
							type: ui.FieldType.TEXT
						});
						docStatus.updateDisplayType({
							displayType: ui.FieldDisplayType.HIDDEN
						});
					}
					else if(AVA_FoundVatCountry == 1){
						var docNo = cForm.addField({
							id: 'custpage_ava_docno',
							label: 'AvaTax Document Number',
							type: ui.FieldType.TEXT,
							container: 'custpage_avatab'
						});
						docNo.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						
						var docDate = cForm.addField({
							id: 'custpage_ava_docdate',
							label: 'Document Date',
							type: ui.FieldType.TEXT,
							container: 'custpage_avatab'
						});
						docDate.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						
						var docStatus = cForm.addField({
							id: 'custpage_ava_docstatus',
							label: 'Document Status',
							type: ui.FieldType.TEXT,
							container: 'custpage_avatab'
						});
						docStatus.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						
						var taxDate = cForm.addField({
							id: 'custpage_ava_taxdate',
							label: 'Tax Calculation Date',
							type: ui.FieldType.TEXT,
							container: 'custpage_avatab'
						});
						taxDate.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						
						var totolAmount = cForm.addField({
							id: 'custpage_ava_totalamount',
							label: 'Total Amount',
							type: ui.FieldType.CURRENCY,
							container: 'custpage_avatab'
						});
						totolAmount.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						
						var totolDiscount = cForm.addField({
							id: 'custpage_ava_totaldiscount',
							label: 'Total Discount',
							type: ui.FieldType.CURRENCY,
							container: 'custpage_avatab'
						});
						totolDiscount.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						
						var totolNonTaxable = cForm.addField({
							id: 'custpage_ava_totalnontaxable',
							label: 'Total Non-Taxable',
							type: ui.FieldType.CURRENCY,
							container: 'custpage_avatab'
						});
						totolNonTaxable.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						
						var totolTaxable = cForm.addField({
							id: 'custpage_ava_totaltaxable',
							label: 'Total Taxable',
							type: ui.FieldType.CURRENCY,
							container: 'custpage_avatab'
						});
						totolTaxable.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						
						var totolTax = cForm.addField({
							id: 'custpage_ava_totaltax',
							label: 'Total Tax',
							type: ui.FieldType.CURRENCY,
							container: 'custpage_avatab'
						});
						totolTax.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
					}
					
					if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW){
						var multiplier = (nRecord.type == 'vendorbill') ? 1 : -1;
						
						var searchRecord = search.create({
							type: 'customrecord_avausetaxheaderdetails',
							filters: ['custrecord_ava_docinternalid', 'anyof', nRecord.id],
							columns:
								[
									'custrecord_ava_docinternalid',
									'custrecord_ava_docdate',
									'custrecord_ava_docstatus',
									'custrecord_ava_taxcalcdate',
									'custrecord_ava_totalamt',
									'custrecord_ava_totaldis',
									'custrecord_ava_totalnontax',
									'custrecord_ava_totaltaxableamt',
									'custrecord_ava_avatax',
									'custrecord_ava_accruedusetax',
									'custrecord_avaaccruedtaxamt',
									'custrecord_ava_journalentryid'
								]
						});
						var searchResult = searchRecord.run();
						searchResult = searchResult.getRange({
							start: 0,
							end: 1000
						});
						
						for(var i = 0; searchResult != null && i < searchResult.length; i++){
							docStatus.defaultValue = taxLibrary.AVA_DocumentStatus(searchResult[i].getValue('custrecord_ava_docstatus'));
							taxHeaderId.defaultValue = searchResult[i].id;
							
							if(nRecord.getValue('nexus_country') == 'US'){
								accruedUseTax.defaultValue = (searchResult[i].getValue('custrecord_ava_accruedusetax') == true) ? 'T' : 'F';
								avaTax.defaultValue = parseFloat(searchResult[i].getValue('custrecord_ava_avatax'));
								accruedTax.defaultValue = parseFloat(searchResult[i].getValue('custrecord_avaaccruedtaxamt'));
								journalEntryId.defaultValue = searchResult[i].getValue('custrecord_ava_journalentryid');
							}
							else if(AVA_FoundVatCountry == 1){
								if(context.type == context.UserEventType.EDIT){
									docNo.defaultValue = searchResult[i].getValue('custrecord_ava_docinternalid');
								}
								else{
									var url1 = url.resolveScript({
										scriptId: 'customscript_avagettaxhistory_suitelet',
										deploymentId: 'customdeploy_gettaxhistory'
									});
									url1 += '&doctype=PurchaseInvoice' + '&doccode=' + nRecord.id + '&rectype=' + nRecord.type + '&ns_transid=' + nRecord.getValue('transactionnumber') + '&AVA_FoundVatCountry=' + AVA_FoundVatCountry;;
									
									var finalURL = '<a href="' + url1 + '" target="_blank">' + searchResult[i].getValue('custrecord_ava_docinternalid') + '</a>';
									docNo.defaultValue = finalURL;
								}
								
								docDate.defaultValue = searchResult[i].getValue('custrecord_ava_docdate');
								taxDate.defaultValue = searchResult[i].getValue('custrecord_ava_taxcalcdate');
								
								var totalAmt = parseFloat(searchResult[i].getValue('custrecord_ava_totalamt'));
								totalAmt = (totalAmt != 0) ? totalAmt * multiplier : totalAmt;
								totolAmount.defaultValue = totalAmt;
								
								var totalDis = parseFloat(searchResult[i].getValue('custrecord_ava_totaldis'));
								totalDis = (totalDis != 0) ? totalDis * multiplier : totalDis;
								totolDiscount.defaultValue = totalDis;
								
								var totalNonTax = parseFloat(searchResult[i].getValue('custrecord_ava_totalnontax'));
								totalNonTax = (totalNonTax != 0) ? totalNonTax * multiplier : totalNonTax;
								totolNonTaxable.defaultValue = totalNonTax;
								
								var totalTaxableAmount = parseFloat(searchResult[i].getValue('custrecord_ava_totaltaxableamt'));
								totalTaxableAmount = (totalTaxableAmount != 0) ? totalTaxableAmount * multiplier : totalTaxableAmount;
								totolTaxable.defaultValue = totalTaxableAmount;
								
								var totalTaxAmt = parseFloat(searchResult[i].getValue('custrecord_ava_avatax'));
								totalTaxAmt = (totalTaxAmt != 0) ? totalTaxAmt * multiplier : totalTaxAmt;
								totolTax.defaultValue = totalTaxAmt;
							}
						}
						
						if(nRecord.getValue('nexus_country') == 'US'){
							var glImpactList = cForm.addSublist({
								id: 'custpage_avaglimpacttab',
								label: 'GL Impact',
								tab: 'custpage_avatab',
								type: ui.SublistType.STATICLIST
							});
							glImpactList.addField({
								id: 'custpage_ava_glaccount',
								label: 'Account',
								type: ui.FieldType.TEXT
							});
							glImpactList.addField({
								id: 'custpage_ava_debitamount',
								label: 'Debit',
								type: ui.FieldType.TEXT
							});
							glImpactList.addField({
								id: 'custpage_ava_creditamount',
								label: 'Credit',
								type: ui.FieldType.TEXT
							});
							
							if(nRecord.getValue('custpage_ava_journalentryid') != null && nRecord.getValue('custpage_ava_journalentryid').length > 0){
								var searchRecord = search.create({
									type: search.Type.JOURNAL_ENTRY,
									filters: ['internalid', 'anyof', nRecord.getValue('custpage_ava_journalentryid')]
								});
								var searchResult = searchRecord.run();
								searchResult = searchResult.getRange({
									start: 0,
									end: 5
								});
								
								if(searchResult != null && searchResult.length > 0){
									var debitCreditField = (nRecord.type == 'vendorbill') ? 'credit' : 'debit';
									var debitCreditField1 = (nRecord.type == 'vendorbill') ? 'debit' : 'credit';
									var debitCreditField2 = (nRecord.type == 'vendorbill') ? 'custpage_ava_creditamount' : 'custpage_ava_debitamount';
									var debitCreditField3 = (nRecord.type == 'vendorbill') ? 'custpage_ava_debitamount' : 'custpage_ava_creditamount';
									
									var rec = record.load({
										type: record.Type.JOURNAL_ENTRY,
										id: nRecord.getValue('custpage_ava_journalentryid')
									});
									
									for(var i = 0; rec.getLineCount('line') != null && i < rec.getLineCount('line'); i++){
										glImpactList.setSublistValue({
											id: 'custpage_ava_glaccount',
											line: i,
											value: rec.getSublistText('line', 'account', i)
										});
										
										if(i > ((rec.getLineCount('line') / 2) - 1)){
											glImpactList.setSublistValue({
												id: debitCreditField2,
												line: i,
												value: rec.getSublistValue('line', debitCreditField, i)
											});
										}
										else{
											glImpactList.setSublistValue({
												id: debitCreditField3,
												line: i,
												value: rec.getSublistValue('line', debitCreditField1, i)
											});
										}
									}
								}
							}
						}
						
						taxLibrary.AVA_AddLogsSubList(context, cForm, ui, nRecord);
					}
				}
			}
			catch(err){
				log.debug({
					title: 'BeforeLoad Try/Catch Error',
					details: err.message
				});
				log.debug({
					title: 'BeforeLoad Try/Catch Error Stack',
					details: err.stack
				});
			}
		}
		
		function AVA_PurchaseTransactionBeforeSubmit(context, configCache, connectorStartTime){
			AVA_LineCount = 0;
			AVA_ResultCode = '';
			var nRecord = context.newRecord;
			
			if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
				try{
					nRecord.setValue({
						fieldId: 'custpage_ava_taxcodestatus',
						value: 3,
						ignoreFieldChange: true
					});
					
					if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT){
						//EVAT
						AVA_FoundVatCountry = ava_library.mainFunction('AVA_CheckVatCountries', nRecord.getValue('nexus_country'));
						if(AVA_FoundVatCountry == 1){
							nRecord.setValue({
								fieldId: 'custbody_ava_transport',
								value: (nRecord.getValue('custpage_ava_transportlist') == null || nRecord.getValue('custpage_ava_transportlist') == '0' || nRecord.getValue('custpage_ava_transportlist') == '' || nRecord.getValue('custpage_ava_transportlist') == ' ') ? 6 : parseInt(nRecord.getValue('custpage_ava_transportlist')),
								ignoreFieldChange: true
							});
							
							for(var i = 0; i < nRecord.getLineCount('item'); i++){
								var transport = nRecord.getSublistValue({
									sublistId: 'item',
									fieldId: 'custpage_ava_transportlist',
									line: i
								});
								
								nRecord.setSublistValue({
									sublistId: 'item',
									fieldId: 'custcol_ava_transport',
									line: i,
									value: (transport == null || transport == '0' || transport == '' || transport == ' ') ? 6 : parseInt(transport)
								});
							}
						}
						
						if(nRecord.getValue('nexus_country') == 'US' && nRecord.getValue('custpage_ava_context') == 'WEBSERVICES'){
							if(nRecord.getValue('custpage_ava_vendorid') != null && nRecord.getValue('custpage_ava_vendorid').length > 0){
								VendorValues = nRecord.getValue('custpage_ava_vendorid').split('+');
							}
							else{
								AVA_GetVendorDetails(nRecord);
								VendorValues = nRecord.getValue('custpage_ava_vendorid').split('+');
							}
							
							if(AVA_UseTaxRequiredFields(nRecord, configCache) == 0){
								if(AVA_UseTaxItemsLines(nRecord, configCache) == 1){
									if(AVA_CalculateUseTax(nRecord, configCache) == false){
										taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', null, '', AVA_ErrorCode);
									}
								}
								else{
									taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', AVA_ErrorCode);
									nRecord.setValue({
										fieldId: 'custpage_ava_document',
										value: false,
										ignoreFieldChange: true
									});
								}
							}
							else{
								taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', AVA_ErrorCode);
								nRecord.setValue({
									fieldId: 'custpage_ava_document',
									value: false,
									ignoreFieldChange: true
								});
							}
							
							if(configCache.AVA_EnableLogEntries == '1' && AVA_ResultCode == 'Success' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
								var docCode = (AVA_TempDocCode != null) ? AVA_TempDocCode.toString().substring(0, 50) : '';
								var connectorEndTime = new Date();
								
								var connectorTime = (AVA_ConnectorEndTime.getTime() - connectorStartTime.getTime()) + (connectorEndTime.getTime() - AVA_ConnectorStartTime.getTime());
								var avaDocType = taxLibrary.AVA_RecordType(nRecord.type);
								ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + docCode + '~~' + connectorTime + '~~' + AVA_LatencyTime + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Performance' + '~~' + 'Informational' + '~~' + nRecord.type + '~~' + 'AVA_PurchaseTransactionBeforeSubmit' + '~~' + 'CONNECTORMETRICS Type - GETTAX, LineCount - ' + AVA_LineCount + ', DocCode - ' + docCode + ', ConnectorTime - ' + connectorTime + ', LatencyTime - ' + AVA_LatencyTime + '~~' + '' + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
							}
						}
					}
				}
				catch(err){
					if(configCache.AVA_EnableLogEntries == '1' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
						var avaDocType = taxLibrary.AVA_RecordType(nRecord.type);
						ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + nRecord.id + '~~' + '' + '~~' + '' + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Debug' + '~~' + 'Exception' + '~~' + nRecord.type + '~~' + 'AVA_PurchaseTransactionBeforeSubmit' + '~~' + err.message + '~~' + err.stack + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
					}
					
					log.debug({
						title: 'BeforeSubmit Try/Catch Error',
						details: err.message
					});
					log.debug({
						title: 'BeforeSubmit Try/Catch Error Stack',
						details: err.stack
					});
				}
			}
		}
		
		function AVA_PurchaseTransactionAfterSubmit(context, configCache, connectorStartTime, details){
			AVA_LineCount = 0;
			AVA_ResultCode = '';
			var nRecord = context.newRecord;
			
			if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
				try{
					AVA_FoundVatCountry = ava_library.mainFunction('AVA_CheckVatCountries', nRecord.getValue('nexus_country'));
					
					if((nRecord.getValue('nexus_country') == 'US' || AVA_FoundVatCountry == 1) && (nRecord.getValue('custpage_ava_context') == 'USERINTERFACE' || nRecord.getValue('custpage_ava_context') == 'WEBSERVICES')){
						nRecord.setValue({
							fieldId: 'custpage_ava_taxcodestatus',
							value: 1,
							ignoreFieldChange: true
						});
						
						if(nRecord.getValue('custpage_ava_document') == true || nRecord.getValue('custpage_ava_document') == 'T'){
							AVA_UseTaxGetNSLines(nRecord);
							AVA_UseTaxGetLocations(nRecord, configCache);
							AVA_UseTaxItemsLines(nRecord, configCache);
							
							if(nRecord.getValue('custpage_ava_vendorid') != null && nRecord.getValue('custpage_ava_vendorid').length > 0){
								VendorValues = nRecord.getValue('custpage_ava_vendorid').split('+');
							}
						}
						
						if(context.type == context.UserEventType.CREATE){
							if(nRecord.getValue('nexus_country') == 'US'){
								if(configCache.AVA_EnableUseTax == true){
									if(nRecord.getValue('custpage_ava_docstatus') != 'Cancelled'){
										if((nRecord.getValue('custpage_ava_document') == true || nRecord.getValue('custpage_ava_document') == 'T') && (configCache.AVA_BillApproved == false || nRecord.getValue('approvalstatus') == '2')){ // Check bill approval status for CONNECT-5254
											if(AVA_CalculateUseTax(nRecord, configCache, 'create') == false){
												taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', null, '', AVA_ErrorCode);
											}
										}
										else{
											var rec = record.create({
												type: 'customrecord_avausetaxheaderdetails'
											});
											
											AVA_UpdateUseTaxHeaderRecord(nRecord, configCache, rec);
											taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', '');
										}
									}
								}
							}
							else if(configCache.AVA_EnableVatIn == true){
								if(nRecord.getValue('custpage_ava_docstatus') != 'Cancelled'){
									if(nRecord.getValue('custpage_ava_document') == true || nRecord.getValue('custpage_ava_document') == 'T'){
										if(AVA_CalculateUseTax(nRecord, configCache, 'create') == false){
											taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', null, '', AVA_ErrorCode);
										}
									}
									else{
										taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', '');
									}
								}
							}
							else{
								taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', '');
							}
						}
						else if(context.type == context.UserEventType.EDIT){
							var searchRecord1 = search.create({
								type: nRecord.type,
								filters:
									[
									 	['mainline', 'is', 'T'],
									 	'and',
									 	['internalid', 'anyof', nRecord.id],
									 	'and',
									 	['voided', 'is', 'T'],
									]
							});
							var searchResult1 = searchRecord1.run();
							searchResult1 = searchResult1.getRange({
								start: 0,
								end: 5
							});
							
							if(searchResult1 != null && searchResult1.length > 0){
								var headerid = nRecord.getValue('custpage_ava_headerid');
								
								if(headerid != null && headerid.length > 0 && nRecord.getValue('custpage_ava_docstatus') != null && nRecord.getValue('custpage_ava_docstatus').length > 0){
									var cancelType = 'DocVoided';
									var cancelStatus = 'Cancelled';
									var cancelTax = taxLibrary.AVA_CancelTax(nRecord, configCache, cancelType, details);
									
									if(cancelTax == 0){
										record.submitFields({
											type: 'customrecord_avausetaxheaderdetails',
											id: headerid,
											values: {'custrecord_ava_docstatus': taxLibrary.AVA_DocumentStatus(cancelStatus)}
										});
									}
									
									if(nRecord.getValue('nexus_country') == 'US' && nRecord.getValue('custpage_ava_journalentryid') != null && nRecord.getValue('custpage_ava_journalentryid').length > 0){
										record.delete({
											type: record.Type.JOURNAL_ENTRY,
											id: parseInt(nRecord.getValue('custpage_ava_journalentryid'))
										});
										record.submitFields({
											type: 'customrecord_avausetaxheaderdetails',
											id: headerid,
											values: {'custrecord_ava_journalentryid': ''}
										});
									}
								}
							}
							else{
								if(nRecord.getValue('nexus_country') == 'US'){
									if(configCache.AVA_EnableUseTax == true){
										if(nRecord.getValue('custpage_ava_docstatus') != 'Cancelled'){
											if((nRecord.getValue('custpage_ava_document') == true || nRecord.getValue('custpage_ava_document') == 'T') && (configCache.AVA_BillApproved == false || nRecord.getValue('approvalstatus') == '2')){ // Check bill approval status for CONNECT-5254
												if(AVA_CalculateUseTax(nRecord, configCache, 'edit') == false){
													taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', null, '', AVA_ErrorCode);
												}
											}
											else{
												var rec;
												
												if(nRecord.getValue('custpage_ava_headerid') != null && nRecord.getValue('custpage_ava_headerid').length > 0){
													rec = record.load({
														type: 'customrecord_avausetaxheaderdetails',
														id: nRecord.getValue('custpage_ava_headerid')
													});
												}
												else{
													rec = record.create({
														type: 'customrecord_avausetaxheaderdetails'
													});
												}
												
												AVA_UpdateUseTaxHeaderRecord(nRecord, configCache, rec);
												taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', '');
											}
										}
									}
								}
								else if(configCache.AVA_EnableVatIn == true){
									if(nRecord.getValue('custpage_ava_document') == true || nRecord.getValue('custpage_ava_document') == 'T'){
										if(AVA_CalculateUseTax(nRecord, configCache, 'edit') == false){
											taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', null, '', AVA_ErrorCode);
										}
									}
									else{
										taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', '');
									}
								}
								else{
									taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', '');
								}
							}
						}
						else if(context.type == context.UserEventType.DELETE){
							if(nRecord.getValue('custpage_ava_headerid') != null && nRecord.getValue('custpage_ava_headerid').length > 0 && nRecord.getValue('custpage_ava_docstatus') != null && nRecord.getValue('custpage_ava_docstatus').length > 0){
								var cancelType = 'DocVoided';
								var cancelStatus = 'Cancelled';
								var cancelTax = taxLibrary.AVA_CancelTax(nRecord, configCache, cancelType, details);
								
								if(cancelTax == 0){
									record.submitFields({
										type: 'customrecord_avausetaxheaderdetails',
										id: nRecord.getValue('custpage_ava_headerid'),
										values: {'custrecord_ava_docstatus': taxLibrary.AVA_DocumentStatus(cancelStatus)}
									});
								}
								
								if(nRecord.getValue('nexus_country') == 'US' && nRecord.getValue('custpage_ava_journalentryid') != null && nRecord.getValue('custpage_ava_journalentryid').length > 0){
									record.delete({
										type: record.Type.JOURNAL_ENTRY,
										id: parseInt(nRecord.getValue('custpage_ava_journalentryid'))
									});
									record.submitFields({
										type: 'customrecord_avausetaxheaderdetails',
										id: nRecord.getValue('custpage_ava_headerid'),
										values: {'custrecord_ava_journalentryid': ''}
									});
								}
							}
						}
					}
					
					if((context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) && configCache.AVA_EnableLogEntries == '1' && AVA_ResultCode == 'Success' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
						var connectorEndTime = new Date();
						var connectorTime = (AVA_ConnectorEndTime.getTime() - connectorStartTime.getTime()) + (connectorEndTime.getTime() - AVA_ConnectorStartTime.getTime());
						var avaDocType = taxLibrary.AVA_RecordType(nRecord.type);
						ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + nRecord.id + '~~' + connectorTime + '~~' + AVA_LatencyTime + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Performance' + '~~' + 'Informational' + '~~' + nRecord.type + '~~' + 'AVA_PurchaseTransactionAfterSubmit' + '~~' + 'CONNECTORMETRICS Type - GETTAX, LineCount - ' + AVA_LineCount + ', DocCode - ' + nRecord.id + ', ConnectorTime - ' + connectorTime + ', LatencyTime - ' + AVA_LatencyTime + '~~' + '' + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
					}
				}
				catch(err){
					if(configCache.AVA_EnableLogEntries == '1' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
						var avaDocType = taxLibrary.AVA_RecordType(nRecord.type);
						ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + nRecord.id + '~~' + '' + '~~' + '' + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Debug' + '~~' + 'Exception' + '~~' + nRecord.type + '~~' + 'AVA_PurchaseTransactionAfterSubmit' + '~~' + err.message + '~~' + err.stack + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
					}
					
					log.debug({
						title: 'AfterSubmit Try/Catch Error',
						details: err.message
					});
					log.debug({
						title: 'AfterSubmit Try/Catch Error Stack',
						details: err.stack
					});
				}
			}
		}
		
		function AVA_GetVendorDetails(nRecord){
			var searchRecord = search.create({
				type:  search.Type.VENDOR,
				filters: ['internalid', 'anyof', nRecord.getValue('entity')],
				columns:
					[
					 	'isperson',
					 	'firstname',
					 	'middlename',
					 	'lastname',
					 	'companyname',
					 	'entityid',
					 	'vatregnumber',
					 	'shipaddress1',
					 	'shipaddress2',
					 	'shipcity',
					 	'shipstate',
					 	'shipzip',
					 	'shipcountrycode',
					 	'custentity_ava_usetaxassessment'
					]
			});
			var searchResult = searchRecord.run();
			searchResult = searchResult.getRange({
				start: 0,
				end: 5
			});
			
			if(searchResult != null && searchResult.length > 0){
				var str = searchResult[0].getValue('isperson') + '+' + searchResult[0].getValue('firstname') + '+' + searchResult[0].getValue('middlename') + '+' + searchResult[0].getValue('lastname') + '+' + searchResult[0].getValue('companyname') + '+' + searchResult[0].getValue('entityid') + '+' + searchResult[0].getValue('vatregnumber') + '+';
				str += searchResult[0].getValue('shipaddress1') + '+' + searchResult[0].getValue('shipaddress2') + '+' + searchResult[0].getValue('shipcity') + '+' + searchResult[0].getValue('shipstate') + '+' + searchResult[0].getValue('shipzip') + '+' + searchResult[0].getValue('shipcountrycode') + '+' + searchResult[0].getValue('custentity_ava_usetaxassessment');
				nRecord.setValue({
					fieldId: 'custpage_ava_vendorid',
					value: str,
					ignoreFieldChange: true
				});
			}
		}
		
		function AVA_UseTaxRequiredFields(nRecord, configCache){
			// 1. Check if AvaTax is enabled
			if(configCache.AVA_DisableTax == true){
				AVA_ErrorCode = 1;
				return 1;
			}
			
			// 2. Check if Advanced Taxes feature is enabled
			if(runtime.isFeatureInEffect('ADVTAXENGINE') == false){
				AVA_ErrorCode = 33;
				return 1;
			}
			
			// 3. Check if UseTax is enabled
			if(nRecord.getValue('nexus_country') == 'US' && configCache.AVA_EnableUseTax == false){
				if(VendorValues[13] == 'true'){
					AVA_ErrorCode = 28;
				}
				else{
					AVA_ErrorCode = 0;
				}
				
				return 1;
			}
			
			// 4. Check if VAT IN is enabled
			if(nRecord.getValue('nexus_country') != 'US' && configCache.AVA_EnableVatIn == false){
				AVA_ErrorCode = 32;
				return 1;
			}
			
			// 5. Check if the Environment is correct
			if(runtime.envType != 'PRODUCTION' && configCache.AVA_ServiceUrl == '0'){
				AVA_ErrorCode = 19;
				return 1;
			}
			
			// 6. Check for Vendor
			if(nRecord.getValue('entity') == null || nRecord.getValue('entity').length == 0){
				AVA_ErrorCode = 25;
				return 1;
			}
			
			// 7. Check if UseTax Assessment is enabled for Vendor
			if(nRecord.getValue('nexus_country') == 'US' && (VendorValues[13] == null || VendorValues[13] == 'false')){
				AVA_ErrorCode = 29;
				return 1;
			}
			
			// 8. Check if Lines exist
			if(nRecord.getValue('haslines') == false){
				AVA_ErrorCode = 2;
				return 1;
			}
			
			// 9. Check for VendorCode in AVACONFIG record
			if(configCache.AVA_VendorCode != null && configCache.AVA_VendorCode > 2){
				AVA_ErrorCode = 26;
				return 1;
			}
			
			// 10. Check for Date
			if(nRecord.getValue('trandate') == null || nRecord.getValue('trandate').length == 0){
				AVA_ErrorCode = 4;
				return 1;
			}
			
			AVA_UseTaxGetNSLines(nRecord);
			AVA_UseTaxGetLocations(nRecord, configCache);
			
			if(nRecord.type == 'purchaseorder'){
				AVA_GetTaxCodes(nRecord);
				
				// 11. Check for Taxcode
				var checkTax = AVA_TaxCodeCheck(nRecord);
				if(checkTax == 1){
					return 1;
				}
			}
			
			// 12. Check if Inventory Items Type exist
			var itemsExist = 'F', euTriangulationCheck = 0;
			for(var i = 0; i < nRecord.getLineCount('item'); i++){
				var lineType = nRecord.getSublistValue({
					sublistId: 'item',
					fieldId: 'itemtype',
					line: i
				});
				
				//EVAT 
				if(AVA_FoundVatCountry == 1 && (nRecord.getSublistValue('item', 'custcol_5892_eutriangulation', i) == true || nRecord.getSublistValue('item', 'custcol_5892_eutriangulation', i) == 'T')){
					euTriangulationCheck = 1;
				}
				
				switch(lineType){
					case 'Discount':
					case 'Markup':
					case 'Description':
					case 'Subtotal':
					case 'Group':
					case 'EndGroup':
						break;
						
					default:
						itemsExist = 'T';
						break;
				}
			}
			
			if(itemsExist == 'F' && ExpenseItemFlag == 'F'){
				AVA_ErrorCode = 15;
				return 1;
			}
			
			// 13. Check if Middle Man VAT ID is entered
			if(AVA_FoundVatCountry == 1 && euTriangulationCheck == 1 && (nRecord.getValue('custbody_ava_vatregno') == null || nRecord.getValue('custbody_ava_vatregno').length <= 0)){
				AVA_ErrorCode = 38;
				return 1;
			}

			// 14. Check for Invalid DocType
			if(taxLibrary.AVA_RecordType(nRecord.type) == 0){
				AVA_ErrorCode = 23;
				return 1;
			}
			
			return 0;
		}
		
		function AVA_UseTaxGetNSLines(nRecord){
			var tabType;
			AVA_NS_Lines = new Array();
			
			ExpenseItemFlag = 'F';
			
			for(var tab = 0; tab < 2; tab++){
				tabType = (tab == 0) ? 'item' : 'expense';
				
				for(var line = 0; line < nRecord.getLineCount(tabType); line++){
					var arrIndex = AVA_NS_Lines.length;						
					
					AVA_NS_Lines[arrIndex] = new Array();
					AVA_NS_Lines[arrIndex][0] = tabType;
					AVA_NS_Lines[arrIndex][1] = line;
					
					if(tabType == 'expense'){
						ExpenseItemFlag = 'T';
					}
				}
			}
		}
		
		function AVA_UseTaxGetLocations(nRecord, configCache){
			taxLibrary.AVA_GetAllLocations();
			AVA_HeaderLocation = new Array();
			AVA_LocationArray = new Array();
			
			if(runtime.isFeatureInEffect('LOCATIONS') == true){ // Fix for CONNECT-3724
				if(nRecord.getValue('custpage_ava_lineloc') == false || nRecord.getValue('custpage_ava_lineloc') == 'F'){
					if(nRecord.getValue('location') != null && nRecord.getValue('location').length > 0){
						AVA_HeaderLocation = taxLibrary.AVA_GetAddresses(nRecord, configCache, nRecord.getValue('location'), 2);
					}
				}
				else{
					for(var line = 0; AVA_NS_Lines != null && line < AVA_NS_Lines.length; line++){
						var existFlag = 'F'; // Flag to check if an address already exists in the Location Array
						var locArrIndex; // Index whose location details need to be copied into a different Array item
						var locArrLen = (AVA_LocationArray != null) ? AVA_LocationArray.length : 0; //Length of Location Array
						var locationId = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'location', AVA_NS_Lines[line][1]); // Location internal ID of a line item.
						
						// Loop to find if the current line location internal id exists in the location array						
						for(var locCtr = 0; locCtr < locArrLen; locCtr++){
							if(AVA_LocationArray[locCtr][0] != null && locationId == AVA_LocationArray[locCtr][0]){
								existFlag = 'T';
								locArrIndex = locCtr;
								break;
							}
						}
						
						AVA_LocationArray[locArrLen] = new Array();
						
						if(locationId != null && locationId.length > 0){
							AVA_LocationArray[locArrLen][0] = locationId;
							
							if(existFlag == 'T'){
								// Location Details exists in Location Array, so copy the details
								AVA_LocationArray[locArrLen][1] = new Array();
								AVA_LocationArray[locArrLen][1] = AVA_LocationArray[locArrIndex][1];
							}
							else{
								AVA_LocationArray[locArrLen][1] = new Array();
								AVA_LocationArray[locArrLen][1] = taxLibrary.AVA_GetAddresses(nRecord, configCache, locationId, 2);
							}
						}
						else{
							AVA_LocationArray[locArrLen][0] = null;
							AVA_LocationArray[locArrLen][1] = null;
						}
					}
				}
			}
		}
		
		function AVA_GetTaxCodes(nRecord){
			var taxcodeArray = new Array();
			AVA_TaxcodeArray = new Array();
			
			if((ExpenseItemFlag == 'T' || nRecord.getValue('custpage_ava_context') != 'USERINTERFACE') && nRecord.getValue('custpage_ava_taxcodestatus') != 0){
				var searchTaxItem = search.create({
					type: search.Type.SALES_TAX_ITEM,
					filters: ['isinactive', 'is', 'F'],
					columns: 'itemid'
				});
				searchTaxItem = searchTaxItem.run();
				var searchResultTaxItem = searchTaxItem.getRange({
					start: 0,
					end: 1000
				});
				
				var j = 0;
				while(searchResultTaxItem != null && searchResultTaxItem.length > 0){
					for(var i = 0; i < searchResultTaxItem.length; i++){
						taxcodeArray[taxcodeArray.length] = new Array();
						taxcodeArray[taxcodeArray.length - 1][0] = searchResultTaxItem[i].id;
						taxcodeArray[taxcodeArray.length - 1][1] = searchResultTaxItem[i].getValue('itemid');
						j++;
					}
					
					if(searchResultTaxItem.length == 1000){
						searchResultTaxItem = searchTaxItem.getRange({
							start: j,
							end: j + 1000
						});
					}
					else{
						break;
					}
				}
				
				var searchTaxGroup = search.create({
					type: search.Type.TAX_GROUP,
					filters: ['isinactive', 'is', 'F'],
					columns: 'itemid'
				});
				searchTaxGroup = searchTaxGroup.run();
				var searchResultTaxGroup = searchTaxGroup.getRange({
					start: 0,
					end: 1000
				});
				
				j = 0;
				while(searchResultTaxGroup != null && searchResultTaxGroup.length > 0){
					for(var i = 0; i < searchResultTaxGroup.length; i++){
						taxcodeArray[taxcodeArray.length] = new Array();
						taxcodeArray[taxcodeArray.length - 1][0] = searchResultTaxGroup[i].id;
						taxcodeArray[taxcodeArray.length - 1][1] = searchResultTaxGroup[i].getValue('itemid');
						j++;
					}
					
					if(searchResultTaxGroup.length == 1000){
						searchResultTaxGroup = searchTaxGroup.getRange({
							start: j,
							end: j + 1000
						});
					}
					else{
						break;
					}
				}
			}
			
			for(var line = 0; AVA_NS_Lines != null && line < AVA_NS_Lines.length; line++){
				if(nRecord.getValue('custpage_ava_taxcodestatus') == 0){
					AVA_TaxcodeArray[AVA_TaxcodeArray.length] = nRecord.getSublistText(AVA_NS_Lines[line][0], 'taxcode', AVA_NS_Lines[line][1]);
				}
				else{
					if(AVA_NS_Lines[line][0] == 'item'){
						if(nRecord.getValue('custpage_ava_context') != 'USERINTERFACE'){
							var taxcode = '';
							
							for(var i = 0; i < taxcodeArray.length; i++){
								if(nRecord.getSublistValue(AVA_NS_Lines[line][0], 'taxcode', AVA_NS_Lines[line][1]) == taxcodeArray[i][0]){
									taxcode = taxcodeArray[i][1];
									break;
								}
							}
							
							AVA_TaxcodeArray[AVA_TaxcodeArray.length] = taxcode;
						}
						else{
							AVA_TaxcodeArray[AVA_TaxcodeArray.length] = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'taxcode_display', AVA_NS_Lines[line][1]);
						}
					}
					else{
						var taxcode = '';
						
						for(var i = 0; i < taxcodeArray.length; i++){
							if(nRecord.getSublistValue(AVA_NS_Lines[line][0], 'taxcode', AVA_NS_Lines[line][1]) == taxcodeArray[i][0]){
								taxcode = taxcodeArray[i][1];
								break;
							}
						}
						
						AVA_TaxcodeArray[AVA_TaxcodeArray.length] = taxcode;
					}
				}
			}
		}
		
		function AVA_TaxCodeCheck(nRecord){
			var avaLines = 'F', lineTaxCode;
			var taxcode = nRecord.getValue('custpage_ava_deftax');
			
			for(var line = 0; AVA_NS_Lines != null && line < AVA_NS_Lines.length; line++){
				lineTaxCode = AVA_TaxcodeArray[line];
				
				if(lineTaxCode.indexOf(':') != -1){
					lineTaxCode = lineTaxCode.substring(lineTaxCode.indexOf(':') + 1);
				}
				
				var linetype = nRecord.getSublistValue({
					sublistId: AVA_NS_Lines[line][0],
					fieldId: 'itemtype',
					line: AVA_NS_Lines[line][1]
				});
				
				if(lineTaxCode != '-Not Taxable-' && !(linetype == 'Description' || linetype == 'Subtotal' || linetype == 'Group' || linetype == 'EndGroup' || linetype == 'Discount')){
					if(lineTaxCode != null && lineTaxCode.length > 0){
						if(lineTaxCode.substring(0, taxcode.length) != taxcode){
							avaLines = 'T';
							break;
						}
					}
				}
			}
			
			if(avaLines == 'T'){
				AVA_ErrorCode = 9;
				return 1;
			}
		}
		
		function AVA_UseTaxItemsLines(nRecord, configCache){
			var prev_lineno = 0, AVA_GroupBegin, AVA_GroupEnd;
			
			AVA_LineNames   = new Array(); // Stores the line names
			AVA_LineType    = new Array(); // Stores the Line Type
			AVA_LineAmount  = new Array(); // Stores the Line amounts
			AVA_TaxLines    = new Array(); // Stores the value 'T' for Item Type and 'F' for Non-Item Type like discount, payment, markup, description, subtotal, groupbegin and endgroup
			AVA_Taxable     = new Array(); // Stores the value 'T' if line is taxable else 'F'
			AVA_LineQty     = new Array(); // Stores the Line Qty
			
			if(nRecord.getValue('nexus_country') == 'US' && configCache.AVA_EnableUseTax == true){
				var i;
				TaxItemCnt = 0;
				VendorChargedTax = 0;
				
				for(i = 0; i < nRecord.getLineCount('item'); i++){
					if(nRecord.getSublistValue('item', 'item', i) == configCache.AVA_VendorTaxItem){
						TaxItemCnt++;
						VendorChargedTax = nRecord.getSublistValue('item', 'amount', i);
					}
				}
				
				if(TaxItemCnt == 1){
					if(nRecord.getSublistValue('item', 'item', i - 1) != configCache.AVA_VendorTaxItem){
						AVA_ErrorCode = 35;
						return 0;
					}
				}
				else if(TaxItemCnt > 1){
					AVA_ErrorCode = 36;
					return 0;
				}
			}
			
			for(var i = 0; i < nRecord.getLineCount('item'); i++){
				AVA_LineType[i] = nRecord.getSublistValue('item', 'itemtype', i);
				
				if(AVA_LineType[i] != 'EndGroup'){
					if(runtime.isFeatureInEffect('BARCODES') == true && configCache.AVA_EnableUpcCode == true && (nRecord.getSublistValue('item', 'custcol_ava_upccode', i) != null && nRecord.getSublistValue('item', 'custcol_ava_upccode', i).length > 0)){
						AVA_LineNames[i] = 'UPC:' + nRecord.getSublistValue('item', 'custcol_ava_upccode', i).substring(0, 46);
					}
					else{
						AVA_LineNames[i] = (nRecord.getSublistValue('item', 'custcol_ava_item', i) != null && nRecord.getSublistValue('item', 'custcol_ava_item', i).length > 0) ? nRecord.getSublistValue('item', 'custcol_ava_item', i).substring(0, 50) : '';
					}
				}
				else{
					AVA_LineNames[i] = 'End Group';
				}
				
				if(AVA_LineType[i] == 'Payment'){
					AVA_LineQty[i] = 1;
				}
				else{
					AVA_LineQty[i] = nRecord.getSublistValue('item', 'quantity', i);
				}
				
				AVA_LineAmount[i] = nRecord.getSublistValue('item', 'amount', i);
				
				if(i == AVA_GroupBegin && AVA_GroupEnd != 0){
					for(var k = i; k <= AVA_GroupEnd; k++){
						AVA_LineType[k] = nRecord.getSublistValue('item', 'itemtype', k);
						
						if(AVA_LineType[k] != 'EndGroup'){
							if(runtime.isFeatureInEffect('BARCODES') == true && configCache.AVA_EnableUpcCode == true && (nRecord.getSublistValue('item', 'custcol_ava_upccode', k) != null && nRecord.getSublistValue('item', 'custcol_ava_upccode', k).length > 0)){
								AVA_LineNames[k] = 'UPC:' + nRecord.getSublistValue('item', 'custcol_ava_upccode', k).substring(0, 46);
							}
							else{
								AVA_LineNames[k] = (nRecord.getSublistValue('item', 'custcol_ava_item', k) != null && nRecord.getSublistValue('item', 'custcol_ava_item', k).length > 0) ? nRecord.getSublistValue('item', 'custcol_ava_item', k).substring(0, 50) : '';
							}
						}
						else{
							AVA_LineNames[k] = 'End Group';
						}
						
						if(AVA_LineType[k] == 'Payment'){
							AVA_LineQty[k] = 1;
						}
						else{
							AVA_LineQty[k] = nRecord.getSublistValue('item', 'quantity', k);
						}
						
						AVA_LineAmount[k] = nRecord.getSublistValue('item', 'amount', k);
						
						switch(AVA_LineType[k]){
							case 'Discount':
							case 'Markup':
								AVA_TaxLines[k] = 'F';
								AVA_Taxable [k] = 'F';
								var discountItem = nRecord.getSublistValue('item', 'amount', k).toString();//here current lines discount is fetched
								if(discountItem != null && discountItem.indexOf('%') != -1){
									discountItem = discountItem.substring(0, discountItem.indexOf('%'));
								}
								
								if(discountItem != 0){
									if(k == i){
										//when there is no preceeding Inv Item before a Discount item
										AVA_LineQty[k] = 1;
										AVA_LineAmount[k] = discountItem;
										AVA_TaxLines[k] = 'T'; //This section's discount will be sent as Line exempt
									}
									else{
										var totallines = 0, prev;
										for(prev = k; AVA_LineType[prev] != 'InvtPart' && AVA_LineType[prev] != 'Subtotal' && AVA_LineType[prev] != 'Kit' && AVA_LineType[prev] != 'Assembly' && AVA_LineType[prev] != 'NonInvtPart' && AVA_LineType[prev] != 'OthCharge' && AVA_LineType[prev] != 'Service' && AVA_LineType[prev] != 'Group' && AVA_LineType[prev] != 'GiftCert' && AVA_LineType[prev] != 'DwnLdItem'; prev--); //searches for the preceeding Inv Item, subtotal or Kit item
										var prevItemAmt = AVA_LineAmount[prev];//this fetches the preceeding InvItem's amount
										AVA_LineAmount[k] = discountItem;
										
										if(AVA_LineType[prev] == 'Group'){
											AVA_LineQty[k] = 1;
											AVA_LineAmount[k] = discountItem;
											AVA_TaxLines[k] = 'T';
										}
										
										if((AVA_LineType[prev] == 'InvtPart' || AVA_LineType[prev] == 'Kit' || AVA_LineType[prev] == 'Assembly' || AVA_LineType[prev] == 'NonInvtPart' || AVA_LineType[prev] == 'OthCharge' || AVA_LineType[prev] == 'Service' || AVA_LineType[prev] == 'GiftCert' || AVA_LineType[prev] == 'DwnLdItem') && AVA_Taxable[prev] == 'T'){ //when the preceeding item is Inventory and is taxable
											AVA_LineAmount[prev] = parseFloat(prevItemAmt) + parseFloat(discountItem);//as we wud hve set some value earlier for the Inv item, that's why when Discount is identified below it, the Inv item's amount is exchanged with the discounted amt
										}
										
										if((AVA_LineType[prev] == 'InvtPart' || AVA_LineType[prev] == 'Kit' || AVA_LineType[prev] == 'Assembly' || AVA_LineType[prev] == 'NonInvtPart' || AVA_LineType[prev] == 'OthCharge' || AVA_LineType[prev] == 'Service' || AVA_LineType[prev] == 'GiftCert' || AVA_LineType[prev] == 'DwnLdItem') && AVA_Taxable[prev] == 'F'){ //when the preceeding item is Inventory but is not taxable
											AVA_LineQty[k] = 1;
											AVA_LineAmount[k] = discountItem;
											AVA_TaxLines[k] = 'T';
										}
										
										if(AVA_LineType[prev] == 'Subtotal'){ //when the preceeding item is a Subtotal item
											var j;
											var totalamt = 0;//to get total of all taxable items
											for(j = prev - 1; AVA_LineType[j] != 'Subtotal' && AVA_LineType[j] != 'Group'; j--){ //finds the last subtotal line, so that the discount can be divided among the taxable items which appears between these two subtotals
												if(AVA_LineType[j] != 'Description' && AVA_LineType[j] != 'Discount' && AVA_LineType[j] != 'Markup' && AVA_LineType[j] != 'Group' && AVA_LineType[j] != 'EndGroup' && AVA_LineType[j] != 'Subtotal'){
													var lineAmt = (AVA_LineAmount[j] == null || (AVA_LineAmount[j] != null && AVA_LineAmount[j].length == 0)) ? 0 : AVA_LineAmount[j];
													totalamt += parseFloat(lineAmt);
													totallines++;
												}
											}
											
											var totalDiscount = 0, lines = 1;
											for(j = j + 1; j != prev; j++){ //to add part of discount to all taxable items which appears between two subtotal items(this doesn't include subtotal which appear in a group item)
												var discAmt = 0;
												if(AVA_LineType[j] != 'Description' && AVA_LineType[j] != 'Discount' && AVA_LineType[j] != 'Markup' && AVA_LineType[j] != 'Group' && AVA_LineType[j] != 'EndGroup' && AVA_LineType[j] != 'Subtotal'){
													var lineAmt = (AVA_LineAmount[j] == null || (AVA_LineAmount[j] != null && AVA_LineAmount[j].length == 0)) ? 0 : AVA_LineAmount[j];
													if(lines == totallines){
														discAmt = parseFloat(discountItem) + totalDiscount;
													}
													else{
														if(totalamt > 0){
															discAmt = (parseFloat(discountItem / totalamt.toFixed(2)) * parseFloat(lineAmt));
														}
													}
													
													AVA_LineAmount[j] = parseFloat(lineAmt) + parseFloat(discAmt);
													totalDiscount += (discAmt.toFixed(2) * -1);
													lines++;
												}
											}
											
											if(totallines == 0){
												AVA_LineQty[k] = 1;
												AVA_LineAmount[k] = discountItem;
												AVA_TaxLines[k] = 'T';
											}
										}
									}
								}
								break;
								
							case 'Description':
							case 'Subtotal':
								AVA_TaxLines[k] = 'F';
								break;
								
							case 'Payment':
								AVA_TaxLines[k] = 'T';
								AVA_Taxable[k] = 'F';
								break;
								
							case 'EndGroup':
								AVA_LineNames[k]  = 'EndGroup';
								AVA_LineType[k]   = 'EndGroup';
								AVA_LineAmount[k] = nRecord.getSublistValue('item', 'amount', k);
								AVA_TaxLines[k]   = 'F';
								AVA_Taxable[k]    = 'F';
								break;
								
							default:
								AVA_TaxLines[k] = 'T';
								//EndGroup Item from Webservice call
								if(nRecord.getSublistValue('item', 'item', k) == 0){
									AVA_LineNames[k]  = 'EndGroup';
									AVA_LineType[k]   = 'EndGroup';
									AVA_LineAmount[k] = nRecord.getSublistValue('item', 'amount', k);
									AVA_TaxLines[k]   = 'F';
									AVA_Taxable[k]    = 'F';
								}
								break;
						}
					}
					
					i = k - 1; //as i would be incremented when the loop ends, that's why deducted 1 so that i be equal to the End of Group line
				}
					
				switch(AVA_LineType[i]){
					case 'Discount':
					case 'Markup':
						var discountItem = nRecord.getSublistValue('item', 'amount', i).toString();//here current lines discount is fetched
						if(discountItem != null && discountItem.indexOf('%') != -1){
							discountItem = discountItem.substring(0, discountItem.indexOf('%'));
						}
						
						if(discountItem != 0){
							if(i == 0){
								AVA_LineQty[i] = 1;
								AVA_LineAmount[i] = discountItem;
								AVA_TaxLines[i] = 'T';
							}
							else{
								var totallines = 0, prev;
								AVA_TaxLines[i]='F';
								for(prev = i - 1; AVA_LineType[prev] != 'InvtPart' && AVA_LineType[prev] != 'EndGroup' && AVA_LineType[prev] != 'Subtotal' && AVA_LineType[prev] != 'Kit' && AVA_LineType[prev] != 'Assembly' && AVA_LineType[prev] != 'NonInvtPart' && AVA_LineType[prev] != 'OthCharge' && AVA_LineType[prev] != 'Service' && AVA_LineType[prev] != 'GiftCert' && AVA_LineType[prev] != 'DwnLdItem' && prev >= 0; prev--);//checks whether the prev item is an Inv Item, a Group or a Subtotal  
								
								if(prev < 0){
									AVA_LineQty[i] = 1;
									AVA_LineAmount[i] = discountItem;
									AVA_TaxLines[i] = 'T';
								}
								
								if(AVA_LineType[prev] == 'EndGroup'){ //if prev item is a Group item
									var j;
									var totalamt = 0; // this var will save the total of taxable items' amounts so that we can divide the discount amount proportionately
									for(j = prev - 1; AVA_LineType[j] != 'Group'; j--){ //it finds the start of the Group
										if(AVA_LineType[j] != 'Description' && AVA_LineType[j] != 'Discount' && AVA_LineType[j] != 'Markup' && AVA_LineType[j] != 'Group' && AVA_LineType[j] != 'EndGroup' && AVA_LineType[j] != 'Subtotal'){
											var lineAmt = (AVA_LineAmount[j] == null || (AVA_LineAmount[j] != null && AVA_LineAmount[j].length == 0)) ? 0 : AVA_LineAmount[j];
											totalamt += parseFloat(lineAmt);
											totallines++;
										}
									}
									
									var totalDiscount = 0, lines = 1;
									for(var m = j + 1; m != prev; m++){
										var discAmt = 0;
										if(AVA_LineType[m] != 'Description' && AVA_LineType[m] != 'Discount' && AVA_LineType[m] != 'Markup' && AVA_LineType[m] != 'Group' && AVA_LineType[m] != 'EndGroup' && AVA_LineType[m] != 'Subtotal'){
											var lineAmt = (AVA_LineAmount[m] == null || (AVA_LineAmount[m] != null && AVA_LineAmount[m].length == 0)) ? 0 : AVA_LineAmount[m];
											if(lines == totallines){
												discAmt = parseFloat(discountItem) + totalDiscount;
											}
											else{
												if(totalamt > 0){
													discAmt = (parseFloat(discountItem / totalamt.toFixed(2)) * parseFloat(lineAmt));
												}
											}
											
											AVA_LineAmount[m] = parseFloat(lineAmt) + parseFloat(discAmt);
											totalDiscount += (discAmt.toFixed(2) * -1);
											lines++;
										}
									}
								}
								
								if(AVA_LineType[prev] == 'Subtotal'){ //if prev item is a Subtotal
									var totalamt = 0;//to get total of all taxable items
									var groupFlag = 0;//to avoid those subtotal items which appear in a group item
									var subtotalFlag = 0;
									
									for(var j = prev - 1; j >= 0; j--){ //finds the last subtotal line, so that the discount can be divided among the taxable items which appears between these two subtotals
										if(AVA_LineType[j] == 'EndGroup'){
											 groupFlag = 1;
										}
										
										if(AVA_LineType[j] == 'Group'){
											 groupFlag = 0;
										}
										
										if(AVA_LineType[j] == 'Subtotal' && groupFlag == 0){
											if(subtotalFlag == 0){
												for(var n = j - 1; n >= 0; n--){
													if(AVA_LineType[n] == 'EndGroup'){
														 groupFlag = 1;
													}
													
													if(AVA_LineType[n] == 'Group'){
														 groupFlag = 0;
													}
													
													if(AVA_LineType[n] != 'Description' && AVA_LineType[n] != 'Discount' && AVA_LineType[n] != 'Markup' && AVA_LineType[n] != 'Group' && AVA_LineType[n] != 'EndGroup' && AVA_LineType[n] != 'Subtotal'){
														var lineAmt = (AVA_LineAmount[n] == null || (AVA_LineAmount[n] != null && AVA_LineAmount[n].length == 0)) ? 0 : AVA_LineAmount[n];
														totalamt += parseFloat(lineAmt);
														totallines++;
													}
													else if(AVA_LineType[n] == 'Subtotal' && groupFlag == 0){ //for scenario where subtotal is not inside a group item
														break;
													}
												}
												
												var totalDiscount = 0, lines = 1;
												for(n = n + 1 ; n != j; n++){
													var discAmt = 0;
													if(AVA_LineType[n] != 'Description' && AVA_LineType[n] != 'Discount' && AVA_LineType[n] != 'Markup' && AVA_LineType[n] != 'Group' && AVA_LineType[n] != 'EndGroup' && AVA_LineType[n] != 'Subtotal'){
														if(lines == totallines){
															discAmt = parseFloat(discountItem) + totalDiscount;
														}
														else{
															if(totalamt > 0){
																discAmt = (parseFloat(discountItem / totalamt.toFixed(2)) * parseFloat(AVA_LineAmount[n]));
															}
														}
														
														AVA_LineAmount[n] = parseFloat(AVA_LineAmount[n]) + parseFloat(discAmt);
														totalDiscount += (discAmt.toFixed(2) * -1);
														lines++;
													}
												}
												break;
											}
											else{
												break;
											}
										}
										else{
											if(AVA_LineType[j] != 'Description' && AVA_LineType[j] != 'Discount' && AVA_LineType[j] != 'Markup' && AVA_LineType[j] != 'Group' && AVA_LineType[j] != 'EndGroup' && AVA_LineType[j] != 'Subtotal'){
												subtotalFlag = 1
												totalamt += parseFloat(AVA_LineAmount[j]);
												totallines++;
											}
										}
									}
									
									var totalDiscount = 0, lines = 1;
									for(j = j + 1; j != prev; j++){ //to add part of discount to all taxable items which appears between two subtotal items(this doesn't include subtotal which appear in a group item)
										var discAmt = 0;
										if(AVA_LineType[j] != 'Description' && AVA_LineType[j] != 'Discount' && AVA_LineType[j] != 'Markup' && AVA_LineType[j] != 'Group' && AVA_LineType[j] != 'EndGroup' && AVA_LineType[j] != 'Subtotal'){
											if(lines == totallines){
												discAmt = parseFloat(discountItem) + totalDiscount;
											}
											else{
												if(totalamt > 0){
													discAmt = (parseFloat(discountItem / totalamt.toFixed(2)) * parseFloat(AVA_LineAmount[j]));
												}
											}
											
											AVA_LineAmount[j] = parseFloat(AVA_LineAmount[j]) + parseFloat(discAmt);
											totalDiscount += (discAmt.toFixed(2) * -1);
											lines++;
										}
									}
								}
								
								if((AVA_LineType[prev] == 'Subtotal' || AVA_LineType[prev] == 'EndGroup') && totallines == 0){
									AVA_LineQty[i] = 1;
									AVA_LineAmount[i] = discountItem;
									AVA_TaxLines[i] = 'T';
								}
								
								if(AVA_LineType[prev] == 'InvtPart' || AVA_LineType[prev] == 'Kit' || AVA_LineType[prev] == 'Assembly' || AVA_LineType[prev] == 'NonInvtPart' || AVA_LineType[prev] == 'OthCharge' || AVA_LineType[prev] == 'Service' || AVA_LineType[prev] == 'GiftCert' || AVA_LineType[prev] == 'DwnLdItem'){ //if prev item is an Inventory
									var invItem = AVA_LineAmount[prev]; //this fetches the preceeding InvItem's amount
									AVA_LineAmount[prev] = parseFloat(invItem) + parseFloat(discountItem); //as we wud hve set some value earlier for the Inv item, that's why when Discount is identified below it, the Inv item's amount is exchanged with the discounted amt
								}
							}
						}
						break;
						
					case 'Description':
					case 'Subtotal':
						AVA_TaxLines[i] = 'F';
						break;
						
					case 'Group':
						var k;
						AVA_GroupEnd = 0;
						AVA_GroupBegin = i + 1; //will save the item line num of the first member of group
						for(k = AVA_GroupBegin; nRecord.getSublistValue('item', 'itemtype', k) != 'EndGroup' && nRecord.getSublistValue('item', 'item', k) != 0; k++){}
						AVA_GroupEnd = k;
						AVA_TaxLines[i] = 'F';
						AVA_Taxable[i]  = 'F';
						continue;
						
					case 'EndGroup':
						AVA_LineNames[i]  = 'EndGroup';
						AVA_LineType[i]   = 'EndGroup';
						AVA_LineAmount[i] = nRecord.getSublistValue('item', 'amount', i);
						AVA_TaxLines[i]   = 'F';
						AVA_Taxable[i]    = 'F';
						break;
						
					case 'Payment':
						prev_lineno = i;
						AVA_TaxLines[i] = 'T';
						AVA_Taxable[i] = 'F';
						break;
						
					default:
						prev_lineno = i;
						if(nRecord.getValue('nexus_country') == 'US' && configCache.AVA_EnableUseTax == true && nRecord.getSublistValue('item', 'item', i) == configCache.AVA_VendorTaxItem){
							AVA_TaxLines[i] = 'F';
						}
						else{
							AVA_TaxLines[i] = 'T';
						}
						
						//EndGroup Item from Webservice call
						if(nRecord.getSublistValue('item', 'item', i) == 0){
							AVA_LineNames[i]  = 'EndGroup';
							AVA_LineType[i]   = 'EndGroup';
							AVA_LineAmount[i] = nRecord.getSublistValue('item','amount',i);
							AVA_TaxLines[i]   = 'F';
							AVA_Taxable[i]    = 'F';
						}
						break;
				}
			}
			
			if(ExpenseItemFlag == 'T'){
				AVA_GetExpenseItems(nRecord); //to get items from Expense subtabs of a transaction
			}
			
			if(nRecord.getValue('nexus_country') == 'US' && configCache.AVA_EnableUseTax == true && TaxItemCnt == 1 && AVA_TaxLines.length == 1){
				AVA_ErrorCode = 37;
				return 0;
			}
			
			return 1;
		}
		
		function AVA_GetExpenseItems(nRecord){
			var line = nRecord.getLineCount('item');
			AVA_ExpenseCategoriesTaxCodes = new Array();
			
			if(runtime.isFeatureInEffect('EXPREPORTS') == true && runtime.getCurrentUser().getPermission('LIST_CATEGORY') != runtime.Permission.NONE){ // Check if 'Expense Report' Feature is enabled
				var searchRecord = search.create({
					type: search.Type.EXPENSE_CATEGORY,
					filters: ['isinactive', 'is', 'F'],
					columns: ['name', 'custrecord_ava_taxcodes']
				});
				var searchResult = searchRecord.run();
				
				var i = 0;
				searchResult.each(function(result){ // fetching all expense item tax code and storing in array
					AVA_ExpenseCategoriesTaxCodes[i] = new Array();
					AVA_ExpenseCategoriesTaxCodes[i][0] = result.id;
					AVA_ExpenseCategoriesTaxCodes[i][1] = result.getValue('name');
					AVA_ExpenseCategoriesTaxCodes[i][2] = result.getValue('custrecord_ava_taxcodes');
					
					if(i == 3999){
						return false;
					}
					else{
						i++;
						return true;
					}
				});
			}
			
			for( ; AVA_NS_Lines != null && line < AVA_NS_Lines.length; line++){
				var lineName,  lineNameFlag = 0;
				
				if(nRecord.getSublistValue(AVA_NS_Lines[line][0], 'category', AVA_NS_Lines[line][1]) != null && nRecord.getSublistValue(AVA_NS_Lines[line][0], 'category', AVA_NS_Lines[line][1]).length > 0){
					for(var i = 0; AVA_ExpenseCategoriesTaxCodes != null && i < AVA_ExpenseCategoriesTaxCodes.length; i++){
						if(nRecord.getSublistValue(AVA_NS_Lines[line][0], 'category', AVA_NS_Lines[line][1]) == AVA_ExpenseCategoriesTaxCodes[i][0]){
							lineName = AVA_ExpenseCategoriesTaxCodes[i][1];
							break;
						}
					}
					
					llineNameFlag = 1;
				}
				
				if(lineNameFlag == 0){
					ExpenseAccountName = search.lookupFields({
						type: search.Type.ACCOUNT,
						id: nRecord.getSublistValue(AVA_NS_Lines[line][0], 'account', AVA_NS_Lines[line][1]),
						columns: 'name'
					});
					ExpenseAccountName = ExpenseAccountName.name;
				}
				
				AVA_LineNames[line] = (lineNameFlag == 1) ? lineName : ExpenseAccountName;
				AVA_LineQty[line] = 1;
				AVA_LineAmount[line] = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'amount', AVA_NS_Lines[line][1]);
				AVA_TaxLines[line] = 'T';
			}
		}
		
		function AVA_CalculateUseTax(nRecord, configCache, type){
			var rec, startTime;
			var multiplier = (nRecord.type == 'vendorbill') ? 1 : -1;
			
			AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', configCache.AVA_ServiceUrl);
			Transaction = new AvaTax.transaction();
			AVA_GetUseTaxBody(nRecord, configCache);
			var createoradjust = Transaction.createoradjust(nRecord.getValue('custpage_ava_details'));
			
			try{
				AVA_ConnectorEndTime = new Date();
				startTime = new Date();
				var response = https.post({
					body: createoradjust.data,
					url: createoradjust.url,
					headers: createoradjust.headers
				});
				var endTime = new Date();
				
				AVA_ConnectorStartTime = new Date();
				AVA_LatencyTime = endTime.getTime() - startTime.getTime();
				
				var getTaxResult = JSON.parse(response.body);
				
				if(getTaxResult.error == null){
					AVA_ResultCode = 'Success';
					
					AVA_DocDate        = getTaxResult.date;
					AVA_DocStatus      = getTaxResult.status;
					AVA_TaxDate        = getTaxResult.taxDate;
					AVA_TotalAmount    = (getTaxResult.totalAmount * multiplier);
					AVA_TotalTax       = (getTaxResult.totalTax * multiplier);
					AVA_TotalDiscount  = getTaxResult.totalDiscount;
					AVA_TotalExemption = getTaxResult.totalExempt;
					AVA_TotalTaxable   = getTaxResult.totalTaxable;
					AVA_DocumentType   = getTaxResult.type;
					
					if(nRecord.getValue('custpage_ava_taxcodestatus') == 0){
						var invoiceMsg = '';
						var responseLineArray = getTaxResult.lines;
						
						for(var i = 0; AVA_TaxRequestLines != null && i < AVA_TaxRequestLines.length; i++){
							//for vatcode
							if(responseLineArray[i].vatCode != null && responseLineArray[i].vatCode.length > 0){
								nRecord.selectLine({
									sublistId: AVA_TaxRequestLines[i][0],
									line: AVA_TaxRequestLines[i][2]
								});
								nRecord.setCurrentSublistValue({
									sublistId: AVA_TaxRequestLines[i][0],
									fieldId: 'custcol_ava_vatcode',
									value: responseLineArray[i].vatCode,
									ignoreFieldChange: true
								});
								nRecord.commitLine({
									sublistId: AVA_TaxRequestLines[i][0]
								});
							}
						}
						
						var messages = getTaxResult.messages;
						
						for(var i = 0; messages != null && i < messages.length; i++){
							if(messages[i].summary == 'Invoice  Messages for the transaction'){
								var messageInfo = JSON.parse(messages[i].details);
								var masterList = messageInfo.InvoiceMessageMasterList;
								
								for(var j in masterList){
									if(j != 0){
										invoiceMsg += masterList[j].Message + '.\n';
									}
								}
								
								break;
							}
						}
						
						nRecord.setValue({
							fieldId: 'custbody_ava_invoicemessage',
							value: invoiceMsg,
							ignoreFieldChange: true
						});
						
						if(nRecord.getValue('nexus_country') == 'US'){
							if(nRecord.getValue('custpage_ava_context') == 'USERINTERFACE'){
								if(TaxItemCnt == 1){
									if(parseFloat(AVA_TotalTax) == parseFloat(VendorChargedTax)){
										alert('Vendor has charged you correct tax.');
										
										nRecord.setValue({
											fieldId: 'custpage_ava_avatax',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedtaxamount',
											value: 0,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedusetax',
											value: false,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_document',
											value: false,
											ignoreFieldChange: true
										});
										
										var accruedUseTax = nRecord.getField({
											fieldId: 'custpage_ava_accruedusetax'
										});
										accruedUseTax.isDisabled = true;
									}
									else if(parseFloat(AVA_TotalTax) > parseFloat(VendorChargedTax)){
										var accruedTax = parseFloat(AVA_TotalTax) - parseFloat(VendorChargedTax);
										var msg = 'AvaTax calculated use tax:\t$' + AVA_TotalTax + '\n\n';
										msg += 'Vendor charged tax:\t\t$' + VendorChargedTax + '\n\n';
										
										if(nRecord.type == 'vendorbill'){
											msg += 'Do you want to accrue:\t\t$' + accruedTax + ' as Self-Assessed Use Tax?\n\n';
											msg += 'Note: It will not increase your vendor payment liability. Accrual amount will be credited to use tax payable account.\n\n';
										}
										else{
											msg += 'Do you want to post:\t\t$' + accruedTax + ' as use tax accrual reversal?\n\n';
											msg += 'Note: Accrual amount will be reversed from use tax payable account and AvaTax.\n\n';
										}
										
										msg += 'Click "OK" if you want to accrue the use tax, click "Cancel", if you don\'t want to do it now.';
										
										if(confirm(msg)){
											nRecord.setValue({
												fieldId: 'custpage_ava_accruedusetax',
												value: true,
												ignoreFieldChange: true
											});
											nRecord.setValue({
												fieldId: 'custpage_ava_document',
												value: true,
												ignoreFieldChange: true
											});
										}
										else{
											nRecord.setValue({
												fieldId: 'custpage_ava_accruedusetax',
												value: false,
												ignoreFieldChange: true
											});
											nRecord.setValue({
												fieldId: 'custpage_ava_document',
												value: false,
												ignoreFieldChange: true
											});
										}
										
										nRecord.setValue({
											fieldId: 'custpage_ava_avatax',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedtaxamount',
											value: (accruedTax.toFixed(2) * multiplier),
											ignoreFieldChange: true
										});
										
										var accruedUseTax = nRecord.getField({
											fieldId: 'custpage_ava_accruedusetax'
										});
										accruedUseTax.isDisabled = false;
									}
									else{
										var msg = '\t\t\tVendor overcharged\n\n';
										msg += 'AvaTax calculates: $' + AVA_TotalTax + ' in Taxes\n';
										msg += 'Whereas your Vendor has charged you: $' + parseFloat(VendorChargedTax) + ' in Taxes\n\n';
										alert(msg);
										
										nRecord.setValue({
											fieldId: 'custpage_ava_avatax',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedtaxamount',
											value: 0,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedusetax',
											value: false,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_document',
											value: false,
											ignoreFieldChange: true
										});
										
										var accruedUseTax = nRecord.getField({
											fieldId: 'custpage_ava_accruedusetax'
										});
										accruedUseTax.isDisabled = true;
									}
								}
								else{
									if(parseFloat(AVA_TotalTax) == parseFloat(VendorChargedTax)){
										alert('Vendor has charged you correct tax.');
										
										nRecord.setValue({
											fieldId: 'custpage_ava_avatax',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedtaxamount',
											value: VendorChargedTax,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedusetax',
											value: false,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_document',
											value: false,
											ignoreFieldChange: true
										});
										
										var accruedUseTax = nRecord.getField({
											fieldId: 'custpage_ava_accruedusetax'
										});
										accruedUseTax.isDisabled = true;
									}
									else{
										var msg = 'AvaTax calculated use tax:\t$' + AVA_TotalTax + '\n\n';
										msg += 'Vendor charged tax:\t\t$0.00\n\n';
										
										if(nRecord.type == 'vendorbill'){
											msg += 'Do you want to accrue:\t\t$' + AVA_TotalTax + ' as Self-Assessed Use Tax?\n\n';
											msg += 'Note: It will not increase your vendor payment liability. Accrual amount will be credited to use tax payable account.\n\n';
										}
										else{
											msg += 'Do you want to post:\t\t$' + AVA_TotalTax + ' as use tax accrual reversal?\n\n';
											msg += 'Note: Accrual amount will be reversed from use tax payable account and AvaTax.\n\n';
										}
										
										msg += 'Click "OK" if you want to accrue the use tax, click "Cancel", if you don\'t want to do it now.';
										
										if(confirm(msg)){
											nRecord.setValue({
												fieldId: 'custpage_ava_accruedusetax',
												value: true,
												ignoreFieldChange: true
											});
											nRecord.setValue({
												fieldId: 'custpage_ava_document',
												value: true,
												ignoreFieldChange: true
											});
										}
										else{
											nRecord.setValue({
												fieldId: 'custpage_ava_accruedusetax',
												value: false,
												ignoreFieldChange: true
											});
											nRecord.setValue({
												fieldId: 'custpage_ava_document',
												value: false,
												ignoreFieldChange: true
											});
										}
										
										nRecord.setValue({
											fieldId: 'custpage_ava_avatax',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedtaxamount',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
										
										var accruedUseTax = nRecord.getField({
											fieldId: 'custpage_ava_accruedusetax'
										});
										accruedUseTax.isDisabled = false;
									}
								}
							}
							else{
								if(TaxItemCnt == 1){
									if(parseFloat(AVA_TotalTax) > parseFloat(VendorChargedTax)){
										var accruedTax = parseFloat(AVA_TotalTax) - parseFloat(VendorChargedTax);
										
										if(configCache.AVA_AutoAssessImportBill == true){
											nRecord.setValue({
												fieldId: 'custpage_ava_accruedusetax',
												value: true,
												ignoreFieldChange: true
											});
											nRecord.setValue({
												fieldId: 'custpage_ava_document',
												value: true,
												ignoreFieldChange: true
											});
										}
										else{
											nRecord.setValue({
												fieldId: 'custpage_ava_accruedusetax',
												value: false,
												ignoreFieldChange: true
											});
											nRecord.setValue({
												fieldId: 'custpage_ava_document',
												value: false,
												ignoreFieldChange: true
											});
										}
										
										nRecord.setValue({
											fieldId: 'custpage_ava_avatax',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedtaxamount',
											value: (accruedTax.toFixed(2) * multiplier),
											ignoreFieldChange: true
										});
									}
									else{
										nRecord.setValue({
											fieldId: 'custpage_ava_avatax',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedtaxamount',
											value: 0,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedusetax',
											value: false,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_document',
											value: false,
											ignoreFieldChange: true
										});
									}
								}
								else{
									if(parseFloat(AVA_TotalTax) == parseFloat(VendorChargedTax)){
										nRecord.setValue({
											fieldId: 'custpage_ava_avatax',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedtaxamount',
											value: VendorChargedTax,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedusetax',
											value: false,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_document',
											value: false,
											ignoreFieldChange: true
										});
									}
									else{
										if(configCache.AVA_AutoAssessImportBill == true){
											nRecord.setValue({
												fieldId: 'custpage_ava_accruedusetax',
												value: true,
												ignoreFieldChange: true
											});
											nRecord.setValue({
												fieldId: 'custpage_ava_document',
												value: true,
												ignoreFieldChange: true
											});
										}
										else{
											nRecord.setValue({
												fieldId: 'custpage_ava_accruedusetax',
												value: false,
												ignoreFieldChange: true
											});
											nRecord.setValue({
												fieldId: 'custpage_ava_document',
												value: false,
												ignoreFieldChange: true
											});
										}
										
										nRecord.setValue({
											fieldId: 'custpage_ava_avatax',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_accruedtaxamount',
											value: (AVA_TotalTax * multiplier),
											ignoreFieldChange: true
										});
									}
								}
							}
						}
						else{
							var msg = '';
							
							if(nRecord.getValue('tax2total') != null){
								AVA_GSTTotal = AVA_PSTTotal = 0;
								var taxLines = getTaxResult.lines;
								
								if(parseFloat(AVA_TotalTax) == (parseFloat(nRecord.getValue('taxtotal')) + parseFloat(nRecord.getValue('tax2total')))){
									alert('Tax charged by vendor is correct!');
								}
								else{
									for(var i = 0; taxLines != null && i < taxLines.length; i++){
										var taxLinesDetails = taxLines[i].details;
										
										for(var j = 0; taxLinesDetails != null && j < taxLinesDetails.length; j++){
											var taxName = taxLinesDetails[j].taxName;
											if(taxName.search('GST') != -1){
												AVA_GSTTotal += parseFloat(taxLinesDetails[j].tax);
											}
											else{
												if(taxName.search('HST') != -1){
													AVA_GSTTotal += parseFloat(taxLinesDetails[j].tax);
												}
												else{
													AVA_PSTTotal += parseFloat(taxLinesDetails[j].tax);
												}
											}
										}
									}
									
									msg += 'AvaTax calculated GST/HST:\t$' + (AVA_GSTTotal * multiplier).toFixed(2) + '\n\n';
									msg += 'AvaTax calculated PST:\t\t$' + (AVA_PSTTotal * multiplier).toFixed(2) + '\n\n';
									msg += 'Vendor charged GST/HST:\t$' + nRecord.getValue('taxtotal') + '\n\n';
									msg += 'Vendor charged PST:\t\t$' + nRecord.getValue('tax2total') + '\n\n';
									msg += 'AvaTax recommends this invoice should be corrected.\n\n';
									alert(msg);
								}
							}
							else if(AVA_DocumentType == 'ReverseChargeOrder'){
								var summary = getTaxResult.summary;
								
								for(var i = 0; summary != null && i < summary.length; i++){
									var taxType = summary[i].taxType;
									if(taxType.search('Input') != -1){
										InputTax = parseFloat(summary[i].tax);
									}
									else if(taxType.search('Output') != -1){
										OutputTax = parseFloat(summary[i].tax);
									}
								}
								
								if(parseFloat(nRecord.getValue('taxtotal')) == 0){
									msg += 'This supply is subjected to Reverse Charge.\n\nPlease note that your vendor zero-rated the invoice.\n\n';
									msg += 'AvaTax calculated Input VAT:\t\t' + (InputTax * multiplier).toFixed(2) + '\n\n';
									msg += 'AvaTax calculated Output VAT:\t' + (OutputTax * multiplier).toFixed(2) + '\n\n';
									msg += 'AvaTax recommends you to book the Input VAT and Output VAT in appropriate General Ledgers.\n\n';
								}
								else{
									msg += 'This supply is subjected to Reverse Charge.\n\nPlease note that your vendor did NOT zero-rate the invoice.\n\n';
									msg += 'AvaTax calculated Input VAT:\t\t' + (InputTax * multiplier).toFixed(2) + '\n\n';
									msg += 'AvaTax calculated Output VAT:\t' + (OutputTax * multiplier).toFixed(2) + '\n\n';
									msg += 'AvaTax recommends this invoice should be corrected.\n\n';
								}
								
								alert(msg);
								
								nRecord.setValue({
									fieldId: 'custpage_ava_taxoverrideflag',
									value: false,
									ignoreFieldChange: true
								});
								nRecord.setValue({
									fieldId: 'custpage_ava_document',
									value: false,
									ignoreFieldChange: true
								});
							}
							else{
								if(parseFloat(AVA_TotalTax) == parseFloat(nRecord.getValue('taxtotal'))){
									alert('VAT charged by your vendor is correct!');
									
									nRecord.setValue({
										fieldId: 'custpage_ava_taxoverrideflag',
										value: true,
										ignoreFieldChange: true
									});
									nRecord.setValue({
										fieldId: 'custpage_ava_document',
										value: true,
										ignoreFieldChange: true
									});
								}
								else if(parseFloat(AVA_TotalTax) > parseFloat(nRecord.getValue('taxtotal'))){
									msg += 'AvaTax calculated VAT: \t' + (AVA_TotalTax).toFixed(2) + '\n\n';
									msg += 'Vendor charged VAT:\t' + nRecord.getValue('taxtotal') + '\n\n';
									msg += 'AvaTax recommends this invoice should be corrected.';
									alert(msg);
									
									nRecord.setValue({
										fieldId: 'custpage_ava_taxoverrideflag',
										value: true,
										ignoreFieldChange: true
									});
									nRecord.setValue({
										fieldId: 'custpage_ava_document',
										value: true,
										ignoreFieldChange: true
									});
								}
								else{
									msg += 'AvaTax calculated VAT: \t' + (AVA_TotalTax).toFixed(2) + '\n\n';
									msg += 'Vendor charged VAT:\t' + nRecord.getValue('taxtotal') + '\n\n';
									msg += 'AvaTax recommends this invoice should be corrected. Click "OK" if you want to post this transaction to AvaTax, click "Cancel", if you don\'t want to post this transaction to AvaTax.';
									
									if(confirm(msg)){
										nRecord.setValue({
											fieldId: 'custpage_ava_taxoverrideflag',
											value: true,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_document',
											value: true,
											ignoreFieldChange: true
										});
									}
									else{
										nRecord.setValue({
											fieldId: 'custpage_ava_taxoverrideflag',
											value: false,
											ignoreFieldChange: true
										});
										nRecord.setValue({
											fieldId: 'custpage_ava_document',
											value: false,
											ignoreFieldChange: true
										});
									}
								}
							}
						}
						
						taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', response, startTime);
					}
					else{
						if(AVA_DocumentType == 'ReverseChargeInvoice'){
							var summary = getTaxResult.summary;
							
							for(var i = 0; summary != null && i < summary.length; i++){
								var taxType = summary[i].taxType;
								
								if(taxType.search('Input') != -1){
									InputTax = parseFloat(summary[i].tax);
								}
								else if(taxType.search('Output') != -1){
									OutputTax = parseFloat(summary[i].tax);
								}
							}
						}
						else if(nRecord.getValue('nexus_country') == 'US'){
							ResponseLineArray = getTaxResult.lines;
						}
						
						if(AVA_FoundVatCountry == 1){
							taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', response, startTime);
						}
					}
					
					if(nRecord.getValue('custpage_ava_taxcodestatus') == 1){
						var journalEntryRecord;
						
						if(type == 'edit'){
							if(nRecord.getValue('custpage_ava_headerid') != null && nRecord.getValue('custpage_ava_headerid').length > 0){
								rec = record.load({
									type: 'customrecord_avausetaxheaderdetails',
									id: nRecord.getValue('custpage_ava_headerid')
								});
								
								if(rec.getValue('custrecord_ava_journalentryid') != null && rec.getValue('custrecord_ava_journalentryid') > 0){
									var searchRecord = search.create({
										type: search.Type.JOURNAL_ENTRY,
										filters: ['internalid', 'anyof', rec.getValue('custrecord_ava_journalentryid')]
									});
									var searchResult = searchRecord.run();
									searchResult = searchResult.getRange({
										start: 0,
										end: 5
									});
									
									if(searchResult != null && searchResult.length > 0){
										record.delete({
											type: record.Type.JOURNAL_ENTRY,
											id: parseInt(nRecord.getValue('custpage_ava_journalentryid'))
										});
									}
								}
								
								if(nRecord.getValue('nexus_country') == 'US'){
									journalEntryRecord = record.create({
										type: record.Type.JOURNAL_ENTRY
									});
								}
							}
							else{
								rec = record.create({
									type: 'customrecord_avausetaxheaderdetails'
								});
								
								if(nRecord.getValue('nexus_country') == 'US'){
									journalEntryRecord = record.create({
										type: record.Type.JOURNAL_ENTRY
									});
								}
							}
							
							if(nRecord.getValue('nexus_country') == 'US'){
								AVA_UpdateGLAccounts(nRecord, configCache, journalEntryRecord);
							}
							
							AVA_UpdateUseTaxHeaderRecord(nRecord, configCache, rec);
						}
						else{
							rec = record.create({
								type: 'customrecord_avausetaxheaderdetails'
							});
							
							if(nRecord.getValue('nexus_country') == 'US'){
								journalEntryRecord = record.create({
									type: record.Type.JOURNAL_ENTRY
								});
								
								AVA_UpdateGLAccounts(nRecord, configCache, journalEntryRecord);
							}
							
							AVA_UpdateUseTaxHeaderRecord(nRecord, configCache, rec);
						}
					}
					
					return true;
				}
				else{
					var severity, message;
					var errorDetails = getTaxResult.error.details;
					
					for(var i = 0; errorDetails != null && i < errorDetails.length; i++){
						message = errorDetails[i].message;
						severity = errorDetails[i].severity;
						break;
					}
					
					if(severity == null || severity == '' || severity == 'Error'){
						nRecord.setValue({
							fieldId: 'custpage_ava_document',
							value: false,
							ignoreFieldChange: true
						});
						
						if(nRecord.getValue('custpage_ava_taxcodestatus') == 0 && (configCache.AVA_ShowMessages == 2 || configCache.AVA_ShowMessages == 3)){
							AVA_ErrorCode = message;
							alert("This Document has used AvaTax Services. " + message);
						}
						else{
							AVA_ErrorCode = message;
							log.debug({
								title: 'Error Message',
								details: message
							});
							log.debug({
								title: 'Error',
								details: response.code
							});
						}
						
						return false;
					}
					else if(severity == 'Exception'){
						nRecord.setValue({
							fieldId: 'custpage_ava_document',
							value: false,
							ignoreFieldChange: true
						});
						
						if(configCache.AVA_EnableLogEntries == '1' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
							var avaDocType = taxLibrary.AVA_RecordType(nRecord.type);
							ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + nRecord.id + '~~' + '' + '~~' + '' + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Debug' + '~~' + 'Error' + '~~' + nRecord.type + '~~' + 'AVA_CalculateUseTax' + '~~' + 'GetTax Exeception - ' + message + '~~' + '' + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
						}
						
						if(nRecord.getValue('custpage_ava_taxcodestatus') == 0 && (configCache.AVA_ShowMessages == 2 || configCache.AVA_ShowMessages == 3)){
							AVA_ErrorCode = message;
							alert("This Document has used AvaTax Services. " + message);
						}
						else{
							AVA_ErrorCode = message;
							log.debug({
								title: 'Exception',
								details: message
							});
							log.debug({
								title: 'Exception',
								details: response.code
							});
						}
						
						return false;
					}
				}
			}
			catch(err){
				log.debug('AVA_CalculateUseTax error stack', err.stack);
				if(configCache.AVA_EnableLogEntries == '1' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK' && err.code != 'GetTaxError' && err.code != 'InvalidAddress'){
					var avaDocType = taxLibrary.AVA_RecordType(nRecord.type);
					ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + nRecord.id + '~~' + '' + '~~' + '' + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Debug' + '~~' + 'Error' + '~~' + nRecord.type + '~~' + 'AVA_CalculateUseTax' + '~~' + err.message + '~~' + err.code + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
				}
				
				nRecord.setValue({
					fieldId: 'custpage_ava_document',
					value: false,
					ignoreFieldChange: true
				});
				
				if(err.code == 'GetTaxError' || err.code == 'InvalidAddress'){
					if(nRecord.getValue('custpage_ava_taxcodestatus') == 0 && (configCache.AVA_ShowMessages == 2 || configCache.AVA_ShowMessages == 3)){
						AVA_ErrorCode = err.message;
						alert("This Document has used AvaTax Services. " + err.message);
					}
					else{
						AVA_ErrorCode = err.message;
						log.debug({
							title: 'Error Message',
							details: err.message
						});
					}
				}
				else{
					if(nRecord.getValue('custpage_ava_taxcodestatus') == 0 && (configCache.AVA_ShowMessages == 2 || configCache.AVA_ShowMessages == 3)){
						alert("Please contact the administrator. " + err.message);
						AVA_ErrorCode = 'Please contact the Administrator. ' + err.message;
					}
					else{
						log.debug({
							title: 'Please contact the administrator'
						});
						
						try{
							if(err.code == 'USER_ERROR'){
								if(rec != null){
									AVA_UpdateUseTaxHeaderRecord(nRecord, configCache, rec);
								}
								
								AVA_ErrorCode = 'General Ledger entry error. ' + err.message;
							}
							else{
								AVA_ErrorCode = 'Please contact the Administrator. ' + err.message;
							}
							
							log.debug({
								title: 'Try/Catch Error',
								details: err.message
							});
						}
						catch(e){
							AVA_ErrorCode = 'Please contact the Administrator';
						}
					}
				}
				
				return false;
			}
			
			taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', response, startTime);
			return true;
		}
		
		function AVA_GetUseTaxBody(nRecord, configCache){
			var multiplier = (nRecord.type == 'vendorbill' || nRecord.type == 'purchaseorder') ? 1 : -1;
			
			var avaDate = ava_library.mainFunction('AVA_ConvertDate', nRecord.getValue('trandate'));
			Transaction.companyCode = (configCache.AVA_DefCompanyCode != null && configCache.AVA_DefCompanyCode.length > 0) ? configCache.AVA_DefCompanyCode : runtime.accountId;
			
			AVA_TempDocCode = Date();
			
			if(AVA_FoundVatCountry == 1 && nRecord.getValue('custpage_ava_taxcodestatus') == 1){
				Transaction.type = 'PurchaseInvoice';
				Transaction.code = nRecord.id;
			}
			else{
				Transaction.type = 'PurchaseOrder';
				Transaction.code = (AVA_TempDocCode != null) ? AVA_TempDocCode.toString().substring(0, 50) : '';
			}
			
			if(nRecord.getValue('nexus_country') == 'US'){
				switch(configCache.AVA_TaxAccrualDate){ // Send DocumentDate as per option selected on AvaTax Configuration.
					case '0':
						Transaction.date = avaDate;
						break;
						
					case '1':
						if(nRecord.getValue('duedate') != null && nRecord.getValue('duedate').toString().length > 0){
							avaDate = ava_library.mainFunction('AVA_ConvertDate', nRecord.getValue('duedate'));
							Transaction.date = avaDate;
						}
						else{
							Transaction.date = avaDate;
						}
						break;
						
					case '2':
						if(runtime.isFeatureInEffect('ACCOUNTINGPERIODS') == true && nRecord.getValue('postingperiod') != null && nRecord.getValue('postingperiod').length > 0){
							var postDate = nRecord.getValue('custbody_ava_postingperiodname');
							if(postDate != null && postDate.length > 0){
								avaDate = postDate.substring(4, postDate.length) + '-' + ava_library.mainFunction('AVA_GetMonthName', postDate.substring(0, 3)) + '-01';
								Transaction.date = avaDate;
							}
							else{
								Transaction.date = avaDate;
							}
						}
						else{
							Transaction.date = avaDate;
						}
						break;
						
					default :
						Transaction.date = avaDate;
						break;
				}
			}
			else{
				Transaction.date = avaDate;
			}
					
			switch(configCache.AVA_VendorCode){
				case '0':
					var CustCode = VendorValues[5];
					Transaction.customerCode = ((CustCode != null && CustCode.length > 0) ? CustCode.substring(0, 50) : '');
					break;
					
				case '1':
					var CustCode = (VendorValues[0] == 'true') ? (VendorValues[1] + ((VendorValues[2] != null && VendorValues[2].length > 0) ? ( ' ' + VendorValues[2]) : ' ') + ((VendorValues[3] != null && VendorValues[3].length > 0) ? ( ' ' + VendorValues[3]) : '')) : (VendorValues[4]);
					Transaction.customerCode = ((CustCode != null && CustCode.length > 0) ? CustCode.substring(0,50) : '');
					break;
					
				case '2':
					Transaction.customerCode = nRecord.getValue('entity');
					break;
					
				default :
					break;
			}
					
			Transaction.discount = 0;
			
			if(nRecord.getValue('nexus_country') == 'US' && nRecord.getValue('location') != null && nRecord.getValue('location').length > 0){
				var location = taxLibrary.AVA_GetAddresses(nRecord, configCache, nRecord.getValue('location'), 2);
				Transaction.reportingLocationCode = location[0];
			}
			
			AVA_UseTaxGetLines(nRecord, configCache);
			Transaction.debugLevel = 'Diagnostic';
			
			if(AVA_FoundVatCountry == 1 && nRecord.getValue('custpage_ava_taxcodestatus') == 1){
				Transaction.commit = 1;
			}
			else{
				Transaction.commit = 0;
			}
			
			if(nRecord.getValue('currencysymbol') != null && nRecord.getValue('currencysymbol').length > 0){
				Transaction.currencyCode = nRecord.getValue('currencysymbol');
				Transaction.exchangeRate = nRecord.getValue('exchangerate');
				Transaction.exchangeRateEffectiveDate = ava_library.mainFunction('AVA_ConvertDate', nRecord.getValue('trandate'));
			}
			
			if(nRecord.getValue('custpage_ava_taxcodestatus') == 1){
				if(nRecord.getValue('nexus_country') == 'US' || (nRecord.getValue('custpage_ava_taxoverrideflag') == true || nRecord.getValue('custpage_ava_taxoverrideflag') == 'T')){
					Transaction.taxOverride.type = 'TaxAmount';
					if(nRecord.getValue('custpage_ava_taxoverrideflag') == true || nRecord.getValue('custpage_ava_taxoverrideflag') == 'T'){
						Transaction.taxOverride.taxAmount = (nRecord.getValue('taxtotal') * multiplier);
						Transaction.taxOverride.reason = 'VAT Override';
					}
					else{
						Transaction.taxOverride.taxAmount = (VendorChargedTax * multiplier);
						Transaction.taxOverride.reason = 'UseTax Override';
					}
				}
			}
					
			if(VendorValues[6] != null && VendorValues[6].length > 0){
				Transaction.businessIdentificationNo = VendorValues[6].substring(0, 25);
			}
			
			//EVAT transport
			if(AVA_FoundVatCountry == 1 && AVA_TriangulationFlag == 0){
				var transportListValue = nRecord.getValue('custpage_ava_transportlist');
				var parameter = Transaction.getNewTransactionParameters();
				parameter.name = 'Transport';
				parameter.value = (transportListValue == 0) ? 'Seller' : ((transportListValue == 1) ? 'None' : ((transportListValue == 2) ? 'Seller' : ((transportListValue == 3) ? 'Buyer' : ((transportListValue == 4) ? 'ThirdPartyForSeller' : 'ThirdPartyForBuyer'))));
				
				Transaction.parameters.push(parameter);
			}
		}
		
		function AVA_UseTaxGetLines(nRecord, configCache){
			var debitAccountName;
			var soapLine = 1, locat;
			AVA_TaxRequestLines = new Array();
			var multiplier = (nRecord.type == 'vendorbill' || nRecord.type == 'purchaseorder') ? 1 : -1;
			
			if(nRecord.getValue('nexus_country') == 'US' && configCache.AVA_GlAccounts == 'glaccount'){
				debitAccountName = search.lookupFields({
					type: search.Type.ACCOUNT,
					id: configCache.AVA_UseTaxDebit,
					columns: 'name'
				});
				debitAccountName = debitAccountName.name
			}

			// CONNECT-33951: Usage limit issue resolved for existing Vendor
			var vatAddr = new Array();
			if(AVA_FoundVatCountry == 1){
				vatAddr = AVA_GetVatAddresses(nRecord);
			}
			
			for(var line = 0; AVA_TaxLines != null && line < AVA_TaxLines.length; line++){
				if(AVA_TaxLines[line] == 'T'){
					var taxLine = Transaction.getNewTransactionLine();
					taxLine.number = soapLine;
					
					if(nRecord.getValue('nexus_country') != 'US'){
						var shipToAddrFlag = 0;
						var address = new AvaTax.address();
						
						address.line1 	   = (VendorValues[7] != null) ? VendorValues[7].substring(0, 50) : '';
						address.line2 	   = (VendorValues[8] != null) ? VendorValues[8].substring(0, 100) : '';
						address.line3 	   = '';
						address.city 	   = (VendorValues[9] != null) ? VendorValues[9].substring(0, 50) : '';
						address.region 	   = (VendorValues[10] != null) ? VendorValues[10] : '';
						address.postalCode = (VendorValues[11] != null) ? VendorValues[11].substring(0, 11) : '';
						var returnCountryName = (VendorValues[12] != null) ? ava_library.mainFunction('AVA_CheckCountryName', VendorValues[12]) : '';
						address.country    = returnCountryName[1];
						
						taxLine.addresses.ShipFrom = address;
						
						if(nRecord.type == 'purchaseorder'){
							if((nRecord.getValue('shipaddresslist') != null && nRecord.getValue('shipaddresslist').length > 0) || (nRecord.getValue('shipaddress') != null && nRecord.getValue('shipaddress').length > 0)){
								var address = new AvaTax.address();
								
								if(nRecord.hasSubrecord('shippingaddress') == true){
									var shipAddr = nRecord.getSubrecord({
										fieldId: 'shippingaddress'
									});
									
									address.line1 = (shipAddr.getValue('addr1') != null) ? (shipAddr.getValue('addr1')).substring(0, 50) : '';
									address.line2 = (shipAddr.getValue('addr2') != null) ? (shipAddr.getValue('addr2')).substring(0, 100) : '';
									address.line3 = '';
									address.city = (shipAddr.getValue('city') != null) ? (shipAddr.getValue('city')).substring(0, 50) : '';
									address.region = (shipAddr.getValue('state') != null) ? shipAddr.getValue('state') : '';
									address.postalCode = (shipAddr.getValue('zip') != null) ? (shipAddr.getValue('zip')).substring(0, 11) : '';
									returnCountryName = ava_library.mainFunction('AVA_CheckCountryName', (shipAddr.getValue('country') != null) ? shipAddr.getValue('country') : '');
								}
								else{
									address.line1 = (nRecord.getValue('shipaddr1') != null) ? (nRecord.getValue('shipaddr1')).substring(0, 50) : '';
									address.line2 = (nRecord.getValue('shipaddr2') != null) ? (nRecord.getValue('shipaddr2')).substring(0, 100) : '';
									address.line3 = '';
									address.city = (nRecord.getValue('shipcity') != null) ? (nRecord.getValue('shipcity')).substring(0, 50) : '';
									address.region = (nRecord.getValue('shipstate') != null) ? nRecord.getValue('shipstate') : '';
									address.postalCode = (nRecord.getValue('shipzip') != null) ? (nRecord.getValue('shipzip')).substring(0, 11) : '';
									returnCountryName = ava_library.mainFunction('AVA_CheckCountryName', (nRecord.getValue('shipcountry') != null) ? nRecord.getValue('shipcountry') : '');
								}
								
								address.country = returnCountryName[1];
								taxLine.addresses.ShipTo = address;
								shipToAddrFlag = 1;
							}
							
							if(AVA_FoundVatCountry == 1 && (nRecord.getValue('custbody_ava_created_from_so') == null || nRecord.getValue('custbody_ava_created_from_so').length == 0)){
								if(nRecord.getValue('custpage_ava_lineloc') == false || nRecord.getValue('custpage_ava_lineloc') == 'F'){
									if(AVA_HeaderLocation != null && AVA_HeaderLocation.length > 0){
										taxLine.addresses.goodsPlaceOrServiceRendered = AVA_GetAddrDetails(configCache, 'headerlocation');
										shipToAddrFlag = 1;
									}
								}
								else{
									if(nRecord.getSublistValue(AVA_NS_Lines[line][0], 'location', AVA_NS_Lines[line][1]) != null){
										locat = (AVA_LocationArray[line] != null && AVA_LocationArray[line][0] != null && AVA_LocationArray[line][1] != null && AVA_LocationArray[line][1][0] != null && AVA_LocationArray[line][1][0].length > 0) ? AVA_LocationArray[line][1][0] : null;
										if(locat != null && locat.length > 0){
											taxLine.addresses.goodsPlaceOrServiceRendered = AVA_GetAddrDetails(configCache, 'linelocation', AVA_LocationArray[line][1]);
											shipToAddrFlag = 1;
										}
									}
								}
							}
						}
						
						if(shipToAddrFlag == 0){
							if(nRecord.getValue('custpage_ava_lineloc') == false || nRecord.getValue('custpage_ava_lineloc') == 'F'){
								if(AVA_HeaderLocation != null && AVA_HeaderLocation.length > 0){
									taxLine.addresses.ShipTo = AVA_GetAddrDetails(configCache, 'headerlocation');
									
									if(AVA_FoundVatCountry == 1){
										taxLine.addresses.goodsPlaceOrServiceRendered = AVA_GetAddrDetails(configCache, 'headerlocation');
									}
								}
								else{
									taxLine.addresses.ShipTo = AVA_GetAddrDetails(configCache, 'default');
								}
							}
							else{
								var lineLocation = 'F';
								if(nRecord.getSublistValue(AVA_NS_Lines[line][0], 'location', AVA_NS_Lines[line][1]) != null){
									locat = (AVA_LocationArray[line] != null && AVA_LocationArray[line][0] != null && AVA_LocationArray[line][1] != null && AVA_LocationArray[line][1][0] != null && AVA_LocationArray[line][1][0].length > 0) ? AVA_LocationArray[line][1][0] : null;
									if(locat != null && locat.length > 0){
										taxLine.addresses.ShipTo = AVA_GetAddrDetails(configCache, 'linelocation', AVA_LocationArray[line][1]);
										
										if(AVA_FoundVatCountry == 1){
											taxLine.addresses.goodsPlaceOrServiceRendered = AVA_GetAddrDetails(configCache, 'linelocation', AVA_LocationArray[line][1]);
										}
										
										lineLocation = 'T';
									}
								}
								
								if(lineLocation == 'F'){
									taxLine.addresses.ShipTo = AVA_GetAddrDetails(configCache, 'default');
								}
							}
						}
						
						//EVAT code 
						if(AVA_FoundVatCountry == 1){
							if(vatAddr != null && vatAddr.length > 0){
								if(vatAddr[0] == true){
									taxLine.addresses.pointOfOrderAcceptance = AVA_GetAddrDetails(configCache, 'pointoforderacceptanceaddress', vatAddr);
								}
								
								if(nRecord.getValue('custbody_ava_sendimportaddress') == true && vatAddr[7] == true){
									taxLine.addresses.import = AVA_GetAddrDetails(configCache, 'importaddress', vatAddr);
								}
							}
						}
					}
					else{
						if(nRecord.getValue('custpage_ava_lineloc') == false || nRecord.getValue('custpage_ava_lineloc') == 'F'){
							if(AVA_HeaderLocation != null && AVA_HeaderLocation.length > 0){
								taxLine.addresses.SingleLocation = AVA_GetAddrDetails(configCache, 'headerlocation');
							}
							else{
								taxLine.addresses.SingleLocation = AVA_GetAddrDetails(configCache, 'default');
							}
						}
						else{
							var lineLocation = 'F';
							if(nRecord.getSublistValue(AVA_NS_Lines[line][0], 'location', AVA_NS_Lines[line][1]) != null){
								locat = (AVA_LocationArray[line] != null && AVA_LocationArray[line][0] != null && AVA_LocationArray[line][1] != null && AVA_LocationArray[line][1][0] != null && AVA_LocationArray[line][1][0].length > 0) ? AVA_LocationArray[line][1][0] : null;
								if(locat != null && locat.length > 0){
									taxLine.addresses.SingleLocation = AVA_GetAddrDetails(configCache, 'linelocation', AVA_LocationArray[line][1]);
									lineLocation = 'T';
								}
							}
							
							if(lineLocation == 'F'){
								taxLine.addresses.SingleLocation = AVA_GetAddrDetails(configCache, 'default');
							}
						}
					}
					
					taxLine.itemCode = (AVA_LineNames[line] != null) ? AVA_LineNames[line].substring(0, 50) : '';
					
					AVA_TaxRequestLines[soapLine-1] = new Array();
					AVA_TaxRequestLines[soapLine-1][0] = AVA_NS_Lines[line][0]; // Tab name
					AVA_TaxRequestLines[soapLine-1][1] = (AVA_LineNames[line] != null) ? AVA_LineNames[line].substring(0, 50) : '';
					AVA_TaxRequestLines[soapLine-1][2] = AVA_NS_Lines[line][1]; // Line Number
					
					if(nRecord.getValue('custpage_ava_lineloc') == false || nRecord.getValue('custpage_ava_lineloc') == 'F'){
						AVA_TaxRequestLines[soapLine-1][3] = (nRecord.getValue('location') != null && nRecord.getValue('location').length > 0) ? nRecord.getValue('location') : '';
					}
					else{
						AVA_TaxRequestLines[soapLine-1][3] = (nRecord.getSublistValue(AVA_NS_Lines[line][0], 'location', AVA_NS_Lines[line][1]) != null && nRecord.getSublistValue(AVA_NS_Lines[line][0], 'location', AVA_NS_Lines[line][1]).length > 0) ? nRecord.getSublistValue(AVA_NS_Lines[line][0], 'location',	AVA_NS_Lines[line][1]) : ''; // Location
					}
					
					if(nRecord.getValue('custpage_ava_lineclass') == false || nRecord.getValue('custpage_ava_lineclass') == 'F'){
						AVA_TaxRequestLines[soapLine-1][4] = (nRecord.getValue('class') != null && nRecord.getValue('class').length > 0) ? nRecord.getValue('class') : '';
					}
					else{
						AVA_TaxRequestLines[soapLine-1][4] = (nRecord.getSublistValue(AVA_NS_Lines[line][0], 'class', AVA_NS_Lines[line][1]) != null && nRecord.getSublistValue(AVA_NS_Lines[line][0], 'class',	AVA_NS_Lines[line][1]).length > 0) ? nRecord.getSublistValue(AVA_NS_Lines[line][0], 'class', AVA_NS_Lines[line][1]) : ''; // Class
					}
					
					if(nRecord.getValue('custpage_ava_linedep') == false || nRecord.getValue('custpage_ava_linedep') == 'F'){
						AVA_TaxRequestLines[soapLine-1][5] = (nRecord.getValue('department') != null && nRecord.getValue('department').length > 0) ? nRecord.getValue('department') : '';
					}
					else{
						AVA_TaxRequestLines[soapLine-1][5] = (nRecord.getSublistValue(AVA_NS_Lines[line][0], 'department', AVA_NS_Lines[line][1]) != null && nRecord.getSublistValue(AVA_NS_Lines[line][0], 'department', AVA_NS_Lines[line][1]).length > 0) ? nRecord.getSublistValue(AVA_NS_Lines[line][0], 'department', AVA_NS_Lines[line][1]) : ''; // Department
					}
					
					if(configCache.AVA_TaxCodeMapping == true){
						var taxcode = null;
						
						if(AVA_NS_Lines[line][0] == 'expense' && nRecord.getSublistValue(AVA_NS_Lines[line][0], 'category', AVA_NS_Lines[line][1]) != null){
							for(var i = 0; AVA_ExpenseCategoriesTaxCodes != null && i < AVA_ExpenseCategoriesTaxCodes.length; i++){
								if(nRecord.getSublistValue(AVA_NS_Lines[line][0], 'category', AVA_NS_Lines[line][1]) == AVA_ExpenseCategoriesTaxCodes[i][0]){
									taxcode = AVA_ExpenseCategoriesTaxCodes[i][2];
									break;
								}
							}
						}
						else{
							taxcode = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custcol_ava_taxcodemapping', AVA_NS_Lines[line][1]);
						}
						
						if(taxcode != null && taxcode != ''){
							taxLine.taxCode = taxcode.substring(0, 25);
						}
					}
					
					var qty = (AVA_LineQty[line] > 0) ? AVA_LineQty[line] : (AVA_LineQty[line] * -1);
					taxLine.quantity = qty;
					
					var amount = (AVA_LineAmount[line] * multiplier);
					taxLine.amount = amount;
					taxLine.discounted = 0;
					
					if(configCache.AVA_ItemAccount == true){
						var itemAccount;
						
						if(nRecord.getValue('nexus_country') == 'US' && configCache.AVA_GlAccounts == 'glaccount'){
							itemAccount = debitAccountName;
						}
						else{
							if(AVA_NS_Lines[line][0] == 'item'){
								if(nRecord.getValue('nexus_country') == 'US'){
									if(nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custcol_ava_assetaccounttext', AVA_NS_Lines[line][1]) != null && nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custcol_ava_assetaccounttext', AVA_NS_Lines[line][1]).length > 0){
										itemAccount = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custcol_ava_assetaccounttext', AVA_NS_Lines[line][1]);
									}
									else{
										itemAccount = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custcol_ava_expenseaccounttext', AVA_NS_Lines[line][1]);
									}
								}
								else{
									itemAccount = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custcol_ava_incomeaccount', AVA_NS_Lines[line][1]);
								}
							}
							else{
								itemAccount = ExpenseAccountName;
							}
						}
						
						if(itemAccount != null && itemAccount.length != 0){
							taxLine.revenueAccount = itemAccount.substring(0, 50);
						}
					}
					
					if(configCache.AVA_UDF1 == true){
						var udf = null;
						
						if(AVA_NS_Lines[line][0] == 'item'){
							udf = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custcol_ava_udf1', AVA_NS_Lines[line][1]);
						}
						
						if(udf != null && udf != ''){
							taxLine.ref1 = udf.substring(0, 250);
						}
					}
					
					if(configCache.AVA_UDF2 == true){
						var udf = null;
						
						if(AVA_NS_Lines[line][0] == 'item'){
							udf = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custcol_ava_udf2', AVA_NS_Lines[line][1]);
						}
						
						if(udf != null && udf != ''){
							taxLine.ref2 = udf.substring(0, 250);
						}
					}
					
					var description = '';
					if(AVA_NS_Lines[line][0] == 'item'){
						var itemdesc = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'description', AVA_NS_Lines[line][1]);
						
						for(var ii = 0; itemdesc != null && ii < itemdesc.length ; ii++){
							if(itemdesc.charCodeAt(ii) != 5){
								description = description + itemdesc.charAt(ii);
							}
						}
					}
					else{
						description = (AVA_LineNames[line] != null) ? AVA_LineNames[line].substring(0, 255) : '';
					}
					
					if(description != null && description.length != 0){
						taxLine.description = description.substring(0, 255);
					}
					else{
						taxLine.description = (AVA_LineNames[line] != null) ? AVA_LineNames[line].substring(0, 255) : '';
					}
					
					//parameters for EVAT
					if(AVA_FoundVatCountry == 1){
						var IsGoodsSecondHand = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custcol_ava_preowned', AVA_NS_Lines[line][1]);
						var parameter = taxLine.getNewTransactionLineParameters();
						parameter.name = 'IsGoodsSecondHand';
						parameter.value = (IsGoodsSecondHand == true || IsGoodsSecondHand == 'T') ? true : false;
						taxLine.parameters.push(parameter);
						
						var IsTriangulation = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custcol_5892_eutriangulation', AVA_NS_Lines[line][1]);
						parameter = taxLine.getNewTransactionLineParameters();
						parameter.name = 'IsTriangulation';
						parameter.value = (IsTriangulation == true || IsTriangulation == 'T') ? true : false;
						taxLine.parameters.push(parameter);
						
						if(IsTriangulation == true){	
							var MiddlemanVatId =  nRecord.getValue('custbody_ava_vatregno');					
							parameter = taxLine.getNewTransactionLineParameters();
							parameter.name = 'MiddlemanVatId';
							parameter.value = (MiddlemanVatId != null && MiddlemanVatId.length > 0) ? MiddlemanVatId : '';
							taxLine.parameters.push(parameter);
							
							var transportListValue = nRecord.getSublistValue(AVA_NS_Lines[line][0], 'custpage_ava_transportlist', AVA_NS_Lines[line][1]);
							parameter = taxLine.getNewTransactionLineParameters();
							parameter.name = 'Transport';
							parameter.value = (transportListValue == 0) ? 'Seller' : ((transportListValue == 1) ? 'None' : ((transportListValue == 2) ? 'Seller' : ((transportListValue == 3) ? 'Buyer' : ((transportListValue == 4) ? 'ThirdPartyForSeller' : 'ThirdPartyForBuyer'))));
							taxLine.parameters.push(parameter);
							
							AVA_TriangulationFlag = 1;
						}
					}
					
					soapLine++;
					AVA_LineCount++;
					Transaction.Lines.push(taxLine);
				}
			}
		}
		
		function AVA_GetAddrDetails(configCache, addressType, addr){
			var address = new AvaTax.address();
			
			if(addressType == 'default'){
				address.line1 	   = (configCache.AVA_Def_Addr1 != null ? configCache.AVA_Def_Addr1.substring(0, 50) : '');
				address.line2 	   = (configCache.AVA_Def_Addr2 != null ? configCache.AVA_Def_Addr2.substring(0, 100) : '');
				address.line3 	   = '';
				address.city 	   = (configCache.AVA_Def_City != null ? configCache.AVA_Def_City.substring(0, 50) : '');
				address.region 	   = (configCache.AVA_Def_State != null ? configCache.AVA_Def_State : '');
				address.postalCode = (configCache.AVA_Def_Zip != null ? configCache.AVA_Def_Zip.substring(0, 11) : '');
				address.country    = (configCache.AVA_Def_Country != null ? configCache.AVA_Def_Country : '');
			}
			else if(addressType == 'headerlocation'){
				address.line1 	   = (AVA_HeaderLocation[1] != null ? AVA_HeaderLocation[1] : '');
				address.line2 	   = (AVA_HeaderLocation[2] != null ? AVA_HeaderLocation[2] : '');
				address.line3 	   = '';
				address.city 	   = (AVA_HeaderLocation[4] != null ? AVA_HeaderLocation[4] : '');
				address.region 	   = (AVA_HeaderLocation[5] != null ? AVA_HeaderLocation[5] : '');
				address.postalCode = (AVA_HeaderLocation[6] != null ? AVA_HeaderLocation[6] : '');
				address.country    = (AVA_HeaderLocation[7] != null ? AVA_HeaderLocation[7] : '');
			}
			else if(addressType == 'linelocation'){
				address.line1 	   = (addr[1] != null ? addr[1] : '');
				address.line2 	   = (addr[2] != null ? addr[2] : '');
				address.line3 	   = '';
				address.city 	   = (addr[4] != null ? addr[4] : '');
				address.region 	   = (addr[5] != null ? addr[5] : '');
				address.postalCode = (addr[6] != null ? addr[6] : '');
				address.country    = (addr[7] != null ? addr[7] : '');
			}
			else if(addressType == 'pointoforderacceptanceaddress'){
				address.line1      = addr[1];
				address.line2      = addr[2];
				address.line3      = '';
				address.city       = addr[3];
				address.region     = addr[4];
				address.postalCode = addr[5];
				address.country    = addr[6];
			}
			else if(addressType == 'importaddress'){
				address.line1      = addr[8];
				address.line2      = addr[9];
				address.line3      = '';
				address.city       = addr[10];
				address.region     = addr[11];
				address.postalCode = addr[12];
				address.country    = addr[13];
			}
			
			return address;
		}
		
		function AVA_GetVatAddresses(nRecord){
			var vatAddress = new Array();
			
			var searchRecord = search.create({
				type: 'customrecord_vendorvataddresses',
				filters: ['custrecord_ava_vatvendorinternalid', 'equalto', nRecord.getValue('entity')],
				columns: ['custrecord_ava_poaflag', 'custrecord_ava_poaaddr1', 'custrecord_ava_poaaddr2', 'custrecord_ava_poacity', 'custrecord_ava_poastate', 'custrecord_ava_poazip', 'custrecord_ava_poacountry', 'custrecord_ava_importaddrflag', 'custrecord_ava_impaddr1', 'custrecord_ava_impaddr2', 'custrecord_ava_impcity', 'custrecord_ava_impstate', 'custrecord_ava_impzip', 'custrecord_ava_impcountry']
			});
			
			var customerSearchResult = searchRecord.run();
			customerSearchResult = customerSearchResult.getRange({
				start: 0,
				end: 1000
			});
			
			for(var i = 0; customerSearchResult != null && i < customerSearchResult.length; i++){
				vatAddress[0] = customerSearchResult[i].getValue('custrecord_ava_poaflag');
				vatAddress[1] = (customerSearchResult[i].getValue('custrecord_ava_poaaddr1') != null && customerSearchResult[i].getValue('custrecord_ava_poaaddr1').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_poaaddr1').substring(0, 50) : '';
				vatAddress[2] = (customerSearchResult[i].getValue('custrecord_ava_poaaddr2') != null && customerSearchResult[i].getValue('custrecord_ava_poaaddr2').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_poaaddr2').substring(0, 100) : '';
				vatAddress[3] = (customerSearchResult[i].getValue('custrecord_ava_poacity') != null && customerSearchResult[i].getValue('custrecord_ava_poacity').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_poacity').substring(0, 50) : '';
				vatAddress[4] = (customerSearchResult[i].getValue('custrecord_ava_poastate') != null && customerSearchResult[i].getValue('custrecord_ava_poastate').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_poastate') : '';
				vatAddress[5] = (customerSearchResult[i].getValue('custrecord_ava_poazip') != null && customerSearchResult[i].getValue('custrecord_ava_poazip').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_poazip').substring(0, 11) : '';
				returnCountryName = ava_library.mainFunction('AVA_CheckCountryName', (customerSearchResult[i].getValue('custrecord_ava_poacountry') != null && customerSearchResult[i].getValue('custrecord_ava_poacountry').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_poacountry') : '');
				vatAddress[6] = returnCountryName[1];
				
				vatAddress[7] = customerSearchResult[i].getValue('custrecord_ava_importaddrflag');
				vatAddress[8] = (customerSearchResult[i].getValue('custrecord_ava_impaddr1') != null && customerSearchResult[i].getValue('custrecord_ava_impaddr1').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_impaddr1').substring(0, 50) : '';
				vatAddress[9] = (customerSearchResult[i].getValue('custrecord_ava_impaddr2') != null && customerSearchResult[i].getValue('custrecord_ava_impaddr2').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_impaddr2').substring(0, 100) : '';
				vatAddress[10] = (customerSearchResult[i].getValue('custrecord_ava_impcity') != null && customerSearchResult[i].getValue('custrecord_ava_impcity').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_impcity').substring(0, 50) : '';
				vatAddress[11] = (customerSearchResult[i].getValue('custrecord_ava_impstate') != null && customerSearchResult[i].getValue('custrecord_ava_impstate').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_impstate') : '';
				vatAddress[12] = (customerSearchResult[i].getValue('custrecord_ava_impzip') != null && customerSearchResult[i].getValue('custrecord_ava_impzip').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_impzip').substring(0, 11) : '';
				returnCountryName = ava_library.mainFunction('AVA_CheckCountryName', (customerSearchResult[i].getValue('custrecord_ava_impcountry') != null && customerSearchResult[i].getValue('custrecord_ava_impcountry').length > 0) ? customerSearchResult[i].getValue('custrecord_ava_impcountry') : '');
				vatAddress[13] = returnCountryName[1];
			}
			
			return vatAddress;
		}
		
		function AVA_UpdateGLAccounts(nRecord, configCache, journalEntryRecord){
			var i;
			
			journalEntryRecord.setValue({
				fieldId: 'trandate',
				value: ava_library.AVA_FormatDate(ava_library.mainFunction('AVA_DateFormat', AVA_DocDate))
			});
			journalEntryRecord.setValue({
				fieldId: 'postingperiod',
				value: nRecord.getValue('postingperiod')
			});
			
			if(nRecord.getValue('nexus_country') == 'US'){
				if(configCache.AVA_GlAccounts == 'glaccount'){
					for(i = 0; AVA_TaxRequestLines != null && i < AVA_TaxRequestLines.length; i++){
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'account',
							line: i,
							value: configCache.AVA_UseTaxDebit
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'debit',
							line: i,
							value: format.parse({
								value: (ResponseLineArray[i].taxCalculated - ResponseLineArray[i].tax),
								type: format.Type.CURRENCY
							})
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'memo',
							line: i,
							value: (nRecord.id + ' - Use Tax')
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'location',
							line: i,
							value: AVA_TaxRequestLines[i][3]
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'class',
							line: i,
							value: AVA_TaxRequestLines[i][4]
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'department',
							line: i,
							value: AVA_TaxRequestLines[i][5]
						});
					}
					
					for(var j = 0; AVA_TaxRequestLines != null && j < AVA_TaxRequestLines.length; j++){
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'account',
							line: i,
							value: configCache.AVA_UseTaxCredit
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'credit',
							line: i,
							value: format.parse({
								value: (ResponseLineArray[j].taxCalculated - ResponseLineArray[j].tax),
								type: format.Type.CURRENCY
							})
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'memo',
							line: i,
							value: (nRecord.id + ' - Use Tax')
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'location',
							line: i,
							value: AVA_TaxRequestLines[j][3]
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'class',
							line: i,
							value: AVA_TaxRequestLines[j][4]
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'department',
							line: i,
							value: AVA_TaxRequestLines[j][5]
						});
						i++;
					}
				}
				else{
					for(i = 0; AVA_TaxRequestLines != null && i < AVA_TaxRequestLines.length; i++){
						if(AVA_TaxRequestLines[i][0] == 'item'){
							if(nRecord.getSublistValue(AVA_TaxRequestLines[i][0], 'custcol_ava_assetaccount', AVA_TaxRequestLines[i][2]) != null && nRecord.getSublistValue(AVA_TaxRequestLines[i][0], 'custcol_ava_assetaccount', AVA_TaxRequestLines[i][2]).length > 0){
								journalEntryRecord.setSublistValue({
									sublistId: 'line',
									fieldId: 'account',
									line: i,
									value: nRecord.getSublistValue(AVA_TaxRequestLines[i][0], 'custcol_ava_assetaccount', AVA_TaxRequestLines[i][2])
								});
							}
							else{
								journalEntryRecord.setSublistValue({
									sublistId: 'line',
									fieldId: 'account',
									line: i,
									value: nRecord.getSublistValue(AVA_TaxRequestLines[i][0], 'custcol_ava_expenseaccount', AVA_TaxRequestLines[i][2])
								});
							}
						}
						else{
							journalEntryRecord.setSublistValue({
								sublistId: 'line',
								fieldId: 'account',
								line: i,
								value: nRecord.getSublistValue(AVA_TaxRequestLines[i][0], 'account', AVA_TaxRequestLines[i][2])
							});
						}
						
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'debit',
							line: i,
							value: format.parse({
								value: (ResponseLineArray[i].taxCalculated - ResponseLineArray[i].tax),
								type: format.Type.CURRENCY
							})
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'memo',
							line: i,
							value: (nRecord.id + ' - Use Tax')
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'location',
							line: i,
							value: AVA_TaxRequestLines[i][3]
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'class',
							line: i,
							value: AVA_TaxRequestLines[i][4]
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'department',
							line: i,
							value: AVA_TaxRequestLines[i][5]
						});
					}
					
					for(j = 0; AVA_TaxRequestLines != null && j < AVA_TaxRequestLines.length; j++){
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'account',
							line: i,
							value: configCache.AVA_UseTaxCredit
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'credit',
							line: i,
							value: format.parse({
								value: (ResponseLineArray[j].taxCalculated - ResponseLineArray[j].tax),
								type: format.Type.CURRENCY
							})
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'memo',
							line: i,
							value: (nRecord.id + ' - Use Tax')
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'location',
							line: i,
							value: AVA_TaxRequestLines[j][3]
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'class',
							line: i,
							value: AVA_TaxRequestLines[j][4]
						});
						journalEntryRecord.setSublistValue({
							sublistId: 'line',
							fieldId: 'department',
							line: i,
							value: AVA_TaxRequestLines[j][5]
						});
						i++;
					}
				}
			}
			
			JournalEntryId = journalEntryRecord.save({
				ignoreMandatoryFields: true
			});
			
			if(JournalEntryId != null && JournalEntryId.toString().length > 0){
				Transaction.type = 'PurchaseInvoice';
				Transaction.code = nRecord.id;
				Transaction.commit = 1;
				
				var createoradjust = Transaction.createoradjust(nRecord.getValue('custpage_ava_details'));
				var startTime = new Date();
				var response = https.post({
					body: createoradjust.data,
					url: createoradjust.url,
					headers: createoradjust.headers
				});
				
				var getTaxResult = JSON.parse(response.body);
				if(getTaxResult.error != null){
					var severity, message;
					var errorDetails = getTaxResult.error.details;
					
					for(var i = 0; errorDetails != null && i < errorDetails.length; i++){
						message = errorDetails[i].message;
						severity = errorDetails[i].severity;
						break;
					}
					
					if(severity == 'Error'){
						AVA_ErrorCode = message;
						log.debug({
							title: 'Error Message',
							details: message
						});
						log.debug({
							title: 'Error',
							details: response.code
						});
					}
					else if(severity == 'Exception'){
						if(configCache.AVA_EnableLogEntries == '1' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
							var avaDocType = taxLibrary.AVA_RecordType(nRecord.type);
							ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + nRecord.id + '~~' + '' + '~~' + '' + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Debug' + '~~' + 'Error' + '~~' + nRecord.type + '~~' + 'AVA_UpdateGLAccounts' + '~~' + 'GetTax Exeception - ' + message + '~~' + '' + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
						}
						
						AVA_ErrorCode = message;
						log.debug({
							title: 'Exception',
							details: message
						});
						log.debug({
							title: 'Exception',
							details: response.code
						});
					}
					
					taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', null, '', AVA_ErrorCode);
				}
				else{
					taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', response, startTime);
				}
			}
		}
		
		function AVA_UpdateUseTaxHeaderRecord(nRecord, configCache, rec){
			var multiplier = (nRecord.type == 'vendorbill') ? 1 : -1;
			
			rec.setValue({
				fieldId: 'custrecord_ava_docinternalid',
				value: nRecord.id
			});
			var docNo = search.lookupFields({
				type: search.Type.TRANSACTION,
				id: nRecord.id,
				columns: 'transactionnumber'
			});
			rec.setValue({
				fieldId: 'custrecord_ava_docno',
				value: docNo.transactionnumber
			});
			rec.setValue({
				fieldId: 'custrecord_ava_docdate',
				value: nRecord.getValue('trandate')
			});
			
			if(nRecord.getValue('nexus_country') == 'US'){
				rec.setValue({
					fieldId: 'custrecord_ava_accruedusetax',
					value: (nRecord.getValue('custpage_ava_document') == true || nRecord.getValue('custpage_ava_document') == 'T') ? true : false
				});
				rec.setValue({
					fieldId: 'custrecord_avaaccruedtaxamt',
					value: format.parse({
						value: nRecord.getValue('custpage_ava_accruedtaxamount'),
						type: format.Type.CURRENCY
					})
				});
				rec.setValue({
					fieldId: 'custrecord_ava_avatax',
					value: format.parse({
						value: nRecord.getValue('custpage_ava_avatax'),
						type: format.Type.CURRENCY
					})
				});
			}
			else{
				rec.setValue({
					fieldId: 'custrecord_ava_doctype',
					value: (AVA_DocumentType == 'ReverseChargeInvoice') ? 7 : 4
				});
				rec.setValue({
					fieldId: 'custrecord_ava_docstatus',
					value: taxLibrary.AVA_DocumentStatus(AVA_DocStatus)
				});
				rec.setValue({
					fieldId: 'custrecord_ava_netdoctype',
					value: (nRecord.type == 'vendorbill') ? 1 : 2
				});
				rec.setValue({
					fieldId: 'custrecord_ava_taxcalcdate',
					value: ava_library.AVA_FormatDate(ava_library.mainFunction('AVA_DateFormat', AVA_TaxDate))
				});
				rec.setValue({
					fieldId: 'custrecord_ava_totalamt',
					value: format.parse({
						value: (AVA_TotalAmount * multiplier),
						type: format.Type.CURRENCY
					})
				});
				rec.setValue({
					fieldId: 'custrecord_ava_totaldis',
					value: format.parse({
						value: AVA_TotalDiscount,
						type: format.Type.CURRENCY
					})
				});
				rec.setValue({
					fieldId: 'custrecord_ava_totalnontax',
					value: format.parse({
						value: AVA_TotalExemption,
						type: format.Type.CURRENCY
					})
				});
				rec.setValue({
					fieldId: 'custrecord_ava_totaltaxableamt',
					value: format.parse({
						value: AVA_TotalTaxable,
						type: format.Type.CURRENCY
					})
				});
				rec.setValue({
					fieldId: 'custrecord_ava_avatax',
					value: format.parse({
						value: (AVA_TotalTax * multiplier),
						type: format.Type.CURRENCY
					})
				});
			}
			
			if(nRecord.getValue('nexus_country') == 'US' && (nRecord.getValue('custpage_ava_document') == true || nRecord.getValue('custpage_ava_document') == 'T') && (configCache.AVA_BillApproved == false || nRecord.getValue('approvalstatus') == '2')){
				rec.setValue({
					fieldId: 'custrecord_ava_doctype',
					value: 4
				});
				rec.setValue({
					fieldId: 'custrecord_ava_docstatus',
					value: taxLibrary.AVA_DocumentStatus(AVA_DocStatus)
				});
				rec.setValue({
					fieldId: 'custrecord_ava_journalentryid',
					value: (JournalEntryId != null && JournalEntryId.toString().length > 0) ? JournalEntryId : ''
				});
			}
			
			rec.save();
		}
		
		function AVA_PurchaseTransactionFieldChangedEvent(context){
			try{
				var cRecord = context.currentRecord;
				
				if(cRecord.getValue('custpage_ava_configobj') != null && cRecord.getValue('custpage_ava_configobj').length > 0){
					var configCache = JSON.parse(cRecord.getValue('custpage_ava_configobj'));
					
					if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
						if(context.fieldId == 'entity'){
							if(cRecord.getValue('entity') != null && cRecord.getValue('entity').length > 0){
								AVA_GetVendorDetails(cRecord);
							}
							else{
								cRecord.setValue({
									fieldId: 'custpage_ava_vendorid',
									value: '',
									ignoreFieldChange: true
								});
							}
						}
					}
				}
			}
			catch(err){
				log.debug({
					title: 'AVA_PurchaseTransactionFieldChangedEvent - Error',
					details: err.message
				});
			}
		}
		
		function AVA_PurchaseTransactionSaveEvent(context){
			var connectorStartTime = new Date();
			AVA_LineCount = 0;
			AVA_ResultCode = '';
			var cRecord = context.currentRecord;
			AVA_FoundVatCountry = ava_library.mainFunction('AVA_CheckVatCountries', cRecord.getValue('nexus_country'));
			
			if(cRecord.type == 'purchaseorder' && AVA_FoundVatCountry == 0){
				return true;
			}
			
			if(cRecord.getValue('custpage_ava_configobj') != null && cRecord.getValue('custpage_ava_configobj').length > 0){
				var configCache = JSON.parse(cRecord.getValue('custpage_ava_configobj'));
				
				if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
					try{
						if(cRecord.getValue('custpage_ava_vendorid') != null && cRecord.getValue('custpage_ava_vendorid').length > 0){
							VendorValues = cRecord.getValue('custpage_ava_vendorid').split('+');
						}
						
						if(cRecord.getValue('custpage_ava_context') == 'USERINTERFACE' && cRecord.getValue('custpage_ava_docstatus') != 'Cancelled'){
							cRecord.setValue({
								fieldId: 'custpage_ava_taxcodestatus',
								value: 0,
								ignoreFieldChange: true
							});
							
							if(AVA_UseTaxRequiredFields(cRecord, configCache) == 0){
								if(AVA_UseTaxItemsLines(cRecord, configCache) == 1){
									if(cRecord.type == 'purchaseorder'){
										if(AVA_CalcTax(cRecord, configCache) == false){
											taxLibrary.AVA_LogTaxResponse(cRecord, configCache, 'T', null, '', AVA_ErrorCode);
										}
									}
									else if(AVA_CalculateUseTax(cRecord, configCache) == false){
										taxLibrary.AVA_LogTaxResponse(cRecord, configCache, 'T', null, '', AVA_ErrorCode);
									}
								}
								else{
									if(configCache.AVA_ShowMessages == 1 || configCache.AVA_ShowMessages == 3){
										alert("This Document has not used AvaTax Services for Tax Calculation. " + ava_library.mainFunction('AVA_ErrorCodeDesc', AVA_ErrorCode));
									}
									
									taxLibrary.AVA_LogTaxResponse(cRecord, configCache, 'F', null, '', AVA_ErrorCode);
									cRecord.setValue({
										fieldId: 'custpage_ava_document',
										value: false,
										ignoreFieldChange: true
									});
								}
							}
							else{
								if((configCache.AVA_ShowMessages == 1 || configCache.AVA_ShowMessages == 3) && AVA_ErrorCode != 0 && AVA_ErrorCode != 29 && AVA_ErrorCode != 32 && AVA_ErrorCode != 33){
									alert("This Document has not used AvaTax Services for Tax Calculation. " + ava_library.mainFunction('AVA_ErrorCodeDesc', AVA_ErrorCode));
								}
									
								if(AVA_FoundVatCountry == 1 && cRecord.type == 'purchaseorder'){
									if(AVA_ErrorCode != 1 && AVA_ErrorCode != 9 && AVA_ErrorCode != 17 && AVA_ErrorCode != 19 && AVA_ErrorCode != 32){
										for(var line = 0 ; AVA_NS_Lines != null && line < AVA_NS_Lines.length; line++){
											var linetype = cRecord.getSublistValue({
												sublistId: AVA_NS_Lines[line][0],
												fieldId: 'itemtype',
												line: AVA_NS_Lines[line][1]
											});
											
											if(!(linetype == 'Description' || linetype == 'Subtotal' || linetype == 'Group' || linetype == 'EndGroup' || linetype == 'Discount')){
												nlapiSetLineItemValue(AVA_NS_Lines[line][0], 'taxrate1', (AVA_NS_Lines[line][1] + 1), 0);
												nlapiSetLineItemValue(AVA_NS_Lines[line][0], 'tax1amt', (AVA_NS_Lines[line][1] + 1), 0);
											}
										}
										
										nlapiSetFieldValue('taxamountoverride', 0);
									}
								}
								
								taxLibrary.AVA_LogTaxResponse(cRecord, configCache, 'F', null, '', AVA_ErrorCode);
								cRecord.setValue({
									fieldId: 'custpage_ava_document',
									value: false,
									ignoreFieldChange: true
								});
							}
						}
						
						if(configCache.AVA_EnableLogEntries == '1' && AVA_ResultCode == 'Success' && cRecord.getValue('custpage_ava_context') != 'WEBSTORE' && cRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && cRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
							var docCode = (AVA_TempDocCode != null) ? AVA_TempDocCode.toString().substring(0, 50) : '';
							var connectorEndTime = new Date();
							
							var connectorTime = (AVA_ConnectorEndTime.getTime() - connectorStartTime.getTime()) + (connectorEndTime.getTime() - AVA_ConnectorStartTime.getTime());
							var avaDocType = taxLibrary.AVA_RecordType(cRecord.type);
							ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + docCode + '~~' + connectorTime + '~~' + AVA_LatencyTime + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Performance' + '~~' + 'Informational' + '~~' + cRecord.type + '~~' + 'AVA_PurchaseTransactionSaveEvent' + '~~' + 'CONNECTORMETRICS Type - GETTAX, LineCount - ' + AVA_LineCount + ', DocCode - ' + docCode + ', ConnectorTime - ' + connectorTime + ', LatencyTime - ' + AVA_LatencyTime + '~~' + '' + '~~' + 0 + '~~' + cRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + cRecord.getValue('custpage_ava_details')));
						}
						
						cRecord.setValue({
							fieldId: 'custpage_ava_taxcodestatus',
							value: 3,
							ignoreFieldChange: true
						});
					}
					catch(err){
						if(configCache.AVA_EnableLogEntries == '1' && cRecord.getValue('custpage_ava_context') != 'WEBSTORE' && cRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && cRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
							var avaDocType = taxLibrary.AVA_RecordType(cRecord.type);
							ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + cRecord.id + '~~' + '' + '~~' + '' + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Debug' + '~~' + 'Exception' + '~~' + cRecord.type + '~~' + 'AVA_PurchaseTransactionSaveEvent' + '~~' + err.message + '~~' + '' + '~~' + 0 + '~~' + cRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + cRecord.getValue('custpage_ava_details')));
						}
						
						alert(err.message);
						cRecord.setValue({
							fieldId: 'custpage_ava_taxcodestatus',
							value: 0,
							ignoreFieldChange: true
						});
						return false;
					}
				}
			}

			return true;
		}
		
		function AVA_VerifyTaxOnDemand(cRecord, connectorStartTime){
			AVA_LineCount = 0;
			AVA_ResultCode = '';
			
			cRecord.setValue({
				fieldId: 'custpage_ava_taxcodestatus',
				value: 0,
				ignoreFieldChange: true
			});
			cRecord.setValue({
				fieldId: 'custpage_ava_notemsg',
				value: '',
				ignoreFieldChange: true
			});
			var configCache = JSON.parse(cRecord.getValue('custpage_ava_configobj'));
			
			try{
				if(cRecord.getValue('custpage_ava_vendorid') != null && cRecord.getValue('custpage_ava_vendorid').length > 0){
					VendorValues = cRecord.getValue('custpage_ava_vendorid').split('+');
				}
				
				AVA_FoundVatCountry = ava_library.mainFunction('AVA_CheckVatCountries', cRecord.getValue('nexus_country'));
				
				if(AVA_UseTaxRequiredFields(cRecord, configCache) == 0){
					if(AVA_UseTaxItemsLines(cRecord, configCache) == 1){
						if(cRecord.type == 'purchaseorder'){
							AVA_CalcTax(cRecord, configCache);
						}
						else{
							AVA_CalculateUseTax(cRecord, configCache);
						}
					}
					else{
						if(configCache.AVA_ShowMessages == 1 || configCache.AVA_ShowMessages == 3){
							alert("This Document has not used AvaTax Services for Tax Calculation. " + ava_library.mainFunction('AVA_ErrorCodeDesc', AVA_ErrorCode));
						}
					}
				}
				else{
					if(configCache.AVA_ShowMessages == 1 || configCache.AVA_ShowMessages == 3){
						alert("This Document has not used AvaTax Services for Tax Calculation. " + ava_library.mainFunction('AVA_ErrorCodeDesc', AVA_ErrorCode));
					}
				}
				
				if(configCache.AVA_EnableLogEntries == '1' && AVA_ResultCode == 'Success' && cRecord.getValue('custpage_ava_context') != 'WEBSTORE' && cRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && cRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
					var connectorEndTime = new Date();
					var connectorTime = (AVA_ConnectorEndTime.getTime() - connectorStartTime.getTime()) + (connectorEndTime.getTime() - AVA_ConnectorStartTime.getTime());
					
					var docCode = (AVA_TempDocCode != null) ? AVA_TempDocCode.toString().substring(0, 50) : '';
					var avaDocType = taxLibrary.AVA_RecordType(cRecord.type);
					ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + docCode + '~~' + connectorTime + '~~' + AVA_LatencyTime + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Performance' + '~~' + 'Informational' + '~~' + cRecord.type + '~~' + 'AVA_VerifyTaxOnDemand' + '~~' + 'CONNECTORMETRICS Type - GETTAX, LineCount - ' + AVA_LineCount + ', DocCode - ' + docCode + ', ConnectorTime - ' + connectorTime + ', LatencyTime - ' + AVA_LatencyTime + '~~' + '' + '~~' + 0 + '~~' + cRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + cRecord.getValue('custpage_ava_details')));
				}
			}
			catch(err){
				if(configCache.AVA_EnableLogEntries == '1' && cRecord.getValue('custpage_ava_context') != 'WEBSTORE' && cRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && cRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
					var avaDocType = taxLibrary.AVA_RecordType(cRecord.type);
					ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + cRecord.id + '~~' + '' + '~~' + '' + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Debug' + '~~' + 'Exception' + '~~' + cRecord.type + '~~' + 'AVA_VerifyTaxOnDemand' + '~~' + err.message + '~~' + '' + '~~' + 0 + '~~' + cRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + cRecord.getValue('custpage_ava_details')));
				}
				
				alert(err.message);
			}
		}
		
		function AVA_PurchaseTransBeforeLoad(context, cForm, ui, configCache){
			try{
				if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
					var nRecord = context.newRecord;
					var executionContextValue = runtime.executionContext;
					
					var executionContext = cForm.addField({
						id: 'custpage_ava_context',
						label: 'Execution Context',
						type: ui.FieldType.TEXT
					});
					executionContext.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					executionContext.defaultValue = executionContextValue;
					
					var lineLocation = cForm.addField({
						id: 'custpage_ava_lineloc',
						label: 'LineLoc',
						type: ui.FieldType.CHECKBOX
					});
					lineLocation.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var transportList = cForm.addField({
						id: 'custpage_ava_transportlist',
						label: 'Transport',
						type: ui.FieldType.SELECT
					});
					transportList.addSelectOption({
						value: '0',
						text: ''
					});
					transportList.addSelectOption({
						value: '1',
						text: 'None'
					});
					transportList.addSelectOption({
						value: '2',
						text: 'Seller'
					});
					transportList.addSelectOption({
						value: '3',
						text: 'Buyer'
					});
					transportList.addSelectOption({
						value: '4',
						text: 'ThirdPartyForSeller'
					});
					transportList.addSelectOption({
						value: '5',
						text: 'ThirdPartyForBuyer'
					});
					transportList.defaultValue = '0';
					
					if(nRecord.getValue('custbody_ava_transport') != null && nRecord.getValue('custbody_ava_transport').toString().length > 0){
						transportList.defaultValue = (nRecord.getValue('custbody_ava_transport') == 6 || nRecord.getValue('custbody_ava_transport') == '' || nRecord.getValue('custbody_ava_transport') == ' ') ? '0' : nRecord.getValue('custbody_ava_transport').toString();
					}
					
					var itemSublist = cForm.getSublist({
						id: 'item'
					});
					
					if(itemSublist != null){
						var itemTransportList = itemSublist.addField({
							id: 'custpage_ava_transportlist',
							label: 'Transport',
							type: ui.FieldType.SELECT
						});
						itemTransportList.addSelectOption({
							value: '0',
							text: ''
						});
						itemTransportList.addSelectOption({
							value: '1',
							text: 'None'
						});
						itemTransportList.addSelectOption({
							value: '2',
							text: 'Seller'
						});
						itemTransportList.addSelectOption({
							value: '3',
							text: 'Buyer'
						});
						itemTransportList.addSelectOption({
							value: '4',
							text: 'ThirdPartyForSeller'
						});
						itemTransportList.addSelectOption({
							value: '5',
							text: 'ThirdPartyForBuyer'
						});
						
						if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW){
							for(var i = 0; i < nRecord.getLineCount('item'); i++){
								var transport = nRecord.getSublistValue({
									sublistId: 'item',
									fieldId: 'custcol_ava_transport',
									line: i
								});
								
								if(transport != null && transport.toString().length > 0){
									nRecord.setSublistValue({
										sublistId: 'item',
										fieldId: 'custpage_ava_transportlist',
										line: i,
										value: (transport == 6 || transport == '' || transport == ' ') ? '0' : transport.toString()
									});
								}
							}
						}
					}
					
					if(executionContextValue == 'USERINTERFACE'){
						if(configCache.AVA_UDF1 == false){
							if(nRecord.getSublistField('item', 'custcol_ava_udf1', 0) != null){
								var udf1 = itemSublist.getField({
									id: 'custcol_ava_udf1'
								});
								udf1.updateDisplayType({
									displayType: ui.FieldDisplayType.HIDDEN
								});
							}
						}
						
						if(configCache.AVA_UDF2 == false){
							if(nRecord.getSublistField('item', 'custcol_ava_udf2', 0) != null){
								var udf2 = itemSublist.getField({
									id: 'custcol_ava_udf2'
								});
								udf2.updateDisplayType({
									displayType: ui.FieldDisplayType.HIDDEN
								});
							}
						}
					}
					
					var taxcode = configCache.AVA_DefaultTaxCode;
					taxcode = (taxcode != null) ? taxcode.substring(0, taxcode.lastIndexOf('+')) : '';
					
					var defTax = cForm.addField({
						id: 'custpage_ava_deftax',
						label: 'Def Tax',
						type: ui.FieldType.TEXT
					});
					defTax.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					defTax.defaultValue = taxcode;
					
					var taxCodeStatus = cForm.addField({
						id: 'custpage_ava_taxcodestatus',
						label: 'TaxCode Status',
						type: ui.FieldType.INTEGER
					});
					taxCodeStatus.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					taxCodeStatus.defaultValue = 0;
					
					var avataxDoc = cForm.addField({
						id: 'custpage_ava_document',
						label: 'AvaTax Document',
						type: ui.FieldType.CHECKBOX
					});
					avataxDoc.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var noteMsg = cForm.addField({
						id: 'custpage_ava_notemsg',
						label: 'Note Message',
						type: ui.FieldType.LONGTEXT
					});
					noteMsg.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var docStatus = cForm.addField({
						id: 'custpage_ava_docstatus',
						label: 'Document Status',
						type: ui.FieldType.TEXT
					});
					docStatus.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT || context.type == context.UserEventType.COPY){
						cForm.addButton({
							id: 'custpage_ava_calculatetax',
							label: 'Calculate Tax',
							functionName: 'AVA_VerifyTax'
						});
						
						var vendorId = cForm.addField({
							id: 'custpage_ava_vendorid',
							label: 'Vendor ID',
							type: ui.FieldType.TEXT
						});
						vendorId.updateDisplayType({
							displayType: ui.FieldDisplayType.HIDDEN
						});
						
						if(nRecord.getValue('entity') != null && nRecord.getValue('entity').length > 0){
							AVA_GetVendorDetails(nRecord);
						}
						
						if(context.type == context.UserEventType.CREATE){
							var request = context.request;
							var customer = request.parameters.entityid;
							var soId = request.parameters.recordId;
							
							if(AVA_Validation(customer) && AVA_Validation(soId)){
								nRecord.setValue({
									fieldId: 'custbody_ava_created_from_so',
									value: soId
								});
								
								var salesOrderLoad = record.load({
									type: record.Type.SALES_ORDER,
									id: soId
								});
								
								var soShipAddressList = cForm.addField({
									id: 'custpage_ava_soshipaddresslist',
									label: 'SO Ship Address List',
									type: ui.FieldType.INTEGER
								});
								soShipAddressList.updateDisplayType({
									displayType: ui.FieldDisplayType.HIDDEN
								});
								
								if(AVA_Validation(salesOrderLoad.getValue('shipaddresslist'))){
									soShipAddressList.defaultValue = salesOrderLoad.getValue('shipaddresslist');
								}
								
								var soEntity = cForm.addField({
									id: 'custpage_ava_soentity',
									label: 'SO Entity',
									type: ui.FieldType.INTEGER
								});
								soEntity.updateDisplayType({
									displayType: ui.FieldDisplayType.HIDDEN
								});
								soEntity.defaultValue = customer;
							}
						}
					}
					
					cForm.addTab({
						id: 'custpage_avatab',
						label: 'AvaTax'
					});
					
					if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW){
						if(executionContextValue == 'USERINTERFACE' || executionContextValue == 'CLIENT'){
							taxLibrary.AVA_AddLogsSubList(context, cForm, ui, nRecord);
						}
					}
				}
			}
			catch(err){
				log.debug({
					title: 'BeforeLoad Try/Catch Error',
					details: err.message
				});
				log.debug({
					title: 'BeforeLoad Try/Catch Error Stack',
					details: err.stack
				});
			}
		}
		
		function AVA_PurchaseTransBeforeSubmit(context, configCache, connectorStartTime){
			var e1;
			AVA_LineCount = 0;
			AVA_ResultCode = '';
			AVA_FoundVatCountry = 1;
			var nRecord = context.newRecord;
			
			if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
				try{
					if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT){
						nRecord.setValue({
							fieldId: 'custpage_ava_taxcodestatus',
							value: 3,
							ignoreFieldChange: true
						});
						
						nRecord.setValue({
							fieldId: 'custbody_ava_transport',
							value: (nRecord.getValue('custpage_ava_transportlist') == null || nRecord.getValue('custpage_ava_transportlist') == '0' || nRecord.getValue('custpage_ava_transportlist') == '' || nRecord.getValue('custpage_ava_transportlist') == ' ') ? 6 : parseInt(nRecord.getValue('custpage_ava_transportlist')),
							ignoreFieldChange: true
						});
						
						for(var i = 0; i < nRecord.getLineCount('item'); i++){
							var transport = nRecord.getSublistValue({
								sublistId: 'item',
								fieldId: 'custpage_ava_transportlist',
								line: i
							});
							
							nRecord.setSublistValue({
								sublistId: 'item',
								fieldId: 'custcol_ava_transport',
								line: i,
								value: (transport == null || transport == '0' || transport == '' || transport == ' ') ? 6 : parseInt(transport)
							});
						}
						
						if(nRecord.getValue('custpage_ava_vendorid') != null && nRecord.getValue('custpage_ava_vendorid').length > 0){
							VendorValues = nRecord.getValue('custpage_ava_vendorid').split('+');
						}
						else{
							AVA_GetVendorDetails(nRecord);
							VendorValues = nRecord.getValue('custpage_ava_vendorid').split('+');
						}
						
						if(AVA_UseTaxRequiredFields(nRecord, configCache) == 0){
							if(AVA_UseTaxItemsLines(nRecord, configCache) == 1){
								if(AVA_CalcTax(nRecord, configCache) == false){
									taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', null, '', AVA_ErrorCode);
								}
							}
							else{
								taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', AVA_ErrorCode);
								nRecord.setValue({
									fieldId: 'custpage_ava_document',
									value: false,
									ignoreFieldChange: true
								});
							}
						}
						else{
							if(nRecord.getValue('custpage_ava_context') != 'USERINTERFACE'){
								taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', AVA_ErrorCode);
								nRecord.setValue({
									fieldId: 'custpage_ava_document',
									value: false,
									ignoreFieldChange: true
								});
							}
						}
						
						if(configCache.AVA_EnableLogEntries == '1' && AVA_ResultCode == 'Success' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
							var docCode = (AVA_TempDocCode != null) ? AVA_TempDocCode.toString().substring(0, 50) : '';
							var connectorEndTime = new Date();
							
							var connectorTime = (AVA_ConnectorEndTime.getTime() - connectorStartTime.getTime()) + (connectorEndTime.getTime() - AVA_ConnectorStartTime.getTime());
							var avaDocType = taxLibrary.AVA_RecordType(nRecord.type);
							ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + docCode + '~~' + connectorTime + '~~' + AVA_LatencyTime + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Performance' + '~~' + 'Informational' + '~~' + nRecord.type + '~~' + 'AVA_PurchaseTransBeforeSubmit' + '~~' + 'CONNECTORMETRICS Type - GETTAX, LineCount - ' + AVA_LineCount + ', DocCode - ' + docCode + ', ConnectorTime - ' + connectorTime + ', LatencyTime - ' + AVA_LatencyTime + '~~' + '' + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
						}
					}
				}
				catch(err){
					if(configCache.AVA_EnableLogEntries == '1' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
						var avaDocType = taxLibrary.AVA_RecordType(nRecord.type)
						ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + nRecord.id + '~~' + '' + '~~' + '' + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Debug' + '~~' + 'Exception' + '~~' + nRecord.type + '~~' + 'AVA_PurchaseTransBeforeSubmit' + '~~' + err.message + '~~' + err.stack + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
					}
					
					log.debug({
						title: 'BeforeSubmit Try/Catch Error',
						details: err.message
					});
					log.debug({
						title: 'BeforeSubmit Try/Catch Error Stack',
						details: err.stack
					});
				}
			}
		}
		
		function AVA_PurchaseTransAfterSubmit(context, configCache){
			var nRecord = context.newRecord;
			
			if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('TaxSvc') != -1){
				try{
					nRecord.setValue({
						fieldId: 'custpage_ava_taxcodestatus',
						value: 1,
						ignoreFieldChange: true
					});
					
					taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'F', null, '', '');
					
					var soRef = nRecord.getValue({
						fieldId: 'custbody_ava_created_from_so'
					});
					
					if(AVA_Validation(soRef)){
						var id = record.submitFields({
							type: record.Type.SALES_ORDER,
							id: soRef,
							values: {'custbody_ava_purchaseorder_ref': nRecord.id}
						});
					}
				}
				catch(err){
					log.debug({
						title: 'AfterSubmit Try/Catch Error',
						details: err.message
					});
					log.debug({
						title: 'AfterSubmit Try/Catch Error Stack',
						details: err.stack
					});
				}
			}
		}
		
		function AVA_CalcTax(nRecord, configCache){
			var startTime;
			
			AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', configCache.AVA_ServiceUrl);
			Transaction = new AvaTax.transaction();
			AVA_GetUseTaxBody(nRecord, configCache);
			var createoradjust = Transaction.createoradjust(nRecord.getValue('custpage_ava_details'));
			
			try{
				AVA_ConnectorEndTime = new Date();
				
				startTime = new Date();
				var response = https.post({
					body: createoradjust.data,
					url: createoradjust.url,
					headers: createoradjust.headers
				});
				var endTime = new Date();
				
				AVA_ConnectorStartTime = new Date();
				AVA_LatencyTime = endTime.getTime() - startTime.getTime();
				
				var getTaxResult = JSON.parse(response.body);
				if(getTaxResult.error == null){
					AVA_ResultCode = 'Success';
					
					AVA_DocDate      = getTaxResult.date;
					AVA_DocStatus    = getTaxResult.status;
					AVA_TotalAmount  = getTaxResult.totalAmount;
					AVA_TotalTax     = getTaxResult.totalTax;
					AVA_DocumentType = getTaxResult.type;
					
					nRecord.setValue({
						fieldId: 'taxamountoverride',
						value: format.parse({
							value: AVA_TotalTax,
							type: format.Type.CURRENCY
						})
					});
					
					if(nRecord.getValue('custpage_ava_taxcodestatus') == 3){
						AVA_UpdateTaxDetails(nRecord, configCache, getTaxResult);
					}
					
					taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', response, startTime);
					return true;
				}
				else{
					var severity, message;
					var errorDetails = getTaxResult.error.details;
					
					for(var i = 0; errorDetails != null && i < errorDetails.length; i++){
						message = errorDetails[i].message;
						severity = errorDetails[i].severity;
						break;
					}
					
					if(severity == null || severity == '' || severity == 'Error'){
						nRecord.setValue({
							fieldId: 'custpage_ava_document',
							value: false,
							ignoreFieldChange: true
						});
						
						if(nRecord.getValue('custpage_ava_taxcodestatus') == 0 && (configCache.AVA_ShowMessages == 2 || configCache.AVA_ShowMessages == 3)){
							AVA_ErrorCode = message;
							alert("This Document has used AvaTax Services. " + message);
						}
						else{
							AVA_ErrorCode = message;
							log.debug({
								title: 'Error Message',
								details: message
							});
							log.debug({
								title: 'Error',
								details: response.code
							});
						}
						
						return false;
					}
					else if(severity == 'Exception'){
						nRecord.setValue({
							fieldId: 'custpage_ava_document',
							value: false,
							ignoreFieldChange: true
						});
						
						if(configCache.AVA_EnableLogEntries == '1' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK'){
							var avaDocType = taxLibrary.AVA_RecordType(nRecord.type);
							ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + nRecord.id + '~~' + '' + '~~' + '' + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Debug' + '~~' + 'Error' + '~~' + nRecord.type + '~~' + 'AVA_CalcTax' + '~~' + 'GetTax Exeception - ' + message + '~~' + '' + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
						}
						
						if(nRecord.getValue('custpage_ava_taxcodestatus') == 0 && (configCache.AVA_ShowMessages == 2 || configCache.AVA_ShowMessages == 3)){
							AVA_ErrorCode = message;
							alert("This Document has used AvaTax Services. " + message);
						}
						else{
							AVA_ErrorCode = message;
							log.debug({
								title: 'Exception',
								details: message
							});
							log.debug({
								title: 'Exception',
								details: response.code
							});
						}
						
						return false;
					}
				}
			}
			catch(err){
				log.debug('AVA_CalcTax error stack', err.stack);
				if(configCache.AVA_EnableLogEntries == '1' && nRecord.getValue('custpage_ava_context') != 'WEBSTORE' && nRecord.getValue('custpage_ava_context') != 'WEBAPPLICATION' && nRecord.getValue('custpage_ava_context') != 'PAYMENTPOSTBACK' && err.code != 'GetTaxError' && err.code != 'InvalidAddress'){
					var avaDocType = taxLibrary.AVA_RecordType(nRecord.type);
					ava_library.mainFunction('AVA_Logs', (configCache.AVA_AccountValue + '~~' + configCache.AVA_ServiceUrl + '~~' + AVA_LineCount + '~~' + 'GetTax' + '~~' + nRecord.id + '~~' + '' + '~~' + '' + '~~' + 'CreateOrAdjustTransaction' + '~~' + 'Debug' + '~~' + 'Error' + '~~' + nRecord.type + '~~' + 'AVA_CalcTax' + '~~' + err.message + '~~' + err.code + '~~' + 0 + '~~' + nRecord.getValue('custpage_ava_taxcodestatus') + '~~' + avaDocType + '~~' + nRecord.getValue('custpage_ava_details')));
				}
				
				nRecord.setValue({
					fieldId: 'custpage_ava_document',
					value: false,
					ignoreFieldChange: true
				});
				
				if(err.code == 'GetTaxError' || err.code == 'InvalidAddress'){
					if(nRecord.getValue('custpage_ava_taxcodestatus') == 0 && (configCache.AVA_ShowMessages == 2 || configCache.AVA_ShowMessages == 3)){
						AVA_ErrorCode = err.message;
						alert("This Document has used AvaTax Services. " + err.message);
					}
					else{
						AVA_ErrorCode = err.message;
						log.debug({
							title: 'Error Message',
							details: err.message
						});
					}
				}
				else{
					if(nRecord.getValue('custpage_ava_taxcodestatus') == 0 && (configCache.AVA_ShowMessages == 2 || configCache.AVA_ShowMessages == 3)){
						alert("Please contact the administrator. " + err.message);
						AVA_ErrorCode = 'Please contact the Administrator. ' + err.message;
					}
					else{
						log.debug({
							title: 'Please contact the administrator'
						});
						log.debug({
							title: 'Try/Catch Error',
							details: err.message
						});
						AVA_ErrorCode = err.message;
					}
				}
				
				return false;
			}
			
			taxLibrary.AVA_LogTaxResponse(nRecord, configCache, 'T', response, startTime);
			return true;
		}
		
		function AVA_UpdateTaxDetails(nRecord, configCache, getTaxResult){
			var invoiceMsg = '';
			var responseLineTax = new Array();
			var showTaxRate, showDecimalPlaces;
			
			showTaxRate = configCache.AVA_TaxRate;
			showDecimalPlaces = configCache.AVA_DecimalPlaces;
			
			var messages = getTaxResult.messages;
			
			for(var i = 0; messages != null && i < messages.length; i++){
				if(messages[i].summary == 'Invoice  Messages for the transaction'){
					var messageInfo = JSON.parse(messages[i].details);
					var masterList = messageInfo.InvoiceMessageMasterList;
					
					for(var j in masterList){
						if(j != 0){
							invoiceMsg += masterList[j].Message + '.\n';
						}
					}
					
					break;
				}
			}
			
			nRecord.setValue({
				fieldId: 'custbody_ava_invoicemessage',
				value: invoiceMsg,
				ignoreFieldChange: true
			});
			
			var responseLineArray = getTaxResult.lines;
			
			for(var i = 0; responseLineArray != null && i < responseLineArray.length; i++){
				responseLineTax[i] = (responseLineArray[i].tax != 0 ) ? 'T' : 'F';
			}
			
			for(var i = 0; AVA_TaxRequestLines != null && i < AVA_TaxRequestLines.length; i++){
				var taxAmount = responseLineArray[i].tax;
				
				nRecord.setSublistValue({
					sublistId: AVA_TaxRequestLines[i][0],
					fieldId: 'tax1amt',
					line: AVA_TaxRequestLines[i][2],
					value: format.parse({
						value: taxAmount,
						type: format.Type.CURRENCY
					})
				});
				
				if(responseLineArray[i].tax == 0){
					nRecord.setSublistValue({
						sublistId: AVA_TaxRequestLines[i][0],
						fieldId: 'taxrate1',
						line: AVA_TaxRequestLines[i][2],
						value: 0
					});
				}
				else if(responseLineTax[i] == 'T'){
					var taxrate = 0;
					var details = responseLineArray[i].details;
					
					for(var j = 0; details != null && j < details.length; j++){
						taxrate += details[j].rate;
					}
					
					nRecord.setSublistValue({
						sublistId: AVA_TaxRequestLines[i][0],
						fieldId: 'taxrate1',
						line: AVA_TaxRequestLines[i][2],
						value: (taxrate * 100).toFixed(showDecimalPlaces)
					});
				}
				
				if(responseLineArray[i].vatCode != null && responseLineArray[i].vatCode.length > 0){
					nRecord.setSublistValue({
						sublistId: AVA_TaxRequestLines[i][0],
						fieldId: 'custcol_ava_vatcode',
						line: AVA_TaxRequestLines[i][2],
						value: responseLineArray[i].vatCode
					});
				}
			}
		}
		
		function AVA_Validation(value){
			if(value != 'null' && value != '' && value != undefined && value != 'NaN' && value != 'undefined' && value != '- None -'){
				return true;
			} 
			else{
				return false;
			}
		}
		
		return{
			AVA_PurchaseTransactionBeforeLoad: AVA_PurchaseTransactionBeforeLoad,
			AVA_PurchaseTransactionBeforeSubmit: AVA_PurchaseTransactionBeforeSubmit,
			AVA_PurchaseTransactionAfterSubmit: AVA_PurchaseTransactionAfterSubmit,
			AVA_PurchaseTransactionFieldChangedEvent: AVA_PurchaseTransactionFieldChangedEvent,
			AVA_PurchaseTransactionSaveEvent: AVA_PurchaseTransactionSaveEvent,
			AVA_VerifyTaxOnDemand: AVA_VerifyTaxOnDemand,
			AVA_PurchaseTransBeforeLoad: AVA_PurchaseTransBeforeLoad,
			AVA_PurchaseTransBeforeSubmit: AVA_PurchaseTransBeforeSubmit,
			AVA_PurchaseTransAfterSubmit: AVA_PurchaseTransAfterSubmit
		};
	}
);