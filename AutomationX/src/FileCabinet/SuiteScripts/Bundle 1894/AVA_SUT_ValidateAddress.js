/******************************************************************************************************
	Script Name - 	AVA_SUT_ValidateAddress.js
	Company - 		Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
*@NApiVersion 2.0
*@NScriptType Suitelet
*/

define(['N/ui/serverWidget', './utility/AVA_Library'],
    function (ui, ava_library) {
        function onRequest(context) {
			var checkServiceSecurity = ava_library.mainFunction('AVA_CheckService', 'AddressSvc');
			if(checkServiceSecurity == 0){
				checkServiceSecurity = ava_library.mainFunction('AVA_CheckSecurity', 19);
			}

            if (checkServiceSecurity == 0) {
                if (context.request.method == 'GET') {
                	var form = ui.createForm({
                        title: 'Validate Address'
                    });
                    form.clientScriptModulePath = './AVA_CLI_ValidateAddress.js';
                    form.addField({
                        id: 'custpage_addressline1',
                        type: ui.FieldType.TEXT,
                        label: '** Address Line 1',
                        container: 'custpage_addressfieldgroup'
                    });
                    form.addField({
                        id: 'custpage_addressline2',
                        type: ui.FieldType.TEXT,
                        label: 'Address Line 2',
                        container: 'custpage_addressfieldgroup'
                    });
                    form.addField({
                        id: 'custpage_addressline3',
                        type: ui.FieldType.TEXT,
                        label: 'Address Line 3',
                        container: 'custpage_addressfieldgroup'
                    });
                    form.addField({
                        id: 'custpage_city',
                        type: ui.FieldType.TEXT,
                        label: '** City',
                        container: 'custpage_addressfieldgroup'
                    });
                    form.addField({
                        id: 'custpage_state',
                        type: ui.FieldType.TEXT,
                        label: '** State (Province)',
                        container: 'custpage_addressfieldgroup'
                    });
                    form.addField({
                        id: 'custpage_zipcode',
                        type: ui.FieldType.TEXT,
                        label: '** Zip/Postal Code',
                        container: 'custpage_addressfieldgroup'
                    });
                    form.addField({
                        id: 'custpage_country',
                        type: ui.FieldType.TEXT,
                        label: '** Country',
                        container: 'custpage_addressfieldgroup'
                    });
                    form.addButton({
                        label: 'Validate',
                        id: 'custpage_validatenow',
                        functionName: 'validateAddress'
                    });
					
                    form.addResetButton({
						label: 'Reset'
					});

                    context.response.writePage({
                    	pageObject: form
                    });
                }
            }
			else{
				context.response.write({
					output: checkServiceSecurity
				});
			}
        }
        
        return {
            onRequest: onRequest
        }
    }
);