/******************************************************************************************************
	Script Name - 	AVA_SUT_CreateCompanyForm.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/config', 'N/redirect', './utility/AVA_Library', './utility/AVA_CommonServerFunctions'],
	function(ui, config, redirect, ava_library, ava_commonFunction){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 28);
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var form = ui.createForm({
						title: 'Create AvaTax Company'
					});
					form.clientScriptModulePath = './AVA_CLI_CreateCompanyForm.js';
					
					var companyCode, j = 1;
					var loadConfig = config.load({
						type: config.Type.COMPANY_INFORMATION
					});
					
					var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
					var details = ava_commonFunction.mainFunction('AVA_General', (avaConfigObjRec['AVA_AccountValue'] + '+' + avaConfigObjRec['AVA_AdditionalInfo'] + '+' + avaConfigObjRec['AVA_AdditionalInfo1'] + '+' + avaConfigObjRec['AVA_AdditionalInfo2']));
					var companyInfo = ava_library.mainFunction('AVA_CompanyFetch', (details + '~~' + avaConfigObjRec['AVA_ServiceUrl'])); // Fetch all the companies from Admin Console
					
					// Generate AvaTax Company code
					if(companyInfo != null && companyInfo.length > 0){
						while(true){
							var flag = 0;
							companyCode = 'netsuite' + j;
							for(var i = 0; i < companyInfo.length; i++){
								if(companyCode == companyInfo[i][0]){
									j++;
									flag = 1;
									break;
								}
							}
							
							if(flag == 0){
								break;
							}
						}
					}
					else{
						companyCode = loadConfig.getValue('companyid');
					}
					
					var companyName = form.addField({
						id: 'ava_companyname',
						label: 'Company Name',
						type: ui.FieldType.TEXT
					});
					companyName.isMandatory = true;
					companyName.maxLength = 50;
					companyName.updateDisplaySize({
						width: 40,
						height: 0
					});
					companyName.defaultValue = loadConfig.getValue('companyname');
					
					var mainAddressRecord = loadConfig.getSubrecord('mainaddress');
					
					var addressLine1 = form.addField({
						id: 'ava_address1',
						label: 'Address 1',
						type: ui.FieldType.TEXT
					});
					addressLine1.isMandatory = true;
					addressLine1.updateDisplaySize({
						width: 40,
						height: 0
					});
					addressLine1.defaultValue = mainAddressRecord.getValue('addr1');
					
					var addressLine2 = form.addField({
						id: 'ava_address2',
						label: 'Address 2',
						type: ui.FieldType.TEXT
					});
					addressLine2.updateDisplaySize({
						width: 40,
						height: 0
					});
					addressLine2.defaultValue = mainAddressRecord.getValue('addr2');
					
					var city = form.addField({
						id: 'ava_city',
						label: 'City',
						type: ui.FieldType.TEXT
					});
					city.isMandatory = true;
					city.updateDisplaySize({
						width: 40,
						height: 0
					});
					city.defaultValue = mainAddressRecord.getValue('city');
					
					var state = form.addField({
						id: 'ava_state',
						label: 'State',
						type: ui.FieldType.TEXT
					});
					state.isMandatory = true;
					state.updateDisplaySize({
						width: 40,
						height: 0
					});
					state.defaultValue = mainAddressRecord.getValue('state');
					
					var zip = form.addField({
						id: 'ava_zip',
						label: 'Zip',
						type: ui.FieldType.TEXT
					});
					zip.isMandatory = true;
					zip.updateDisplaySize({
						width: 40,
						height: 0
					});
					zip.defaultValue = mainAddressRecord.getValue('zip');
					
					var country = form.addField({
						id: 'ava_country',
						label: 'Country',
						type: ui.FieldType.TEXT
					});
					country.isMandatory = true;
					country.updateDisplaySize({
						width: 40,
						height: 0
					});
					country.defaultValue = mainAddressRecord.getValue('country');
					
					var compCode = form.addField({
						id: 'ava_companycode',
						label: 'Company Code',
						type: ui.FieldType.TEXT
					});
					compCode.isMandatory = true;
					compCode.maxLength = 25;
					compCode.updateDisplaySize({
						width: 40,
						height: 0
					});
					compCode.updateLayoutType({
						layoutType: ui.FieldLayoutType.STARTROW
					});
					compCode.updateBreakType({
						breakType: ui.FieldBreakType.STARTCOL
					});
					compCode.defaultValue = companyCode;
					
					var email = form.addField({
						id: 'ava_email',
						label: 'Email',
						type: ui.FieldType.EMAIL
					});
					email.isMandatory = true;
					email.updateDisplaySize({
						width: 40,
						height: 0
					});
					
					var fName = form.addField({
						id: 'ava_firstname',
						label: 'First Name',
						type: ui.FieldType.TEXT
					});
					fName.isMandatory = true;
					fName.updateDisplaySize({
						width: 40,
						height: 0
					});
					
					var lName = form.addField({
						id: 'ava_lastname',
						label: 'Last Name',
						type: ui.FieldType.TEXT
					});
					lName.isMandatory = true;
					lName.updateDisplaySize({
						width: 40,
						height: 0
					});
					
					var phoneNumber = form.addField({
						id: 'ava_phonenumber',
						label: 'Phone Number',
						type: ui.FieldType.PHONE
					});
					phoneNumber.isMandatory = true;
					phoneNumber.updateDisplaySize({
						width: 40,
						height: 0
					});
					
					var tinNumber = form.addField({
						id: 'ava_tinnumber',
						label: 'Business Tax Identification Number (TIN)',
						type: ui.FieldType.TEXT
					});
					tinNumber.maxLength = 11;
					tinNumber.updateDisplaySize({
						width: 40,
						height: 0
					});
					
					var accountValue = form.addField({
						id: 'ava_accvalue',
						label: 'Account Number',
						type: ui.FieldType.TEXT
					});
					accountValue.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					accountValue.defaultValue = avaConfigObjRec['AVA_AccountValue'];
					
					var licKey = form.addField({
						id: 'ava_lickey',
						label: 'License Key',
						type: ui.FieldType.PASSWORD
					});
					licKey.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					licKey.maxLength = 200;
					licKey.defaultValue = avaConfigObjRec['AVA_AdditionalInfo'];
					
					var additionalInfo1 = form.addField({
						id: 'ava_addtionalinfo1',
						label: 'Additional Info1',
						type: ui.FieldType.PASSWORD
					});
					additionalInfo1.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					additionalInfo1.maxLength = 200;
					additionalInfo1.defaultValue = avaConfigObjRec['AVA_AdditionalInfo1'];
					
					var additionalInfo2 = form.addField({
						id: 'ava_addtionalinfo2',
						label: 'Additional Info2',
						type: ui.FieldType.PASSWORD
					});
					additionalInfo2.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					additionalInfo2.maxLength = 200;
					additionalInfo2.defaultValue = avaConfigObjRec['AVA_AdditionalInfo2'];
					
					var serviceUrl = form.addField({
						id: 'ava_serviceurl',
						label: 'Service URL',
						type: ui.FieldType.TEXT
					});
					serviceUrl.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					serviceUrl.defaultValue = avaConfigObjRec['AVA_ServiceUrl'];
					
					var companyId = form.addField({
						id: 'ava_companyid',
						label: 'Company ID',
						type: ui.FieldType.TEXT
					});
					companyId.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					form.addSubmitButton({
						label: 'Create Company'
					});
					
					context.response.writePage({
						pageObject: form
					});
				}
				else{
					redirect.toSuitelet({
						scriptId: 'customscript_avaenablenexus_suitelet',
						deploymentId: 'customdeploy_avaenablenexus_suitelet',
						parameters: {
							'companyid': context.request.parameters.ava_companyid
						}
					});
				}
			}
			else{
				context.response.write({
					output: checkServiceSecurity
				});
			}
		}
		
		return{
			onRequest: onRequest
		};
	}
);