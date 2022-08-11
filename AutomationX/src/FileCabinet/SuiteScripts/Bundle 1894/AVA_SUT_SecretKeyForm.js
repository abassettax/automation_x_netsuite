/******************************************************************************************************
	Script Name - 	AVA_SUT_SecretKeyForm.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/search', 'N/redirect'],
	function(ui, search, redirect){
		function onRequest(context){
			if(context.request.method === 'GET'){
				var form = ui.createForm({
					title: 'Setup Assistant'
				});
				form.clientScriptModulePath = './AVA_CLI_Config.js';
				
				var searchRecord = search.create({
					type: 'customrecord_avaconfig',
					columns: ['custrecord_ava_accountvalue', 'custrecord_ava_additionalinfo', 'custrecord_ava_configflag']
				});
				var searchresult = searchRecord.run();
				searchresult = searchresult.getRange({
					start: 0,
					end: 5
				});
				
				if(searchresult != null && searchresult.length > 0){
					var accValue = searchresult[0].getValue('custrecord_ava_accountvalue');
					var key = searchresult[0].getValue('custrecord_ava_additionalinfo');
					var configFlag = searchresult[0].getValue('custrecord_ava_configflag');
					
					if(accValue != null && accValue.length > 0 && key != null && key.length > 0 && configFlag == true){
						redirect.toSuitelet({
							scriptId: 'customscript_avaconfig_suitlet',
							deploymentId: 'customdeploy_configuration'
						});
					}
				}
				
				var sKeyHelp = '<b>Secret key FAQs</b><br><br>Q. What is the secret key for?<br><br>';
				sKeyHelp += 'A. The secret key allows Avalara Connector for NetSuite to encrypt and decrypt your AvaTax sign in information that is sent from NetSuite, keeping your data more secure.<br><br><br>';
				sKeyHelp += 'Q. Do I need to remember my secret key or write it down?<br><br>';
				sKeyHelp += 'A. No. The key won\'t be used anywhere else.<br><br><br>';
				sKeyHelp += 'Q. Will I need to enter this secret key if I uninstall and re-install Connector for NetSuite?<br><br>';
				sKeyHelp += 'A. No. A new secret key is entered any time Connector for NetSuite is installed or re-installed.<br><br><br>';
				sKeyHelp += 'Q. What characters can I use in my secret key?<br><br>';
				sKeyHelp += 'A. Use any combination of letters and numbers. Just make sure the key is exactly 16, 24, or 32 characters long.<br><br><br>';
				sKeyHelp += 'Q. We were already using Connector for NetSuite. How will I know if someone else in my organization already entered a secret key?<br><br>';
				sKeyHelp += 'A. This page only displays if a key has not yet been entered. Once that\'s done, you won\'t see this page again.<br><br>';
				
				var helpDescription = form.addField({
					id: 'ava_help',
					label: ' ',
					type: ui.FieldType.INLINEHTML
				});
				helpDescription.defaultValue = '<font size = 2>Enter a secret key that is 16, 24, or 32 letters and numbers long. You won\'t need to remember it or enter it anywhere else, so you don\'t need to make it memorable.</font>';
				
				var sKey = form.addSecretKeyField({
					id: 'ava_guidkey',
					label: 'Secret key',
					restrictToScriptIds: 
									[
				                	 	'customscript_avaconfig_wizard',
				                	 	'customscript_avaconfig_wizard1',
				                	 	'customscript_avaconfig_suitlet',
				                	 	'customscript_ava_createcompany_suitelet',
				                	 	'customscript_ava_general_restlet',
				                	 	'customscript_avacertstatus_suitelet',
				                	 	'customscript_avagetcertificates_suitelet',
				                	 	'customscript_avagetcertimage_suitelet',
				                	 	'customscript_avagettaxhistory_suitelet',
				                	 	'customscript_avapurchasetransactiontab',
				                	 	'customscript_avatransactiontab',
				                	 	'customscript_avatransactiontab_2',
				                	 	'customscript_avaaddressvalidation_sched',
				                	 	'customscript_avacommittrans_sched',
				                	 	'customscript_avaentityusecodeslist_sched',
				                	 	'customscript_ava_reconcileavatax_sched'
				                	],
				    restrictToCurrentUser: false
				});
				sKey.setHelpText({
					help: sKeyHelp
				});
				
				form.addSubmitButton({
					label: 'Submit'
				});
				
				context.response.writePage({
					pageObject: form
				});
			}
			else{
				redirect.toSuitelet({
					scriptId: 'customscript_avaconfig_wizard',
					deploymentId: 'customdeploy_ava_configurewizard',
					parameters: {'info': context.request.parameters.ava_guidkey}
				});
			}
		}
		
		return{
        	onRequest: onRequest
        };
	}
);