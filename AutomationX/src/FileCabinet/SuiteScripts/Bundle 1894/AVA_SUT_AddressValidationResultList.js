/******************************************************************************************************
	Script Name - AVA_SUT_AddressValidationResultList.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/record', 'N/search', 'N/url', 'N/redirect', 'N/log', './utility/AVA_Library'],
	function(ui, record, search, url, redirect, log, ava_library){
		var totalRec = 0, valCorrect = 0, valFail = 0, AVA_ListLimit = 10;
		
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'AddressSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 18);
			}
			
			if(checkServiceSecurity == 0){
				var batchId = context.request.parameters.ava_batchid;
				
				if(context.request.method === 'GET'){
					var form = ui.createForm({
						title: 'Address Validation Batch'
					});
					form.clientScriptModulePath = './AVA_CLI_AddressValidationResult.js';
					
					var batchStatus = context.request.parameters.ava_status;
					
					if(batchId == null || batchId == '' || batchStatus == null || batchStatus == ''){
						context.response.write({
							output: ava_library.mainFunction('AVA_NoticePage', 'Batch Name or Batch Status Missing')
						});
					}
					else{
						var batchRecord = record.load({
							type: 'customrecord_avaaddressvalidationbatch',
							id: batchId
						});
						
						var batchid = form.addField({
							id: 'ava_batchid',
							label: 'Batch Name',
							type: ui.FieldType.SELECT,
							source: 'customrecord_avaaddressvalidationbatch'
						});
						batchid.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						batchid.defaultValue = batchId;
						
						//Field - Record Type: Customer, Location or Subsidiary
						var recordType = batchRecord.getValue('custrecord_ava_recordtype');
						var recType = form.addField({
							id: 'ava_recordtype',
							label: 'Record Type',
							type: ui.FieldType.TEXT
						});
						recType.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						recType.defaultValue = (recordType == 'c') ? 'Customer' : (recordType == 's' ? 'Subsidiary' : 'Location');
						
						if(recordType == 'c'){ //for customer
							//Field - SubType : Lead, Prospect or Customer
							var custSubType = batchRecord.getValue('custrecord_ava_customersubtype');
							var subType = form.addField({
								id: 'ava_subtype',
								label: 'Sub Type',
								type: ui.FieldType.TEXT
							});
							subType.updateDisplayType({
								displayType: ui.FieldDisplayType.INLINE
							});
							subType.defaultValue = (custSubType == 'c') ? 'Customer' : (custSubType == 'l' ? 'Lead' : 'Prospect');
							
							//Field - Customer Type : Individual, Company or Both
							var customerType = batchRecord.getValue('custrecord_ava_customertype');
							var custType = form.addField({
								id: 'ava_custtype',
								label: 'Customer Type',
								type: ui.FieldType.TEXT
							});
							custType.updateDisplayType({
								displayType: ui.FieldDisplayType.INLINE
							});
							custType.defaultValue = (customerType == 'i') ? 'Individial' : (customerType == 'c' ? 'Company' : 'Individuals and Companies');
							
							//Field - Start Date 
							if(batchRecord.getValue('custrecord_ava_customerstartdate') != null && batchRecord.getValue('custrecord_ava_customerstartdate').toString().length > 0){
								var startDate = form.addField({
									id: 'ava_startdate',
									label: 'Start Date',
									type: ui.FieldType.DATE
								});
								startDate.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								startDate.defaultValue = batchRecord.getValue('custrecord_ava_customerstartdate');
							}
							
							//Field - End Date 
							if(batchRecord.getValue('custrecord_ava_customerenddate') != null && batchRecord.getValue('custrecord_ava_customerenddate').toString().length > 0){
								var endDate = form.addField({
									id: 'ava_enddate',
									label: 'End Date',
									type: ui.FieldType.DATE
								});
								endDate.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								endDate.defaultValue = batchRecord.getValue('custrecord_ava_customerenddate');
							}
							
							// Field - Customer Name starts with
							if(batchRecord.getValue('custrecord_ava_custname') != null && batchRecord.getValue('custrecord_ava_custname').length > 0){
								var custName = form.addField({
									id: 'ava_custname',
									label: 'Customer Name starts with',
									type: ui.FieldType.TEXT
								});
								custName.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								custName.defaultValue =  batchRecord.getValue('custrecord_ava_custname');
							}
							
							//Field - Address Type: All (a), Default Billing (b), Default Shipping (s), Default Billing & Shipping (bs)
							var addType = batchRecord.getValue('custrecord_ava_custaddresstype');
							var addressType = form.addField({
								id: 'ava_addresstype',
								label: 'Address Type',
								type: ui.FieldType.TEXT
							});
							addressType.updateDisplayType({
								displayType: ui.FieldDisplayType.INLINE
							});
							addressType.updateLayoutType({
								layoutType: ui.FieldLayoutType.NORMAL
							});
							addressType.updateBreakType({
								breakType: ui.FieldBreakType.STARTCOL
							});
							addressType.defaultValue = (addType == 'a') ? 'All' : (addType == 'b' ? 'Default Billing' : (addType == 's' ? 'Default Shipping' : 'Default Billing & Shipping'));
						}
						else if(recordType == 'l'){ //for location
							//Field - Address Type: All Addresses (a), Specific Locations (p)
							var addType = batchRecord.getValue('custrecord_ava_locationaddresstype');
							var addressType = form.addField({
								id: 'ava_addresstype',
								label: 'Address Type',
								type: ui.FieldType.TEXT
							});
							addressType.updateDisplayType({
								displayType: ui.FieldDisplayType.INLINE
							});
							addressType.updateLayoutType({
								layoutType: ui.FieldLayoutType.NORMAL
							});
							addressType.updateBreakType({
								breakType: ui.FieldBreakType.STARTCOL
							});
							addressType.defaultValue = (addType == 'a') ? 'All' : 'Specific Location(s)';
							
							if(addType == 'p'){
								//Field - Selected Locations
								var location = form.addField({
									id: 'ava_locations',
									label: 'Selected Locations',
									type: ui.FieldType.MULTISELECT,
									source: 'location'
								});
								location.updateDisplayType({
									displayType: ui.FieldDisplayType.INLINE
								});
								location.defaultValue = batchRecord.getValue('custrecord_ava_locationlist');
							}
						}
						
						//Field - Only Active records
						var active = form.addField({
							id: 'ava_onlyactive',
							label: 'Include Inactive',
							type: ui.FieldType.CHECKBOX
						});
						active.updateDisplayType({
							displayType: ui.FieldDisplayType.INLINE
						});
						active.defaultValue = (batchRecord.getValue('custrecord_ava_onlyactive') == true) ? 'T' : 'F';
						
						var criteria = form.addField({
							id: 'ava_status',
							label: 'Sublist Criteria',
							type: ui.FieldType.SELECT
						});
						criteria.addSelectOption({
							value : '0',
							text: 'All'
						});
						criteria.addSelectOption({
							value : '1',
							text: 'Validated - address not updated'
						});
						criteria.addSelectOption({
							value : '2',
							text: 'Not Validated'
						});
						criteria.addSelectOption({
							value : '3',
							text: 'Validated - address updated'
						});
						criteria.addSelectOption({
							value : '4',
							text: 'Update failed'
						});
						criteria.defaultValue = batchStatus;
						
						totalRec = batchRecord.getValue('custrecord_ava_totaladdresses');
						valCorrect = batchRecord.getValue('custrecord_ava_validaddresses');
						valFail = batchRecord.getValue('custrecord_ava_invalidaddresses');
						
						AVA_SetResultSublist(context, form, recordType, batchRecord.id);
						
						var resultsList = form.getSublist({
							id: 'custpage_avaresults'
						});
						
						log.debug({
							title: 'results count',
							details: resultsList.lineCount
						});
						log.debug({
							title: 'custrecord_ava_status',
							details: batchRecord.getValue('custrecord_ava_status')
						});
						log.debug({
							title: 'BatchStatus',
							details: batchStatus
						});
						log.debug({
							title: 'ava_mode',
							details: context.request.parameters.ava_mode
						});
						
						if((resultsList.lineCount == -1 || resultsList.lineCount > 0) && (batchRecord.getValue('custrecord_ava_status') == '2' || batchRecord.getValue('custrecord_ava_status') == '3') && batchStatus == '1' && context.request.parameters.ava_mode == 'view'){
							form.addButton({
								id: 'ava_updatebutton',
								label: 'Update Validated Records',
								functionName: 'AVA_UpdateBatchRecords'
							});
						}
						
						if(context.request.parameters.ava_mode == 'edit'){
							form.addSubmitButton({
								label: 'Submit'
							});
						}
						
						form.addButton({
							id: 'ava_exportcsv',
							label: 'Export CSV',
							functionName: 'AVA_ExportCSV'
						});
						
						try{
							var temphtml = '<span style="padding: 10px 25px; display: inline-block; position: relative; left: -20px; margin-bottom: 5px;" class="bgmd"><img src="/images/x.gif" class="totallingTopLeft"><img src="/images/x.gif" class="totallingTopRight"><img src="/images/x.gif" class="totallingBottomLeft"><img src="/images/x.gif" class="totallingBottomRight"><table cellspacing="0" cellpadding="0" border="0" class="totallingtable">';
							temphtml += '<tbody><tr><td><span class="smallgraytextnolink">Total Addresses  &nbsp;&nbsp;</span></td><td ALIGN="right"><span class="smallgraytextnolink">' + totalRec + '</span></td></tr><tr><td>&nbsp;&nbsp;</td><td>&nbsp;&nbsp;</td></tr>';
							temphtml += '<tr><td><span class="smallgraytextnolink">*Valid Addresses &nbsp;&nbsp;</span></td><td ALIGN="right"><span class="smallgraytextnolink">' + valCorrect + '</span></td></tr><tr><td>&nbsp;&nbsp;</td><td>&nbsp;&nbsp;</td></tr>';
							temphtml += '<tr><td><span class="smallgraytextnolink">Non-Valid Addresses &nbsp;&nbsp;</span></td><td ALIGN="right"><span class="smallgraytextnolink">' + valFail + '</span></td></tr></tbody></table></span>';
							
							var stats = form.addField({
								id: 'ava_stats',
								label: ' ',
								type: ui.FieldType.INLINEHTML
							});
							stats.updateLayoutType({
								layoutType: ui.FieldLayoutType.NORMAL
							});
							stats.updateBreakType({
								breakType: ui.FieldBreakType.STARTCOL
							});
							stats.defaultValue = temphtml;			
						}
						catch(err){
							var totalRecord = form.addField({
								id: 'ava_totalrec',
								label: 'Total Addresses ',
								type: ui.FieldType.TEXT
							});
							totalRecord.updateDisplayType({
								displayType: ui.FieldDisplayType.INLINE
							});
							totalRecord.updateLayoutType({
								layoutType: ui.FieldLayoutType.NORMAL
							});
							totalRecord.updateBreakType({
								breakType: ui.FieldBreakType.STARTCOL
							});
							totalRecord.defaultValue = totalRec;
							
							var validAddress = form.addField({
								id: 'ava_valcorrect',
								label: '*Valid Addresses ',
								type: ui.FieldType.TEXT
							});
							validAddress.updateDisplayType({
								displayType: ui.FieldDisplayType.INLINE
							});
							validAddress.defaultValue = valCorrect;
							
							var nonValidAddress = form.addField({
								id: 'ava_valfail',
								label: 'Non-Valid Addresses ',
								type: ui.FieldType.TEXT
							});
							nonValidAddress.updateDisplayType({
								displayType: ui.FieldDisplayType.INLINE
							});
							nonValidAddress.defaultValue = valFail;
						}
						
						form.addField({
							id: 'ava_help',
							label: '*Includes addresses that exist in Validation Saved status also',
							type: ui.FieldType.HELP
						});
						
						context.response.writePage({
							pageObject: form
						});
					}
				}
				else{
					var lineCount = context.request.getLineCount({
						group: 'custpage_avaresults'
					});
					
					if(context.request.parameters.ava_status == 1 && lineCount > 0){
						for(var i = 0; i < lineCount; i++){
							var validationStatus = search.lookupFields({
								type: 'customrecord_avaaddvalidationbatchrecord',
								id: context.request.getSublistValue('custpage_avaresults', 'ava_id', i),
								columns: 'custrecord_ava_validationstatus'
							});
							
							if(context.request.getSublistValue('custpage_avaresults', 'ava_update', i) == true && validationStatus.custrecord_ava_validationstatus != '3'){
								record.submitFields({
									type: 'customrecord_avaaddvalidationbatchrecord',
									id: context.request.getSublistValue('custpage_avaresults', 'ava_id', i),
									values: {'custrecord_ava_validationstatus': '3'}
								});
							}
							else if(context.request.getSublistValue('custpage_avaresults', 'ava_update', i) == false && validationStatus.custrecord_ava_validationstatus == '3'){
								record.submitFields({
									type: 'customrecord_avaaddvalidationbatchrecord',
									id: context.request.getSublistValue('custpage_avaresults', 'ava_id', i),
									values: {'custrecord_ava_validationstatus': '1'}
								});
							}
						}
						
						record.submitFields({
							type: 'customrecord_avaaddressvalidationbatch',
							id: context.request.parameters.ava_batchid,
							values: {'custrecord_ava_status': '4'}
						});
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
		
		function AVA_SetResultSublist(context, form, recordType, batchId){
			var listStart = (context.request.parameters.ava_start == null || (context.request.parameters.ava_start != null && (context.request.parameters.ava_start).length == 0)) ? 0 : context.request.parameters.ava_start;
			var listEnd = (context.request.parameters.ava_end != null && (context.request.parameters.ava_end).length > 0) ? context.request.parameters.ava_end : 0;
			
			form.addTab({
				id: 'custpage_avatab',
				label: 'Sample Tab'
			});
			
			var FirstLink = '&lt;&lt;First Page';
			var PrevLink = 'Previous';
			var NextLink = 'Next';
			var LastLink = 'Last Page&gt;&gt;';
			
			var resultsList = form.addSublist({
				id: 'custpage_avaresults',
				label: 'Results',
				type: ui.SublistType.LIST,
				container: 'custpage_avatab'
			});
			
			if(context.request.parameters.ava_mode == 'edit'){
				resultsList.addMarkAllButtons();

				var avaId = resultsList.addField({
					id: 'ava_id',
					label: 'ID',
					type: ui.FieldType.TEXT
				});
				avaId.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				resultsList.addField({
					id: 'ava_update',
					label: 'Update',
					type: ui.FieldType.CHECKBOX
				});
			}
			
			resultsList.addField({
				id: 'ava_name',
				label: 'Name',
				type: ui.FieldType.TEXT
			});
			resultsList.addField({
				id: 'ava_addtype',
				label: 'Address Type',
				type: ui.FieldType.TEXT
			});
			resultsList.addField({
				id: 'ava_origadd',
				label: 'Original Address',
				type: ui.FieldType.TEXTAREA
			});
			resultsList.addField({
				id: 'ava_validadd',
				label: 'Validated Address',
				type: ui.FieldType.TEXTAREA
			});
			resultsList.addField({
				id: 'ava_status',
				label: 'Status',
				type: ui.FieldType.TEXT
			});
			resultsList.addField({
				id: 'ava_error',
				label: 'Message',
				type: ui.FieldType.TEXT
			});
			
			//add values to sublist
			var filter = new Array();
			var filterprev = new Array();
			var filternext = new Array();
			
			filter[filter.length] = search.createFilter({
				name: 'custrecord_ava_validationbatch',
				operator: search.Operator.ANYOF,
				values: batchId
			});
			filterprev[filterprev.length] = search.createFilter({
				name: 'custrecord_ava_validationbatch',
				operator: search.Operator.ANYOF,
				values: batchId
			});
			filternext[filternext.length] = search.createFilter({
				name: 'custrecord_ava_validationbatch',
				operator: search.Operator.ANYOF,
				values: batchId
			});
			
			log.debug({
				title: 'Status',
				details: context.request.parameters.ava_status
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
				
				filterprev[filterprev.length] = search.createFilter({
					name: 'custrecord_ava_validationstatus',
					operator: search.Operator.ISNOT,
					values: '2'
				});
				filterprev[filterprev.length] = search.createFilter({
					name: 'custrecord_ava_validationstatus',
					operator: search.Operator.ISNOT,
					values: '4'
				});
				
				filternext[filternext.length] = search.createFilter({
					name: 'custrecord_ava_validationstatus',
					operator: search.Operator.ISNOT,
					values: '2'
				});
				filternext[filternext.length] = search.createFilter({
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
				filterprev[filterprev.length] = search.createFilter({
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
				filterprev[filterprev.length] = search.createFilter({
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
				filterprev[filterprev.length] = search.createFilter({
					name: 'custrecord_ava_validationstatus',
					operator: search.Operator.IS,
					values: '5'
				});
			}
			
			// for Next Page
			if(context.request.parameters.ava_end != null && context.request.parameters.ava_page == 'n'){
				filter[filter.length] = search.createFilter({
					name: 'INTERNALIDNUMBER',
					operator: search.Operator.GREATERTHAN,
					values: parseInt(context.request.parameters.ava_end)
				});
			}
			
			// for First and Prev Page
			if(context.request.parameters.ava_start != null && context.request.parameters.ava_page == 'p'){
				filter[filter.length] = search.createFilter({
					name: 'INTERNALIDNUMBER',
					operator: search.Operator.LESSTHAN,
					values: parseInt(context.request.parameters.ava_start)
				});
			}
			
			var cols = [
						 	search.createColumn({
						 		name: 'internalid',
						 		sort: (context.request.parameters.ava_page == 'p' || context.request.parameters.ava_page == 'l') ? search.Sort.DESC : search.Sort.ASC
				            }),
						 	'custrecord_ava_recordname',
						 	'custrecord_ava_validatedrecordtype',
						 	'custrecord_ava_validatedrecordid',
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
			searchRecord = searchRecord.getRange({
				start: 0,
				end: 1000
			});
			
			if(context.request.parameters.ava_page == 'p' || context.request.parameters.ava_page == 'l'){
				if(context.request.parameters.ava_page == 'l'){
					var count = (context.request.parameters.ava_status == '0' ? totalRec : (context.request.parameters.ava_status == '1' ? valCorrect : valFail));
					AVA_ListLimit = parseInt(count - (Math.floor(count/AVA_ListLimit) * AVA_ListLimit));
				}
				
				var tempRecArray = new Array();
				var arrayCtr = 0;
				while(tempRecArray.length != AVA_ListLimit){
					tempRecArray[tempRecArray.length] = searchRecord[arrayCtr];
					arrayCtr++;
				}
				
				searchRecord = new Array();
				for(var m = 0, ctr = tempRecArray.length - 1; searchRecord.length != tempRecArray.length; m++, ctr--){
					searchRecord[m] = tempRecArray[ctr];
				}
			}
			
			if(searchRecord != null && searchRecord.length > 0){
				log.debug({
					title: 'ava_page: ' + context.request.parameters.ava_page,
					details: searchRecord.length
				});
				
				listStart = searchRecord[0].id;
				
				for(var i = 0; i < Math.min(AVA_ListLimit, searchRecord.length); i++){
					resultsList.setSublistValue({
						id: 'ava_id',
						line: i,
						value: searchRecord[i].id
					});
					
					var recType = searchRecord[i].getValue('custrecord_ava_validatedrecordtype');
					var addType = searchRecord[i].getValue('custrecord_ava_addresstype');
					addType = (recType == 'c') ? (addType == 'd' ? 'Default Billing & Shipping' : (addType == 'b' ? 'Default Billing' : (addType == 's' ? 'Default Shipping' : ''))) : (addType == 'm' ? 'Main' : 'Return');
					recType = (recType == 'c' ? 'customer' : 'location');
					
					var displayName = searchRecord[i].getValue('custrecord_ava_recordname');
					resultsList.setSublistValue({
						id: 'ava_name',
						line: i,
						value: displayName
					});
					resultsList.setSublistValue({
						id: 'ava_addtype',
						line: i,
						value: (addType != null && addType.length) ? addType : ' '
					});
					
					var orgAdd = (searchRecord[i].getValue('custrecord_ava_origline1') != null && searchRecord[i].getValue('custrecord_ava_origline1') != '') ? searchRecord[i].getValue('custrecord_ava_origline1') + ' \n' : '';
					orgAdd += (searchRecord[i].getValue('custrecord_ava_origline2') != null && searchRecord[i].getValue('custrecord_ava_origline2') != '') ? searchRecord[i].getValue('custrecord_ava_origline2') + ' \n' : '';
					orgAdd += (searchRecord[i].getValue('custrecord_ava_origline3') != null && searchRecord[i].getValue('custrecord_ava_origline3') != '') ? searchRecord[i].getValue('custrecord_ava_origline3') + ' \n' : '';
					orgAdd += searchRecord[i].getValue('custrecord_ava_origcity') + ' \n';
					orgAdd += searchRecord[i].getValue('custrecord_ava_origstate') + ' \n';
					orgAdd += searchRecord[i].getValue('custrecord_ava_origzip') + ' \n';
					orgAdd += searchRecord[i].getValue('custrecord_ava_origcountry') + ' \n';
					
					resultsList.setSublistValue({
						id: 'ava_origadd',
						line: i,
						value: orgAdd
					});
					
					var valAdd = (searchRecord[i].getValue('custrecord_ava_validatedline1') != null && searchRecord[i].getValue('custrecord_ava_validatedline1') != '') ? searchRecord[i].getValue('custrecord_ava_validatedline1') + ' \n' : '';
					valAdd += (searchRecord[i].getValue('custrecord_ava_validatedline2') != null && searchRecord[i].getValue('custrecord_ava_validatedline2') != '') ? searchRecord[i].getValue('custrecord_ava_validatedline2') + ' \n' : '';
					valAdd += (searchRecord[i].getValue('custrecord_ava_validatedline3') != null && searchRecord[i].getValue('custrecord_ava_validatedline3') != '') ? searchRecord[i].getValue('custrecord_ava_validatedline3') + ' \n' : '';
					valAdd += searchRecord[i].getValue('custrecord_ava_validatedcity') + ' \n';
					valAdd += searchRecord[i].getValue('custrecord_ava_validatedstate') + ' \n';
					valAdd += searchRecord[i].getValue('custrecord_ava_validatedzip') + ' \n';
					valAdd += searchRecord[i].getValue('custrecord_ava_validatedcountry') + ' \n';
					
					resultsList.setSublistValue({
						id: 'ava_validadd',
						line: i,
						value: valAdd
					});
					resultsList.setSublistValue({
						id: 'ava_error',
						line: i,
						value: (searchRecord[i].getValue('custrecord_ava_errormsg') != null && searchRecord[i].getValue('custrecord_ava_errormsg').length > 0) ? searchRecord[i].getValue('custrecord_ava_errormsg') : ' '
					});
					
					var valStatus = searchRecord[i].getValue('custrecord_ava_validationstatus');
					if(resultsList.getField('ava_update') != null){
						resultsList.setSublistValue({
							id: 'ava_update',
							line: i,
							value: (valStatus == '3') ? 'T' : 'F'
						});
					}
					
					resultsList.setSublistValue({
						id: 'ava_status',
						line: i,
						value: ((valStatus == '1') ? 'Validated' : ((valStatus == '2') ? 'Error' : ((valStatus == '3') ? 'To be Saved' : 'Validation Saved')))
					});
				}
				
				listEnd = searchRecord[i - 1].id;
				
				//First Page
				var url1 = url.resolveScript({
					scriptId: 'customscript_avaaddvalidlist_suitelet',
					deploymentId: 'customdeploy_avaaddressvalidlist'
				});
				url1 += '&ava_batchid=' + context.request.parameters.ava_batchid + '&ava_status=' + context.request.parameters.ava_status + '&ava_mode=' + (context.request.parameters.ava_mode == 'edit' ? 'edit' : 'view') + '&ava_start=' + listStart + '&ava_end=' + listEnd;
				
				//for First and Prev Page
				if(context.request.parameters.ava_page == 'p'){
					filterprev[filterprev.length] = search.createFilter({
						name: 'INTERNALIDNUMBER',
						operator: search.Operator.LESSTHAN,
						values: parseInt(listStart)
					});
				}
				
				var searchPrev = search.create({
					type: 'customrecord_avaaddvalidationbatchrecord',
					filters: filterprev,
					columns: cols
						
				});
				searchPrev = searchPrev.run();
				searchPrev = searchPrev.getRange({
					start: 0,
					end: 1000
				});
				
				if(context.request.parameters.ava_page != 'f' && searchPrev != null && searchPrev.length > 0){
					FirstLink = '<b><a href="' + url1 + '&ava_page=f' + '" onclick=AVA_PagingLinkClick()>\t\t\t\t&lt;&lt;First Page</a></b>';
					PrevLink = '<b>&nbsp;&nbsp;&nbsp;&nbsp;<a href="' + url1 + '&ava_page=p' + '" onclick=AVA_PagingLinkClick()>Previous</a></b>';
				}
				
				log.debug({
					title: 'Page: ' + context.request.parameters.ava_page + ' listEnd' + listEnd
				});
				
				if(context.request.parameters.ava_page == 'f' || context.request.parameters.ava_page == 'p' || context.request.parameters.ava_page == 'n'){
					filternext[filternext.length] = search.createFilter({
						name: 'INTERNALIDNUMBER',
						operator: search.Operator.GREATERTHAN,
						values: parseInt(listEnd)
					});
					log.debug({
						title: 'Filter Length ' + filternext.length
					});
					
					var searchNext = search.create({
						type: 'customrecord_avaaddvalidationbatchrecord',
						filters: filternext,
						columns: cols
							
					});
					searchNext = searchNext.run();
					searchNext = searchNext.getRange({
						start: 0,
						end: 1000
					});
					
					if(searchNext != null && searchNext.length > 0){
						NextLink = '<b>&nbsp;&nbsp;&nbsp;&nbsp;<a href="' + url1 + '&ava_page=n' + '" onclick=AVA_PagingLinkClick()>Next</a></b>';
						LastLink = '<b>&nbsp;&nbsp;&nbsp;&nbsp;<a href="' + url1 + '&ava_page=l' + '" onclick=AVA_PagingLinkClick()>Last Page&gt;&gt;</a></b>';
					}
				}
			}
			
			var emptyCells = '<td></td><td></td><td></td><td></td><td></td><td></td><td></td>';
			var html = '<table cellspacing="20" align="center"><tr>' + emptyCells + emptyCells + '<td><font size="2">' + FirstLink + '</font></td><td><font size="2">|&nbsp;&nbsp;&nbsp;&nbsp;' + PrevLink + '</font></td>';
			html +='<td><font size="2">|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + NextLink + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|</font></td><td><font size="2">' + LastLink + '</font></td></tr></table>';
			
			var pagingHtml = form.addField({
				id: 'ava_pagelinks',
				label: html,
				type: ui.FieldType.HELP
			});
			pagingHtml.updateLayoutType({
				layoutType: ui.FieldLayoutType.OUTSIDEBELOW
			});
			pagingHtml.updateBreakType({
				breakType: ui.FieldBreakType.STARTROW
			});
		}
		
		return{
			onRequest: onRequest
		};
	}
);