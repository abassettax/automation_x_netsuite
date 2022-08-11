/******************************************************************************************************
	Script Name - 	AVA_SUT_GetCertificatesDetails.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/ui/serverWidget', 'N/search', 'N/https', 'N/log', './utility/AVA_Library', './utility/AVA_CommonServerFunctions'],
    function(ui, search, https, log, ava_library, ava_commonFunction){
        function AVA_GetCertificatesDetails(context){
            var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'AvaCert2Svc');
            if(checkServiceSecurity == 0){
            	checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 24);
            }

            if(checkServiceSecurity == 0){
                if(context.request.method == 'GET'){
                    var certificateDetailsForm = ui.createForm({
						title: 'Certificate(s) Details'
                    });
                    certificateDetailsForm.clientScriptModulePath = './AVA_CLI_Entity.js';
					
					var custCode = certificateDetailsForm.addField({
						id: 'ava_customercode',
						label: 'Customer Code',
						type: ui.FieldType.TEXT
					});
					custCode.updateDisplayType({
						displayType: ui.FieldDisplayType.INLINE
					});
					custCode.defaultValue = context.request.parameters.customercode;
					
					var folderId = certificateDetailsForm.addField({
						id: 'ava_folderid',
						label: 'Folder Id',
						type: ui.FieldType.TEXT
					});
					folderId.updateDisplayType({
						displayType: ui.FieldDisplayType.HIDDEN
					});

					var fileFormat = certificateDetailsForm.addField({
						id: 'ava_fileformat',
						label: 'Select File Format',
						type: ui.FieldType.SELECT
					});
					fileFormat.addSelectOption({
						value : 'Pdf',
						text: 'PDF'
					});
					fileFormat.addSelectOption({
						value : 'Jpeg',
						text: 'JPG'
					});
					fileFormat.defaultValue = 'Pdf';

					var certificateList = certificateDetailsForm.addSublist({
						id: 'custpage_avacertlist',
						label: 'AvaTax Certificate(s) Details',
						type: ui.SublistType.LIST
					});
					certificateList.addField({
						id: 'ava_getimage',
						label: 'Get Image',
						type: ui.FieldType.RADIO
					});
					certificateList.addField({
						id: 'ava_certid',
						label: 'ID',
						type: ui.FieldType.TEXT
					});
					certificateList.addField({
						id: 'ava_certstatus',
						label: 'Status',
						type: ui.FieldType.TEXT
					});
					certificateList.addField({
						id: 'ava_issinglecertificate',
						label: 'Is Single Certificate',
						type: ui.FieldType.TEXT
					});
					certificateList.addField({
						id: 'ava_exemptreason',
						label: 'Exemption Reason',
						type: ui.FieldType.TEXT
					});
					certificateList.addField({
						id: 'ava_pagecount',
						label: 'Pages',
						type: ui.FieldType.TEXT
					});
					var page = certificateList.addField({
						id: 'ava_page',
						label: 'Page Number',
						type: ui.FieldType.TEXT
					});
					page.updateDisplayType({
						displayType: ui.FieldDisplayType.ENTRY
					});
					
					certificateDetailsForm.addButton({
						id : 'custpage_ava_getimage',
						label : 'Get Certificate',
						functionName: 'AVA_GetCertImage()'
					});

                    var avaConfigObjRecvd = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
                    var accountDetails  = ava_commonFunction.mainFunction('AVA_General', (avaConfigObjRecvd.AVA_AccountValue + '+' + avaConfigObjRecvd.AVA_AdditionalInfo + '+' + avaConfigObjRecvd.AVA_AdditionalInfo1 + '+' + avaConfigObjRecvd.AVA_AdditionalInfo2));
                    
                    var avaTax = ava_library.mainFunction('AVA_InitSignatureObject', avaConfigObjRecvd.AVA_ServiceUrl);
                    var CertCapture = new avaTax.certCapture();
                    var certificateGet = CertCapture.certificateGet(accountDetails, avaConfigObjRecvd.AVA_DefCompanyId, context.request.parameters.customercode);

                    try{
                        var response = https.get({
                            url : certificateGet.url,
                            body : certificateGet.data,
                            headers : certificateGet.headers
                        });

                        var responseBody = JSON.parse(response.body);

                        if(response.code == 200){
                            var searchRecord = search.create({
                                type : 'folder',
                                filters : ['name', 'is', 'Bundle 1894'],
                                columns : ['internalid']
                            });

                            var searchResult = searchRecord.run();
                            searchResult = searchResult.getRange({
                                start : 0,
                                end : 5
                            });

							var folderId;
                            if(searchResult != null){
                                folderId = searchResult[0].getValue('internalid');
                            }
                            var fid = certificateDetailsForm.getField('ava_folderid');
                            fid.defaultValue = folderId;
            
                            var responseCertificateArray = responseBody.value;

                            for(var i= 0; responseCertificateArray != null && i < responseCertificateArray.length; i++){
                                certificateList.setSublistValue({
                                    id: 'ava_certid',
                                    line: i,
                                    value: responseCertificateArray[i].id.toString()
                                });
                                certificateList.setSublistValue({
                                    id: 'ava_certstatus',
                                    line: i,
                                    value: responseCertificateArray[i].status
                                });
                                certificateList.setSublistValue({
                                    id: 'ava_certstatus',
                                    line: i,
                                    value: responseCertificateArray[i].status
                                });
                                certificateList.setSublistValue({
                                    id: 'ava_exemptreason',
                                    line: i,
                                    value: responseCertificateArray[i].exemptionReason.name
                                });
                                certificateList.setSublistValue({
                                    id: 'ava_pagecount',
                                    line: i,
                                    value: responseCertificateArray[i].pageCount.toString()
                                });

                                certificateList.setSublistValue({
                                    id: 'ava_issinglecertificate',
                                    line: i,
                                    value: responseCertificateArray[i].isSingleCertificate == true ? 'TRUE' : 'FALSE'
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
            onRequest : AVA_GetCertificatesDetails
        };
    }
);