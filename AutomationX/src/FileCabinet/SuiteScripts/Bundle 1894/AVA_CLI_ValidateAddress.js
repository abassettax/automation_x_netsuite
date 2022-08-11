/******************************************************************************************************
	Script Name - 	AVA_CLI_ValidateAddress.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
*@NApiVersion 2.0
*@NScriptType ClientScript
*/

define(['N/url', 'N/currentRecord', 'N/https', './utility/AVA_Library'],
	function(url, currentRecord, https, ava_library){
		function pageInit(){
			return 1;
		}
		
		function validateAddress(context){
			var context_Params = currentRecord.get();
			var avaConfigObjRecvd = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
			
			if (avaConfigObjRecvd["AVA_DisableAddValidation"] == true || avaConfigObjRecvd["AVA_DisableAddValidation"] == 'T'){
                alert('Address Validation cannot be done. Address Validation is disabled in Configuration Settings.');
                return;
            }

            var addr1 = context_Params.getValue('custpage_addressline1');
            var addr2 = context_Params.getValue('custpage_addressline2');
            var addr3 = context_Params.getValue('custpage_addressline3');
            var city = context_Params.getValue('custpage_city');
            var state = context_Params.getValue('custpage_state');
            var zip = context_Params.getValue('custpage_zipcode');
            var country = context_Params.getValue('custpage_country');
            
            var useCase = (((addr1 != null && addr1.length > 0) || (addr2 != null && addr2.length > 0)) && (zip != null && zip.length > 0)) ? 1 : 0;
            if(useCase == 0){
            	useCase = (((addr1 != null && addr1.length > 0) || (addr2 != null && addr2.length > 0)) && (city != null && city.length > 0) && (state != null && state.length > 0)) ? 1 : 0;
            }
            
            if(useCase == 0){
                alert('Address Validation cannot be done. [Address Line 1/Address Line 2 and Zip] or [Address Line 1/Address Line 2, City and State] is required.');
            }
            else{
            	var Url = url.resolveScript({
					scriptId: 'customscript_ava_general_restlet',
					deploymentId: 'customdeploy_ava_general_restlet'
				});
				Url = Url + '&type=dosomethingelse' + '&accountValue=' + avaConfigObjRecvd['AVA_AccountValue'] + '&ava_lickey=' + avaConfigObjRecvd['AVA_AdditionalInfo'] + '&ava_additionalinfo1=' + avaConfigObjRecvd['AVA_AdditionalInfo1']+ '&ava_additionalinfo2=' + avaConfigObjRecvd['AVA_AdditionalInfo2'];
				var resp = https.get({
					url: Url
				});
				
				var AvaTax = ava_library.mainFunction('AVA_InitSignatureObject', avaConfigObjRecvd['AVA_ServiceUrl']);
				var address = validateAddressBody(addr1, addr2, addr3, city, state, zip, country, AvaTax, avaConfigObjRecvd['AVA_AddUpperCase']);
				var validate = address.validate(resp.body);
				
				try{
					var response = https.post({
						url: validate.url,
						body: validate.data,
						headers: validate.headers
					});
					
					if(response.code == 200){
						var responseBody = JSON.parse(response.body);
						var messages = responseBody.messages;
						
						if(messages == null || messages.length == 0){
							var validatedAddress = responseBody.validatedAddresses[0];
							
							var message = 'Address Validation was Successful. \n\n';
							message += 'Line 1:           ' + validatedAddress.line1 + '\n';
							message += (validatedAddress.line2 != '') ? 'Line2:       ' + validatedAddress.line2 + '\n' : '';
							message += (validatedAddress.line3 != '') ? 'Line3:       ' + validatedAddress.line3 + '\n' : '';
							message += 'City:               ' + validatedAddress.city + '\n';
							message += 'Region:          ' + validatedAddress.region + '\n';
							message += 'Postal Code:  ' + validatedAddress.postalCode + '\n';
							
							var stateCheck = ava_library.mainFunction('AVA_CheckCountryName', validatedAddress.region);
							var country = (stateCheck[0] == 0 ? validatedAddress.region : validatedAddress.country);
							message += 'Country:         ' + country + '\n';
							
							alert(message);
							
							context_Params.setValue({
								fieldId: 'custpage_addressline1',
								value: validatedAddress.line1,
								ignoreFieldChange: true
							});
							context_Params.setValue({
								fieldId: 'custpage_addressline2',
								value: validatedAddress.line2,
								ignoreFieldChange: true
							});
							context_Params.setValue({
								fieldId: 'custpage_addressline3',
								value: validatedAddress.line3,
								ignoreFieldChange: true
							});
							context_Params.setValue({
								fieldId: 'custpage_city',
								value: validatedAddress.city,
								ignoreFieldChange: true
							});
							context_Params.setValue({
								fieldId: 'custpage_state',
								value: validatedAddress.region,
								ignoreFieldChange: true
							});
							context_Params.setValue({
								fieldId: 'custpage_zipcode',
								value: validatedAddress.postalCode,
								ignoreFieldChange: true
							});
							context_Params.setValue({
								fieldId: 'custpage_country',
								value: country,
								ignoreFieldChange: true
							});
						}
						else{
							if(messages.length > 0){
								if(messages[0].details != null && (messages[0].details).length > 0)
								{
									alert(messages[0].details);
								}
								else
								{
									alert(messages[0].summary);
								}
							}
						}
					}
					else{
						var responseBody = JSON.parse(response.body);
						alert(responseBody.error.message);
					}
				}
				catch(err){
					alert(err.message);
				}
			}
        }
        
        function validateAddressBody(addr1, addr2, addr3, city, state, zip, country, AvaTax, addressUpperCase){
        	var address = new AvaTax.address();
        	
        	address.textCase = ((addressUpperCase == true || addressUpperCase == 'T') ? 'Upper' : 'Mixed');
        	address.line1 = ((addr1 != null) ? ava_library.mainFunction('Trim', addr1) : '');
        	address.line2 = ((addr2 != null) ? ava_library.mainFunction('Trim', addr2) : '');
        	address.line3 = ((addr3 != null) ? ava_library.mainFunction('Trim', addr3) : '');
        	address.city = ((city != null) ? ava_library.mainFunction('Trim', city) : '');
        	address.region = ((state != null) ? ava_library.mainFunction('Trim', state) : '');
        	address.postalCode = ((zip != null) ? ava_library.mainFunction('Trim', zip) : '');
        	
        	var countryName = ava_library.mainFunction('AVA_CheckCountryName', country != null ? ava_library.mainFunction('Trim', country) : '');
        	address.country = countryName[1];
        	
        	return address;
        }
        
        return{
        	pageInit: pageInit,
        	validateAddress: validateAddress
        };
    }
);