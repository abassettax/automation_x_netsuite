/******************************************************************************************************
	Script Name - AVA_CLI_Entity.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/url', 'N/search', 'N/currentRecord', 'N/runtime', 'N/https', './utility/AVA_Library'],
	function(url, search, currentRecord, runtime, https, ava_library){
		var CertCapture;
		
		function AVA_EntitySublistChanged(){
			var cRecord = currentRecord.get();
			
			var lineItemCount = cRecord.getLineCount({
				sublistId: 'addressbook'
			});
			
			if(cRecord.type == 'vendor'){
				var poaFlag = new Array();
				var importFlag = new Array();
				
				for(var i = 0; i < lineItemCount; i++){
					poaFlag[i] = cRecord.getSublistValue({
						sublistId: 'addressbook',
						fieldId: 'custpage_ava_poa',
						line: i
					});
					importFlag[i] = cRecord.getSublistValue({
						sublistId: 'addressbook',
						fieldId: 'custpage_ava_import',
						line: i
					});
					
					if(poaFlag.filter(Boolean).length > 0){
						if(i == cRecord.getCurrentSublistIndex('addressbook') && poaFlag[i] == true){
							cRecord.setCurrentSublistValue('addressbook', 'custpage_ava_poa', true);
						}
						else if(poaFlag[i] == false || cRecord.getCurrentSublistValue('addressbook', 'custpage_ava_poa') == true){
							nlapiSetLineItemValue('addressbook', 'custpage_ava_poa', i+1, false);
						}
					}
					
					if(importFlag.filter(Boolean).length > 0){
						if(i == cRecord.getCurrentSublistIndex('addressbook') && importFlag[i] == true){
							cRecord.setCurrentSublistValue('addressbook', 'custpage_ava_import', true);
						}
						else if(importFlag[i] == false || cRecord.getCurrentSublistValue('addressbook', 'custpage_ava_import') == true){
							nlapiSetLineItemValue('addressbook', 'custpage_ava_import', i + 1, false);
						}
					}
				}
			}
			else{
				var gsFlag = new Array();
				var orderOriginFlag = new Array();
				var importFlag = new Array();
				
				for(var i = 0; i < lineItemCount; i++){
					gsFlag[i] = cRecord.getSublistValue({
						sublistId: 'addressbook',
						fieldId: 'custpage_ava_gposr',
						line: i
					});
					orderOriginFlag[i] = cRecord.getSublistValue({
						sublistId: 'addressbook',
						fieldId: 'custpage_ava_originaddr',
						line: i
					});
					importFlag[i] = cRecord.getSublistValue({
						sublistId: 'addressbook',
						fieldId: 'custpage_ava_import',
						line: i
					});
					
					if(gsFlag.filter(Boolean).length > 0){
						if(i == cRecord.getCurrentSublistIndex('addressbook') && gsFlag[i] == true){
							cRecord.setCurrentSublistValue('addressbook', 'custpage_ava_gposr', true);
						}
						else if(gsFlag[i] == false || cRecord.getCurrentSublistValue('addressbook', 'custpage_ava_gposr') == true){
							nlapiSetLineItemValue('addressbook', 'custpage_ava_gposr', i+1, false);
						}
					}
					
					if(orderOriginFlag.filter(Boolean).length > 0){
						if(i == cRecord.getCurrentSublistIndex('addressbook') && orderOriginFlag[i] == true){
							cRecord.setCurrentSublistValue('addressbook', 'custpage_ava_originaddr', true);
						}
						else if(orderOriginFlag[i] == false || cRecord.getCurrentSublistValue('addressbook', 'custpage_ava_originaddr') == true){
							nlapiSetLineItemValue('addressbook', 'custpage_ava_originaddr', i+1, false);
						}
					}
					
					if(importFlag.filter(Boolean).length > 0){
						if(i == cRecord.getCurrentSublistIndex('addressbook') && importFlag[i] == true){
							cRecord.setCurrentSublistValue('addressbook', 'custpage_ava_import', true);
						}
						else if(importFlag[i] == false || cRecord.getCurrentSublistValue('addressbook', 'custpage_ava_import') == true){
							nlapiSetLineItemValue('addressbook', 'custpage_ava_import', i+1, false);
						}
					}
				}
			}
		}
		
		function AVA_ValidateAddress(mode){
			var cRecord = currentRecord.get();
			var avaConfigObjRec = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
			ava_library.AVA_ValidateAddress(cRecord, avaConfigObjRec, mode);
		}
		
		function AVA_CreateCustomerAvaCert(){
			var crecord = currentRecord.get();
			
			if(crecord.getCurrentSublistValue('addressbook', 'addressbookaddress_text') != null && crecord.getCurrentSublistValue('addressbook', 'addressbookaddress_text').length > 0){
				var avaConfigObjRecvd = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
				
				if(avaConfigObjRecvd.AVA_CustomerCode != null && avaConfigObjRecvd.AVA_CustomerCode > 8){
					alert("Customer cannot be created. " + ava_library.mainFunction('AVA_ErrorCodeDesc', 24));
					return;
				}
				
				if(avaConfigObjRecvd.AVA_DefCompanyId == null || avaConfigObjRecvd.AVA_DefCompanyId.length == 0){
					alert('Please re-run the Avalara Configuration.');
					return;
				}
				
				var customerCode = AVA_GetCustomerInfo(crecord, avaConfigObjRecvd);
				
				var Url = url.resolveScript({
					scriptId: 'customscript_ava_general_restlet',
					deploymentId: 'customdeploy_ava_general_restlet'
				});
				Url = Url + '&type=dosomethingelse' + '&accountValue=' + avaConfigObjRecvd.AVA_AccountValue + '&ava_lickey=' + avaConfigObjRecvd.AVA_AdditionalInfo + '&ava_additionalinfo1=' + avaConfigObjRecvd.AVA_AdditionalInfo1 + '&ava_additionalinfo2=' + avaConfigObjRecvd.AVA_AdditionalInfo2;
				var resp = https.get({
					url: Url
				});
				
				var avaTax = ava_library.mainFunction('AVA_InitSignatureObject', avaConfigObjRecvd.AVA_ServiceUrl);
				CertCapture = new avaTax.certCapture();
				var customers = AVA_CreateCustomerAvaCertBody(customerCode, crecord);
				var customerSave = CertCapture.customerSave(resp.body, avaConfigObjRecvd.AVA_DefCompanyId, customers);
				
				try{
					var response = https.post({
						url: customerSave.url,
						body: customerSave.data,
						headers: customerSave.headers
					});
					var responseBody = JSON.parse(response.body);
					
					if(response.code == 201){
						alert('The Customer record has been successfully created in CertCapture.');
					}
					else if(responseBody.error.code == 'DuplicateEntry'){
						alert('The customer that you are trying to create already exists.');
					}
					else{
						alert(responseBody.error.message);
					}
				}
				catch(err){
					alert('Adding Customer on CertCapture was not successful.' + err.message);
				}
			}
			else{
				alert('Please select an address line.');
			}
		}
		
		function AVA_CreateCustomerAvaCertBody(customerCode, crecord){
			var customers = [];
			var customer = new CertCapture.customer();
			
			var addressBookRecord = crecord.getCurrentSublistSubrecord({
				sublistId: 'addressbook',
				fieldId: 'addressbookaddress'
			});
			
			var phone = (addressBookRecord.getValue('addrphone') != null && addressBookRecord.getValue('addrphone').length > 0) ? addressBookRecord.getValue('addrphone') : crecord.getValue('phone');
			phone = phone.replace(/\(|\)/gi, '');
			
			var fax = crecord.getValue('fax');
			fax = fax.replace(/\(|\)/gi, '');
			
			var email = (addressBookRecord.getValue('custpage_ava_email') != null && addressBookRecord.getValue('custpage_ava_email').length > 0) ? addressBookRecord.getValue('custpage_ava_email') : crecord.getValue('email');
			
			customer.phoneNumber = phone;
			customer.faxNumber = fax;
			customer.emailAddress = email;
			customer.customerCode = (customerCode[0] != null ? customerCode[0].substring(0, 49) : '');
			customer.name = (customerCode[1] != null ? customerCode[1].substring(0, 49) : '');
			customer.attnName = addressBookRecord.getValue('attention');
			customer.line1 = addressBookRecord.getValue('addr1');
			customer.line2 = addressBookRecord.getValue('addr2');
			customer.city = addressBookRecord.getValue('city');
			customer.region = addressBookRecord.getValue('state');
			customer.postalCode = addressBookRecord.getValue('zip');
			var returnCountryName = ava_library.mainFunction('AVA_CheckCountryName', addressBookRecord.getValue('country'));
			customer.country = returnCountryName[1];
			customer.contactName = (customerCode[1] != null ? customerCode[1].substring(0, 49) : '');
			    
			customers.push(customer);
			
			return customers;
		}
		
		function AVA_UpdateCustomerDetails(){
			var crecord = currentRecord.get();
			
			if(crecord.getCurrentSublistValue('addressbook', 'addressbookaddress_text') != null && crecord.getCurrentSublistValue('addressbook', 'addressbookaddress_text').length > 0){
				var avaConfigObjRecvd = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
				
				if(avaConfigObjRecvd.AVA_CustomerCode != null && avaConfigObjRecvd.AVA_CustomerCode > 8){
					alert("Customer cannot be updated. " + ava_library.mainFunction('AVA_ErrorCodeDesc', 24));
					return;
				}

				if(avaConfigObjRecvd.AVA_DefCompanyId == null || avaConfigObjRecvd.AVA_DefCompanyId.length == 0){
					alert('Please re-run the Avalara Configuration and map Default Company Code to respective subsidiary.');
					return;
				}
				
				var customerCode = AVA_GetCustomerInfo(crecord, avaConfigObjRecvd);
				
				var Url = url.resolveScript({
					scriptId: 'customscript_ava_general_restlet',
					deploymentId: 'customdeploy_ava_general_restlet'
				});
				Url = Url + '&type=dosomethingelse' + '&accountValue=' + avaConfigObjRecvd.AVA_AccountValue + '&ava_lickey=' + avaConfigObjRecvd.AVA_AdditionalInfo + '&ava_additionalinfo1=' + avaConfigObjRecvd.AVA_AdditionalInfo1 + '&ava_additionalinfo2=' + avaConfigObjRecvd.AVA_AdditionalInfo2;
				var resp = https.get({
					url: Url
				});

				var avaTax = ava_library.mainFunction('AVA_InitSignatureObject', avaConfigObjRecvd.AVA_ServiceUrl);
				CertCapture = new avaTax.certCapture();
				var customers = AVA_UpdateCustomerAvaCertBody(customerCode, crecord);
				var customerUpdate = CertCapture.customerUpdate(resp.body, avaConfigObjRecvd.AVA_DefCompanyId, customerCode[0], customers);
				
				try{
					var response = https.put({
						url: customerUpdate.url,
						body: customerUpdate.data,
						headers: customerUpdate.headers
					});
					var responseBody = JSON.parse(response.body);
					
					if(response.code == 200){
						alert('The Customer record has been successfully updated in CertCapture.');
					}
					else if(responseBody == 404 && (responseBody == null || responseBody == '')){
						alert('Customer does not exists on CertCapture. Please add customer to CertCapture before updating.');
					}
					else{
						alert(responseBody.error.message);
					}
				}
				catch(err){
					alert('Updating Customer on CertCapture was not successful.' + err.message);
				}
			}
			else{
				alert('Please select an address line.');
			}
		}
		
		function AVA_UpdateCustomerAvaCertBody(customerCode, crecord){
			var customer = new CertCapture.customer();
			
			var addressBookRecord = crecord.getCurrentSublistSubrecord({
				sublistId: 'addressbook',
				fieldId: 'addressbookaddress'
			});
			
			var phone = (addressBookRecord.getValue('addrphone') != null && addressBookRecord.getValue('addrphone').length > 0) ? addressBookRecord.getValue('addrphone') : crecord.getValue('phone');
			phone = phone.replace(/\(|\)/gi, '');
			
			var fax = crecord.getValue('fax');
			fax = fax.replace(/\(|\)/gi, '');
			
			var email = (addressBookRecord.getValue('custpage_ava_email') != null && addressBookRecord.getValue('custpage_ava_email').length > 0) ? addressBookRecord.getValue('custpage_ava_email') : crecord.getValue('email');
			
			customer.phoneNumber = phone;
			customer.faxNumber = fax;
			customer.emailAddress = email;
			customer.customerCode = (customerCode[0] != null ? customerCode[0].substring(0, 49) : '');
			customer.name = (customerCode[1] != null ? customerCode[1].substring(0, 49) : '');
			customer.attnName = addressBookRecord.getValue('attention');
			customer.line1 = addressBookRecord.getValue('addr1');
			customer.line2 = addressBookRecord.getValue('addr2');
			customer.city = addressBookRecord.getValue('city');
			customer.region = addressBookRecord.getValue('state');
			customer.postalCode = addressBookRecord.getValue('zip');
			var returnCountryName = ava_library.mainFunction('AVA_CheckCountryName', addressBookRecord.getValue('country'));
			customer.country = returnCountryName[1];
			customer.contactName = (customerCode[1] != null ? customerCode[1].substring(0, 49) : '');
			
			return customer;
		}

		function AVA_InitiateExemptCert(){
			var crecord = currentRecord.get();
			
			if(crecord.getCurrentSublistValue('addressbook', 'addressbookaddress_text') != null && crecord.getCurrentSublistValue('addressbook', 'addressbookaddress_text').length > 0){
				if(crecord.getCurrentSublistValue('addressbook', 'custpage_ava_communicationmode') == null || crecord.getCurrentSublistValue('addressbook', 'custpage_ava_communicationmode') == 0){
					alert('The Exemption Certificate Workflow Request cannot be initiated because Communication mode is missing');
					return;
				}
				
				if(crecord.getCurrentSublistValue('addressbook', 'custpage_ava_communicationmode') == 'EMAIL' && (crecord.getCurrentSublistValue('addressbook', 'custpage_ava_email') == null || crecord.getCurrentSublistValue('addressbook', 'custpage_ava_email').length <= 0)){
					if(crecord.getValue('email') == null || crecord.getValue('email').length <= 0){
						alert('The Exemption Certificate Workflow Request cannot be initiated because Customer does not have an associated email address');
						return;
					}
				}
				
				var avaConfigObjRecvd = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
				if(avaConfigObjRecvd.AVA_DefCompanyId == null || avaConfigObjRecvd.AVA_DefCompanyId.length == 0){
					alert('Please re-run the Avalara Configuration.');
					return;
				}
				
				if(avaConfigObjRecvd.AVA_CustomerCode != null && avaConfigObjRecvd.AVA_CustomerCode > 8){
					alert("The Exemption Certificate Workflow Request cannot be initiated. " + ava_library.mainFunction('AVA_ErrorCodeDesc', 24));
					return;
				}
				
				var customerCode = AVA_GetCustomerInfo(crecord, avaConfigObjRecvd);
				
				var Url = url.resolveScript({
					scriptId: 'customscript_ava_general_restlet',
					deploymentId: 'customdeploy_ava_general_restlet'
				});
				Url = Url + '&type=dosomethingelse' + '&accountValue=' + avaConfigObjRecvd.AVA_AccountValue + '&ava_lickey=' + avaConfigObjRecvd.AVA_AdditionalInfo + '&ava_additionalinfo1=' + avaConfigObjRecvd.AVA_AdditionalInfo1 + '&ava_additionalinfo2=' + avaConfigObjRecvd.AVA_AdditionalInfo2;
				var resp = https.get({
					url: Url
				});
				
				var avaTax = ava_library.mainFunction('AVA_InitSignatureObject', avaConfigObjRecvd.AVA_ServiceUrl);
				CertCapture = new avaTax.certCapture();
				var invitations = AVA_InitiateExemptCertInvitationBody(crecord);
				var certCapture = CertCapture.certificateRequestInitiate(resp.body, avaConfigObjRecvd.AVA_DefCompanyId, customerCode[0], invitations);
				
				try{
					var response = https.post({
						url: certCapture.url,
						body: certCapture.data,
						headers: certCapture.headers
					});
					var responseBody = JSON.parse(response.body);
					
					if(response.code == 201){
						alert('The Exemption Certificate Workflow Request has been successfully generated.');
						
						if(crecord.getCurrentSublistValue('addressbook', 'custpage_ava_communicationmode') == 'DOWNLOAD'){
							window.open(responseBody[0].invitation.requestLink, '_blank');
						}
					}
					else{
						alert(responseBody.error.message);
					}
				}
				catch(err){
					alert('Initiating Exemption Certificate on CertCapture was not successful.' + err.message);
				}
			}
			else{
				alert('Please select an address line.');
			}
		}
		
		function AVA_InitiateExemptCertInvitationBody(crecord){
			var invitations = [];
			var invitation = new CertCapture.invitation();
			
			var communicationMode = crecord.getCurrentSublistValue({
				sublistId: 'addressbook',
				fieldId: 'custpage_ava_communicationmode'
			});
			
			invitation.deliveryMethod = communicationMode;
			
			if(communicationMode == 'EMAIL'){
				invitation.recipient = (crecord.getCurrentSublistValue('addressbook', 'custpage_ava_email') != null && crecord.getCurrentSublistValue('addressbook', 'custpage_ava_email').length > 0) ? crecord.getCurrentSublistValue('addressbook', 'custpage_ava_email') : crecord.getValue('email');
			}
			
			invitation.coverLetterTitle = 'STANDARD_REQUEST';
			invitations.push(invitation);
			
			return invitations;
		}
		
		function AVA_GetCustomerInfo(crecord, avaConfigObjRecvd){
			var entityId;
			var customerCode = new Array(); // 0-Customer/Partner ID, 1-Customer/Partner Name
			
			switch(avaConfigObjRecvd.AVA_CustomerCode){
				case '0':
					entityId = search.lookupFields({
						type: search.Type.CUSTOMER,
						id: crecord.getValue('id'),
						columns: ['entityid']
					});
					customerCode[0] = entityId.entityid;
					customerCode[1] = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ? (' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
					break;
				
				case '1':
					var customerName = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ? (' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
					customerCode[0] = customerName;
					customerCode[1] = customerName;
					break;
				
				case '2':
					var customerName = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ? (' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
					customerCode[0] = crecord.id.toString();
					customerCode[1] = customerName;
					break;
				
				case '3':
					if(crecord.type == 'partner'){
						var partnerName = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ?	(' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
						entityId = search.lookupFields({
							type: search.Type.CUSTOMER,
							id: crecord.getValue('id'),
							columns: ['entityid']
						});
						customerCode[0] = entityId.entityid;
						customerCode[1] = partnerName;
					}
					else{
						if(runtime.isFeatureInEffect({ feature: 'MULTIPARTNER' }) != true && crecord.getValue('partner') != null && crecord.getValue('partner').length > 0){
							var response = https.get({
								url: url.resolveScript({
									scriptId: 'customscript_ava_recordload_suitelet',
									deploymentId: 'customdeploy_ava_recordload',
									params:
										{
											type: 'partner',
											id: crecord.getValue('partner'),
											recordopr: 'search'
										}
								})
							});
							var fieldValues = response.body.split('+');
							customerCode[0] = fieldValues[5];
							customerCode[1] = (fieldValues[0] == true) ? (fieldValues[1] + ((fieldValues[2] != null && fieldValues[2].length > 0) ? ('' + fieldValues[2] + '') : '') + fieldValues[3]) : (fieldValues[4]);
						}
						else{
							var customerName = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ? (' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
							entityId = search.lookupFields({
								type: search.Type.CUSTOMER,
								id: crecord.getValue('id'),
								columns: ['entityid']
							});
							customerCode[0] = entityId.entityid;
							customerCode[1] = customerName;
						}
					}
					break;
				
				case '4':
					if(crecord.type == 'partner'){
						var partnerName = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ?	(' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
						customerCode[0] = partnerName;
						customerCode[1] = partnerName;
					}
					else{
						if(runtime.isFeatureInEffect({ feature: 'MULTIPARTNER' }) != true && crecord.getValue('partner') != null && crecord.getValue('partner').length > 0){
							var response = https.get({
								url: url.resolveScript({
									scriptId: 'customscript_ava_recordload_suitelet',
									deploymentId: 'customdeploy_ava_recordload',
									params:
										{
											type: 'partner',
											id: crecord.getValue('partner'),
											recordopr: 'search'
										}
								})
							});
							var fieldValues = response.body.split('+');
							customerCode[0] = (fieldValues[0] == true) ? (fieldValues[1] + ((fieldValues[2] != null && fieldValues[2].length > 0) ? ('' + fieldValues[2] + '') : '') + fieldValues[3]) : (fieldValues[4]);
							customerCode[1] = (fieldValues[0] == true) ? (fieldValues[1] + ((fieldValues[2] != null && fieldValues[2].length > 0) ? ('' + fieldValues[2] + '') : '') + fieldValues[3]) : (fieldValues[4]);
						}
						else{
							var customerName = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ? (' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
							customerCode[0] = customerName;
							customerCode[1] = customerName;
						}
					}
					break;
				
				case '5':
					if(crecord.type == 'partner'){
						var partnerName = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ? (' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
						customerCode[0] = crecord.id.toString();
						customerCode[1] = partnerName;
					}
					else{
						if(runtime.isFeatureInEffect({ feature: 'MULTIPARTNER' }) != true && crecord.getValue('partner') != null && crecord.getValue('partner').length > 0){
							var response = https.get({
								url: url.resolveScript({
								scriptId: 'customscript_ava_recordload_suitelet',
								deploymentId: 'customdeploy_ava_recordload',
								params:
									{
										type: 'partner',
										id: crecord.getValue('partner'),
										recordopr: 'search'
									}
								})
							});
							var fieldValues = response.body.split('+');
							customerCode[0] = crecord.getValue('partner');
							customerCode[1] = (fieldValues[0] == true) ? (fieldValues[1] + ((fieldValues[2] != null && fieldValues[2].length > 0) ? ('' + fieldValues[2] + '') : '') + fieldValues[3]) : (fieldValues[4]);
						}
						else{
							var customerName = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ? (' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
							customerCode[0] = crecord.id.toString();
							customerCode[1] = customerName;
						}
					}
					break;
				
				case '6':
					customerCode[0] = crecord.getValue('entitytitle');
					customerCode[1] = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ? (' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
					break;
				
				case '7':
					if(crecord.type == 'partner'){
						var partnerName = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ?	(' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
						customerCode[0] = crecord.getValue('entitytitle');
						customerCode[1] = partnerName;
					}
					else{
						if(runtime.isFeatureInEffect({ feature: 'MULTIPARTNER' }) != true && crecord.getValue('partner') != null && crecord.getValue('partner').length > 0){
							var response = https.get({
								url: url.resolveScript({
								scriptId: 'customscript_ava_recordload_suitelet',
								deploymentId: 'customdeploy_ava_recordload',
								params:
									{
										type: 'partner',
										id: crecord.getValue('partner'),
										recordopr: 'search'
									}
								})
							});
							var fieldValues = response.body.split('+');
							customerCode[0] = fieldValues[8];
							customerCode[1] = (fieldValues[0] == true) ? (fieldValues[1] + ((fieldValues[2] != null && fieldValues[2].length > 0) ? ('' + fieldValues[2] + '') : '') + fieldValues[3]) : (fieldValues[4]);
						}
						else{
							var customerName = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ? (' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
							customerCode[0] = crecord.getValue('entitytitle');
							customerCode[1] = customerName;
						}
					}
					break;
				
				case '8':
					if(crecord.getValue('externalid') != null && crecord.getValue('externalid').length > 0){
						customerCode[0] = crecord.getValue('externalid');
						customerCode[1] = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ?	(' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
					}
					else{
						entityId = search.lookupFields({
							type: search.Type.CUSTOMER,
							id: crecord.getValue('id'),
							columns: ['entityid']
						});
						customerCode[0] = entityId.entityid;
						customerCode[1] = (crecord.getValue('isperson') == 'T') ? (crecord.getValue('firstname') + ((crecord.getValue('middlename') != null && crecord.getValue('middlename').length > 0) ? (' ' + crecord.getValue('middlename') + ' ') : ' ') + crecord.getValue('lastname')) : (crecord.getValue('companyname'));
					}
					break;
				
				default:
					customerCode = 0;
					break;
			}
			
			return customerCode;
		}
		
		function AVA_GetCertificates(){
			var crecord = currentRecord.get();
			var avaConfigObjRecvd = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
			
			if(avaConfigObjRecvd.AVA_CustomerCode != null && avaConfigObjRecvd.AVA_CustomerCode > 8){
				alert("Certificate(s) cannot be retrieved. " + ava_library.mainFunction('AVA_ErrorCodeDesc', 24));
				return;
			}
			
			if(avaConfigObjRecvd.AVA_DefCompanyId == null || avaConfigObjRecvd.AVA_DefCompanyId.length == 0){
				alert('Please re-run the Avalara Configuration.');
				return;
			}
			
			var customerCode = AVA_GetCustomerInfo(crecord, avaConfigObjRecvd);
			var seturl = url.resolveScript({
				scriptId: 'customscript_avagetcertificates_suitelet',
				deploymentId: 'customdeploy_avagetcertificates'
			});
			seturl = seturl + '&customercode=' + customerCode[0];
			window.open(seturl, '_blank');
		}
		
		function AVA_CertificatesStatus(){
			var crecord = currentRecord.get();
			var avaConfigObjRecvd = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
			
			if(avaConfigObjRecvd.AVA_CustomerCode != null && avaConfigObjRecvd.AVA_CustomerCode > 8){
				alert("Certificates status cannot be retrieved. " + ava_library.mainFunction('AVA_ErrorCodeDesc', 24));
				return;
			}
			
			if(avaConfigObjRecvd.AVA_DefCompanyId == null || avaConfigObjRecvd.AVA_DefCompanyId.length == 0){
				alert('Please re-run the Avalara Configuration.');
				return;
			}
			
			var customerCode = AVA_GetCustomerInfo(crecord, avaConfigObjRecvd);
			var seturl = url.resolveScript({
				scriptId: 'customscript_avacertstatus_suitelet',
				deploymentId: 'customdeploy_avacertstatus'
			});
			seturl = seturl + '&customercode=' + customerCode[0];
			window.open(seturl, '_blank');
		}
		
		function AVA_GetCertImage(){
			var flag = 0;
			var crecord = currentRecord.get();
			
			for(var i = 0; i < crecord.getLineCount('custpage_avacertlist'); i++){
				if(crecord.getSublistValue('custpage_avacertlist', 'ava_getimage', i) == 'T'){
					flag = 1;
					
					if(crecord.getValue('ava_fileformat') == 'Jpeg'){
						if(crecord.getSublistValue('custpage_avacertlist', 'ava_page', i) != null && crecord.getSublistValue('custpage_avacertlist', 'ava_page', i).length > 0){
							if(crecord.getSublistValue('custpage_avacertlist', 'ava_page', i) > crecord.getSublistValue('custpage_avacertlist', 'ava_pagecount', i)){
								alert('Invalid page number');
								return;
							}
						}
					}
					
					var response = https.get({
						url: url.resolveScript({
							scriptId: 'customscript_avagetcertimage_suitelet',
							deploymentId: 'customdeploy_avagetcertificateimage',
							params:
								{
									certid: crecord.getSublistValue('custpage_avacertlist', 'ava_certid', i),
									folderid: crecord.getValue('ava_folderid'),
									fileformat: crecord.getValue('ava_fileformat'),
									page: crecord.getSublistValue('custpage_avacertlist', 'ava_page', i),
								}
						})
					});
					
					var fieldValues = response.body.split('+');
					var fieldId = response.body;
					
					var html = fieldValues[1];
					window.open(html, '_blank');
					
					var response = https.get({
						url: url.resolveScript({
							deploymentId: 'customdeploy_ava_recordload',
							scriptId: 'customscript_ava_recordload_suitelet',
							params:
								{
									type: 'deletefile',
									FileId: fieldValues[0]
								}
						})
					});
					
					break;
				}
			}
			
			if(flag == 0 && crecord.getLineCount('custpage_avacertlist') > 0){
				alert('Please select the certificate to download');
			}
		}
		
		return{
			sublistChanged: AVA_EntitySublistChanged,
			AVA_ValidateAddress: AVA_ValidateAddress,
			AVA_CreateCustomerAvaCert: AVA_CreateCustomerAvaCert,
			AVA_UpdateCustomerDetails: AVA_UpdateCustomerDetails,
			AVA_InitiateExemptCert: AVA_InitiateExemptCert,
			AVA_GetCertificates: AVA_GetCertificates,
			AVA_CertificatesStatus: AVA_CertificatesStatus,
			AVA_GetCertImage: AVA_GetCertImage
		};
	}
);