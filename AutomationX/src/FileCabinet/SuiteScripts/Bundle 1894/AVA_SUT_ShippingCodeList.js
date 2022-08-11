/******************************************************************************************************
	Script Name - 	AVA_SUT_ShippingCodeList.js
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
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 11);
			}
			
			if(checkServiceSecurity == 0){
				var AVA_ShippingList = ui.createList({
					title: 'Shipping Code List'
				});
				
				AVA_ShippingList.clientScriptModulePath = './AVA_CLI_ShippingCode.js';
				
				var loadUserPref = config.load({
					type: config.Type.USER_PREFERENCES
				});
				
				if(loadUserPref.getValue('EXPOSEIDS') == true){
					AVA_ShippingList.addColumn({
						id: 'id',
						label: 'Internal Id',
						type: ui.FieldType.TEXT
					});
				}
				
				var AVA_ShippingId = AVA_ShippingList.addColumn({
					id: 'custrecord_ava_shippingcode',
					label: 'Shipping Code ID',
					type: ui.FieldType.TEXT
				});
				
				var shippingCodeUrl =  url.resolveScript({
					scriptId: 'customscript_avashippingcodeform_suitlet',
					deploymentId: 'customdeploy_shippingcode'
				});
				
				AVA_ShippingId.setURL({
					url: shippingCodeUrl
				});
				
				AVA_ShippingId.addParamToURL({
					param: 'avaid',
					value: 'id',
					dynamic: true
				});
				
				AVA_ShippingId.addParamToURL({
					param: 'avaedit',
					value: 'T',
					dynamic: false
				});
				
				AVA_ShippingList.addColumn({
					id: 'custrecord_ava_shippingdesc',
					label: 'Description',
					type: ui.FieldType.TEXT
				});
				
				var searchRecord = search.create({
					type: 'customrecord_avashippingcodes',
					columns: ['custrecord_ava_shippingcode', 'custrecord_ava_shippingdesc']
				});
				
				var results = searchRecord.run();
				
				AVA_ShippingList.addRows({
					rows: results
				});
				
				AVA_ShippingList.addButton({
					id: 'ava_newshippingcode',
					label: 'New',
					functionName: 'AVA_NewShippingCode'
				});
				
				context.response.writePage({
					pageObject: AVA_ShippingList
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