/******************************************************************************************************
	Script Name - 	AVA_SUT_CertificatesForm.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/runtime', './utility/AVA_Library'],
	function(ui, runtime, ava_library){
		function onRequest(context){
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'AvaCert2Svc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 26);
			}
			
			if(checkServiceSecurity == 0){
				if(context.request.method === 'GET'){
					var AVA_CertificatesForm = ui.createForm({
						title: 'Get Certificate(s)/Status'
					});
					
					AVA_CertificatesForm.clientScriptModulePath = './AVA_CLI_CertificatesForm.js';
					var avaConfigObjRec = ava_library.mainFunction('AVA_ReadConfig', '0');
					
					var customerCode = AVA_CertificatesForm.addField({
						id: 'ava_customercode',
						label: 'Customer Code',
						type: ui.FieldType.TEXT
					});
					customerCode.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					customerCode.defaultValue = avaConfigObjRec["AVA_CustomerCode"];
					
					var customerId = AVA_CertificatesForm.addField({
						id: 'ava_customerid',
						label: 'Customer Id',
						type: ui.FieldType.TEXT
					});
					customerId.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var partnerId = AVA_CertificatesForm.addField({
						id: 'ava_partnerid',
						label: 'Partner Id',
						type: ui.FieldType.TEXT
					});
					partnerId.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});
					
					var recordType = AVA_CertificatesForm.addField({
						id: 'ava_record',
						label: 'Record type',
						type: ui.FieldType.LABEL
					});
					recordType.updateLayoutType({
						layoutType: ui.FieldLayoutType.STARTROW
					});
					
					var customerRec = AVA_CertificatesForm.addField({
						id: 'ava_recordtype',
						label: 'Customer',
						type: ui.FieldType.RADIO,
						source: 'customer'
					});
					customerRec.updateLayoutType({
						layoutType: ui.FieldLayoutType.MIDROW
					});
					
					if(runtime.isFeatureInEffect('PRM') == true){
						var partnerRec = AVA_CertificatesForm.addField({
							id: 'ava_recordtype',
							label: 'Partner',
							type: ui.FieldType.RADIO,
							source: 'partner'
						});
						partnerRec.updateLayoutType({
							layoutType: ui.FieldLayoutType.MIDROW
						});
					}
					else{
						recordType.updateDisplayType({
							displayType: ui.FieldDisplayType.HIDDEN
						});
						customerRec.updateDisplayType({
							displayType: ui.FieldDisplayType.HIDDEN
						});
					}
					
					customerRec.defaultValue = 'customer';
					
					var customerList = AVA_CertificatesForm.addField({
						id: 'ava_customer',
						label: 'Customer',
						type: ui.FieldType.SELECT,
						source: 'customer'
					});
					customerList.updateLayoutType({
						layoutType: ui.FieldLayoutType.STARTROW
					});
					
					if(runtime.isFeatureInEffect('PRM') == true){
						var partnerList = AVA_CertificatesForm.addField({
							id: 'ava_partner',
							label: 'Partner',
							type: ui.FieldType.SELECT,
							source: 'partner'
						});
						partnerList.updateLayoutType({
							layoutType: ui.FieldLayoutType.MIDROW
						});
						partnerList.updateDisplayType({
							displayType: ui.FieldDisplayType.DISABLED
						});
					}
					
					AVA_CertificatesForm.addButton({
						id: 'ava_getcertificate',
						label: 'Retrieve Certificate(s)',
						functionName: 'AVA_GetCertificates(0)'
					});
					
					AVA_CertificatesForm.addButton({
						id: 'ava_getcertificatestatus',
						label: 'Retrieve Certificate(s) Status',
						functionName: 'AVA_GetCertificates(1)'
					});
					
					context.response.writePage({
						pageObject: AVA_CertificatesForm
					});
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