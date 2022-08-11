/******************************************************************************************************
	Script Name - 	AVA_SUT_GetCertificateImage.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType Suitelet
*/

define(['N/https', 'N/log', 'N/file', './utility/AVA_Library', './utility/AVA_CommonServerFunctions'],
    function(https, log, file, ava_library, ava_commonFunction){
        function AVA_GetCertificateImage(context){
        	var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'AvaCert2Svc');
            if(checkServiceSecurity == 0){
            	checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 25);
            }

            if(checkServiceSecurity == 0){
                if(context.request.method == 'GET'){
                    var recordValues = '';
                    var avaConfigObjRecvd = ava_library.mainFunction('AVA_LoadValuesToGlobals', '');
                    var accountDetails  = ava_commonFunction.mainFunction('AVA_General', (avaConfigObjRecvd.AVA_AccountValue + '+' + avaConfigObjRecvd.AVA_AdditionalInfo + '+' + avaConfigObjRecvd.AVA_AdditionalInfo1 + '+' + avaConfigObjRecvd.AVA_AdditionalInfo2));
                    
                    var avaTax = ava_library.mainFunction('AVA_InitSignatureObject', avaConfigObjRecvd.AVA_ServiceUrl);
                    var CertCapture = new avaTax.certCapture();
                    var certificateImageGet = CertCapture.certificateImageGet(accountDetails, avaConfigObjRecvd.AVA_DefCompanyId, context.request.parameters.certid, context.request.parameters.fileformat, context.request.parameters.page);

                    try{
                        var response = https.get({
                            url : certificateImageGet.url,
                            body : certificateImageGet.data,
                            headers : certificateImageGet.headers
                        });

                        if(response.code == 200){
                            var AVA_CertificateImageResponse = response.body;

                            var file1 = file.create({
                                name: context.request.parameters.certid + '.' + context.request.parameters.fileformat,
                                fileType : context.request.parameters.fileformat == 'Jpeg' ? file.Type.PJPGIMAGE : file.Type.PDF,
                                contents : AVA_CertificateImageResponse,
                            });
                            file1.folder = context.request.parameters.folderid;
                            file1.isOnline = true;

                            var fid =  file1.save();
                            var frecord = file.load(fid);
                            recordValues = fid + '+' + frecord.url;
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

                        context.response.write({
                            output: recordValues
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
            onRequest : AVA_GetCertificateImage
        };
    }
);