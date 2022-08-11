/******************************************************************************************************
	Script Name - AVA_SUT_ConfigForm.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/search', 'N/config', 'N/redirect', 'N/record', 'N/https', 'N/log', 'N/cache', 'N/runtime', './utility/AVA_Library', './utility/AVA_CommonServerFunctions'],
	function(ui, search, config, redirect, record, https, log, cache, runtime, ava_library, ava_commonFunction){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 2);
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var form = ui.createForm({
						title: 'Avalara Configuration'
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
					
					var additionalInfo1 = form.addField({
						id: 'ava_addtionalinfo1',
						label: 'Additional Info1',
						type: ui.FieldType.PASSWORD
					});
					additionalInfo1.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					additionalInfo1.maxLength = 200;
					
					var additionalInfo2 = form.addField({
						id: 'ava_addtionalinfo2',
						label: 'Additional Info2',
						type: ui.FieldType.PASSWORD
					});
					additionalInfo2.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					additionalInfo2.maxLength = 200;
					
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
					
					var avataxCompanyName = form.addField({
						id: 'ava_company',
						label: 'AvaTax Company Code/Name',
						type: ui.FieldType.SELECT
					});
					avataxCompanyName.isMandatory = true;
					avataxCompanyName.setHelpText('Company code is an unique identifier for your company. AvaTax creates this identifier and uses it during tax calculation.');
					
					var companyId = form.addField({
						id: 'ava_companyid',
						label: 'Company ID',
						type: ui.FieldType.TEXT
					});
					companyId.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var serviceTypes = form.addField({
						id: 'ava_servicetype',
						label: 'Service Types',
						type: ui.FieldType.TEXT
					});
					serviceTypes.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var searchRecord = search.create({
						type: 'customrecord_avaconfig'
					});
					var searchresult = searchRecord.run();
					searchresult = searchresult.getRange({
						start: 0,
						end: 5
					});
					
					if(searchresult != null && searchresult.length > 0){
						var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
						
						accountValue.defaultValue = avaConfigObjRec['AVA_AccountValue'];
						licKey.defaultValue = avaConfigObjRec['AVA_AdditionalInfo'];
						additionalInfo1.defaultValue = avaConfigObjRec['AVA_AdditionalInfo1'];
						additionalInfo2.defaultValue = avaConfigObjRec['AVA_AdditionalInfo2'];
						serviceUrl.defaultValue = avaConfigObjRec['AVA_ServiceUrl'];
						serviceTypes.defaultValue = avaConfigObjRec['AVA_ServiceTypes'];
						
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
								
								if(avaConfigObjRec['AVA_DefCompanyCode'] != null && avaConfigObjRec['AVA_DefCompanyCode'].length > 0 && companyInfo[i][0] == avaConfigObjRec['AVA_DefCompanyCode']){
									companyId.defaultValue = companyInfo[i][2].toString();
								}
							}
							
							avataxCompanyName.defaultValue = avaConfigObjRec['AVA_DefCompanyCode'];
						}
						else{
							avataxCompanyName.addSelectOption({
								value : '',
								text: 'No Company found'
							});
						}
						
						if(avaConfigObjRec['AVA_ServiceTypes'] != null){
							if(avaConfigObjRec['AVA_ServiceTypes'].search('TaxSvc') != -1){
								form.addTab({
									id: 'ava_general',
									label: 'General'
								});
								form.addTab({
									id: 'ava_taxcalculation',
									label: 'Tax Calculation'
								});
								form.addTab({
									id: 'ava_cutvatsetting',
									label: 'Consumer Use Tax/Input VAT'
								});
								
								form = addGeneralTabFields(form, avaConfigObjRec);
								form = addTaxCalculationTabFields(form, avaConfigObjRec);
								form = addUseTaxVatTabFields(form, avaConfigObjRec);
							}
							
							if(avaConfigObjRec['AVA_ServiceTypes'].search('AddressSvc') != -1){
								form.addTab({
									id: 'ava_addressvalidation',
									label: 'Address Validation'
								});
								
								form = addAddressValidationTabFields(form, avaConfigObjRec);
							}
						}
						
						form.addTab({
							id: 'ava_about',
							label: 'About Avalara'
						});
						
						form = addAboutAvalaraTabFields(form, avaConfigObjRec, details);
					}
					
					form.addSubmitButton({
						label: 'Save'
					});
					form.addButton({
						id: 'ava_back',
						label: 'Edit Credentials',
						functionName: 'editCredentials'
					});
					
					context.response.writePage({
						pageObject: form
					});
				}
				else{
					saveConfigSettingsToCustomRecord(context);
					
					var avaConfigCache = cache.getCache({
						name: 'avaConfigCache',
						scope: cache.Scope.PROTECTED
					});
					avaConfigCache.put({
						key: 'avaConfigObjRec',
						value: ava_library.mainFunction('AVA_LoadValuesToGlobals', '')
					});
					
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
		
		function addGeneralTabFields(form, avaConfigObjRec){
			// Item Specific Fields
			var itemHelp = form.addField({
				id: 'ava_itemhelp',
				label: '<b>Item Specific:</b><hr>',
				type: ui.FieldType.HELP,
				container: 'ava_general'
			});
			itemHelp.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			itemHelp.updateBreakType({
				breakType: ui.FieldBreakType.STARTCOL
			});
			var taxcodeMapping = form.addField({
				id: 'ava_taxcodemapping',
				label: 'Enable Tax Code Mapping',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_general'
			});
			taxcodeMapping.setHelpText("Select to enable mapping items to Avalara tax codes.<br><br> If you don't map items to Avalara tax codes, all products and services are taxed at the standard rate for each jurisdiction.");
			
			var overrideTaxcode = form.addField({
				id: 'ava_taxcodeprecedence',
				label: 'Override Avatax Taxcode',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_general'
			});
			overrideTaxcode.setHelpText('Select to override your assigned Avalara tax code and send NT for non-taxable items. If this option is disabled, the assigned Avalara tax code is used.');
			
			var udf1 = form.addField({
				id: 'ava_udf1',
				label: 'User Defined 1',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_general'
			});
			udf1.setHelpText('Select to display the UDF1 field on the item line in transactions. The field is automatically populated with information available in the User Defined 1 on an item page.');
			
			var udf2 = form.addField({
				id: 'ava_udf2',
				label: 'User Defined 2',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_general'
			});
			udf2.setHelpText('Select to display the UDF2 field on the item line in transactions. The field is automatically populated with information available in the User Defined 2 on an item page.');
			
			var itemAccount = form.addField({
				id: 'ava_itemaccount',
				label: 'Send Item Account to Avalara',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_general'
			});
			itemAccount.setHelpText('Select to send General Ledger Account (configured on an item record) to AvaTax.');
			
			// Customer Specific Fields
			var customerHelp = form.addField({
				id: 'ava_custhelp',
				label: '<b>Customer/Vendor Specific:</b><hr>',
				type: ui.FieldType.HELP,
				container: 'ava_general'
			});
			customerHelp.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			customerHelp.updateBreakType({
				breakType: ui.FieldBreakType.STARTCOL
			});
			var customerCode = form.addField({
				id: 'ava_customercode',
				label: 'Customer Code',
				type: ui.FieldType.SELECT,
				container: 'ava_general'
			});
			customerCode.addSelectOption({
				value : '0',
				text: 'Customer ID'
			});
			customerCode.addSelectOption({
				value : '1',
				text: 'Customer Name'
			});
			customerCode.addSelectOption({
				value : '2',
				text: 'Customer Internal ID'
			});
			customerCode.addSelectOption({
				value : '8',
				text: 'Customer External ID'
			});
			customerCode.addSelectOption({
				value : '3',
				text: 'Partner ID'
			});
			customerCode.addSelectOption({
				value : '4',
				text: 'Partner Name'
			});
			customerCode.addSelectOption({
				value : '5',
				text: 'Partner Internal ID'
			});
			customerCode.addSelectOption({
				value : '6',
				text: 'Customer ID/Name'
			});
			customerCode.addSelectOption({
				value : '7',
				text: 'Partner ID/Name'
			});
			customerCode.setHelpText('Select the value to be sent to AvaTax and to be displayed as Customer Code on Transactions.');
			
			var vendorCode = form.addField({
				id: 'ava_vendorcode',
				label: 'Vendor Code',
				type: ui.FieldType.SELECT,
				container: 'ava_general'
			});
			vendorCode.addSelectOption({
				value : '0',
				text: 'Vendor ID'
			});
			vendorCode.addSelectOption({
				value : '1',
				text: 'Vendor Name'
			});
			vendorCode.addSelectOption({
				value : '2',
				text: 'Vendor Internal ID'
			});
			vendorCode.setHelpText('Select the value to be sent to AvaTax and to be displayed as Vendor Code on Transactions.');
			
			var markCustomerTaxable = form.addField({
				id: 'ava_markcusttaxable',
				label: 'Default Customers to Taxable',
				type: ui.FieldType.SELECT,
				container: 'ava_general'
			});
			markCustomerTaxable.addSelectOption({
				value : '0',
				text: ''
			});
			markCustomerTaxable.addSelectOption({
				value : '1',
				text: 'New and Existing Customer(s)'
			});
			markCustomerTaxable.addSelectOption({
				value : '2',
				text: 'Only New Customer(s)'
			});
			markCustomerTaxable.addSelectOption({
				value : '3',
				text: 'Only Existing Customer(s)'
			});
			markCustomerTaxable.setHelpText('Select Customers, in NetSuite, you would like to make taxable.<br><br> Here, Taxable field (Field Id: taxable) on the customer record will be marked as TRUE when you add or save customer record.');
			
			var defaultCustomerTaxcode = form.addField({
				id: 'ava_defaultcustomer',
				label: 'Default Taxcode To',
				type: ui.FieldType.SELECT,
				container: 'ava_general'
			});
			defaultCustomerTaxcode.addSelectOption({
				value : '0',
				text: ''
			});
			defaultCustomerTaxcode.addSelectOption({
				value : '1',
				text: 'New and Existing Customer(s)'
			});
			defaultCustomerTaxcode.addSelectOption({
				value : '2',
				text: 'Only New Customer(s)'
			});
			defaultCustomerTaxcode.addSelectOption({
				value : '3',
				text: 'Only Existing Customer(s)'
			});
			defaultCustomerTaxcode.setHelpText('Select Customers, in NetSuite, you would like to consider taxable.<br><br> Here, Tax Item (Field Id: taxitem) on the customer record will be assigned with default TAXCODE when you add or save customer record.');
			
			var entityUseCode = form.addField({
				id: 'ava_entityusecode',
				label: 'Enable Entity/Use Code',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_general'
			});
			entityUseCode.setHelpText('Enable to apply tax exemptions based on Entity/Use Code.');
			
			// Miscellaneous Setting Fields
			var miscHelp = form.addField({
				id: 'ava_mischelp',
				label: '<b>Miscellaneous Settings:</b><hr>',
				type: ui.FieldType.HELP,
				container: 'ava_general'
			});
			miscHelp.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			miscHelp.updateBreakType({
				breakType: ui.FieldBreakType.STARTCOL
			});
			var defaultShippingCode = form.addField({
				id: 'ava_defshipcode',
				label: 'Default Shipping Code',
				type: ui.FieldType.SELECT,
				container: 'ava_general'
			});
			defaultShippingCode.setHelpText('Select the default Shipping Code to be applied on a sales document when you enter a shipping charge.');
			
			var searchRecord = search.create({
				type: 'customrecord_avashippingcodes',
				columns: ['custrecord_ava_shippingcode']
			});
			var searchresult = searchRecord.run();
			searchresult = searchresult.getRange({
				start: 0,
				end: 1000
			});
			
			if(searchresult != null && searchresult.length > 0){
				defaultShippingCode.addSelectOption({
					value : '',
					text: ''
				});
				
				// Adding Shipping Codes
				for(var i = 0; i < searchresult.length; i++){
					defaultShippingCode.addSelectOption({
						value : searchresult[i].getValue('custrecord_ava_shippingcode'),
						text: searchresult[i].getValue('custrecord_ava_shippingcode')
					});
				}
			}
			
			var showMsgs = form.addField({
				id: 'ava_showmessages',
				label: 'Show Warnings/Errors',
				type: ui.FieldType.SELECT,
				container: 'ava_general'
			});
			showMsgs.addSelectOption({
				value : '0',
				text: 'None'
			});
			showMsgs.addSelectOption({
				value : '1',
				text: 'Only Warnings'
			});
			showMsgs.addSelectOption({
				value : '2',
				text: 'Only Errors'
			});
			showMsgs.addSelectOption({
				value : '3',
				text: 'Both'
			});
			showMsgs.defaultValue = '3';
			showMsgs.setHelpText('Select to any one option to decide what to display in Error logs.<br><br> Select None: To stop both Warning and Errors to appear in Error logs.<br><br> Select Both: To enable both Warning messages and Error Messages to appear in Error logs.');
			
			if(runtime.isFeatureInEffect('billscosts') == true){
				var billTimeName = form.addField({
					id: 'ava_billtimename',
					label: 'Billable Time Name',
					type: ui.FieldType.SELECT,
					container: 'ava_general'
				});
				billTimeName.addSelectOption({
					value : '0',
					text: 'Billable Time'
				});
				billTimeName.addSelectOption({
					value : '1',
					text: 'Item Name'
				});
				billTimeName.setHelpText("Select Billable Time if you want AvaTax to display the phrase 'Billable Time' in the item code field otherwise select Item Name.");
			}
			
			var extensiveLogging = form.addField({
				id: 'ava_enablelogentries',
				label: 'Extensive Logging',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_general'
			});
			extensiveLogging.defaultValue = 'T';
			extensiveLogging.setHelpText('Select to automatically log AvaTax activities and save the details in a log file.');
			
			// Setting Values
			taxcodeMapping.defaultValue = (avaConfigObjRec['AVA_TaxCodeMapping'] == true) ? 'T' : 'F';
			overrideTaxcode.defaultValue = (avaConfigObjRec['AVA_TaxCodePrecedence'] == true) ? 'T' : 'F';
			udf1.defaultValue = (avaConfigObjRec['AVA_UDF1'] == true) ? 'T' : 'F';
			udf2.defaultValue = (avaConfigObjRec['AVA_UDF2'] == true) ? 'T' : 'F';
			itemAccount.defaultValue = (avaConfigObjRec['AVA_ItemAccount'] == true) ? 'T' : 'F';
			
			if(avaConfigObjRec['AVA_CustomerCode'] != null && avaConfigObjRec['AVA_CustomerCode'].length > 0){
				customerCode.defaultValue = avaConfigObjRec['AVA_CustomerCode'];
			}
			
			if(avaConfigObjRec['AVA_VendorCode'] != null && avaConfigObjRec['AVA_VendorCode'].length > 0){
				vendorCode.defaultValue = avaConfigObjRec['AVA_VendorCode'];
			}
			
			if(avaConfigObjRec['AVA_MarkCustTaxable'] != null && avaConfigObjRec['AVA_MarkCustTaxable'].length > 0){
				markCustomerTaxable.defaultValue = avaConfigObjRec['AVA_MarkCustTaxable'];
			}
			
			if(avaConfigObjRec['AVA_DefaultCustomerTaxcode'] != null && avaConfigObjRec['AVA_DefaultCustomerTaxcode'].length > 0){
				defaultCustomerTaxcode.defaultValue = avaConfigObjRec['AVA_DefaultCustomerTaxcode'];
			}
			
			entityUseCode.defaultValue = (avaConfigObjRec['AVA_EntityUseCode'] == true) ? 'T' : 'F';
			defaultShippingCode.defaultValue = avaConfigObjRec['AVA_DefaultShippingCode'];
			
			if(avaConfigObjRec['AVA_ShowMessages'] != null && avaConfigObjRec['AVA_ShowMessages'].length > 0){
				showMsgs.defaultValue = avaConfigObjRec['AVA_ShowMessages'];
			}
			
			if(form.getField('ava_billtimename') != null){
				if(avaConfigObjRec['AVA_BillableTimeName'] != null && avaConfigObjRec['AVA_BillableTimeName'].length > 0){
					billTimeName.defaultValue = avaConfigObjRec['AVA_BillableTimeName'];
				}
			}
			
			if(avaConfigObjRec['AVA_EnableLogEntries'] != null && avaConfigObjRec['AVA_EnableLogEntries'].length > 0){
				extensiveLogging.defaultValue = (avaConfigObjRec['AVA_EnableLogEntries'] == '1') ? 'T' : 'F';
			}
			
			return form;
		}
		
		function addTaxCalculationTabFields(form, avaConfigObjRec){
			var disableTax = form.addField({
				id: 'ava_disabletax',
				label: 'Disable Tax Calculation',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			disableTax.setHelpText('Select to stop AvaTax doing Tax calculation on Transactions.');
			
			var disableTaxQuote = form.addField({
				id: 'ava_disabletaxquote',
				label: 'Disable Tax Calculation for Quotes',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			disableTaxQuote.setHelpText('Select to stop AvaTax doing Tax calculation on Quotes.');
			
			var disableTaxSalesOrder = form.addField({
				id: 'ava_disabletaxsalesorder',
				label: 'Disable Tax Calculation for Sales Order',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			disableTaxSalesOrder.setHelpText('Select to stop AvaTax doing Tax calculation on Sales Order.');
			
			var disableLineLevelTax = form.addField({
				id: 'ava_disableline',
				label: 'Disable Tax Calculation at line level',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			disableLineLevelTax.setHelpText("Select to stop AvaTax doing Tax calculation at line level.");
			
			var enableLogging = form.addField({
				id: 'ava_enablelogging',
				label: 'Enable Logging',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			enableLogging.setHelpText('Select this to capture and display all success and error messages in the log of each Transaction.');
			
			var taxOnDemand = form.addField({
				id: 'ava_taxondemand',
				label: 'Calculate Tax on Demand',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			taxOnDemand.setHelpText("Enable this to display 'Calculate Tax' button on Sales Transaction in Edit mode. This button can be used for instance Tax calculation, even before you save the transaction.");
			
			var taxInclude = form.addField({
				id: 'ava_taxinclude',
				label: 'Tax Included Capability',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			taxInclude.setHelpText('Select when sales tax is included in the Total Amount of sales documents. Line item amount will be automatically adjusted to the amount before Tax. Total Amount on the sales document remains same and it is inclusive of Sales Tax.');
			
			var usePostingPeriod = form.addField({
				id: 'ava_usepostingperiod',
				label: 'Use Posting Period as Transaction date during Tax calls',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			usePostingPeriod.setHelpText('Select to use first day of Posting period as Transaction Date instead of header Transaction Date (Field ID: trandate) on Sales document.');
			
			if(runtime.isFeatureInEffect('accountingperiods') == false){
				usePostingPeriod.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
			}
			
			var disableLocationCode = form.addField({
				id: 'ava_disableloccode',
				label: 'Disable Location Code',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			disableLocationCode.setHelpText("Select to ignore Location code of the Transaction.<br><br> If not selected, it will use transaction's location as Origin/Ship-From address.<br><br> If selected, it will use Default Address from Avalara Configuration as Origin/Ship-From address for the transaction.");
			
			var enableUpcCode = form.addField({
				id: 'ava_enableupccode',
				label: 'Enable UPC Code as ItemCode',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			enableUpcCode.setHelpText('Select to send UPC instead of Item code to AvaTax.');
			
			if(runtime.isFeatureInEffect('barcodes') == false){
				enableUpcCode.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
			}
			
			var useInvoiceAddress = form.addField({
				id: 'ava_useinvoiceaddress',
				label: 'Use Invoice address for Tax calculation on Returns',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			useInvoiceAddress.setHelpText('Select to use Invoice Address for tax calculation on returns.<br><br> If this is selected, address mentioned on return transactions will be ignored during tax calculation.');
			
			var workflowApproval = form.addField({
				id: 'ava_committransaction',
				label: 'Allow workflow approval for posting',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			workflowApproval.setHelpText("Select to send only approved invoices to AvaTax.<br><br> If this option is selected, Approval Routing NetSuite's Accounting Preferences should be enable.");
			
			if(runtime.getCurrentUser().getPreference('CUSTOMAPPROVALCUSTINVC') == false){
				workflowApproval.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
			}
			
			var enableDiscount = form.addField({
				id: 'ava_enablediscount',
				label: 'Enable Discount Mechanism',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			enableDiscount.setHelpText("Select if you need to use non-taxable discounts which won't affect the taxable line amount. This will map discounts to Avalara Tax code.");
			
			var discountMapping = form.addField({
				id: 'ava_discountmapping',
				label: 'Discount Mapping',
				type: ui.FieldType.SELECT,
				container: 'ava_taxcalculation'
			});
			discountMapping.addSelectOption({
				value : '0',
				text: 'Gross Amount'
			});
			discountMapping.addSelectOption({
				value : '1',
				text: 'Net Amount'
			});
			discountMapping.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			discountMapping.setHelpText('Select whether you want to discount the Gross amount or Net Amount.');
			
			var discountTaxcode = form.addField({
				id: 'ava_discounttaxcode',
				label: 'Discount Tax Code',
				type: ui.FieldType.TEXT,
				container: 'ava_taxcalculation'
			});
			discountTaxcode.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			discountTaxcode.setHelpText("Enter the Tax code for discounts. This is mostly 'NT' (non taxable).");
			
			var taxrate = form.addField({
				id: 'ava_taxrate',
				label: 'Tax Rate',
				type: ui.FieldType.SELECT,
				container: 'ava_taxcalculation'
			});
			taxrate.addSelectOption({
				value : '0',
				text: 'Show Base Rate'
			});
			taxrate.addSelectOption({
				value : '1',
				text: 'Show Net Rate'
			});
			taxrate.setHelpText('Select either Base Rate or Net Rate to show.');
			
			var decimalPlace = form.addField({
				id: 'ava_decimalplaces',
				label: 'Round-off Tax percentage(Decimal Places)',
				type: ui.FieldType.SELECT,
				container: 'ava_taxcalculation'
			});
			decimalPlace.addSelectOption({
				value : '2',
				text: '2'
			});
			decimalPlace.addSelectOption({
				value : '3',
				text: '3'
			});
			decimalPlace.addSelectOption({
				value : '4',
				text: '4'
			});
			decimalPlace.addSelectOption({
				value : '5',
				text: '5'
			});
			decimalPlace.setHelpText('Select the number of decimal places to be displayed in calculated Tax Rate.');
			
			var defaultTaxcode = form.addField({
				id: 'ava_deftaxcode',
				label: 'Default Tax Code',
				type: ui.FieldType.SELECT,
				container: 'ava_taxcalculation'
			});
			defaultTaxcode.isMandatory = true;
			defaultTaxcode.addSelectOption({
				value : '',
				text: ''
			});
			var defaultTaxcodeRate = form.addField({
				id: 'ava_deftaxcoderate',
				label: 'Default Tax Code Rate',
				type: ui.FieldType.SELECT,
				container: 'ava_taxcalculation'
			});
			defaultTaxcodeRate.addSelectOption({
				value : '',
				text: ''
			});
			defaultTaxcodeRate.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			
			// Retrieve Tax Code
			var searchTaxItem = search.create({
				type: search.Type.SALES_TAX_ITEM,
				filters: ['isinactive', 'is', 'F'],
				columns: ['itemid', 'rate']
			});
			searchTaxItem = searchTaxItem.run();
			var searchResultTaxItem = searchTaxItem.getRange({
				start: 0,
				end: 1000
			});
			
			var j = 0;
			while(searchResultTaxItem != null && searchResultTaxItem.length > 0){
				for(var i = 0; i < searchResultTaxItem.length; i++){
					if(searchResultTaxItem[i].getValue('itemid') != '-Not Taxable-'){
						defaultTaxcode.addSelectOption({
							value: searchResultTaxItem[i].getValue('itemid') + '+' + searchResultTaxItem[i].id,
							text: searchResultTaxItem[i].getValue('itemid')
						});
						defaultTaxcodeRate.addSelectOption({
							value : searchResultTaxItem[i].id,
							text: searchResultTaxItem[i].getValue('rate')
						});
					}
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
			
			// Retrieve Tax Groups
			var searchTaxGroup = search.create({
				type: search.Type.TAX_GROUP,
				filters: ['isinactive', 'is', 'F'],
				columns: ['itemid', 'rate']
			});
			searchTaxGroup = searchTaxGroup.run();
			var searchResultTaxGroup = searchTaxGroup.getRange({
				start: 0,
				end: 1000
			});
			
			j = 0;
			while(searchResultTaxGroup != null && searchResultTaxGroup.length > 0){
				for(var i = 0; i < searchResultTaxGroup.length; i++){
					if(searchResultTaxGroup[i].getValue('itemid') != '-Not Taxable-'){
						defaultTaxcode.addSelectOption({
							value: searchResultTaxGroup[i].getValue('itemid') + '+' + searchResultTaxGroup[i].id,
							text: searchResultTaxGroup[i].getValue('itemid')
						});
						defaultTaxcodeRate.addSelectOption({
							value : searchResultTaxGroup[i].id,
							text: searchResultTaxGroup[i].getValue('rate')
						});
					}
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
			
			var defAddressee = form.addField({
				id: 'ava_def_addressee',
				label: 'Addressee',
				type: ui.FieldType.TEXT,
				container: 'ava_taxcalculation'
			});
			defAddressee.isMandatory = true;
			defAddressee.maxLength = 50;
			defAddressee.updateLayoutType({
				layoutType: ui.FieldLayoutType.NORMAL
			});
			defAddressee.updateBreakType({
				breakType: ui.FieldBreakType.STARTCOL
			});
			var defAddr1 = form.addField({
				id: 'ava_def_addr1',
				label: 'Address 1',
				type: ui.FieldType.TEXT,
				container: 'ava_taxcalculation'
			});
			defAddr1.isMandatory = true;
			defAddr1.maxLength = 50;
			var defAddr2 = form.addField({
				id: 'ava_def_addr2',
				label: 'Address 2',
				type: ui.FieldType.TEXT,
				container: 'ava_taxcalculation'
			});
			defAddr2.maxLength = 100;
			var defCity = form.addField({
				id: 'ava_def_city',
				label: 'City',
				type: ui.FieldType.TEXT,
				container: 'ava_taxcalculation'
			});
			defCity.isMandatory = true;
			defCity.maxLength = 50;
			var defState = form.addField({
				id: 'ava_def_state',
				label: 'State/Province',
				type: ui.FieldType.TEXT,
				container: 'ava_taxcalculation'
			});
			defState.isMandatory = true;
			var defZip = form.addField({
				id: 'ava_def_zip',
				label: 'Zip',
				type: ui.FieldType.TEXT,
				container: 'ava_taxcalculation'
			});
			defZip.isMandatory = true;
			defZip.maxLength = 11;
			var defCountry = form.addField({
				id: 'ava_def_country',
				label: 'Country',
				type: ui.FieldType.TEXT,
				container: 'ava_taxcalculation'
			});
			defCountry.isMandatory = true;
			var defAddress = form.addField({
				id: 'ava_def_addrtext',
				label: 'Address',
				type: ui.FieldType.TEXTAREA,
				container: 'ava_taxcalculation'
			});
			defAddress.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			defAddress.updateDisplaySize({
				width: 50,
				height: 7
			});
			form.addField({
				id: 'ava_addressvalidate',
				label: 'Validate Address',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			
			var taxsettings = form.addField({
				id: 'ava_taxsettings',
				label: '<b>Abort Save Operation on Tax Calculation Error(s)/Incomplete data:</b><hr>',
				type: ui.FieldType.HELP,
				container: 'ava_taxcalculation'
			});
			taxsettings.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			taxsettings.updateBreakType({
				breakType: ui.FieldBreakType.STARTCOL
			});
			var abortBulkBilling = form.addField({
				id: 'ava_abortbulkbilling',
				label: 'Bulk Billing',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			abortBulkBilling.setHelpText('Not Recommended. If enabled, this option will abort the document with calculation errors of incomplete data.');
			
			var abortUserInterfaces = form.addField({
				id: 'ava_abortuserinterfaces',
				label: 'User Interfaces',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			abortUserInterfaces.setHelpText('Not Recommended. If enabled, this option will abort the document with calculation errors of incomplete data.');
			
			var abortWebservices = form.addField({
				id: 'ava_abortwebservices',
				label: 'Webservices',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			abortWebservices.setHelpText('Not Recommended. If enabled, this option will abort the document with calculation errors of incomplete data.');
			
			var abortCsvImports = form.addField({
				id: 'ava_abortcsvimports',
				label: 'CSV Imports',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			abortCsvImports.setHelpText('Not Recommended. If enabled, this option will abort the document with calculation errors of incomplete data.');
			
			var abortScheduledScripts = form.addField({
				id: 'ava_abortscheduledscripts',
				label: 'Scheduled Scripts',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			abortScheduledScripts.setHelpText('Not Recommended. If enabled, this option will abort the document with calculation errors of incomplete data.');
			
			var abortSuitelets = form.addField({
				id: 'ava_abortsuitelets',
				label: 'Suitelets',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			abortSuitelets.setHelpText('Not Recommended. If enabled, this option will abort the document with calculation errors of incomplete data.');
			
			var abortWorkflowScript = form.addField({
				id: 'ava_abortworkflowactionscripts',
				label: 'Workflow Action Scripts',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_taxcalculation'
			});
			abortWorkflowScript.setHelpText('Not Recommended. If enabled, this option will abort the document with calculation errors of incomplete data.');
			
			// Setting Values
			disableTax.defaultValue = (avaConfigObjRec['AVA_DisableTax'] == true) ? 'T' : 'F';
			disableTaxQuote.defaultValue = (avaConfigObjRec['AVA_DisableTaxQuote'] == true) ? 'T' : 'F';
			disableTaxSalesOrder.defaultValue = (avaConfigObjRec['AVA_DisableTaxSalesOrder'] == true) ? 'T' : 'F';
			disableLineLevelTax.defaultValue = (avaConfigObjRec['AVA_DisableLine'] == true) ? 'T' : 'F';
			enableLogging.defaultValue = (avaConfigObjRec['AVA_EnableLogging'] == true) ? 'T' : 'F';
			taxOnDemand.defaultValue = (avaConfigObjRec['AVA_CalculateonDemand'] == true) ? 'T' : 'F';
			taxInclude.defaultValue = (avaConfigObjRec['AVA_TaxInclude'] == true) ? 'T' : 'F';
			usePostingPeriod.defaultValue = (avaConfigObjRec['AVA_UsePostingPeriod'] == true) ? 'T' : 'F';
			disableLocationCode.defaultValue = (avaConfigObjRec['AVA_DisableLocationCode'] == true) ? 'T' : 'F';
			enableUpcCode.defaultValue = (avaConfigObjRec['AVA_EnableUpcCode'] == true) ? 'T' : 'F';
			useInvoiceAddress.defaultValue = (avaConfigObjRec['AVA_UseInvoiceAddress'] == true) ? 'T' : 'F';
			workflowApproval.defaultValue = (avaConfigObjRec['AVA_CommitTransaction'] == true) ? 'T' : 'F';
			enableDiscount.defaultValue = (avaConfigObjRec['AVA_EnableDiscount'] == true) ? 'T' : 'F';
			discountMapping.defaultValue = avaConfigObjRec['AVA_DiscountMapping'];
			
			if(avaConfigObjRec['AVA_DiscountTaxCode'] != null && avaConfigObjRec['AVA_DiscountTaxCode'].length > 0){
				discountTaxcode.defaultValue = avaConfigObjRec['AVA_DiscountTaxCode'];
			}
			else{
				discountTaxcode.defaultValue = 'NT';
			}
			
			if(avaConfigObjRec['AVA_EnableDiscount'] == true){
				discountMapping.updateDisplayType({
					displayType: ui.FieldDisplayType.NORMAL
				});
				discountTaxcode.updateDisplayType({
					displayType: ui.FieldDisplayType.NORMAL
				});
			}
			
			taxrate.defaultValue = avaConfigObjRec['AVA_TaxRate'];
			decimalPlace.defaultValue = avaConfigObjRec['AVA_DecimalPlaces'];
			defaultTaxcode.defaultValue = avaConfigObjRec['AVA_DefaultTaxCode'];
			
			if(avaConfigObjRec['AVA_DefaultTaxCode'] != null){
				var val = avaConfigObjRec['AVA_DefaultTaxCode'].substr(avaConfigObjRec['AVA_DefaultTaxCode'].lastIndexOf('+') + 1, avaConfigObjRec['AVA_DefaultTaxCode'].length);
				defaultTaxcodeRate.defaultValue = val;
			}
			
			var loadConfig = config.load({
				type: config.Type.COMPANY_INFORMATION
			});
			var mainAddressRecord = loadConfig.getSubrecord('mainaddress');
			defAddressee.defaultValue = (avaConfigObjRec['AVA_Def_Addressee'] != null && avaConfigObjRec['AVA_Def_Addressee'].length > 0) ? avaConfigObjRec['AVA_Def_Addressee'] : mainAddressRecord.getValue('addressee');
			defAddr1.defaultValue = (avaConfigObjRec['AVA_Def_Addr1'] != null && avaConfigObjRec['AVA_Def_Addr1'].length > 0) ? avaConfigObjRec['AVA_Def_Addr1'] : mainAddressRecord.getValue('addr1');
			defAddr2.defaultValue = (avaConfigObjRec['AVA_Def_Addr2'] != null && avaConfigObjRec['AVA_Def_Addr2'].length > 0) ? avaConfigObjRec['AVA_Def_Addr2'] : mainAddressRecord.getValue('addr2');
			defCity.defaultValue = (avaConfigObjRec['AVA_Def_City'] != null && avaConfigObjRec['AVA_Def_City'].length > 0) ? avaConfigObjRec['AVA_Def_City'] : mainAddressRecord.getValue('city');
			defState.defaultValue = (avaConfigObjRec['AVA_Def_State'] != null && avaConfigObjRec['AVA_Def_State'].length > 0) ? avaConfigObjRec['AVA_Def_State'] : mainAddressRecord.getValue('state');
			defZip.defaultValue = (avaConfigObjRec['AVA_Def_Zip'] != null && avaConfigObjRec['AVA_Def_Zip'].length > 0) ? avaConfigObjRec['AVA_Def_Zip'] : mainAddressRecord.getValue('zip');
			defCountry.defaultValue = (avaConfigObjRec['AVA_Def_Country'] != null && avaConfigObjRec['AVA_Def_Country'].length > 0) ? avaConfigObjRec['AVA_Def_Country'] : mainAddressRecord.getValue('country');
			
			var address = '';
			if (avaConfigObjRec['AVA_Def_Addressee'] != null && avaConfigObjRec['AVA_Def_Addressee'].length > 0){
				address = avaConfigObjRec['AVA_Def_Addressee'] + '\n' + avaConfigObjRec['AVA_Def_Addr1'] + ((avaConfigObjRec['AVA_Def_Addr2'] != null && avaConfigObjRec['AVA_Def_Addr2'].length > 0) ? '\n' : '' + avaConfigObjRec['AVA_Def_Addr2']) + '\n' + avaConfigObjRec['AVA_Def_City'] + '\n' + avaConfigObjRec['AVA_Def_State'] + '\n' + avaConfigObjRec['AVA_Def_Zip'] + '\n' + avaConfigObjRec['AVA_Def_Country'];
			}
			else
			{
				address = mainAddressRecord.getValue('addressee') + '\n' + mainAddressRecord.getValue('addr1') + ((mainAddressRecord.getValue('addr2') != null && mainAddressRecord.getValue('addr2').length > 0)? '\n' + mainAddressRecord.getValue('addr2') : '') + '\n' + mainAddressRecord.getValue('city') + '\n' + mainAddressRecord.getValue('state') + '\n' + mainAddressRecord.getValue('zip') + '\n' + mainAddressRecord.getValue('country');
			}
			
			defAddress.defaultValue = address;
			
			abortBulkBilling.defaultValue = (avaConfigObjRec['AVA_AbortBulkBilling'] == true) ? 'T' : 'F';
			abortUserInterfaces.defaultValue = (avaConfigObjRec['AVA_AbortUserInterfaces'] == true) ? 'T' : 'F';
			abortWebservices.defaultValue = (avaConfigObjRec['AVA_AbortWebServices'] == true) ? 'T' : 'F';
			abortCsvImports.defaultValue = (avaConfigObjRec['AVA_AbortCSVImports'] == true) ? 'T' : 'F';
			abortScheduledScripts.defaultValue = (avaConfigObjRec['AVA_AbortScheduledScripts'] == true) ? 'T' : 'F';
			abortSuitelets.defaultValue = (avaConfigObjRec['AVA_AbortSuitelets'] == true) ? 'T' : 'F';
			abortWorkflowScript.defaultValue = (avaConfigObjRec['AVA_AbortWorkflowActionScripts'] == true) ? 'T' : 'F';
			
			if(avaConfigObjRec['AVA_DisableTax'] == true){
				disableTaxQuote.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				disableTaxSalesOrder.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				disableLineLevelTax.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				enableLogging.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				taxOnDemand.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				taxInclude.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				usePostingPeriod.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				disableLocationCode.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				enableUpcCode.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				useInvoiceAddress.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				workflowApproval.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				enableDiscount.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				discountMapping.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				discountTaxcode.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				taxrate.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				decimalPlace.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				defaultTaxcode.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				abortBulkBilling.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				abortUserInterfaces.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				abortWebservices.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				abortCsvImports.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				abortScheduledScripts.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				abortSuitelets.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				abortWorkflowScript.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
			}
			
			return form;
		}
		
		function addUseTaxVatTabFields(form, avaConfigObjRec){
			var usetaxHelp = form.addField({
				id: 'ava_usetaxhelp',
				label: '<b>Consumer Use Tax Assessment Settings:</b><hr>',
				type: ui.FieldType.HELP,
				container: 'ava_cutvatsetting'
			});
			usetaxHelp.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			usetaxHelp.updateBreakType({
				breakType: ui.FieldBreakType.STARTCOL
			});
			var enableUseTax = form.addField({
				id: 'ava_enableusetax',
				label: 'Enable Use Tax Assessment on Vendor Bill',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_cutvatsetting'
			});
			enableUseTax.setHelpText('If this option is enabled, AvaTax will calculate consumer use tax for transactions and will display the difference between the amount calculated by AvaTax calculated & the vendor-paid tax. Upon approval, the consumer use tax calculated by AvaTax is posted to NetSuite in the accrual field.');
			
			var creditAccount = form.addField({
				id: 'ava_creditacc',
				label: 'Use Tax Payable Liability Account',
				type: ui.FieldType.SELECT,
				source: 'account',
				container: 'ava_cutvatsetting'
			});
			creditAccount.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			creditAccount.setHelpText('Select the account where you want to post Vendor Use Tax liability.');
			
			var gltoDebit = form.addField({
				id: 'ava_glaccount',
				label: 'GL Account to Debit',
				type: ui.FieldType.LABEL,
				container: 'ava_cutvatsetting'
			});
			gltoDebit.setHelpText("Select 'Individual Item/Expense Account' to use the Item or Expense Account mapped to the vendor as the GL Account to debit.<br> or <br> Select 'Use Tax Debit GL Account' to manually select the Use Tax Debit GL account.");
			
			var itemAccount = form.addField({
				id: 'ava_glacc',
				label: 'Individual Item/Expense Account',
				type: ui.FieldType.RADIO,
				source: 'itemaccount',
				container: 'ava_cutvatsetting'
			});
			itemAccount.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			var glAccount = form.addField({
				id: 'ava_glacc',
				label: 'Select a Use Tax Debit GL Account',
				type: ui.FieldType.RADIO,
				source: 'glaccount',
				container: 'ava_cutvatsetting'
			});
			glAccount.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			itemAccount.defaultValue = 'itemaccount';
			var debitAccount = form.addField({
				id: 'ava_debitacc',
				label: 'Use Tax Debit GL Account',
				type: ui.FieldType.SELECT,
				source: 'account',
				container: 'ava_cutvatsetting'
			});
			debitAccount.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			debitAccount.setHelpText('Select relevant account from Use Tax Debit GL account list.');
			
			var billApproved = form.addField({
				id: 'ava_billapproved',
				label: 'Accrue consumer use tax when a vendor bill is approved',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_cutvatsetting'
			});
			billApproved.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			billApproved.setHelpText('Select to enable the accrual of consumer use tax when a vendor bill is approved, and then post to AvaTax.');
			
			var autoAssess = form.addField({
				id: 'ava_autoassess',
				label: 'Auto Self Assess on Imported Vendor bills',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_cutvatsetting'
			});
			autoAssess.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			autoAssess.setHelpText("Select to enable auto self assessment on imported vendor bills. \n This will automatically compare the 'Tax calculated by Vendor' with 'Tax calculated by AvaTax'.");
			
			var help = form.addField({
				id: 'ava_help',
				label: '<br><hr>',
				type: ui.FieldType.HELP,
				container: 'ava_cutvatsetting'
			});
			help.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			help.updateBreakType({
				breakType: ui.FieldBreakType.STARTCOL
			});
			var vendorTaxItem = form.addField({
				id: 'ava_vendortaxitem',
				label: 'Item for Tax Paid to Vendor',
				type: ui.FieldType.SELECT,
				source: 'item',
				container: 'ava_cutvatsetting'
			});
			vendorTaxItem.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			vendorTaxItem.setHelpText('Select an item that represents Sales Tax paid on Vendor Bills.');
			
			var taxAccrualDate = form.addField({
				id: 'ava_taxaccrualdate',
				label: 'Tax Accrual Date',
				type: ui.FieldType.SELECT,
				container: 'ava_cutvatsetting'
			});
			taxAccrualDate.addSelectOption({
				value : '0',
				text: 'Transaction Date'
			});
			taxAccrualDate.addSelectOption({
				value : '1',
				text: 'Due Date'
			});
			taxAccrualDate.addSelectOption({
				value : '2',
				text: 'Posting Date'
			});
			taxAccrualDate.updateDisplayType({
				displayType: ui.FieldDisplayType.DISABLED
			});
			taxAccrualDate.setHelpText("Select either 'Transaction Date', 'Due Date' or 'Posting Date' as Tax Accrual Date. AvaTax will use this date for calculating Tax.");
			
			var vatinHelp = form.addField({
				id: 'ava_vatinhelp',
				label: '<b>Input VAT Verification Settings:</b><hr>',
				type: ui.FieldType.HELP,
				container: 'ava_cutvatsetting'
			});
			vatinHelp.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			vatinHelp.updateBreakType({
				breakType: ui.FieldBreakType.STARTCOL
			});
			var enableVatIn = form.addField({
				id: 'ava_enablevatin',
				label: 'Enable Input VAT Verification on Purchase Transactions',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_cutvatsetting'
			});
			enableVatIn.setHelpText('Enable this to verify the VAT amount calculated by the Vendor.');
			
			// Setting values
			enableUseTax.defaultValue = (avaConfigObjRec['AVA_EnableUseTax'] == true) ? 'T' : 'F';
			
			if(avaConfigObjRec['AVA_EnableUseTax'] == true){
				creditAccount.updateDisplayType({
					displayType: ui.FieldDisplayType.NORMAL
				});
				itemAccount.updateDisplayType({
					displayType: ui.FieldDisplayType.NORMAL
				});
				glAccount.updateDisplayType({
					displayType: ui.FieldDisplayType.NORMAL
				});
				
				if(avaConfigObjRec['AVA_GlAccounts'] == 'glaccount'){
					debitAccount.updateDisplayType({
						displayType: ui.FieldDisplayType.NORMAL
					});
				}
				
				billApproved.updateDisplayType({
					displayType: ui.FieldDisplayType.NORMAL
				});
				autoAssess.updateDisplayType({
					displayType: ui.FieldDisplayType.NORMAL
				});
				vendorTaxItem.updateDisplayType({
					displayType: ui.FieldDisplayType.NORMAL
				});
				taxAccrualDate.updateDisplayType({
					displayType: ui.FieldDisplayType.NORMAL
				});
			}
				
			if(avaConfigObjRec['AVA_GlAccounts'] != null && avaConfigObjRec['AVA_GlAccounts'].length > 0){
				form.getField('ava_glacc').defaultValue = avaConfigObjRec['AVA_GlAccounts'];
			}
			else{
				itemAccount.defaultValue = 'itemaccount';
			}
			
			if(avaConfigObjRec['AVA_UseTaxCredit'] != null && avaConfigObjRec['AVA_UseTaxCredit'].length > 0){
				creditAccount.defaultValue = avaConfigObjRec['AVA_UseTaxCredit'];
			}
			else{
				creditAccount.defaultValue = '';
			}
			
			if(avaConfigObjRec['AVA_UseTaxDebit'] != null && avaConfigObjRec['AVA_UseTaxDebit'].length > 0){
				debitAccount.defaultValue = avaConfigObjRec['AVA_UseTaxDebit'];
			}
			else{
				debitAccount.defaultValue = '';
			}
			
			if(avaConfigObjRec['AVA_VendorTaxItem'] != null && avaConfigObjRec['AVA_VendorTaxItem'].length > 0){
				vendorTaxItem.defaultValue = avaConfigObjRec['AVA_VendorTaxItem'];
			}
			else{
				vendorTaxItem.defaultValue = '';
			}
			
			if(avaConfigObjRec['AVA_TaxAccrualDate'] != null && avaConfigObjRec['AVA_TaxAccrualDate'].length > 0){
				taxAccrualDate.defaultValue = avaConfigObjRec['AVA_TaxAccrualDate'];
			}
			
			billApproved.defaultValue = (avaConfigObjRec['AVA_BillApproved'] == true) ? 'T' : 'F';
			autoAssess.defaultValue = (avaConfigObjRec['AVA_AutoAssessImportBill'] == true) ? 'T' : 'F';
			enableVatIn.defaultValue = (avaConfigObjRec['AVA_EnableVatIn'] == true) ? 'T' : 'F';
			
			return form;
		}
		
		function addAddressValidationTabFields(form, avaConfigObjRec){
			var disableAddrValidation = form.addField({
				id: 'ava_disableaddvalidation',
				label: 'Disable Address Validation',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_addressvalidation'
			});
			disableAddrValidation.setHelpText('Select to disable the Address Validation. If the address validation is disabled, Sales tax might be calculated incorrectly for incomplete/wrong addresses.');
			
			var enableAddrValidationOnTrans = form.addField({
				id: 'ava_enableaddvalontran',
				label: 'Enable Address Validation on Transaction(s)',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_addressvalidation'
			});
			enableAddrValidationOnTrans.setHelpText('Select to display address validation buttons on Transactions.');
			
			var enableAddrValidationFlag = form.addField({
				id: 'ava_enableaddvalflag',
				label: 'Track Previously Validated Addresses',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_addressvalidation'
			});
			enableAddrValidationFlag.setHelpText('Select to track whether address has previously been validated.<br><br> This will display a checkbox on customer record to indicate if address is already verified.');
			
			var upperCaseAddr = form.addField({
				id: 'ava_uppercaseaddress',
				label: 'Result in Upper Case',
				type: ui.FieldType.CHECKBOX,
				container: 'ava_addressvalidation'
			});
			upperCaseAddr.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW
			});
			upperCaseAddr.updateBreakType({
				breakType: ui.FieldBreakType.STARTCOL
			});
			upperCaseAddr.setHelpText('Select to receive address in upper case.');
			
			var addrBatchProcessing = form.addField({
				id: 'ava_addbatchprocessing',
				label: 'Batch Processing',
				type: ui.FieldType.SELECT,
				container: 'ava_addressvalidation'
			});
			addrBatchProcessing.addSelectOption({
				value : 'manual',
				text: 'Manual'
			});
			addrBatchProcessing.addSelectOption({
				value : 'automatic',
				text: 'Automatic'
			});
			addrBatchProcessing.setHelpText('Select either Automatic or Manual process to accept address validation results.');
			
			// Setting Values
			disableAddrValidation.defaultValue = (avaConfigObjRec['AVA_DisableAddValidation'] == true) ? 'T' : 'F';
			enableAddrValidationOnTrans.defaultValue = (avaConfigObjRec['AVA_EnableAddValonTran'] == true) ? 'T' : 'F';
			enableAddrValidationFlag.defaultValue = (avaConfigObjRec['AVA_EnableAddValFlag'] == true) ? 'T' : 'F';
			upperCaseAddr.defaultValue = (avaConfigObjRec['AVA_AddUpperCase'] == true) ? 'T' : 'F';
			addrBatchProcessing.defaultValue = (avaConfigObjRec['AVA_AddBatchProcessing'] == 0) ? 'manual' : 'automatic';
			
			if(avaConfigObjRec['AVA_DisableAddValidation'] == true){
				enableAddrValidationOnTrans.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				enableAddrValidationFlag.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				upperCaseAddr.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
				addrBatchProcessing.updateDisplayType({
					displayType: ui.FieldDisplayType.DISABLED
				});
			}
			
			return form;
		}
		
		function addAboutAvalaraTabFields(form, avaConfigObjRec, details){
			var dYear = new Date();
			form.addField({
				id: 'ava_copyright',
				label: 'Copyright &copy ' + dYear.getFullYear() + ' Avalara, Inc. All Rights Reserved.',
				type: ui.FieldType.HELP,
				container: 'ava_about'
			});
			var version = form.addField({
				id: 'ava_version',
				label: 'Version',
				type: ui.FieldType.TEXT,
				container: 'ava_about'
			});
			version.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			version.defaultValue = ava_library.mainFunction('AVA_ClientAtt', '');
			var serviceVersion = form.addField({
				id: 'ava_serversion',
				label: 'AvaTax Version',
				type: ui.FieldType.TEXT,
				container: 'ava_about'
			});
			serviceVersion.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			serviceVersion.defaultValue = avaPing(avaConfigObjRec['AVA_ServiceUrl'], details);
			var email = form.addField({
				id: 'ava_email',
				label: 'Email',
				type: ui.FieldType.EMAIL,
				container: 'ava_about'
			});
			email.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			email.defaultValue = 'support@avalara.com';
			var phone = form.addField({
				id: 'ava_phone',
				label: 'Phone',
				type: ui.FieldType.PHONE,
				container: 'ava_about'
			});
			phone.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			phone.defaultValue = '(877)-780-4848';
			var website = form.addField({
				id: 'ava_web',
				label: 'Website',
				type: ui.FieldType.URL,
				container: 'ava_about'
			});
			website.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			website.defaultValue = 'http://www.avalara.com';
			var adminConsole = form.addField({
				id: 'ava_adminconsole',
				label: 'Avalara Customer Portal',
				type: ui.FieldType.URL,
				container: 'ava_about'
			});
			adminConsole.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			adminConsole.defaultValue = (avaConfigObjRec['AVA_ServiceUrl'] == 1) ? 'https://sandbox.admin.avalara.com' : 'https://admin.avalara.com';
			var userCenter = form.addField({
				id: 'ava_usercenter',
				label: 'Avalara User Center',
				type: ui.FieldType.URL,
				container: 'ava_about'
			});
			userCenter.updateDisplayType({
				displayType: ui.FieldDisplayType.INLINE
			});
			userCenter.defaultValue = 'https://help.avalara.com';
			
			return form;
		}
		
		function avaPing(serviceUrl, details){
			var version = '';
			
			try{
				var AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', serviceUrl);
				var ping = AvaTax.ping(details);
				
				var response = https.get({
					url: ping.url,
					headers: ping.headers
				});
				
				if(response.code == 200){
					var responseBody = JSON.parse(response.body);
					version = responseBody.version;
				}
				else{
					log.debug({
						title: 'Ping error response code',
						details: response.code
					});
				}
			}
			catch(err){
				log.debug({
					title: 'Ping Try/Catch',
					details: err.message
				});
			}
			
			return version;
		}
		
		function saveConfigSettingsToCustomRecord(context){
			var searchRecord = search.create({
				type: 'customrecord_avaconfig'
			});
			var searchresult = searchRecord.run();
			searchresult = searchresult.getRange({
				start: 0,
				end: 5
			});
			
			var rec = record.load({
				type: 'customrecord_avaconfig',
				id: searchresult[0].id
			});
			
			rec.setValue({
				fieldId: 'custrecord_ava_defcompanycode',
				value: context.request.parameters.ava_company
			});
			rec.setValue({
				fieldId: 'custrecord_ava_compid',
				value: context.request.parameters.ava_companyid
			});
			
			// General Tab Elements Detail 
			rec.setValue({
				fieldId: 'custrecord_ava_taxcodemapping',
				value: (context.request.parameters.ava_taxcodemapping == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_taxcodepreced',
				value: (context.request.parameters.ava_taxcodeprecedence == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_udf1',
				value: (context.request.parameters.ava_udf1 == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_udf2',
				value: (context.request.parameters.ava_udf2 == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_itemaccount',
				value: (context.request.parameters.ava_itemaccount == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_customercode',
				value: context.request.parameters.ava_customercode
			});
			rec.setValue({
				fieldId: 'custrecord_ava_vendorcode',
				value: context.request.parameters.ava_vendorcode
			});
			rec.setValue({
				fieldId: 'custrecord_ava_markcusttaxable',
				value: context.request.parameters.ava_markcusttaxable
			});
			rec.setValue({
				fieldId: 'custrecord_ava_defaultcustomer',
				value: context.request.parameters.ava_defaultcustomer
			});
			rec.setValue({
				fieldId: 'custrecord_ava_entityusecode',
				value: (context.request.parameters.ava_entityusecode == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_defshipcode',
				value: context.request.parameters.ava_defshipcode
			});
			rec.setValue({
				fieldId: 'custrecord_ava_showmessages',
				value: context.request.parameters.ava_showmessages
			});
			
			var billTimeName = context.request.parameters.ava_billtimename;
			if(billTimeName != null && billTimeName.length > 0){
				rec.setValue({
					fieldId: 'custrecord_ava_billtimename',
					value: billTimeName
				});
			}
			
			rec.setValue({
				fieldId: 'custrecord_ava_enablelogentries',
				value: (context.request.parameters.ava_enablelogentries == 'T') ? 1 : 0
			});
			
			// Tax Calculation Tab Elements Details 
			rec.setValue({
				fieldId: 'custrecord_ava_disabletax',
				value: (context.request.parameters.ava_disabletax == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_disabletaxquotes',
				value: (context.request.parameters.ava_disabletaxquote == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_disabletaxsalesorder',
				value: (context.request.parameters.ava_disabletaxsalesorder == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_disableline',
				value: (context.request.parameters.ava_disableline == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_taxondemand',
				value: (context.request.parameters.ava_taxondemand == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_enablelogging',
				value: (context.request.parameters.ava_enablelogging == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_taxinclude',
				value: (context.request.parameters.ava_taxinclude == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_usepostingdate',
				value: (context.request.parameters.ava_usepostingperiod == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_disableloccode',
				value: (context.request.parameters.ava_disableloccode == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_enableupccode',
				value: (context.request.parameters.ava_enableupccode == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_useinvoiceaddress',
				value: (context.request.parameters.ava_useinvoiceaddress == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_committrans',
				value: (context.request.parameters.ava_committransaction == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_enablediscount',
				value: (context.request.parameters.ava_enablediscount == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_discountmapping',
				value: context.request.parameters.ava_discountmapping
			});
			rec.setValue({
				fieldId: 'custrecord_ava_discounttaxcode',
				value: context.request.parameters.ava_discounttaxcode
			});
			rec.setValue({
				fieldId: 'custrecord_ava_taxrate',
				value: context.request.parameters.ava_taxrate
			});
			rec.setValue({
				fieldId: 'custrecord_ava_decimalplaces',
				value: context.request.parameters.ava_decimalplaces
			});
			rec.setValue({
				fieldId: 'custrecord_ava_deftaxcode',
				value: context.request.parameters.ava_deftaxcode
			});
			rec.setValue({
				fieldId: 'custrecord_ava_addressee',
				value: context.request.parameters.ava_def_addressee
			});
			rec.setValue({
				fieldId: 'custrecord_ava_address1',
				value: context.request.parameters.ava_def_addr1
			});
			rec.setValue({
				fieldId: 'custrecord_ava_address2',
				value: context.request.parameters.ava_def_addr2
			});
			rec.setValue({
				fieldId: 'custrecord_ava_city',
				value: context.request.parameters.ava_def_city
			});
			rec.setValue({
				fieldId: 'custrecord_ava_state',
				value: context.request.parameters.ava_def_state
			});
			rec.setValue({
				fieldId: 'custrecord_ava_zip',
				value: context.request.parameters.ava_def_zip
			});
			rec.setValue({
				fieldId: 'custrecord_ava_country',
				value: context.request.parameters.ava_def_country
			});
			rec.setValue({
				fieldId: 'custrecord_ava_abortbulkbilling',
				value: (context.request.parameters.ava_abortbulkbilling == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_abortuserinterfaces',
				value: (context.request.parameters.ava_abortuserinterfaces == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_abortwebservices',
				value: (context.request.parameters.ava_abortwebservices == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_abortcsvimports',
				value: (context.request.parameters.ava_abortcsvimports == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_abortscheduledscripts',
				value: (context.request.parameters.ava_abortscheduledscripts == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_abortsuitelets',
				value: (context.request.parameters.ava_abortsuitelets == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_abortworkflowscripts',
				value: (context.request.parameters.ava_abortworkflowactionscripts == 'T') ? true : false
			});
			
			// Consumer Use Tax / Input VAT Tab Elements Details
			rec.setValue({
				fieldId: 'custrecord_ava_enableusetax',
				value: (context.request.parameters.ava_enableusetax == 'T') ? true : false
			});
			
			if(context.request.parameters.ava_enableusetax == 'T'){
				rec.setValue({
					fieldId: 'custrecord_ava_glaccounts',
					value: context.request.parameters.ava_glacc
				});
				rec.setValue({
					fieldId: 'custrecord_ava_usetaxcredit',
					value: context.request.parameters.ava_creditacc
				});
				
				if(context.request.parameters.ava_glacc == 'glaccount'){
					rec.setValue({
						fieldId: 'custrecord_ava_usetaxdebit',
						value: context.request.parameters.ava_debitacc
					});
				}
				
				rec.setValue({
					fieldId: 'custrecord_ava_billapproved',
					value: (context.request.parameters.ava_billapproved == 'T') ? true : false
				});
				rec.setValue({
					fieldId: 'custrecord_ava_autoassessbill',
					value: (context.request.parameters.ava_autoassess == 'T') ? true : false
				});
				rec.setValue({
					fieldId: 'custrecord_ava_vendortaxitem',
					value: context.request.parameters.ava_vendortaxitem
				});
				rec.setValue({
					fieldId: 'custrecord_ava_taxaccrualdate',
					value: context.request.parameters.ava_taxaccrualdate
				});
			}
			
			rec.setValue({
				fieldId: 'custrecord_ava_enablevatin',
				value: (context.request.parameters.ava_enablevatin == 'T') ? true : false
			});
			
			// Address Validation Tab Elements Details
			rec.setValue({
				fieldId: 'custrecord_ava_disableaddvalidation',
				value: (context.request.parameters.ava_disableaddvalidation == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_enableaddvalontran',
				value: (context.request.parameters.ava_enableaddvalontran == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_enableaddvalflag',
				value: (context.request.parameters.ava_enableaddvalflag == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_adduppercase',
				value: (context.request.parameters.ava_uppercaseaddress == 'T') ? true : false
			});
			rec.setValue({
				fieldId: 'custrecord_ava_addbatchprocessing',
				value: (context.request.parameters.ava_addbatchprocessing == 'manual') ? '0' : '1'
			});
			
			rec.save({
			});
		}
		
		return{
			onRequest: onRequest
		};
	}
);