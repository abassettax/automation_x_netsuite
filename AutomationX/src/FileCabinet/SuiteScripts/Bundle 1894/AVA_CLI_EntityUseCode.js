/******************************************************************************************************
	Script Name - 	AVA_CLI_EntityUseCode.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/url', 'N/search', 'N/currentRecord', 'N/record'],
	function(url, search, currentRecord, record){
		function initTest(){
		}
		
		function AVA_NewEntityUseCode(){
			window.location = url.resolveScript({
				scriptId: 'customscript_avaentityuseform_suitlet',
				deploymentId: 'customdeploy_entityusecode'
			});
		}
		
		function AVA_DeleteEntityUseCode(){
			if(confirm("Are you sure you want to delete the record?") == true){
				var crecord = currentRecord.get();
				var entityId = crecord.getValue({
					fieldId: 'ava_entityinternalid'
				});
				
				var searchRecord = search.create({
					type: 'customrecord_avaentityusemapping',
					filters: ['custrecord_ava_entityusemap', 'is', entityId],
					columns: ['custrecord_ava_entityusemap']
				});
				var searchresult = searchRecord.run();
				searchresult = searchresult.getRange({
					start: 0,
					end: 5
				});
				
				if(searchresult != null && searchresult.length > 0){
					alert('The Entity/Use Code cannot be deleted as there are child records asscoiated with this code');
				}
				else{
					try{
						record.delete({
							type: 'customrecord_avaentityusecodes',
							id: entityId
						});
					}
					catch(error){
						alert(error.name);
					}
					
					window.location = crecord.getValue({
						fieldId: 'ava_entitylisturl'
					});
				}
			}
		}
		
		return{
			pageInit: initTest,
			AVA_NewEntityUseCode: AVA_NewEntityUseCode,
			AVA_DeleteEntityUseCode: AVA_DeleteEntityUseCode
		};
	}
);