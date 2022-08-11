/******************************************************************************************************
	Script Name - AVA_CLI_Config.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/https', 'N/url', 'N/currentRecord', 'N/search', 'N/record', 'N/runtime', './utility/AVA_Library'],
	function(https, url, currentRecord, search, record, runtime, ava_library){
		var ConfigLogs = {};
		function configPageInit(context){
			var cRecord = context.currentRecord;
			
			if(cRecord.getField('ava_guidkey') != null){
				cRecord.setValue({
					fieldId: 'ava_guidkey',
					value: '',
					ignoreFieldChange: true
				});
			}
		}
		
		function configSave(context){
			var cRecord = context.currentRecord;
			
			if(cRecord.getField('ava_servicetypes') != null){
				return configTestConnection(cRecord);
			}
			
			if(cRecord.getField('ava_servicetype') != null){
				var avataxCompany = cRecord.getValue({
					fieldId: 'ava_company'
				});
				if(avataxCompany == null || avataxCompany.length == 0){
					alert('Please select AvaTax Company Code/Name');
					return false;
				}
				
				var customerCode = cRecord.getValue({
					fieldId: 'ava_customercode'
				});
				if(customerCode >= 3 && customerCode != 6 && customerCode != 8){
					if(runtime.isFeatureInEffect('prm') == false){
						alert('Partner information cannot be passed to service as the required features are not enabled.');
						return false;
					}
				}
				
				var enableDiscount = cRecord.getValue({
					fieldId: 'ava_enablediscount'
				});
				if(enableDiscount == true){
					var discountTaxcode = cRecord.getValue({
						fieldId: 'ava_discounttaxcode'
					});
					if(discountTaxcode == null || discountTaxcode.length == 0)
					{
						alert('Please Enter Discount Tax Code');
						return false;
					}
				}
				
				var defTaxcode = cRecord.getValue({
					fieldId: 'ava_deftaxcode'
				});
				if(defTaxcode == null || defTaxcode.length == 0){
					alert('Please select Default Tax Code');
					return false;
				}
				
				var defTaxcodeRate = cRecord.getValue({
					fieldId: 'ava_deftaxcoderate'
				});
				if(defTaxcodeRate != null){
					var taxrate = cRecord.getText({
						fieldId: 'ava_deftaxcoderate'
					});
					
					if(taxrate.indexOf('%') == -1){
						if(parseFloat(taxrate) > 0){
							alert('Default Tax Code rate selected should be equal to zero');
							return false;
						}
					}
					else{
						taxrate = taxrate.substr(0, taxrate.indexOf('%'));
						if(parseFloat(taxrate) > 0){
							alert('Default Tax Code rate selected should be equal to zero');
							return false;
						}
					}
				}
				
				var enableUseTax = cRecord.getValue({
					fieldId: 'ava_enableusetax'
				});
				if(enableUseTax == true){
					var creditAccount = cRecord.getValue({
						fieldId: 'ava_creditacc'
					});
					var debitAccount = cRecord.getValue({
						fieldId: 'ava_debitacc'
					});
					var glAccounts = cRecord.getValue({
						fieldId: 'ava_glacc'
					});
					if(creditAccount == null || creditAccount.length == 0){
						alert('Please select Use Tax Payable Liability Account');
						return false;
					}
					if(glAccounts == 'glaccount' && (debitAccount == null || debitAccount.length == 0)){
						alert('Please select Use Tax Debit Account');
						return false;
					}
				}
				
				var enableLogEntries = cRecord.getValue({
					fieldId: 'ava_enablelogentries'
				});
				if(enableLogEntries == true){
					var accountValue = cRecord.getValue({
						fieldId: 'ava_accvalue'
					});
					var serviceUrl = cRecord.getValue({
						fieldId: 'ava_serviceurl'
					});
					var licenseKey = cRecord.getValue({
						fieldId: 'ava_lickey'
					});
					var additionalInfo1 = cRecord.getValue({
						fieldId: 'ava_addtionalinfo1'
					});
					var additionalInfo2 = cRecord.getValue({
						fieldId: 'ava_addtionalinfo2'
					});
					
					var configLogs = JSON.stringify(ConfigLogs);
					
					if(configLogs != null){
						configLogs = configLogs.replace(/"/g, "");
					}
					
					if(configLogs.length > 2){
						var Url = url.resolveScript({
							scriptId: 'customscript_ava_general_restlet',
							deploymentId: 'customdeploy_ava_general_restlet'
						});
						Url = Url + '&type=dosomethingelse' + '&accountValue=' + accountValue + '&ava_lickey=' + licenseKey + '&ava_additionalinfo1=' + additionalInfo1+ '&ava_additionalinfo2=' + additionalInfo2;
						var resp = https.get({
							url: Url
						});
						
						ava_library.mainFunction('AVA_Logs', (accountValue + '~~' + serviceUrl + '~~' + '0' + '~~' + '' + '~~' + '' + '~~' + '' + '~~' + '' + '~~' + 'ConfigChanges' + '~~' + 'ConfigAudit' + '~~' + 'Informational' + '~~' + 'ConfigurationForm' + '~~' + 'AVA_ConfigWizardSave' + '~~' + configLogs + '~~' + '' + '~~' + 1 + '~~' + 0 + '~~' + '' + '~~' + resp.body));
					}
				}
			}
			
			return true;
		}
		
		function configTestConnection(cRecord){
			var serviceTypes = '';
			var accountValue = cRecord.getValue({
				fieldId: 'ava_accvalue'
			});
			var licenseKey = cRecord.getValue({
				fieldId: 'ava_lickey'
			});
			var additionalInfo1 = cRecord.getValue({
				fieldId: 'ava_addtionalinfo1'
			});
			var additionalInfo2 = cRecord.getValue({
				fieldId: 'ava_addtionalinfo2'
			});
			var serviceUrl = cRecord.getValue({
				fieldId: 'ava_serviceurl'
			});
			
			if(accountValue != 0 && licenseKey != 0){
				var Url = url.resolveScript({
					scriptId: 'customscript_ava_general_restlet',
					deploymentId: 'customdeploy_ava_general_restlet'
				});
				Url = Url + '&type=dosomethingelse' + '&accountValue=' + accountValue + '&ava_lickey=' + licenseKey + '&ava_additionalinfo1=' + additionalInfo1+ '&ava_additionalinfo2=' + additionalInfo2;
				var resp = https.get({
					url: Url
				});
				
				var AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', serviceUrl);
				var subscriptions = AvaTax.subscriptions(resp.body);
				
				try{
					var taxSvc = '', certCaptureSvc = '';
					
					var response = https.get({
						url: subscriptions.url,
						headers: subscriptions.headers
					});
					
					if(response.code == 200){
						var responseBody = JSON.parse(response.body);
						var values = responseBody.value;
						
						for(var i = 0; values != null && i < values.length; i++){
							if(values[i].subscriptionTypeId == 1 || values[i].subscriptionTypeId == 2 || values[i].subscriptionTypeId == 3){
								taxSvc = 'TaxSvc, AddressSvc, ';
							}
							else if(values[i].subscriptionTypeId == 10 || values[i].subscriptionTypeId == 12){
								certCaptureSvc = 'AvaCert2Svc';
							}
						}
						
						serviceTypes = taxSvc + certCaptureSvc;
						
						if(serviceTypes != null && serviceTypes.length > 0){
							alert("License keys validated successfully.");
							cRecord.setValue({
								fieldId: 'ava_servicetypes',
								value: serviceTypes,
								ignoreFieldChange: true
							});
							
							return true;
						}
						else{
							alert("No services enabled for this account. Please contact Avalara Support.");
							return false; 
						}
					}
					else{
						var msg = '';
						
						if(response.code == 401 && (response.body == null || response.body == '')){
							msg = 'No services enabled for this account. Please contact your Customer Account Manager for assistance.';
						}
						else{
							var responseBody = JSON.parse(response.body);
							msg = responseBody.error.message;
							
							if(responseBody.error.code == 'AuthenticationException'){
								msg += ' Enter the correct Account Value and License key and URL provided during registration.';
							}
						}
						
						alert(msg);
						return false;
					}
				}
				catch(err){
					alert(err.message);
					return false;
				}
			}
			else{
				alert("Not all required fields have been entered");
				
				if(accountValue == null || accountValue.length == 0){
					document.forms['main_form'].ava_accvalue.focus();
				}
				else if(licenseKey == null || licenseKey.length == 0){
					document.forms['main_form'].ava_lickey.focus();
				}
				
				return false;
			}
		}
		
		function configChanged(context){
			var address = new Array(7);
			var cRecord = context.currentRecord;
			var fieldValue = cRecord.getValue({
				fieldId: context.fieldId
			});
			switch(context.fieldId)
			{
				case 'ava_company':
					if(cRecord.getField('ava_servicetype') != null){
						ConfigLogs.AvaTaxCompanyCodeName = fieldValue;
						var accountValue = cRecord.getValue({
							fieldId: 'ava_accvalue'
						});
						var licenseKey = cRecord.getValue({
							fieldId: 'ava_lickey'
						});
						var additionalInfo1 = cRecord.getValue({
							fieldId: 'ava_addtionalinfo1'
						});
						var additionalInfo2 = cRecord.getValue({
							fieldId: 'ava_addtionalinfo2'
						});
						var serviceUrl = cRecord.getValue({
							fieldId: 'ava_serviceurl'
						});
						
						var Url = url.resolveScript({
							scriptId: 'customscript_ava_general_restlet',
							deploymentId: 'customdeploy_ava_general_restlet'
						});
						Url = Url + '&type=dosomethingelse' + '&accountValue=' + accountValue + '&ava_lickey=' + licenseKey + '&ava_additionalinfo1=' + additionalInfo1+ '&ava_additionalinfo2=' + additionalInfo2;
						var resp = https.get({
							url: Url
						});
						
						var companyInfo = ava_library.mainFunction('AVA_CompanyFetch', (resp.body + '~~' + serviceUrl));
						
						if(companyInfo != null && companyInfo.length > 0){
							for(var i = 0; i < companyInfo.length; i++){
								if(fieldValue != null && fieldValue.length > 0 && companyInfo[i][0] == fieldValue){
									cRecord.setValue({
										fieldId: 'ava_companyid',
										value: companyInfo[i][2].toString(),
										ignoreFieldChange: true
									});
									break;
								}
							}
						}
					}
					break;
				case 'ava_taxcodemapping':
					ConfigLogs.EnableTaxCodeMapping = fieldValue;
					break;
				case 'ava_taxcodeprecedence':
					ConfigLogs.TaxCodePrecedence =fieldValue;
					break;
				case 'ava_udf1':
					ConfigLogs.UserDefined1 = fieldValue;
					break;
				case 'ava_udf2':
					ConfigLogs.UserDefined2 = fieldValue;
					break;
				case 'ava_itemaccount':
					ConfigLogs.SendItemAccountToAvalara = fieldValue;
					break;
					
				case 'ava_customercode':
					ConfigLogs.CustomerCode = fieldValue;
					if(fieldValue >= 3 && fieldValue != 6 && fieldValue != 8){
						if(runtime.isFeatureInEffect('prm') == false){
							alert('Partner information cannot be passed to service as the required features are not enabled.');
						}
						else if(runtime.isFeatureInEffect('multipartner') == true){
							alert('Customer information will be passed to the service as Multi-Partner Management feature is enabled.');
						}
					}
					break;
					
				case 'ava_vendorcode':
					ConfigLogs.VendorCode = fieldValue;
					break;
				case 'ava_markcusttaxable':
					ConfigLogs.DefaultCustomersToTaxable = fieldValue;
					break;
				case 'ava_defaultcustomer':
					ConfigLogs.ApplyDefaultTaxcodeTo = fieldValue;
					break;
				case 'ava_entityusecode':
					ConfigLogs.EnableEntityUseCode = fieldValue;
					break;
				case 'ava_defshipcode':
					ConfigLogs.DefaultShippingCode = fieldValue;
					break;
				case 'ava_showmessages':
					ConfigLogs.ShowWarningsError = fieldValue;
					break;
				case 'ava_billtimename':
					ConfigLogs.BillableTimeName = fieldValue;
					break;
				case 'ava_enablelogentries':
					ConfigLogs.EnableLogEntries = fieldValue;
					break;
					
				case 'ava_disabletax':
					if(fieldValue == true){
						if(confirm('Are you sure you want to disable AvaTax Tax Calculation ?') == true){
							ConfigLogs.DisableTaxCalculation = fieldValue;
							disableTaxFields(cRecord, fieldValue);
						}
						else{
							cRecord.setValue({
								fieldId: 'ava_disabletax',
								value: false,
								ignoreFieldChange: true
							});
						}
					}
					else{
						ConfigLogs.DisableTaxCalculation = fieldValue;
						disableTaxFields(cRecord, fieldValue);
					}
					break;
					
				case 'ava_disabletaxquote':
					ConfigLogs.DisableTaxCalculationQuote = fieldValue;
					break;
				case 'ava_disabletaxsalesorder':
					ConfigLogs.DisableTaxCalculationOrder = fieldValue;
					break;
				case 'ava_disableline':
					ConfigLogs.DisableTaxCalculationLineLevel = fieldValue;
					
					if(fieldValue == false){
						alert('Line Level Tax calculation may cause incremental AvaTax usage charges as this option will automatically calculate tax when a line is added, removed, or changed.');
					}
					break;
				case 'ava_enablelogging':
					ConfigLogs.EnableLogging = fieldValue;
					break;
				case 'ava_taxondemand':
					ConfigLogs.CalculateTaxOnDemand = fieldValue;
					break;
				case 'ava_taxinclude':
					ConfigLogs.TaxIncludedCapability = fieldValue;
					break;
				case 'ava_usepostingperiod':
					ConfigLogs.UsePostingPeriod = fieldValue;
					break;
				case 'ava_disableloccode':
					ConfigLogs.DisableLocationCode = fieldValue;
					break;
				case 'ava_enableupccode':
					ConfigLogs.EnableUPCCode = fieldValue;
					break;
				case 'ava_useinvoiceaddress':
					ConfigLogs.UseInvoiceAddressOnReturns = fieldValue;
					break;
				case 'ava_committransaction':
					ConfigLogs.AllowWorkflowApprovalForPosting = fieldValue;
					break;
					
				case 'ava_enablediscount':
					ConfigLogs.EnableDiscountMechanism = fieldValue;
					var discountMapping = cRecord.getField({
						fieldId: 'ava_discountmapping'
					});
					var discountTaxcode = cRecord.getField({
						fieldId: 'ava_discounttaxcode'
					});
					var disabled = (fieldValue == true) ? false : true;
					discountMapping.isDisabled = disabled;
					discountTaxcode.isDisabled = disabled;
					break;
					
				case 'ava_discountmapping':
					ConfigLogs.DiscountMapping = fieldValue;
					break;
				case 'ava_discounttaxcode':
					ConfigLogs.DiscountTaxCode = fieldValue;
					break;
				case 'ava_taxrate':
					ConfigLogs.TaxRate = fieldValue;
					break;
				case 'ava_decimalplaces':
					ConfigLogs.RoundOffTaxPercentage = fieldValue;
					break;
					
				case 'ava_deftaxcode':
					var val = fieldValue.substr(fieldValue.lastIndexOf('+')+1, fieldValue.length);
					cRecord.setValue({
						fieldId: 'ava_deftaxcoderate',
						value: val,
						ignoreFieldChange: true
					});
					break;
					
				case 'ava_def_addressee':
				case 'ava_def_addr1':
				case 'ava_def_addr2':
				case 'ava_def_city':
				case 'ava_def_state':
				case 'ava_def_zip':
				case 'ava_def_country':
					var addr = '';
					
					if(context.fieldId == 'ava_def_addressee'){
						ConfigLogs.Addressee = fieldValue;
					}
					if(context.fieldId == 'ava_def_addr1'){
						ConfigLogs.Address1 = fieldValue;
					}
					if(context.fieldId == 'ava_def_addr2'){
						ConfigLogs.Address2 = fieldValue;
					}
					if(context.fieldId == 'ava_def_city'){
						ConfigLogs.City = fieldValue;
					}
					if(context.fieldId == 'ava_def_state'){
						ConfigLogs.State = fieldValue;
					}
					if(context.fieldId == 'ava_def_zip'){
						ConfigLogs.Zip = fieldValue;
					}
					if(context.fieldId == 'ava_def_country'){
						ConfigLogs.Country = fieldValue;
					}
					
					if (cRecord.getValue('ava_def_addressee') != null){
						address[0] = (cRecord.getValue('ava_def_addressee').length > 0) ? cRecord.getValue('ava_def_addressee') + '\n' : '';
					}
					if (cRecord.getValue('ava_def_addr1') != null){
						address[1] = (cRecord.getValue('ava_def_addr1').length > 0) ? cRecord.getValue('ava_def_addr1') + '\n' : '';
					}
					if(cRecord.getValue('ava_def_addr2') != null){
						address[2] = (cRecord.getValue('ava_def_addr2').length > 0) ? cRecord.getValue('ava_def_addr2') + '\n' : '';
					}
					if (cRecord.getValue('ava_def_city') != null){
						address[3] = (cRecord.getValue('ava_def_city').length > 0) ? cRecord.getValue('ava_def_city') + '\n' : '';
					}
					if (cRecord.getValue('ava_def_state') != null){
						address[4] = (cRecord.getValue('ava_def_state').length > 0) ? cRecord.getValue('ava_def_state') + '\n' : '';
					}
					if (cRecord.getValue('ava_def_zip') != null){
						address[5] = (cRecord.getValue('ava_def_zip').length > 0) ? cRecord.getValue('ava_def_zip') + '\n' : '';
					}
					if (cRecord.getValue('ava_def_country') != null){
						address[6] = (cRecord.getValue('ava_def_country').length > 0) ? cRecord.getValue('ava_def_country') + '\n' : '';
					}
					
					for(var i = 0; i <= 6; i++){
						addr = addr +  address[i];
					}
					
					cRecord.setValue({
						fieldId: 'ava_def_addrtext',
						value: addr,
						ignoreFieldChange: true
					});
					break;
					
				case 'ava_addressvalidate':
					ConfigLogs.ValidateAddress = fieldValue;
					
					if(fieldValue == true){
						var accountValue = cRecord.getValue({
							fieldId: 'ava_accvalue'
						});
						var licenseKey = cRecord.getValue({
							fieldId: 'ava_lickey'
						});
						var additionalInfo1 = cRecord.getValue({
							fieldId: 'ava_addtionalinfo1'
						});
						var additionalInfo2 = cRecord.getValue({
							fieldId: 'ava_addtionalinfo2'
						});
						var serviceUrl = cRecord.getValue({
							fieldId: 'ava_serviceurl'
						});
						
						var Url = url.resolveScript({
							scriptId: 'customscript_ava_general_restlet',
							deploymentId: 'customdeploy_ava_general_restlet'
						});
						Url = Url + '&type=dosomethingelse' + '&accountValue=' + accountValue + '&ava_lickey=' + licenseKey + '&ava_additionalinfo1=' + additionalInfo1+ '&ava_additionalinfo2=' + additionalInfo2;
						var resp = https.get({
							url: Url
						});
						
						var AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', serviceUrl);
						var address = validateAddressBody(cRecord, AvaTax);
						var validate = address.validate(resp.body);
						
						try{
							var response = https.post({
								url: validate.url,
								body: validate.data,
								headers: validate.headers
							});
							
							if(response.code == 200){
								var responseBody = JSON.parse(response.body);
								var messages = responseBody.messages;
								
								if(messages == null || messages.length == 0){
									var validatedAddress = responseBody.validatedAddresses[0];
									
									var line1 		= validatedAddress.line1;
									var line2 		= validatedAddress.line2;
									var city  		= validatedAddress.city;
									var region  	= validatedAddress.region;
									var postalCode  = validatedAddress.postalCode;
									var country  	= validatedAddress.country;
									
									cRecord.setValue({
										fieldId: 'ava_def_addr1',
										value: line1,
										ignoreFieldChange: true
									});
									cRecord.setValue({
										fieldId: 'ava_def_addr2',
										value: line2,
										ignoreFieldChange: true
									});
									cRecord.setValue({
										fieldId: 'ava_def_city',
										value: city,
										ignoreFieldChange: true
									});
									cRecord.setValue({
										fieldId: 'ava_def_state',
										value: region,
										ignoreFieldChange: true
									});
									cRecord.setValue({
										fieldId: 'ava_def_zip',
										value: postalCode,
										ignoreFieldChange: true
									});
									cRecord.setValue({
										fieldId: 'ava_def_country',
										value: country,
										ignoreFieldChange: true
									});
									
									var address = '';
									line2 = (line2 != null && line2.length > 0) ? '\n' + line2 : '';
									address = cRecord.getValue('ava_def_addressee') + '\n' + line1 + line2 + '\n' + city + '\n' + region + '\n' + postalCode + '\n' + country;
									cRecord.setValue({
										fieldId: 'ava_def_addrtext',
										value: address,
										ignoreFieldChange: true
									});
								}
								else{
									if(messages.length > 0){
										if(messages[0].details != null && (messages[0].details).length > 0)
										{
											alert(messages[0].details);
										}
										else
										{
											alert(messages[0].summary);
										}
									}
								}
							}
							else{
								var responseBody = JSON.parse(response.body);
								alert(responseBody.error.message);
							}
						}
						catch(err){
							alert('Address Validation was not Successful. ' + err.message);
						}
					}
					
					cRecord.setValue({
						fieldId: 'ava_addressvalidate',
						value: false,
						ignoreFieldChange: true
					});
					break;
					
				case 'ava_abortbulkbilling':
					ConfigLogs.AbortBulkBilling = fieldValue;
					break;
				case 'ava_abortuserinterfaces':
					ConfigLogs.AbortUserInterfaces = fieldValue;
					break;
				case 'ava_abortwebservices':
					ConfigLogs.AbortWebservices = fieldValue;
					break;
				case 'ava_abortcsvimports':
					ConfigLogs.AbortCSVImports = fieldValue;
					break;
				case 'ava_abortscheduledscripts':
					ConfigLogs.AbortScheduledScripts = fieldValue;
					break;
				case 'ava_abortsuitelets':
					ConfigLogs.AbortSuitelets = fieldValue;
					break;
				case 'ava_abortworkflowactionscripts':
					ConfigLogs.AbortWorkFlowActionsScripts = fieldValue;
					break;
					
				case 'ava_enableusetax':
					ConfigLogs.EnableUseTaxAssessment = fieldValue;
					
					if(fieldValue == true && runtime.isFeatureInEffect('advtaxengine') == false){
						alert('Please enable Advanced Taxes feature to use UseTax Assessment feature.');
						cRecord.setValue({
							fieldId: 'ava_enableusetax',
							value: false,
							ignoreFieldChange: true
						});
						return;
					}
					
					var disabled = (fieldValue == true) ? false : true;
					var creditAccount = cRecord.getField({
						fieldId: 'ava_creditacc'
					});
					var glAccounts = cRecord.getField({
						fieldId: 'ava_glacc'
					});
					var debitAccount = cRecord.getField({
						fieldId: 'ava_debitacc'
					});
					var billApproved = cRecord.getField({
						fieldId: 'ava_billapproved'
					});
					var autoAssess = cRecord.getField({
						fieldId: 'ava_autoassess'
					});
					var vendorTaxItem = cRecord.getField({
						fieldId: 'ava_vendortaxitem'
					});
					var taxAccrualDate = cRecord.getField({
						fieldId: 'ava_taxaccrualdate'
					});
					
					creditAccount.isDisabled = disabled;
					glAccounts.isDisabled = disabled;
					var glAccount = cRecord.getValue({
						fieldId: 'ava_glacc'
					});
					if(glAccount == 'glaccount'){
						debitAccount.isDisabled = disabled;
					}
					billApproved.isDisabled = disabled;
					autoAssess.isDisabled = disabled;
					vendorTaxItem.isDisabled = disabled;
					taxAccrualDate.isDisabled = disabled;
					break;
					
				case 'ava_creditacc':
					ConfigLogs.UseTaxPayableAccount = fieldValue;
					break;
					
				case 'ava_glacc':
					ConfigLogs.GLAccountDebit = fieldValue;
					var debitAccount = cRecord.getField({
						fieldId: 'ava_debitacc'
					});
					var disabled = (fieldValue == 'glaccount') ? false : true;
					debitAccount.isDisabled = disabled;
					break;
					
				case 'ava_debitacc':
					ConfigLogs.UseTaxDebitAccount = fieldValue;
					break;
				case 'ava_billapproved':
					ConfigLogs.VendorBillApproved = fieldValue;
					break;
				case 'ava_autoassess':
					ConfigLogs.AutoAssessImportedBill = fieldValue;
					break;
					
				case 'ava_vendortaxitem':
					if(fieldValue != null && fieldValue.length > 0){
						var itemType = search.lookupFields({
							type: search.Type.ITEM,
							id: fieldValue,
							columns: 'type'
						});
						
						if(itemType.type[0].value != 'InvtPart' && itemType.type[0].value != 'NonInvtPart'){
							alert('Please select item of inventory or non-inventory type only.')
							cRecord.setValue({
								fieldId: 'ava_vendortaxitem',
								value: ' ',
								ignoreFieldChange: true
							});
						}
						else{
							ConfigLogs.ItemForVendorChargedTax = fieldValue;
						}
					}
					else{
						ConfigLogs.ItemForVendorChargedTax = fieldValue;
					}
					break;
					
				case 'ava_taxaccrualdate':
					ConfigLogs.TaxAccrualDate = fieldValue;
					
					if(fieldValue == 2 && runtime.isFeatureInEffect('accountingperiods') == false){
						alert('Please enable Accounting Periods feature to use Posting Period option.');
						cRecord.setValue({
							fieldId: 'ava_taxaccrualdate',
							value: '0',
							ignoreFieldChange: true
						});
					}
					break;
					
				case 'ava_enablevatin':
					ConfigLogs.EnableInputVAT = fieldValue;
					
					if(fieldValue == true && runtime.isFeatureInEffect('advtaxengine') == false){
						alert('Please enable Advanced Taxes feature to use Input VAT Verification feature.');
						cRecord.setValue({
							fieldId: 'ava_enablevatin',
							value: false,
							ignoreFieldChange: true
						});
					}
					break;
					
				case 'ava_disableaddvalidation':
					ConfigLogs.DisableAddressValidation = fieldValue;
					var enableAddrValidationOnTrans = cRecord.getField({
						fieldId: 'ava_enableaddvalontran'
					});
					var enableAddrValidationFlag = cRecord.getField({
						fieldId: 'ava_enableaddvalflag'
					});
					var upperCaseAddr = cRecord.getField({
						fieldId: 'ava_uppercaseaddress'
					});
					var addrBatchProcessing = cRecord.getField({
						fieldId: 'ava_addbatchprocessing'
					});
					
					enableAddrValidationOnTrans.isDisabled = fieldValue;
					enableAddrValidationFlag.isDisabled = fieldValue;
					upperCaseAddr.isDisabled = fieldValue;
					addrBatchProcessing.isDisabled = fieldValue;
					break;
					
				case 'ava_enableaddvalontran':
					ConfigLogs.EnableAddrValTransaction = fieldValue;
					break;
				case 'ava_enableaddvalflag':
					ConfigLogs.TrackPreviouslyValAddr = fieldValue;
					break;
				case 'ava_uppercaseaddress':
					ConfigLogs.ResultInUpperCase = fieldValue;
					break;
				case 'ava_addbatchprocessing':
					ConfigLogs.BatchProcessing = fieldValue;
					break;
					
				case 'ava_lickey':
					if(fieldValue != null && fieldValue.length > 0){
						var additionalInfo1 = cRecord.getValue({
							fieldId: 'ava_addtionalinfo1'
						});
						
						var Url = url.resolveScript({
							scriptId: 'customscript_ava_general_restlet',
							deploymentId: 'customdeploy_ava_general_restlet'
						});
						Url = Url + '&type=dosomething' + '&ava_lickey=' + fieldValue + '&ava_addtionalinfo1=' + additionalInfo1;
						var response = https.get({
							url: Url
						});
						var responseBody = response.body.split('+');
						
						if(responseBody[0] != null && responseBody[0].indexOf('Invalid secret key') != -1)
						{
							alert('Invalid secret string provided. Please provide 16, 24 or 32 byte length string on initial Setup Assistant page.');
							cRecord.setValue({
								fieldId: 'ava_lickey',
								value: '',
								ignoreFieldChange: true
							});
							
							return;
						}
						
						cRecord.setValue({
							fieldId: 'ava_lickey',
							value: responseBody[0],
							ignoreFieldChange: true
						});
						cRecord.setValue({
							fieldId: 'ava_addtionalinfo2',
							value: responseBody[1],
							ignoreFieldChange: true
						});
					}
					else{
						cRecord.setValue({
							fieldId: 'ava_lickey',
							value: '',
							ignoreFieldChange: true
						});
						cRecord.setValue({
							fieldId: 'ava_addtionalinfo2',
							value: '',
							ignoreFieldChange: true
						});
					}
					break;
					
				default :
					break;
			}
		}
		
		function disableTaxFields(cRecord, disabled){
			var disableTaxQuote = cRecord.getField({
				fieldId: 'ava_disabletaxquote'
			});
			var disableTaxSalesOrder = cRecord.getField({
				fieldId: 'ava_disabletaxsalesorder'
			});
			var disableLineLevelTax = cRecord.getField({
				fieldId: 'ava_disableline'
			});
			var enableLogging = cRecord.getField({
				fieldId: 'ava_enablelogging'
			});
			var taxOnDemand = cRecord.getField({
				fieldId: 'ava_taxondemand'
			});
			var taxInclude = cRecord.getField({
				fieldId: 'ava_taxinclude'
			});
			var usePostingPeriod = cRecord.getField({
				fieldId: 'ava_usepostingperiod'
			});
			var disableLocationCode = cRecord.getField({
				fieldId: 'ava_disableloccode'
			});
			var enableUpcCode = cRecord.getField({
				fieldId: 'ava_enableupccode'
			});
			var useInvoiceAddress = cRecord.getField({
				fieldId: 'ava_useinvoiceaddress'
			});
			var workflowApproval = cRecord.getField({
				fieldId: 'ava_committransaction'
			});
			var enableDiscount = cRecord.getField({
				fieldId: 'ava_enablediscount'
			});
			var discountMapping = cRecord.getField({
				fieldId: 'ava_discountmapping'
			});
			var discountTaxcode = cRecord.getField({
				fieldId: 'ava_discounttaxcode'
			});
			var taxrate = cRecord.getField({
				fieldId: 'ava_taxrate'
			});
			var decimalPlace = cRecord.getField({
				fieldId: 'ava_decimalplaces'
			});
			var defTaxcode = cRecord.getField({
				fieldId: 'ava_deftaxcode'
			});
			var abortBulkBilling = cRecord.getField({
				fieldId: 'ava_abortbulkbilling'
			});
			var abortUserInterfaces = cRecord.getField({
				fieldId: 'ava_abortuserinterfaces'
			});
			var abortWebservices = cRecord.getField({
				fieldId: 'ava_abortwebservices'
			});
			var abortCsvImports = cRecord.getField({
				fieldId: 'ava_abortcsvimports'
			});
			var abortScheduledScripts = cRecord.getField({
				fieldId: 'ava_abortscheduledscripts'
			});
			var abortSuitelets = cRecord.getField({
				fieldId: 'ava_abortsuitelets'
			});
			var abortWorkflowScript = cRecord.getField({
				fieldId: 'ava_abortworkflowactionscripts'
			});
			
			disableTaxQuote.isDisabled = disabled;
			disableTaxSalesOrder.isDisabled = disabled;
			disableLineLevelTax.isDisabled = disabled;
			enableLogging.isDisabled = disabled;
			taxOnDemand.isDisabled = disabled;
			taxInclude.isDisabled = disabled;
			usePostingPeriod.isDisabled = disabled;
			disableLocationCode.isDisabled = disabled;
			enableUpcCode.isDisabled = disabled;
			useInvoiceAddress.isDisabled = disabled;
			workflowApproval.isDisabled = disabled;
			enableDiscount.isDisabled = disabled;
			var display = (disabled == true) ? true : ((enableDiscount == true) ? false : true);
			discountMapping.isDisabled = display;
			discountTaxcode.isDisabled = display;
			taxrate.isDisabled = disabled;
			decimalPlace.isDisabled = disabled;
			defTaxcode.isDisabled = disabled;
			abortBulkBilling.isDisabled = disabled;
			abortUserInterfaces.isDisabled = disabled;
			abortWebservices.isDisabled = disabled;
			abortCsvImports.isDisabled = disabled;
			abortScheduledScripts.isDisabled = disabled;
			abortSuitelets.isDisabled = disabled;
			abortWorkflowScript.isDisabled = disabled;
		}
		
		function validateAddressBody(cRecord, AvaTax){
			var address = new AvaTax.address();
			
		 	address.textCase   = (cRecord.getValue('ava_uppercaseaddress') == true) ? 'Upper' : 'Mixed';
			address.line1	   = (cRecord.getValue('ava_def_addr1') != null) ? ava_library.mainFunction('Trim', cRecord.getValue('ava_def_addr1')) : '';
			address.line2	   = (cRecord.getValue('ava_def_addr2') != null) ? ava_library.mainFunction('Trim', cRecord.getValue('ava_def_addr2')) : '';
			address.line3	   = '';
			address.city 	   = (cRecord.getValue('ava_def_city') != null) ? ava_library.mainFunction('Trim', cRecord.getValue('ava_def_city')) : '';
			address.region	   = (cRecord.getValue('ava_def_state') != null) ? ava_library.mainFunction('Trim', cRecord.getValue('ava_def_state')) : '';
			address.postalCode = (cRecord.getValue('ava_def_zip') != null) ? ava_library.mainFunction('Trim', cRecord.getValue('ava_def_zip')) : '';
			
			var countryName = ava_library.mainFunction('AVA_CheckCountryName', (cRecord.getValue('ava_def_country') != null) ? ava_library.mainFunction('Trim', cRecord.getValue('ava_def_country')) : '');
			address.country = countryName[1];
		 	
		 	return address;
		}
		
		function editCredentials(){
			window.onbeforeunload = undefined;
			var Url = url.resolveScript({
				scriptId: 'customscript_avaconfig_wizard',
				deploymentId: 'customdeploy_ava_configurewizard'
			});
			window.open(Url, '_self');
		}
		
		function next(){
			window.onbeforeunload = undefined;
			var cRecord = currentRecord.get();
			var avataxCompany = cRecord.getValue({
				fieldId: 'ava_company'
			});
			var netsuiteEdition = cRecord.getValue({
				fieldId: 'ava_netsuitedition'
			});
			var taxAgency = cRecord.getValue({
				fieldId: 'ava_taxagency'
			});
			var taxcode = cRecord.getValue({
				fieldId: 'ava_taxcode'
			});
			
			if(avataxCompany == null || avataxCompany.length == 0){
				alert('Please select AvaTax Company Code/Name');
				return;
			}
			
			if(netsuiteEdition == 'US'){
				var taxControlAcc = cRecord.getValue({
					fieldId: 'ava_taxcontrolacct'
				});
				if(taxcode == false){
					if(taxControlAcc == null || taxControlAcc.length == 0){
						alert('Please select GL account of type \'Tax Control\'');
						return;
					}
					else{
						var taxAgencyId = cRecord.getValue({
							fieldId: 'ava_taxagencyid'
						});
						var response = https.request({
							method: https.Method.GET,
							url: url.resolveScript({
								scriptId: 'customscript_ava_recordload_suitelet',
								deploymentId: 'customdeploy_ava_recordload',
								params: {'type': 'createtaxcode', 'taxagencyid': taxAgencyId, 'taxcontrolacct': taxControlAcc}
							})
						});
						
						if(response.body == 0){
							alert('Please select respective GL account of type \'Tax Control\'');
							return;
						}
					}
				}
			}
			else{
				if(taxcode == false){
					var msg = 'The required minimum configuration setting (Tax Agency Created and Tax Code Created) to calculate tax are not completed.\n\nDo you want to still continue?';
					
					if(!confirm(msg)){
						return;
					}
				}
			}
			
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
				fieldId: 'custrecord_ava_configflag',
				value: true
			});
			rec.setValue({
				fieldId: 'custrecord_ava_defcompanycode',
				value: avataxCompany
			});
			rec.save({
			});
			
			var Url = url.resolveScript({
				scriptId: 'customscript_avaconfig_suitlet',
				deploymentId: 'customdeploy_configuration'
			});
			window.open(Url, '_self');
		}
		
		function createCompany(){
			var Url = url.resolveScript({
				scriptId: 'customscript_ava_createcompany_suitelet',
				deploymentId: 'customdeploy_ava_createcompany_suitelet'
			});
			window.open(Url, 'Create AvaTax Company', 'scrollbars = yes, width = 1024, height = 600, left = 200, top = 120');
		}
		
		return{
			fieldChanged: configChanged,
			pageInit: configPageInit,
			saveRecord: configSave,
			editCredentials: editCredentials,
			next: next,
			createCompany: createCompany
		};
	}
);