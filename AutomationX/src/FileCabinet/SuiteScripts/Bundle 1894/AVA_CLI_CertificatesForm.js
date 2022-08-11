/******************************************************************************************************
	Script Name - 	AVA_CLI_CertificatesForm.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
*/

define(['N/https', 'N/url', 'N/currentRecord', 'N/runtime'],
	function(https, url, currentRecord, runtime){
		function AVA_CertficatesFieldChanged(context){
			var cRecord = context.currentRecord;
			
			if(context.fieldId == 'ava_recordtype'){
				var recordType = cRecord.getValue({
					fieldId: 'ava_recordtype'
				});
				var customer = cRecord.getField({
					fieldId: 'ava_customer'
				});
				var partner = cRecord.getField({
					fieldId: 'ava_partner'
				});
				
				if(recordType == 'partner'){
					customer.isDisabled = true;
					partner.isDisabled = false;
				}
				else{
					partner.isDisabled = true;
					customer.isDisabled = false;
				}
			}
			
			if(context.fieldId == 'ava_customer'){
				var customer = cRecord.getValue({
					fieldId: 'ava_customer'
				});
				
				if(customer != null && customer.length > 0){
					var response = https.request({
						method: https.Method.GET,
						url: url.resolveScript({
							scriptId: 'customscript_ava_recordload_suitelet',
							deploymentId: 'customdeploy_ava_recordload',
							params: {'type': 'customer', 'id': customer}
						})
					});
					
					cRecord.setValue({
						fieldId: 'ava_customerid',
						value: JSON.stringify(response.body.split('+'))
					});
				}
				else{
					cRecord.setValue({
						fieldId: 'ava_customerid',
						value: ''
					});
				}
			}
			
			if(context.fieldId == 'ava_partner'){
				var partner = cRecord.getValue({
					fieldId: 'ava_partner'
				});
				
				if(partner != null && partner.length > 0){
					var response = https.request({
						method: https.Method.GET,
						url: url.resolveScript({
							scriptId: 'customscript_ava_recordload_suitelet',
							deploymentId: 'customdeploy_ava_recordload',
							params: {'type': 'partner', 'id': partner, 'recordopr': 'load'}
						})
					});
					
					cRecord.setValue({
						fieldId: 'ava_partnerid',
						value: JSON.stringify(response.body.split('+'))
					});
				}
				else{
					cRecord.setValue({
						fieldId: 'ava_partnerid',
						value: ''
					});
				}
			}
		}
		
		function AVA_GetCertificates(flag){
			var cRecord = currentRecord.get();
			
			var customerCode = cRecord.getValue({
				fieldId: 'ava_customercode'
			});
			var recordType = cRecord.getValue({
				fieldId: 'ava_recordtype'
			});
			
			if(recordType == null || recordType == 'customer'){
				var customer = cRecord.getValue({
					fieldId: 'ava_customer'
				});
				if(customer == null || customer.length == 0){
					alert('Please select Customer');
					return;
				}
			}
			else{
				var partner = cRecord.getValue({
					fieldId: 'ava_partner'
				});
				if(partner == null || partner.length == 0){
					alert('Please select Partner');
					return;
				}
				if(customerCode == 8){
					alert('Customer Code - \'Customer External ID\' is not available for Partner record. Please select other option for Customer Code on Avalara Configuration.');
					return;
				}
			}
			
			if(customerCode != null && (customerCode < 0 || customerCode > 8)){
				var msg = (flag == 0) ? 'Certificates cannot be retrieved. ' : 'Certificates status cannot be retrieved. ';
				alert(msg + 'Invalid value set for CustomerCode in AVACONFIG customrecord.');
				return;
			}
			
			AVA_RedirectToSuitelet(flag, cRecord);
		}
		
		function AVA_RedirectToSuitelet(flag, cRecord){ //flag..... 0 - Certificates SuiteLet, 1 - Certificates Status SuiteLet
			var customerId, customerCode;
			var configCustomerCode = cRecord.getValue({
				fieldId: 'ava_customercode'
			});
			var recordType = cRecord.getValue({
				fieldId: 'ava_recordtype'
			});
			if(recordType == null || recordType == 'customer'){
				customerId = cRecord.getValue({
					fieldId: 'ava_customerid'
				});
			}
			else{
				customerId = cRecord.getValue({
					fieldId: 'ava_partnerid'
				});
			}
			customerId = JSON.parse(customerId);
			
			switch(configCustomerCode){
				case '0':
					customerCode = customerId[5];
					break;
					
				case '1':
						var customerName = (customerId[0] == 'T') ? (customerId[1] + ((customerId[2] != 'null' && customerId[2].length > 0)? ( ' ' + customerId[2] + ' ' ) : ' ') + customerId[3]) : (customerId[4]);
						customerCode = customerName;
					break;
					
				case '2':
					if(recordType == null || recordType == 'customer'){
						customerCode = cRecord.getValue({
							fieldId: 'ava_customer'
						});
					}
					else{
						customerCode = cRecord.getValue({
							fieldId: 'ava_partner'
						});
					}
					break;
					
				case '3':
					if(recordType == 'partner'){
						customerCode = customerId[5];
					}
					else{
						if(runtime.isFeatureInEffect('MULTIPARTNER') == false && customerId[6] != 'null' && customerId[6].length > 0){
							var fieldValues = getCustomerPartnerValues(customerId[6], 'search');
							customerCode = fieldValues[5];
						}
						else{
							customerCode = customerId[5];
						}
					}
					break;
					
				case '4':
					if(recordType == 'partner'){
						var partnerName = (customerId[0] == 'T') ? (customerId[1] + ((customerId[2] != 'null' && customerId[2].length > 0)? ( ' ' + customerId[2] + ' ' ) : ' ') + customerId[3]) : (customerId[4]);
						customerCode = partnerName;
					}
					else{
						if(runtime.isFeatureInEffect('MULTIPARTNER') == false && customerId[6] != 'null' && customerId[6].length > 0){
							var fieldValues = getCustomerPartnerValues(customerId[6], 'load');
							customerCode = (fieldValues[0] == 'T') ? (fieldValues[1] + ((fieldValues[2] != 'null' && fieldValues[2].length > 0)? ( ' ' + fieldValues[2] + ' ' ) : ' ') + fieldValues[3]) : (fieldValues[4]);
						}
						else{
							var customerName = (customerId[0] == 'T') ? (customerId[1] + ((customerId[2] != 'null' && customerId[2].length > 0)? ( ' ' + customerId[2] + ' ' ) : ' ') + customerId[3]) : (customerId[4]);
							customerCode = customerName;
						}
					}
					break;
					
				case '5':
					if(recordType == 'partner'){
						customerCode = cRecord.getValue({
							fieldId: 'ava_partner'
						});
					}
					else{
						if(runtime.isFeatureInEffect('MULTIPARTNER') == false && customerId[6] != 'null' && customerId[6].length > 0){
							customerCode = customerId[6];
						}
						else{
							customerCode = cRecord.getValue({
								fieldId: 'ava_customer'
							});
						}
					}
					break;
					
				case '6': // Fix for CONNECT-3326
						customerCode = customerId[7];
					break;
					
				case '7': // Fix for CONNECT-3326
					if(recordType == 'partner'){
						customerCode = customerId[7];
					}
					else{
						if(runtime.isFeatureInEffect('MULTIPARTNER') == false && customerId[6] != 'null' && customerId[6].length > 0){
							var fieldValues = getCustomerPartnerValues(customerId[6], 'load');
							customerCode = fieldValues[7];
						}
						else{
							customerCode = customerId[7];
						}
					}
					break;
					
				case '8':
					if(recordType == null || recordType == 'customer'){
						if(customerId[8] != 'null' && customerId[8].length > 0){
							customerCode = customerId[8];
						}
						else
						{
							customerCode = customerId[5];
						}
					}
					break;
					
				default:
					customerCode = 0;
					break;
			}
			
			var URL;
			if(flag == 0){
				URL = url.resolveScript({
					scriptId: 'customscript_avagetcertificates_suitelet',
					deploymentId: 'customdeploy_avagetcertificates'
				});
			}
			else{
				URL = url.resolveScript({
					scriptId: 'customscript_avacertstatus_suitelet',
					deploymentId: 'customdeploy_avacertstatus'
				});
			}
			
			URL = URL + '&customercode=' + customerCode;
			window.open(URL, '_blank');
		}
		
		function getCustomerPartnerValues(id, recordOpr){
			var response = https.request({
				method: https.Method.GET,
				url: url.resolveScript({
					scriptId: 'customscript_ava_recordload_suitelet',
					deploymentId: 'customdeploy_ava_recordload',
					params: {'type': 'partner', 'id': id, 'recordopr': recordOpr}
				})
			});
			return response.body.split('+');
		}
		
		return{
			fieldChanged: AVA_CertficatesFieldChanged,
			AVA_GetCertificates: AVA_GetCertificates
		};
	}
);