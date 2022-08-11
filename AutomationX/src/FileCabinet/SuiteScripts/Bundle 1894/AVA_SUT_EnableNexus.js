/******************************************************************************************************
	Script Name - 	AVA_SUT_EnableNexus.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/search', 'N/config', 'N/redirect', './utility/AVA_Library'],
	function(ui, search, config, redirect, ava_library){
		function onRequest(context){
			if(context.request.method === 'GET'){
				var form = ui.createForm({
					title: 'Nexus Setup'
				});
				form.clientScriptModulePath = './AVA_CLI_EnableNexus.js';
				
				var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
				
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
				companyId.defaultValue = context.request.parameters.companyid;
				
				var help = 'Where should AvaTax collect tax for you? Let\'s take a look at it together!<br><br>';
				help += 'At least one jurisdiction must be selected in order to start calculating tax using AvaTax. The list below will help you select nexus jurisdictions based on your data in NetSuite.<br><br>';
				help += '<b>**Please note, the selections below only reflect a basic nexus configuration. Where applicable, local jurisdictions can be selected within your AvaTax Admin Console.<br>';
				help += 'Further information about local jurisdictions is found <a href= "https://help.avalara.com/Avalara_AvaTax_Update/Local_jurisdictions" target="_blank">here</a></b><br><br>';
				help += '<b>Select the locations below where you want to collect tax and hit "Enable Tax Jurisdiction(s)"';
				
				form.addField({
					id: 'ava_help',
					label: help,
					type: ui.FieldType.LABEL
				});
				
				var nexusList = form.addSublist({
					id: 'custpage_nexuslist',
					label: 'Nexus List',
					type: ui.SublistType.LIST
				});
				nexusList.addField({
					id: 'ava_selectnexus',
					label: 'Select Nexus',
					type: ui.FieldType.CHECKBOX
				});
				nexusList.addField({
					id: 'ava_nexusname',
					label: 'Where (State,  Country)',
					type: ui.FieldType.TEXT
				});
				var nexusState = nexusList.addField({
					id: 'ava_nexusstate',
					label: 'Nexus State',
					type: ui.FieldType.TEXT
				});
				nexusState.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				var nexusCountry = nexusList.addField({
					id: 'ava_nexuscountry',
					label: 'Nexus Country',
					type: ui.FieldType.TEXT
				});
				nexusCountry.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN
				});
				nexusList.addMarkAllButtons();
				
				var stateCountry = new Array();
				var searchLocation = search.create({
					type: search.Type.LOCATION,
					filters: ['isinactive', 'is', 'F'],
					columns: ['state', 'country']
				});
				var searchResultLocation = searchLocation.run();
				searchResultLocation = searchResultLocation.getRange({
					start: 0,
					end: 1000
				});
				
				for(var i = 0; searchResultLocation != null && i < searchResultLocation.length; i++){
					if(searchResultLocation[i].getValue('state') != null && searchResultLocation[i].getValue('state').length == 2){
						var flag = 0;
						for(var k = 0; k < stateCountry.length; k++){
							if(stateCountry[k][0] == searchResultLocation[i].getValue('state')){
								flag = 1;
								break;
							}
						}
						
						if(flag == 0){
							var arrIndex = stateCountry.length;
							stateCountry[arrIndex] = new Array();
							stateCountry[arrIndex][0] = searchResultLocation[i].getValue('state');
							stateCountry[arrIndex][1] = searchResultLocation[i].getValue('country');
						}
					}
				}
				
				var transactionTypeArray = new Array('Estimate','SalesOrd','CustInvc','CashSale','RtnAuth','CashRfnd','CustCred');
				var searchTransaction = search.create({
					type: search.Type.TRANSACTION,
					filters: 
						[
						 	['mainline', 'is', 'T'],
						 	'and',
						 	['type', 'anyof', transactionTypeArray]
						],
					columns:
						[
						 	search.createColumn({
						 		name: 'internalid',
						 		sort: search.Sort.DESC
						 	}),
						 	'shipstate',
						 	'shipcountrycode'
						]
				});
				var searchResultTransaction = searchTransaction.run();
				searchResultTransaction = searchResultTransaction.getRange({
					start: 0,
					end: 1000
				});
				
				for(var i = 0; searchResultTransaction != null && i < searchResultTransaction.length; i++){
					if(searchResultTransaction[i].getValue('shipstate') != null && searchResultTransaction[i].getValue('shipstate').length == 2){
						var flag = 0;
						for(var k = 0; k < stateCountry.length; k++){
							if(stateCountry[k][0] == searchResultTransaction[i].getValue('shipstate')){
								flag = 1;
								break;
							}
						}
						
						if(flag == 0){
							var arrIndex = stateCountry.length;
							stateCountry[arrIndex] = new Array();
							stateCountry[arrIndex][0] = searchResultTransaction[i].getValue('shipstate');
							stateCountry[arrIndex][1] = searchResultTransaction[i].getValue('shipcountrycode');
						}
					}
				}
				
				var loadConfig = config.load({
					type: config.Type.COMPANY_INFORMATION
				});
				var companyState = loadConfig.getValue({
					fieldId: 'state'
				});
				var companyCountry = loadConfig.getValue({
					fieldId: 'country'
				});
				
				if(companyState != null && companyState.length > 0){
					var flag = 0;
					for(var k = 0; k < stateCountry.length; k++){
						if(stateCountry[k][0] == companyState){
							flag = 1;
							break;
						}
					}
					
					if(flag == 0){
						var arrIndex = stateCountry.length;
						stateCountry[arrIndex] = new Array();
						stateCountry[arrIndex][0] = companyState;
						stateCountry[arrIndex][1] = companyCountry;
					}
				}
				
				for(var i = 0; i < stateCountry.length; i++){
					nexusList.setSublistValue({
						id: 'ava_nexusname',
						line: i,
						value: stateCountry[i][0] + ', ' + stateCountry[i][1]
					});
					nexusList.setSublistValue({
						id: 'ava_nexusstate',
						line: i,
						value: stateCountry[i][0]
					});
					nexusList.setSublistValue({
						id: 'ava_nexuscountry',
						line: i,
						value: stateCountry[i][1]
					});
				}
				
				form.addSubmitButton({
					label: 'Enable Tax Jurisdiction(s)'
				});
				
				context.response.writePage({
					pageObject: form
				});
			}
			else{
				redirect.toTaskLink({
					id: 'CARD_-29'
				});
			}
		}
		
		return{
        	onRequest: onRequest
        };
	}
);