/******************************************************************************************************
	Script Name - AVA_SUT_SetupAssistant.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/search', 'N/runtime', 'N/redirect', 'N/record'],
	function(ui, search, runtime, redirect, record){
		function onRequest(context){
			if(context.request.method === 'GET'){
				var form = ui.createForm({
					title: 'Setup Assistant'
				});
				form.clientScriptModulePath = './AVA_CLI_Config.js';
				
				var accountValue = form.addField({
					id: 'ava_accvalue',
					label: 'Account Number',
					type: ui.FieldType.TEXT
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
				additionalInfo1.maxLength = 200;
				additionalInfo1.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				additionalInfo1.defaultValue = context.request.parameters.info;
				
				var additionalInfo2 = form.addField({
					id: 'ava_addtionalinfo2',
					label: 'Additional Info2',
					type: ui.FieldType.PASSWORD
				});
				additionalInfo2.maxLength = 200;
				additionalInfo2.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				
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
				serviceUrl.setHelpText("Select the type of AvaTax account you're connecting to in AvaTax.<br><br> Select 'Development' if you are in NetSuite Sandbox or Test environment.<br><br> Select 'Production' if you are in NetSuite Live / Production environment.");
				
				if(runtime.envType != runtime.EnvType.PRODUCTION){
					serviceUrl.defaultValue = '1';
				}
				
				var setupConfigFlag = form.addField({
					id: 'ava_setupconfig',
					label: 'Setup/Config Flag',
					type: ui.FieldType.TEXT
				});
				setupConfigFlag.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				setupConfigFlag.defaultValue = 'F';
				
				var serviceTypes = form.addField({
					id: 'ava_servicetypes',
					label: 'Service Types',
					type: ui.FieldType.TEXT
				});
				serviceTypes.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				
				var searchRecord = search.create({
					type: 'customrecord_avaconfig',
					columns: ['custrecord_ava_accountvalue', 'custrecord_ava_licensekey', 'custrecord_ava_additionalinfo', 'custrecord_ava_additionalinfo1', 'custrecord_ava_additionalinfo2', 'custrecord_ava_url', 'custrecord_ava_configflag']
				});
				var searchresult = searchRecord.run();
				searchresult = searchresult.getRange({
					start: 0,
					end: 5
				});
				
				if(searchresult != null && searchresult.length > 0){
					var accValue = searchresult[0].getValue('custrecord_ava_accountvalue');
					var key = searchresult[0].getValue('custrecord_ava_additionalinfo');
					
					accountValue.defaultValue = accValue;
					additionalInfo2.defaultValue = searchresult[0].getValue('custrecord_ava_additionalinfo2');
					serviceUrl.defaultValue = searchresult[0].getValue('custrecord_ava_url');
					
					if(key != null && key.length > 0 && searchresult[0].getValue('custrecord_ava_configflag') == true){
						form.title = 'Avalara Configuration';
						licKey.defaultValue = key;
						additionalInfo1.defaultValue = searchresult[0].getValue('custrecord_ava_additionalinfo1');
						setupConfigFlag.defaultValue = 'T';
					}
				}
				
				form.addSubmitButton({
					label: 'Validate'
				});
				
				context.response.writePage({
					pageObject: form
				});
			}
			else{
				var rec;
				var searchRecord = search.create({
					type: 'customrecord_avaconfig'
				});
				var searchresult = searchRecord.run();
				searchresult = searchresult.getRange({
					start: 0,
					end: 5
				});
				
				if(searchresult != null && searchresult.length > 0){
					rec = record.load({
						type: 'customrecord_avaconfig',
						id: searchresult[0].id
					});
				}
				else{
					rec = record.create({
						type: 'customrecord_avaconfig'
					});
				}
				
				rec.setValue({
					fieldId: 'custrecord_ava_accountvalue',
					value: context.request.parameters.ava_accvalue
				});
				rec.setValue({
					fieldId: 'custrecord_ava_additionalinfo',
					value: context.request.parameters.ava_lickey
				});
				rec.setValue({
					fieldId: 'custrecord_ava_additionalinfo1',
					value: context.request.parameters.ava_addtionalinfo1
				});
				rec.setValue({
					fieldId: 'custrecord_ava_additionalinfo2',
					value: context.request.parameters.ava_addtionalinfo2
				});
				rec.setValue({
					fieldId: 'custrecord_ava_url',
					value: context.request.parameters.ava_serviceurl
				});
				rec.setValue({
					fieldId: 'custrecord_ava_servicetypes',
					value: context.request.parameters.ava_servicetypes
				});
				
				rec.save({
				});
				
				if(context.request.parameters.ava_setupconfig == 'F'){
					redirect.toSuitelet({
						scriptId: 'customscript_avaconfig_wizard1',
						deploymentId: 'customdeploy_avaconfig_wizard1'
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