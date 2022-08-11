/******************************************************************************************************
	Script Name - 	AVA_SUT_SetupAssistant1.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/config', 'N/search', 'N/record', 'N/redirect', './utility/AVA_Library', './utility/AVA_CommonServerFunctions'],
	function(ui, config, search, record, redirect, ava_library, ava_commonFunction){
		function onRequest(context){
			if(context.request.method === 'GET'){
				var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
				
				if(avaConfigObjRec['AVA_ConfigFlag'] == false){
					var form = ui.createForm({
						title: 'Setup Assistant'
					});
					form.clientScriptModulePath = './AVA_CLI_Config.js';
					
					var accountValue = form.addField({
						id: 'ava_accvalue',
						label: 'Account Number',
						type: ui.FieldType.TEXT
					});
					accountValue.updateDisplayType({
						displayType: ui.FieldDisplayType.DISABLED
					});
					accountValue.updateDisplaySize({
						width: 40,
						height: 0
					});
					accountValue.setHelpText('This is your Account Number in AvaTax.<br><br> Select Settings > All AvaTax settings. The account number is listed at the top of the page as your Account ID.');
					accountValue.defaultValue = avaConfigObjRec['AVA_AccountValue'];
					
					var licKey = form.addField({
						id: 'ava_lickey',
						label: 'License Key',
						type: ui.FieldType.PASSWORD
					});
					licKey.updateDisplayType({
						displayType: ui.FieldDisplayType.DISABLED
					});
					licKey.maxLength = 200;
					licKey.updateDisplaySize({
						width: 40,
						height: 0
					});
					licKey.setHelpText('This is the License Key you have generated in your AvaTax.');
					licKey.defaultValue = avaConfigObjRec['AVA_AdditionalInfo'];
					
					var serviceUrl = form.addField({
						id: 'ava_serviceurl',
						label: 'Service URL',
						type: ui.FieldType.SELECT
					});
					serviceUrl.addSelectOption({
						value : '0',
						text: 'Production'
					});
					serviceUrl.addSelectOption({
						value : '1',
						text: 'Development'
					});
					serviceUrl.updateDisplayType({
						displayType: ui.FieldDisplayType.DISABLED
					});
					serviceUrl.setHelpText("Select the type of AvaTax account you're connecting to in AvaTax.<br><br> Select 'Development' if you are in NetSuite Sandbox or Test environment.<br><br> Select 'Production' if you are in NetSuite Live / Production environment.");
					serviceUrl.defaultValue = avaConfigObjRec['AVA_ServiceUrl'];
					
					var avataxCompanyName = form.addField({
						id: 'ava_company',
						label: 'AvaTax Company Code/Name',
						type: ui.FieldType.SELECT
					});
					avataxCompanyName.isMandatory = true;
					avataxCompanyName.setHelpText({
						help: 'Company code is an unique identifier for your company. AvaTax creates this identifier and uses it during tax calculation.<br>Hit the \'Create Company\' button to proceed on company creation process.'
					});
					
					var details = ava_commonFunction.mainFunction('AVA_General', (avaConfigObjRec['AVA_AccountValue'] + '+' + avaConfigObjRec['AVA_AdditionalInfo'] + '+' + avaConfigObjRec['AVA_AdditionalInfo1'] + '+' + avaConfigObjRec['AVA_AdditionalInfo2']));
					var companyInfo = ava_library.mainFunction('AVA_CompanyFetch', (details + '~~' + avaConfigObjRec['AVA_ServiceUrl'])); // Fetch all the companies from Admin Console
					
					if(companyInfo != null && companyInfo.length > 0){
						avataxCompanyName.addSelectOption({
							value : '',
							text: '<Select Company>'
						});
						
						for(var i = 0; i < companyInfo.length; i++){
							avataxCompanyName.addSelectOption({
								value : companyInfo[i][0],
								text: (companyInfo[i][0] + ' : ' + companyInfo[i][1])
							});
						}
					}
					else{
						avataxCompanyName.addSelectOption({
							value : '',
							text: 'No Company found'
						});
					}
					
					var loadConfig = config.load({
						type: config.Type.COMPANY_INFORMATION
					});
					
					var netsuiteEdition = form.addField({
						id: 'ava_netsuitedition',
						label: 'NetSuite Edition',
						type: ui.FieldType.TEXT
					});
					netsuiteEdition.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					netsuiteEdition.defaultValue = loadConfig.getValue('country');
					
					form.addTab({
						id: 'ava_requiredparameter',
						label: 'Required Parameters'
					});
					
					var helpLabel = form.addField({
						id: 'ava_help',
						label: '<b>Connect to Avalara AvaTax</b><br>Please ensure the following are completed in order to start calculating with AvaTax.',
						type: ui.FieldType.LABEL,
						container: 'ava_requiredparameter'
					});
					helpLabel.updateLayoutType({
						layoutType: ui.FieldLayoutType.OUTSIDEBELOW
					});
					helpLabel.updateBreakType({
						breakType: ui.FieldBreakType.STARTROW
					});
					
					var taxAgencyId = form.addField({
						id: 'ava_taxagencyid',
						label: 'Tax agency ID',
						type: ui.FieldType.TEXT
					});
					taxAgencyId.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var searchVendorCategory = search.create({
						type: search.Type.VENDOR_CATEGORY,
						filters: 
							[
							 	['isinactive', 'is', 'F'],
							 	'and',
							 	['istaxagency', 'is', 'T']
							]
					});
					var searchResultVendorCategory = searchVendorCategory.run();
					searchResultVendorCategory = searchResultVendorCategory.getRange({
						start: 0,
						end: 5
					});
					
					var searchRecord = search.create({
						type: search.Type.VENDOR,
						filters: 
							[
							 	['isinactive', 'is', 'F'],
							 	'and',
							 	['entityid', 'contains', 'AVALARA'],
							 	'and',
							 	['category', 'anyof', searchResultVendorCategory[0].id]
							]
					});
					var searchresult = searchRecord.run();
					searchresult = searchresult.getRange({
						start: 0,
						end: 1000
					});
					
					var taxAgency;
					if(searchresult != null && searchresult.length > 0){
						taxAgency = form.addField({
							id: 'ava_taxagency',
							label: 'Tax Agency (Avalara) already created in NetSuite',
							type: ui.FieldType.CHECKBOX,
							container: 'ava_requiredparameter'
						});
						taxAgencyId.defaultValue = searchresult[0].id;
					}
					else{
						taxAgency = form.addField({
							id: 'ava_taxagency',
							label: 'Tax Agency (Avalara) is created in NetSuite',
							type: ui.FieldType.CHECKBOX,
							container: 'ava_requiredparameter'
						});
						
						var rec = record.create({
							type: record.Type.VENDOR
						});
						rec.setValue({
							fieldId: 'companyname',
							value: 'AVALARA'
						});
						rec.setValue({
							fieldId: 'category',
							value: searchResultVendorCategory[0].id
						});
						var recId = rec.save();
						
						taxAgencyId.defaultValue = recId;
					}

					taxAgency.setHelpText({
						help: 'You can set up a vendor as a tax agency as below:<br>By selecting Tax Agency in the Category field on the vendor record.<br><br>You can create new tax agency at Lists > Relationships > Vendors > New.<br>Recommended Tax Agency name is \'Avalara\'.'
					});
					taxAgency.updateDisplayType({
						displayType: ui.FieldDisplayType.DISABLED
					});
					taxAgency.defaultValue = 'T';
					taxAgency.updateLayoutType({
						layoutType: ui.FieldLayoutType.OUTSIDEBELOW
					});
					taxAgency.updateBreakType({
						breakType: ui.FieldBreakType.STARTROW
					});
					
					if(loadConfig.getValue('country') == 'US'){
						var searchRecord = search.create({
							type: search.Type.SALES_TAX_ITEM,
							filters: 
								[
								 	['isinactive', 'is', 'F'],
								 	'and',
								 	['country', 'anyof', 'US'],
								 	'and',
								 	['itemid', 'contains', 'AVATAX']
								]
						});
						var searchresult = searchRecord.run();
						searchresult = searchresult.getRange({
							start: 0,
							end: 1000
						});
						
						if(searchresult != null && searchresult.length > 0){
							var taxcode = form.addField({
								id: 'ava_taxcode',
								label: 'Tax Code (AVATAX) already created in NetSuite',
								type: ui.FieldType.CHECKBOX,
								container: 'ava_requiredparameter'
							});
							taxcode.updateLayoutType({
								layoutType: ui.FieldLayoutType.OUTSIDEBELOW
							});
							taxcode.updateBreakType({
								breakType: ui.FieldBreakType.STARTROW
							});
							taxcode.updateDisplayType({
								displayType: ui.FieldDisplayType.DISABLED
							});
							taxcode.setHelpText({
								help: 'A tax code is an entity to remit taxes which is configured to customer or transaction. This default tax code needs to be configured on Avalara Configuration --> Tax Calculation Tab for subsidiaries against which AvaTax tax calculation is to be triggered.<br><br>You can create new tax codes at Setup > Accounting > Tax Codes > New.<br> Recommended Tax Code name is \'AVATAX\' with Tax Rate as 0%.'
							});
							taxcode.defaultValue = 'T';
						}
						else{
							var taxControlAcc = form.addField({
								id: 'ava_taxcontrolacct',
								label: 'Please select GL account of type \'Tax Control\' to create \'AVATAX\' Tax Code',
								type: ui.FieldType.SELECT,
								source: 'account',
								container: 'ava_requiredparameter'
							});
							taxControlAcc.updateLayoutType({
								layoutType: ui.FieldLayoutType.OUTSIDEBELOW
							});
							taxControlAcc.updateBreakType({
								breakType: ui.FieldBreakType.STARTROW
							});
							taxControlAcc.isMandatory = true;
							var taxcode = form.addField({
								id: 'ava_taxcode',
								label: 'Tax Code Flag',
								type: ui.FieldType.CHECKBOX,
								container: 'ava_requiredparameter'
							});
							taxcode.updateDisplayType({
								displayType: ui.FieldDisplayType.HIDDEN
							});
						}
					}
					else{
						var taxcode = form.addField({
							id: 'ava_taxcode',
							label: '\'AVATAX\' created as Tax Code in NetSuite',
							type: ui.FieldType.CHECKBOX,
							container: 'ava_requiredparameter'
						});
						taxcode.updateLayoutType({
							layoutType: ui.FieldLayoutType.OUTSIDEBELOW
						});
						taxcode.updateBreakType({
							breakType: ui.FieldBreakType.STARTROW
						});
						taxcode.setHelpText({
							help: 'A tax code is an entity to remit taxes which is configured to customer or transaction. This default tax code needs to be configured on Avalara Configuration --> Tax Calculation Tab for subsidiaries against which AvaTax tax calculation is to be triggered.<br><br>You can create new tax codes at Setup > Accounting > Tax Codes > New.<br> Recommended Tax Code name is \'AVATAX\' with Tax Rate as 0%.'
						});
					}
					
					form.addButton({
						id: 'ava_back',
						label: 'Previous',
						functionName: 'editCredentials'
					});
					form.addButton({
						id: 'ava_next',
						label: 'Next',
						functionName: 'next'
					});
					form.addButton({
						id: 'ava_createcompany',
						label: 'Create Company',
						functionName: 'createCompany'
					});
					
					context.response.writePage({
						pageObject: form
					});
				}
				else{
					redirect.toSuitelet({
						scriptId: 'customscript_avaconfig_suitlet',
						deploymentId: 'customdeploy_configuration'
					});
				}
			}
		}
		
		return{
			onRequest: onRequest
		};
	}
);