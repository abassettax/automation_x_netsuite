/******************************************************************************************************
	Script Name - 	AVA_SUT_ShippingCodeForm.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/url', 'N/record', 'N/search', 'N/redirect', './utility/AVA_Library'],
	function(ui, url, record, search, redirect, ava_library){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'TaxSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 10);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var shippingform = ui.createForm({
						title: 'Shipping Codes'
					});
					
					shippingform.clientScriptModulePath = './AVA_CLI_ShippingCode.js';
					
					var AVA_ShippingId = shippingform.addField({
						id: 'ava_shippingcode',
						label: 'Shipping Code',
						type: ui.FieldType.TEXT
					});
					
					AVA_ShippingId.isMandatory = true;
					AVA_ShippingId.maxLength = 25;
					
					var AVA_ShippingDesc = shippingform.addField({
						id: 'ava_shippingdesc',
						label: 'Description',
						type: ui.FieldType.TEXT
					});
					
					AVA_ShippingDesc.maxLength = 200;
					
					var AVA_ShipListURL = shippingform.addField({
						id: 'ava_shiplisturl',
						label: 'URL',
						type: ui.FieldType.TEXT
					});
					
					AVA_ShipListURL.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var URL = url.resolveScript({
						scriptId: 'customscript_avashippinglist_suitlet',
						deploymentId: 'customdeploy_shippingcodelist'
					});
					
					AVA_ShipListURL.defaultValue = URL;
					
					var AVA_InternalID = shippingform.addField({
						id: 'ava_shippinginternalid',
						label: 'Internal ID',
						type: ui.FieldType.TEXT
					});
					
					AVA_InternalID.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					shippingform.addSubmitButton({
						label: 'Save'
					});
					
					if(context.request.parameters.avaid != null){
						var rec = record.load({
							type: 'customrecord_avashippingcodes',
							id: context.request.parameters.avaid
						});
						
						AVA_ShippingId.defaultValue = rec.getValue({
							fieldId: 'custrecord_ava_shippingcode'
						});
						
						AVA_ShippingId.updateDisplayType({
							displayType: ui.FieldDisplayType.DISABLED
						});
						
						AVA_ShippingDesc.defaultValue = rec.getValue({
							fieldId: 'custrecord_ava_shippingdesc'
						});
						
						AVA_InternalID.defaultValue = context.request.parameters.avaid;
					}
					
					if(context.request.parameters.avaedit == 'T'){
						shippingform.addButton({
							id: 'ava_deleteshippingcode',
							label: 'Delete',
							functionName: 'AVA_DeleteShippingCode'
						});
					}
					
					shippingform.addResetButton({
						label: 'Reset'
					});
					
					shippingform.addPageLink({
						title: 'List Records',
						type: ui.FormPageLinkType.CROSSLINK,
						url: URL
					});
					
					context.response.writePage({
						pageObject: shippingform
					});
				}
				else{
					var AVA_Message = 'A Shipping Code record with this ID already exists. You must enter a unique Shipping Code ID for each record you create.';
					var AVA_ShippingFlag = 'F';
					var AVA_ShippingSearchId;
					var AVA_ShippingCode = ava_library.mainFunction('Trim', context.request.parameters.ava_shippingcode);
					
					var searchRecord = search.create({
						type: 'customrecord_avashippingcodes',
						filters: ['custrecord_ava_shippingcode', 'is', AVA_ShippingCode],
						columns: ['custrecord_ava_shippingcode']
					});
					
					var searchresult = searchRecord.run();
					searchresult = searchresult.getRange({
						start: 0,
						end: 5
					});
					
					if((searchresult != null && searchresult.length > 0) && (context.request.parameters.ava_shippinginternalid == null || (context.request.parameters.ava_shippinginternalid).length == 0)){
						var AVA_Notice = ava_library.mainFunction('AVA_NoticePage', AVA_Message);
						context.response.write({
							output: AVA_Notice
						});
					}
					else{
						if(context.request.parameters.ava_shippinginternalid != null && (context.request.parameters.ava_shippinginternalid).length > 0){
							record.submitFields({
								type: 'customrecord_avashippingcodes',
								id: context.request.parameters.ava_shippinginternalid,
								values: {
									'name' : context.request.parameters.ava_shippingcode,
									'custrecord_ava_shippingcode' : context.request.parameters.ava_shippingcode,
									'custrecord_ava_shippingdesc' : context.request.parameters.ava_shippingdesc
								}
							});
						}
						else{
							var rec = record.create({
								type: 'customrecord_avashippingcodes',
							});
							
							rec.setValue({
								fieldId: 'custrecord_ava_shippingcode',
								value: context.request.parameters.ava_shippingcode
							});
							
							rec.setValue({
								fieldId: 'custrecord_ava_shippingdesc',
								value: context.request.parameters.ava_shippingdesc
							});
							
							rec.setValue({
								fieldId: 'name',
								value: context.request.parameters.ava_shippingcode
							});
							
							rec.save({
							});
						}
						
						redirect.toSuitelet({
							scriptId: 'customscript_avashippinglist_suitlet',
							deploymentId: 'customdeploy_shippingcodelist'
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
		
		return{
        	onRequest: onRequest
        };
	}
);