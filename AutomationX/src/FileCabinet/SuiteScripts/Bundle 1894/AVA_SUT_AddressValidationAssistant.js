/******************************************************************************************************
	Script Name - AVA_SUT_AddressValidationAssistant.js
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
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 16);
			}
			
			if(checkServiceSecurity == 0){
				var assistant = ui.createAssistant({
				    title: 'Address Validation Assistant'
				});
				
				assistant.addStep({
					id: 'ava_validationtype',
					label: 'Select Type'
				}).helpText = 'Select the type of <b>record</b> below, for which you want to perform the address validation.';
				assistant.addStep({
					id: 'ava_filtercriteria',
					label: 'Set Data Filter'
				}).helpText = 'Select the option to filter the records below.';
				assistant.addStep({
					id: 'ava_summary',
					label: 'Summary Information'
				}).helpText = 'Summary of your Assistant Work.<br> You have made the following choices to run Address Validation process.';
				
				if(context.request.method === 'GET'){
					assistant.clientScriptModulePath = './AVA_CLI_AddressValidationAssistant.js';
					
					if(!assistant.isFinished()){
						if(assistant.currentStep == null){
							assistant.currentStep = assistant.getStep({
								id: 'ava_validationtype'
							});
							assistant.setSplash({
								title: 'Welcome to the AvaTax Address Validation Assistant!',
								text1: '<b>What you\'ll be doing</b><br>The AvaTax Address Validation Setup Assistant will walk you through the process of configuring your NetSuite account to run Address validation utility..',
								text2: '<b>When you finish</b><br>your account will be ready to run scheduled scripts to validate addresses as per the settings you made.'
							});
						}
						
						var step = assistant.currentStep;
						if(step.id == 'ava_validationtype'){
							assistant = addValidationTypePageFields(assistant);
						}
						else if(step.id == 'ava_filtercriteria'){
							assistant = addFilterCriteriaPageFields(assistant);
						}
						else if(step.id == 'ava_summary'){
							assistant = addSummaryPageFields(assistant);
						}
					}
					
					context.response.writePage({
						pageObject: assistant
					});
				}
				else{
					assistant.errorHtml = null;
					var lastAction = assistant.getLastAction();
					
					if(lastAction == ui.AssistantSubmitAction.FINISH){
						assistant = assistantSubmitActionFinished(assistant, context);
					}
					else if(lastAction == ui.AssistantSubmitAction.CANCEL){
						redirect.toTaskLink({
							id: 'CARD_-10'
						});
					}
					else{
						if(!assistant.hasErrorHtml()){
							assistant.currentStep = assistant.getNextStep();
						}
						
						assistant.sendRedirect({
				            response: context.response
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
		
		function addValidationTypePageFields(assistant){
			var lastStep = assistant.getLastStep();
			assistant.addFieldGroup({
				id: 'ava_recordtypegroup',
				label: 'What type of record you want to run the address validation against?'
			});
			var location = assistant.addField({
				id: 'ava_recordtype',
				label: 'Location',
				type: ui.FieldType.RADIO,
				source: 'l',
				container: 'ava_recordtypegroup'
			});
			assistant.addField({
				id: 'ava_recordtype',
				label: 'Customer',
				type: ui.FieldType.RADIO,
				source: 'c',
				container: 'ava_recordtypegroup'
			});
			
			var recordType;
			if(lastStep != null){
				recordType = lastStep.getValue({
					id: 'ava_recordtype'
				});
			}
			location.defaultValue = (recordType != null) ? recordType : 'l';
			
			return assistant;
		}
		
		function addFilterCriteriaPageFields(assistant){
			var lastStep = assistant.getLastStep();
			var lastStepRecordType = lastStep.getValue({
				id: 'ava_recordtype'
			});
			
			var recordType = assistant.addField({
				id: 'ava_recordtype',
				label: 'Record Type',
				type: ui.FieldType.TEXT
			});
			recordType.defaultValue = lastStepRecordType;
			recordType.updateDisplayType({
				displayType: ui.FieldDisplayType.HIDDEN
			});
			
			if(lastStepRecordType == 'l'){ // If record Type selected in last step was Location
				assistant = addLocationCriteriaFields(assistant);
			}
			else if(lastStepRecordType == 'c'){ // If record Type selected in last step was Customer
				assistant = addCustomerCriteriaFields(assistant);
			}
			
			return assistant;
		}
		
		function addLocationCriteriaFields(assistant){
			assistant.addField({
				id: 'ava_loctypelabel',
				label: 'Type of Location(s) to be validated',
				type: ui.FieldType.LABEL
			});
			var locType = assistant.addField({
				id: 'ava_loctype',
				label: 'All Locations',
				type: ui.FieldType.RADIO,
				source: 'a'
			});
			assistant.addField({
				id: 'ava_loctype',
				label: 'Specific Location(s)',
				type: ui.FieldType.RADIO,
				source: 'p'
			});
			locType.defaultValue = 'a';
			var  seperator = assistant.addField({
				id: 'ava_separator',
				label: '<hr><br>',
				type: ui.FieldType.HELP
			});
			seperator.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var locationList = assistant.addField({
				id: 'ava_locationlist',
				label: 'Select Location(s)',
				type: ui.FieldType.MULTISELECT,
				source: 'location'
			});
			locationList.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var locationListValues = assistant.addField({
				id: 'ava_locationlistvalues',
				label: 'Location List Values',
				type: ui.FieldType.LONGTEXT
			});
			locationListValues.updateDisplayType({
				displayType: ui.FieldDisplayType.HIDDEN
			});
			var subLoc = assistant.addField({
				id: 'ava_subloc',
				label: 'Include Sub-Location(s) ',
				type: ui.FieldType.CHECKBOX
			});
			subLoc.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var active = assistant.addField({
				id: 'ava_activechkbox',
				label: 'Only Active Records',
				type: ui.FieldType.CHECKBOX
			});
			active.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			active.defaultValue = 'T';
			var  seperator1 = assistant.addField({
				id: 'ava_separator1',
				label: '<hr><br>',
				type: ui.FieldType.HELP
			});
			seperator1.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			
			return assistant;
		}
		
		function addCustomerCriteriaFields(assistant){
			var type = assistant.addField({
				id: 'ava_typelabel',
				label: 'Type',
				type: ui.FieldType.LABEL
			});
			type.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var lead = assistant.addField({
				id: 'ava_type',
				label: 'Lead',
				type: ui.FieldType.RADIO,
				source: 'l'
			});
			lead.updateLayoutType({
				layoutType: ui.FieldLayoutType.MIDROW
			});
			var prospect = assistant.addField({
				id: 'ava_type',
				label: 'Prospect',
				type: ui.FieldType.RADIO,
				source: 'p'
			});
			prospect.updateLayoutType({
				layoutType: ui.FieldLayoutType.MIDROW
			});
			var customer = assistant.addField({
				id: 'ava_type',
				label: 'Customer',
				type: ui.FieldType.RADIO,
				source: 'c'
			});
			customer.updateLayoutType({
				layoutType: ui.FieldLayoutType.ENDROW
			});
			customer.defaultValue = 'c';
			assistant.addField({
				id: 'ava_separator',
				label: '<br>',
				type: ui.FieldType.HELP
			});
			var custType = assistant.addField({
				id: 'ava_custtypelabel',
				label: 'What type of customers?',
				type: ui.FieldType.LABEL
			});
			custType.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var individual = assistant.addField({
				id: 'ava_custtype',
				label: 'Individual',
				type: ui.FieldType.RADIO,
				source: 'i'
			});
			individual.updateLayoutType({
				layoutType: ui.FieldLayoutType.MIDROW
			});
			var company = assistant.addField({
				id: 'ava_custtype',
				label: 'Company',
				type: ui.FieldType.RADIO,
				source: 'c'
			});
			company.updateLayoutType({
				layoutType: ui.FieldLayoutType.MIDROW
			});
			var both = assistant.addField({
				id: 'ava_custtype',
				label: 'Both',
				type: ui.FieldType.RADIO,
				source: 'b'
			});
			both.updateLayoutType({
				layoutType: ui.FieldLayoutType.ENDROW
			});
			both.defaultValue = 'b';
			assistant.addField({
				id: 'ava_separator1',
				label: '<br>',
				type: ui.FieldType.HELP
			});
			assistant.addFieldGroup({
				id: 'ava_addfilters',
				label: 'Additional Filters'
			});
			var custName = assistant.addField({ // Added customer name filter for Address Validation Batch - CONNECT-3007
				id: 'ava_customername',
				label: 'Customer name starts with',
				type: ui.FieldType.TEXT,
				container: 'ava_addfilters'
			});
			custName.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			assistant.addField({
				id: 'ava_separator2',
				label: '<br>',
				type: ui.FieldType.HELP,
				container: 'ava_addfilters'
			});
			var dateRangeLabel = assistant.addField({
				id: 'ava_daterangelabel',
				label: 'Date Created',
				type: ui.FieldType.LABEL,
				container: 'ava_addfilters'
			});
			dateRangeLabel.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var startDate = assistant.addField({
				id: 'ava_startdate',
				label: 'Start Date',
				type: ui.FieldType.DATE,
				container: 'ava_addfilters'
			});
			startDate.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var endDate = assistant.addField({
				id: 'ava_enddate',
				label: 'End Date',
				type: ui.FieldType.DATE,
				container: 'ava_addfilters'
			});
			endDate.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var addrTypeLabel = assistant.addField({
				id: 'ava_addresstypelabel',
				label: '<br>Address Type',
				type: ui.FieldType.LABEL,
				container: 'ava_addfilters'
			});
			addrTypeLabel.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var allType = assistant.addField({
				id: 'ava_addresstype',
				label: 'All',
				type: ui.FieldType.RADIO,
				source: 'a',
				container: 'ava_addfilters'
			});
			assistant.addField({
				id: 'ava_addresstype',
				label: 'Default Billing',
				type: ui.FieldType.RADIO,
				source: 'b',
				container: 'ava_addfilters'
			});
			assistant.addField({
				id: 'ava_addresstype',
				label: 'Default Shipping',
				type: ui.FieldType.RADIO,
				source: 's',
				container: 'ava_addfilters'
			});
			assistant.addField({
				id: 'ava_addresstype',
				label: 'Default Billing & Shipping',
				type: ui.FieldType.RADIO,
				source: 'd',
				container: 'ava_addfilters'
			});
			allType.defaultValue = 'a';
			assistant.addField({
				id: 'ava_separator3',
				label: '<br>',
				type: ui.FieldType.HELP,
				container: 'ava_addfilters'
			});
			var active = assistant.addField({
				id: 'ava_activechkbox',
				label: 'Only Active Records',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_addfilters'
			});
			active.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			active.defaultValue = 'T';
			
			return assistant;
		}
		
		function addSummaryPageFields(assistant){
			var vtStep = assistant.getStep({
				id: 'ava_validationtype'
			});
			var fcStep = assistant.getStep({
				id: 'ava_filtercriteria'
			});
			assistant.addFieldGroup({
				id: 'ava_validationsummary',
				label: 'Address Validation Process Summary'
			});
			var recordTypeLabel = assistant.addField({
				id: 'ava_recordtype1',
				label: 'What type of record you want to run Address Validation for?',
				type: ui.FieldType.LABEL,
				container: 'ava_validationsummary'
			});
			recordTypeLabel.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var recordType = vtStep.getValue({
				id: 'ava_recordtype'
			});
			var recType = assistant.addField({
				id: 'ava_recordtype',
				label: 'Record Type',
				type: ui.FieldType.TEXT
			});
			recType.defaultValue = recordType;
			recType.updateDisplayType({
				displayType: ui.FieldDisplayType.HIDDEN
			});
			var recordTypeLabel1 = assistant.addField({
				id: 'ava_recordtypelabel',
				label: (recordType == 'l' ? 'Location' : 'Customer'),
				type: ui.FieldType.LABEL,
				container: 'ava_validationsummary'
			});
			recordTypeLabel1.updateLayoutType({
				layoutType: ui.FieldLayoutType.MIDROW
			});
			
			if(recordType == 'l'){
				assistant = addSummaryPageLocationFields(assistant, fcStep);
			}
			else if(recordType == 'c'){
				assistant = addSummaryPageCustomerFields(assistant, fcStep);
			}
			
			assistant.addField({
				id: 'ava_separator1',
				label: '<br><hr><br>',
				type: ui.FieldType.HELP,
				container: 'ava_validationsummary'
			});
			var batchName = assistant.addField({
				id: 'ava_batchname',
				label: 'Batch Name',
				type: ui.FieldType.TEXT,
				container: 'ava_validationsummary'
			});
			batchName.setHelpText({
				help: 'Provide a unique Batch Name to save the above choices for future reference.',
				showInlineForAssistant: true
			});
			batchName.isMandatory = true;
			var batchDesc = assistant.addField({
				id: 'ava_batchdesc',
				label: 'Description',
				type: ui.FieldType.TEXTAREA,
				container: 'ava_validationsummary'
			});
			batchDesc.setHelpText({
				help: '(Optional) Provide a useful description for this validation.',
				showInlineForAssistant: true
			});
			assistant.addField({
				id: 'ava_separator2',
				label: '<br><hr><br>',
				type: ui.FieldType.HELP,
				container: 'ava_validationsummary'
			});
			
			return assistant;
		}
		
		function addSummaryPageLocationFields(assistant, fcStep){
			var locType = fcStep.getValue({
				id: 'ava_loctype'
			});
			
			if(locType == 'p'){
				var locationLabel = assistant.addField({
					id: 'ava_locationlabel',
					label: 'Location(s)',
					type: ui.FieldType.LABEL,
					container: 'ava_validationsummary'
				});
				locationLabel.updateLayoutType({
					layoutType: ui.FieldLayoutType.STARTROW
				});
				
				var selectedLocString = '';
				var selectedLoc;
				selectedLoc = fcStep.getValue({
					id: 'ava_locationlistvalues'
				});
				selectedLoc = selectedLoc.split('+');
				
				var searchRecord = search.create({
					type: search.Type.LOCATION,
					filters: ['internalid', 'anyof', selectedLoc],
					columns: ['name']
				});
				var searchresult = searchRecord.run();
				searchresult = searchresult.getRange({
					start: 0,
					end: 1000
				});
				
				for(var i = 0; searchresult != null && i < searchresult.length; i++){
					selectedLocString += searchresult[i].getValue('name') + '\n';
				}
				
				var locationValue = assistant.addField({
					id: 'ava_locationvalue',
					label: ' ',
					type: ui.FieldType.TEXTAREA,
					container: 'ava_validationsummary'
				});
				locationValue.updateLayoutType({
					layoutType: ui.FieldLayoutType.STARTROW
				});
				locationValue.defaultValue = selectedLocString;
				locationValue.updateDisplayType({
					displayType: ui.FieldDisplayType.INLINE
				});
				var subLocation = assistant.addField({
					id: 'ava_includesubloc',
					label: 'Include Sub-Location(s)',
					type: ui.FieldType.CHECKBOX,
					container: 'ava_validationsummary'
				});
				subLocation.updateLayoutType({
					layoutType: ui.FieldLayoutType.STARTROW
				});
				subLocation.defaultValue = fcStep.getValue({
					id: 'ava_subloc'
				});
				subLocation.updateDisplayType({
					displayType: ui.FieldDisplayType.INLINE
				});
			}
			
			var active = assistant.addField({
				id: 'ava_activechkbxvalue',
				label: 'Only Active Records',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_validationsummary'
			});
			active.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			active.defaultValue = fcStep.getValue({
				id: 'ava_activechkbox'
			});
			active.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			
			return assistant;
		}
		
		function addSummaryPageCustomerFields(assistant, fcStep){
			var typeLabel = assistant.addField({
				id: 'ava_typelabel',
				label: 'Type',
				type: ui.FieldType.LABEL,
				container: 'ava_validationsummary'
			});
			typeLabel.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var subType = fcStep.getValue({
				id: 'ava_type'
			});
			var subTypeLabel = assistant.addField({
				id: 'ava_type',
				label: (subType == 'l' ? 'Lead' : (subType == 'p' ? 'Prospect' : 'Customer')),
				type: ui.FieldType.LABEL,
				container: 'ava_validationsummary'
			});
			subTypeLabel.updateLayoutType({
				layoutType: ui.FieldLayoutType.MIDROW
			});
			var custTypeLabel = assistant.addField({
				id: 'ava_custtypelabel',
				label: 'Type of Customers',
				type: ui.FieldType.LABEL,
				container: 'ava_validationsummary'
			});
			custTypeLabel.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var customerType = fcStep.getValue({
				id: 'ava_custtype'
			});
			var custSubTypeLabel = assistant.addField({
				id: 'ava_custtype',
				label: (customerType == 'i' ? 'Individual' : (customerType == 'c' ? 'Company' : 'Individuals and Companies')),
				type: ui.FieldType.LABEL,
				container: 'ava_validationsummary'
			});
			custSubTypeLabel.updateLayoutType({
				layoutType: ui.FieldLayoutType.MIDROW
			});
			
			var customerName = fcStep.getValue({
				id: 'ava_customername'
			});
			if(customerName != null && customerName.length > 0){ // display selected customer name
				var custName = assistant.addField({
					id: 'ava_custname',
					label: 'Customer Name Starts with',
					type: ui.FieldType.TEXT,
					container: 'ava_validationsummary'
				});
				custName.updateLayoutType({
					layoutType: ui.FieldLayoutType.STARTROW
				});
				custName.defaultValue = customerName;
				custName.updateDisplayType({
					displayType: ui.FieldDisplayType.INLINE
				});
			}
			
			var dateLabel = assistant.addField({
				id: 'ava_datelabel',
				label: 'Date Created',
				type: ui.FieldType.LABEL,
				container: 'ava_validationsummary'
			});
			dateLabel.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			
			var startDate = fcStep.getValue({
				id: 'ava_startdate'
			});
			var endDate = fcStep.getValue({
				id: 'ava_enddate'
			});
			if(startDate != null && endDate != null){
				var dateValue = assistant.addField({
					id: 'ava_datevalue',
					label: ((startDate != null && startDate.length > 0) ? startDate : '___') + ' to '+ (endDate != null && endDate.length > 0 ? endDate : '___'),
					type: ui.FieldType.LABEL,
					container: 'ava_validationsummary'
				});
				dateValue.updateLayoutType({
					layoutType: ui.FieldLayoutType.MIDROW
				});
			}
			
			var addrTypeLabel = assistant.addField({
				id: 'ava_addtypelabel',
				label: 'Address Type',
				type: ui.FieldType.LABEL,
				container: 'ava_validationsummary'
			});
			addrTypeLabel.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			var addressType = fcStep.getValue({
				id: 'ava_addresstype'
			});
			var addrType = assistant.addField({
				id: 'ava_addtype',
				label: (addressType == 'a' ? 'All' : (addressType == 'b' ? 'Default Billing' : (addressType == 's' ? 'Default Shipping' : 'Default Billing & Shipping'))),
				type: ui.FieldType.LABEL,
				container: 'ava_validationsummary'
			});
			addrType.updateLayoutType({
				layoutType: ui.FieldLayoutType.MIDROW
			});
			var active = assistant.addField({
				id: 'ava_activechkbxvalue',
				label: 'Only Active Records',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_validationsummary'
			});
			active.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			active.defaultValue = fcStep.getValue({
				id: 'ava_activechkbox'
			});
			active.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			
			return assistant;
		}
		
		function assistantSubmitActionFinished(assistant, context){
			saveBatch(assistant, context);
			
			var resultUrl = url.resolveScript({
				scriptId: 'customscript_avaaddvalidresults_suitelet',
				deploymentId: 'customdeploy_avaaddressvalidationresults'
			});
			var assistantUrl = url.resolveScript({
				scriptId: 'customscript_avaddressvalidation_suitlet',
				deploymentId: 'customdeploy_avaaddressvalidation'
			});
			
			var finishedText = "Congratulations! You have completed the AvaTax Address Validation Assistant.<tr><td colspan=2> &nbsp; </td></tr>";
			finishedText += "<tr><td colspan=2 class=text align=left>Quick Links</td></tr><tr><td class=textbold style='padding-left:50; padding-top:20' colspan=2 align=left valign=top><a href='" + resultUrl + "'>View Saved Batches</a></td></tr>";
			finishedText += "<tr><td class=text colspan=2 style='padding-left:50;' align=left valign=top>Click this link to review the list of address validation batches. You may start another Address Validation batch from this page.</td></tr>";
			finishedText += "<tr> <td class=textbold style='padding-left:50; padding-top:20' colspan=2 align=left valign=top><a href='" + assistantUrl + "'>Start Another Batch</a></td></tr>";
			finishedText += "<tr><td class=text colspan=2 style='padding-left:50;' align=left valign=top>Click this link to return to the beginning of the Address Validation assistant and start another batch.</td></tr>";
			
			var searchRecord = search.create({
				type: 'customrecord_avaaddressvalidationbatch',
				filters: ['custrecord_ava_status', 'lessthan', 2]
			});
			var searchresult = searchRecord.run();
			searchresult = searchresult.getRange({
				start: 0,
				end: 5
			});
			
			if(searchresult != null && searchresult.length == 1){
				var scriptTask = task.create({
					taskType: task.TaskType.MAP_REDUCE,
					scriptId: 'customscript_avaaddressvalidation_sched',
					deploymentId: 'customdeploy_addressvalidate'
				});
				
				scriptTask.submit();
			}
			
			assistant.finishedHtml = finishedText;
			assistant.sendRedirect({
	            response: context.response
	        });
			
			return assistant;
		}
		
		function saveBatch(assistant, context){
			var vtStep = assistant.getStep({
				id: 'ava_validationtype'
			});
			var fcStep = assistant.getStep({
				id: 'ava_filtercriteria'
			});
			var recordType = vtStep.getValue({
				id: 'ava_recordtype'
			});
			var validationRecord = record.create({
				type: 'customrecord_avaaddressvalidationbatch',
			});
			validationRecord.setValue({
				fieldId: 'name',
				value: context.request.parameters.ava_batchname
			});
			validationRecord.setValue({
				fieldId: 'custrecord_ava_batchdescription',
				value: context.request.parameters.ava_batchdesc
			});
			validationRecord.setValue({
				fieldId: 'custrecord_ava_recordtype',
				value: recordType
			});
			validationRecord.setValue({
				fieldId: 'custrecord_ava_progress',
				value: 0
			});
			validationRecord.setValue({
				fieldId: 'custrecord_ava_status',
				value: 0
			});
			validationRecord.setValue({
				fieldId: 'custrecord_ava_totaladdresses',
				value: 0
			});
			validationRecord.setValue({
				fieldId: 'custrecord_ava_validaddresses',
				value: 0
			});
			validationRecord.setValue({
				fieldId: 'custrecord_ava_invalidaddresses',
				value: 0
			});
			
			if(recordType == 'l'){
				validationRecord.setValue({
					fieldId: 'custrecord_ava_locationlist',
					value: fcStep.getValue({
						id: 'ava_locationlist'
					})
				});
				validationRecord.setValue({
					fieldId: 'custrecord_ava_locationaddresstype',
					value: fcStep.getValue({
						id: 'ava_loctype'
					})
				});
				var subLocation = fcStep.getValue({
					id: 'ava_subloc'
				});
				validationRecord.setValue({
					fieldId: 'custrecord_ava_includesublocations',
					value: (subLocation == 'T') ? true : false
				});
			}
			else if(recordType == 'c'){
				validationRecord.setValue({
					fieldId: 'custrecord_ava_customersubtype',
					value: fcStep.getValue({
						id: 'ava_type'
					})
				});
				validationRecord.setValue({
					fieldId: 'custrecord_ava_customertype',
					value: fcStep.getValue({
						id: 'ava_custtype'
					})
				});
				validationRecord.setValue({
					fieldId: 'custrecord_ava_custname',
					value: fcStep.getValue({
						id: 'ava_customername'
					})
				});
				var startDate = fcStep.getValue({
					id: 'ava_startdate'
				});
				validationRecord.setValue({
					fieldId: 'custrecord_ava_customerstartdate',
					value: (startDate != null && startDate.length > 0) ? ava_library.AVA_FormatDate(startDate) : ''
				});
				var endDate = fcStep.getValue({
					id: 'ava_enddate'
				});
				validationRecord.setValue({
					fieldId: 'custrecord_ava_customerenddate',
					value: (endDate != null && endDate.length > 0) ? ava_library.AVA_FormatDate(endDate) : ''
				});
				validationRecord.setValue({
					fieldId: 'custrecord_ava_custaddresstype',
					value: fcStep.getValue({
						id: 'ava_addresstype'
					})
				});
			}
			
			var active = fcStep.getValue({
				id: 'ava_activechkbox'
			});
			validationRecord.setValue({
				fieldId: 'custrecord_ava_onlyactive',
				value: (active == 'T') ? true : false
			});
			validationRecord.save({
			});
		}
		
		return{
			onRequest: onRequest
		};
	}
);