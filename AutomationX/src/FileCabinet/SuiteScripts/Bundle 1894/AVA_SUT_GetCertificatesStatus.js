/******************************************************************************************************
	Script Name - 	AVA_SUT_GetCertificatesStatus.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/https', 'N/log', './utility/AVA_Library', './utility/AVA_CommonServerFunctions'],
    function(ui, https, log, ava_library, ava_commonFunction){
        function AVA_GetCertificatesStatus(context){
            var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'AvaCert2Svc');
            if(checkServiceSecurity == 0){
            	checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 27);
            }

            if(checkServiceSecurity == 0){
                if(context.request.method == 'GET'){
                    var certificateDetailsForm = ui.createForm({
                    	title: 'Exemption Certificate(s) Status'
                    });

                    var avaConfigObjRecvd = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
                    var accountDetails = ava_commonFunction.mainFunction('AVA_General', (avaConfigObjRecvd.AVA_AccountValue + '+' + avaConfigObjRecvd.AVA_AdditionalInfo + '+' + avaConfigObjRecvd.AVA_AdditionalInfo1 + '+' + avaConfigObjRecvd.AVA_AdditionalInfo2));
                    
                    var avaTax = ava_library.mainFunction('AVA_InitSignatureObject', avaConfigObjRecvd.AVA_ServiceUrl);
                    var CertCapture = new avaTax.certCapture();
                    var certificateRequestGet = CertCapture.certificateRequestGet(accountDetails, avaConfigObjRecvd.AVA_DefCompanyId, context.request.parameters.customercode);

                    try{    
                        var response = https.get({
                            url : certificateRequestGet.url,
                            body : certificateRequestGet.data,
                            headers : certificateRequestGet.headers
                        });

                        var responseBody = JSON.parse(response.body);

                        if(response.code == 200){
                            var custCode = certificateDetailsForm.addField({
                                id: 'ava_customercode',
                                label: 'Customer Code',
                                type: ui.FieldType.TEXT
                            });
                            custCode.updateDisplayType({
                                displayType: ui.FieldDisplayType.INLINE
                            });
                            custCode.defaultValue = context.request.parameters.customercode;

                            var certificateList = certificateDetailsForm.addSublist({
                                id: 'custpage_avacertstatuslist',
                                label: 'Certificate(s) Status Details',
                                type: ui.SublistType.LIST
                            });
                            certificateList.addField({
                                id: 'ava_certid',
                                label: 'Id',
                                type: ui.FieldType.TEXT
                            });
                            certificateList.addField({
                                id: 'ava_requeststatus',
                                label: 'Email Status',
                                type: ui.FieldType.TEXT
                            });
                            certificateList.addField({
                                id: 'ava_communicationmode',
                                label: 'Communication Mode',
                                type: ui.FieldType.TEXT
                            });
                            
                            var responseCertificateArray = responseBody.value;

                            for(var i = 0; responseCertificateArray != null && i < responseCertificateArray.length; i++){
                                certificateList.setSublistValue({
                                    id: 'ava_certid',
                                    line: i,
                                    value: responseCertificateArray[i].id.toString()
                                });
                                certificateList.setSublistValue({
                                    id: 'ava_communicationmode',
                                    line: i,
                                    value: responseCertificateArray[i].deliveryMethod
                                });
                                certificateList.setSublistValue({
                                    id: 'ava_requeststatus',
                                    line: i,
                                    value: responseCertificateArray[i].emailStatus
                                });
                                certificateList.setSublistValue({
                                    id: 'ava_requestdate',
                                    line: i,
                                    value: responseCertificateArray[i].customer.createdDate
                                });
                            }
                        }
                        else{
                            log.debug({
                                title : 'Response Code',
                                details : response.code
                            });
                            log.debug({
                                title : 'Please contact the administrator- Error Message',
                                details : response
                            });
                        }

                        context.response.writePage({
    						pageObject: certificateDetailsForm
    					});
                    }
                    catch(err){
                    	log.debug({
                    	   title : 'error',
                    	   details : err.message
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
            onRequest : AVA_GetCertificatesStatus
        };
    }
);