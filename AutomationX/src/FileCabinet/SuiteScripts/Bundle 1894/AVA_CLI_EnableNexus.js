/******************************************************************************************************
	Script Name - 	AVA_CLI_EnableNexus.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/url', 'N/https', './utility/AVA_Library'],
	function(url, https, ava_library){
		function enableNexus(context){
			var nexusFlag = 0;
			var cRecord = context.currentRecord;
			
			var nexusListCount = cRecord.getLineCount({
				sublistId: 'custpage_nexuslist'
			});
			if(nexusListCount > 0){
				var nexusArray = new Array();
				var serviceUrl = cRecord.getValue({
					fieldId: 'ava_serviceurl'
				});
				
				var AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', serviceUrl);
				var nexus = new AvaTax.nexus();
				
				for(var i = 0; i < nexusListCount; i++){
					var selectedNexus = cRecord.getSublistValue({
						sublistId: 'custpage_nexuslist',
						fieldId: 'ava_selectnexus',
						line: i
					});
					
					if(selectedNexus == true){
						var fetchRequestObj = nexus.fetchRequestObject();
						
						var nexusCountry = cRecord.getSublistValue({
							sublistId: 'custpage_nexuslist',
							fieldId: 'ava_nexuscountry',
							line: i
						});
						nexusCountry = (nexusCountry == 'PR') ? 'US' : nexusCountry;
						var nexusState = cRecord.getSublistValue({
							sublistId: 'custpage_nexuslist',
							fieldId: 'ava_nexusstate',
							line: i
						});
						
						if(nexus.fetchRequest.length == 0){
							fetchRequestObj.country = nexusCountry;
							fetchRequestObj.states.push(nexusState);
							nexus.fetchRequest.push(fetchRequestObj);
						}
						else{
							var obj = nexus.fetchRequest.filter(function(obj,ind){ if(obj.country == nexusCountry) return obj;});
							
							if(obj.length > 0){
								obj[0].states.push(nexusState);
							}
							else{
								fetchRequestObj.country = nexusCountry;
								fetchRequestObj.states.push(nexusState);
								nexus.fetchRequest.push(fetchRequestObj);
							}
						}
						
						nexusFlag = 1;
					}
				}
				
				if(nexusFlag == 0){
					alert('Please select atleast one nexus.');
					return false;
				}
				else{
					var accountValue = cRecord.getValue({
						fieldId: 'ava_accvalue'
					});
					var licenseKey = cRecord.getValue({
						fieldId: 'ava_lickey'
					});
					var additionalInfo1 = cRecord.getValue({
						fieldId: 'ava_addtionalinfo1'
					});
					var additionalInfo2 = cRecord.getValue({
						fieldId: 'ava_addtionalinfo2'
					});
					
					var Url = url.resolveScript({
						scriptId: 'customscript_ava_general_restlet',
						deploymentId: 'customdeploy_ava_general_restlet'
					});
					Url = Url + '&type=dosomethingelse' + '&accountValue=' + accountValue + '&ava_lickey=' + licenseKey + '&ava_additionalinfo1=' + additionalInfo1+ '&ava_additionalinfo2=' + additionalInfo2;
					var resp = https.get({
						url: Url
					});
					
					var fetchFiltered = nexus.fetchFiltered(resp.body, nexus.fetchRequest);
					
					try{
						var response = https.get({
							url: fetchFiltered.url,
							headers: fetchFiltered.headers
						});
						
						if(response.code == 200){
							var responseBody = JSON.parse(response.body);
							var nexusList = responseBody.value;
							var companyId = cRecord.getValue({
								fieldId: 'ava_companyid'
							});
							
							for(var i = 0; nexusList != null && i < nexusList.length; i++){
								nexusList[i].id = 0;
								nexusList[i].companyId = companyId;
							}
							
							if(nexusList != null && nexusList.length > 0){
								var nexusPostRequest = nexus.post(resp.body, companyId, nexusList);
								
								var response = https.post({
									url: nexusPostRequest.url,
									body: nexusPostRequest.data,
									headers: nexusPostRequest.headers
								});
								
								if(response.code == 200 || response.code == 201){
									alert('Nexus updated successfully.');
									window.onbeforeunload = undefined;
									window.close();
								}
								else{
									var responseBody = JSON.parse(response.body);
									alert(responseBody.error.message);
									return false;
								}
							}
						}
						else{
							var responseBody = JSON.parse(response.body);
							alert(responseBody.error.message);
							return false;
						}
					}
					catch(err){
						alert(err.message);
						return false;
					}
				}
			}
			else{
				return false;
			}
			
			return true;
		}
		
		return{
			saveRecord: enableNexus
		};
	}
);