/******************************************************************************************************
	Script Name - 	AVA_SUT_EntityUseCodeForm.js
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
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 4);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var entityform = ui.createForm({
						title: 'Entity/Use Code'
					});
					
					entityform.clientScriptModulePath = './AVA_CLI_EntityUseCode.js';
					
					var AVA_EntityId = entityform.addField({
						id: 'ava_entityid',
						label: 'Entity/Use Code Id',
						type: ui.FieldType.TEXT
					});
					
					AVA_EntityId.isMandatory = true;
					AVA_EntityId.maxLength = 100;
					
					var AVA_EntityDesc = entityform.addField({
						id: 'ava_entitydesc',
						label: 'Description',
						type: ui.FieldType.TEXT
					});
					
					AVA_EntityDesc.maxLength = 200;
					
					var AVA_EntityListURL = entityform.addField({
						id: 'ava_entitylisturl',
						label: 'URL',
						type: ui.FieldType.TEXT
					});
					
					AVA_EntityListURL.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var URL = url.resolveScript({
						scriptId: 'customscript_avaentityuselist_suitlet',
						deploymentId: 'customdeploy_entityuselist'
					});
					
					AVA_EntityListURL.defaultValue = URL;
					
					var AVA_InternalID = entityform.addField({
						id: 'ava_entityinternalid',
						label: 'Internal ID',
						type: ui.FieldType.TEXT
					});
					
					AVA_InternalID.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					entityform.addSubmitButton({
						label: 'Save'
					});
					
					if(context.request.parameters.avaid != null){
						var rec = record.load({
							type: 'customrecord_avaentityusecodes',
							id: context.request.parameters.avaid
						});
						
						AVA_EntityId.defaultValue = rec.getValue({
							fieldId: 'custrecord_ava_entityid'
						});
						
						AVA_EntityId.updateDisplayType({
							displayType: ui.FieldDisplayType.DISABLED
						});
						
						AVA_EntityDesc.defaultValue = rec.getValue({
							fieldId: 'custrecord_ava_entityusedesc'
						});
						
						AVA_InternalID.defaultValue = context.request.parameters.avaid;
					}
					
					if(context.request.parameters.avaedit == 'T'){
						entityform.addButton({
							id: 'ava_entitydelete',
							label: 'Delete',
							functionName: 'AVA_DeleteEntityUseCode'
						});
					}
					
					entityform.addResetButton({
						label: 'Reset'
					});
					
					entityform.addPageLink({
						title: 'List Records',
						type: ui.FormPageLinkType.CROSSLINK,
						url: URL
					});
					
					context.response.writePage({
						pageObject: entityform
					});
				}
				else{
					var AVA_Message = 'A Entity/Use Code record with this ID already exists. You must enter a unique Entity/Use Code ID for each record you create.';
					var AVA_EntityFlag = 'F';
					var AVA_EntitySearchId;
					var AVA_EntityId = ava_library.mainFunction('Trim', context.request.parameters.ava_entityid);
					
					var searchRecord = search.create({
						type: 'customrecord_avaentityusecodes',
						filters: ['custrecord_ava_entityid', 'is', AVA_EntityId],
						columns: ['custrecord_ava_entityid']
					});
					var searchresult = searchRecord.run();
					searchresult = searchresult.getRange({
						start: 0,
						end: 5
					});
					
					if((searchresult != null && searchresult.length > 0) && (context.request.parameters.ava_entityinternalid == null || (context.request.parameters.ava_entityinternalid).length == 0)){
						var AVA_Notice = ava_library.mainFunction('AVA_NoticePage', AVA_Message);
						context.response.write({
							output: AVA_Notice
						});
					}
					else{
						if(context.request.parameters.ava_entityinternalid != null && (context.request.parameters.ava_entityinternalid).length > 0){
							record.submitFields({
								type: 'customrecord_avaentityusecodes',
								id: context.request.parameters.ava_entityinternalid,
								values: {
									'name' : context.request.parameters.ava_entityid,
									'custrecord_ava_entityid' : context.request.parameters.ava_entityid,
									'custrecord_ava_entityusedesc' : context.request.parameters.ava_entitydesc
								}
							});
						}
						else{
							var rec = record.create({
								type: 'customrecord_avaentityusecodes',
							});
							
							rec.setValue({
								fieldId: 'custrecord_ava_entityid',
								value: context.request.parameters.ava_entityid
							});
							rec.setValue({
								fieldId: 'custrecord_ava_entityusedesc',
								value: context.request.parameters.ava_entitydesc
							});
							rec.setValue({
								fieldId: 'name',
								value: context.request.parameters.ava_entityid
							});
							
							rec.save({
							});
						}
						
						redirect.toSuitelet({
							scriptId: 'customscript_avaentityuselist_suitlet',
							deploymentId: 'customdeploy_entityuselist'
						});
					}
				}
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