/******************************************************************************************************
	Script Name - AVA_SCH_GetEntityUseCodesList.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ScheduledScript
*/

define(['N/https', 'N/search', 'N/record', 'N/log', './utility/AVA_Library', './utility/AVA_CommonServerFunctions'],
	function(https, search, record, log, ava_library, ava_commonFunction){
		function execute(context){
			log.debug({
				title: 'Script execution start'
			});
			var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
			
			if(avaConfigObjRec.AVA_AdditionalInfo != null && avaConfigObjRec.AVA_AdditionalInfo.length > 0){
				try{
					var details = ava_commonFunction.mainFunction('AVA_General', (avaConfigObjRec.AVA_AccountValue + '+' + avaConfigObjRec.AVA_AdditionalInfo + '+' + avaConfigObjRec.AVA_AdditionalInfo1 + '+' + avaConfigObjRec.AVA_AdditionalInfo2));
					
					var AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', avaConfigObjRec.AVA_ServiceUrl);
					var getEntityUseCodes = AvaTax.getEntityUseCodes(details);
					
					var response = https.get({
						url: getEntityUseCodes.url,
						headers: getEntityUseCodes.headers
					});
					
					if(response.code == 200){
						var responseBody = JSON.parse(response.body);
						var value = responseBody.value;
						
						if(value != null && value.length > 0){
							var searchRecord = search.create({
								type: 'customrecord_avaentityusecodes',
								columns: 'custrecord_ava_entityid'
							});
							var searchResult = searchRecord.run();
							searchResult = searchResult.getRange({
								start: 0,
								end: 1000
							});
							
							if(searchResult != null && searchResult.length > 0){
								for(var i = 0; i < value.length; i++){
									var flag = 0;
									
									for(var j = 0; j < searchResult.length; j++){
										if((value[i].code).toUpperCase() == (searchResult[j].getValue('custrecord_ava_entityid')).toUpperCase()){
											flag = 1;
											break;
										}
									}
									
									if(flag == 0){
										var rec = record.create({
											type: 'customrecord_avaentityusecodes'
										});
										rec.setValue({
											fieldId: 'name',
											value: value[i].code
										});
										rec.setValue({
											fieldId: 'custrecord_ava_entityid',
											value: value[i].code
										});
										rec.setValue({
											fieldId: 'custrecord_ava_entityusedesc',
											value: value[i].name
										});
										rec.save();
									}
								}
							}
							else{
								for(var i = 0; i < value.length; i++){
									var rec = record.create({
										type: 'customrecord_avaentityusecodes'
									});
									rec.setValue({
										fieldId: 'name',
										value: value[i].code
									});
									rec.setValue({
										fieldId: 'custrecord_ava_entityid',
										value: value[i].code
									});
									rec.setValue({
										fieldId: 'custrecord_ava_entityusedesc',
										value: value[i].name
									});
									rec.save();
								}
							}
						}
					}
					else{
						var errorBody = JSON.parse(response.body);
						log.debug({
							title: 'Response error',
							details: errorBody.error.message
						});
					}
				}
				catch(err){
					log.debug({
						title: 'Try/Catch error',
						details: err.message
					});
				}
			}
			else{
				log.debug({
					title: 'Please re-run the Avalara Configuration.'
				});
			}
			
			log.debug({
				title: 'Script execution end'
			});
		}
		
		return{
			execute: execute
		};
	}
);