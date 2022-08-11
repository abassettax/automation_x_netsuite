/******************************************************************************************************
	Script Name - 	AVA_SUT_EntityUseCodeList.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/config', 'N/url', 'N/search', './utility/AVA_Library'],
	function(ui, config, url, search, ava_library){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'TaxSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 5);
			}
			
			if(checkServiceSecurity == 0){
				var AVA_EntityList = ui.createList({
					title: 'Entity/Use Code List'
				});
				
				AVA_EntityList.clientScriptModulePath = './AVA_CLI_EntityUseCode.js';
				
				var loadUserPref = config.load({
					type: config.Type.USER_PREFERENCES
				});
				
				if(loadUserPref.getValue('EXPOSEIDS') == true){
					AVA_EntityList.addColumn({
						id: 'id',
						label: 'Internal Id',
						type: ui.FieldType.TEXT
					});
				}
				
				var AVA_EntityId = AVA_EntityList.addColumn({
					id: 'custrecord_ava_entityid',
					label: 'Entity/Use Code ID',
					type: ui.FieldType.TEXT
				});
				
				var entityUseCodeUrl =  url.resolveScript({
					scriptId: 'customscript_avaentityuseform_suitlet',
					deploymentId: 'customdeploy_entityusecode'
				});
				
				AVA_EntityId.setURL({
					url: entityUseCodeUrl
				});
				
				AVA_EntityId.addParamToURL({
					param: 'avaid',
					value: 'id',
					dynamic: true
				});
				
				AVA_EntityId.addParamToURL({
					param: 'avaedit',
					value: 'T',
					dynamic: false
				});
				
				AVA_EntityList.addColumn({
					id: 'custrecord_ava_entityusedesc',
					label: 'Description',
					type: ui.FieldType.TEXT
				});
				
				var searchRecord = search.create({
					type: 'customrecord_avaentityusecodes',
					columns: ['custrecord_ava_entityid', 'custrecord_ava_entityusedesc']
				});
				
				var results = searchRecord.run();
				
				AVA_EntityList.addRows({
					rows: results
				});
				
				AVA_EntityList.addButton({
					id: 'ava_newentityusecode',
					label: 'New',
					functionName: 'AVA_NewEntityUseCode'
				});
				
				context.response.writePage({
					pageObject: AVA_EntityList
				});
			}
			else
			{
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