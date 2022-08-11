/******************************************************************************************************
	Script Name - AVA_UES_CustomerCerts.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
*/

define(['N/ui/serverWidget', 'N/runtime', 'N/search', 'N/record', 'N/cache', './utility/AVA_Library'],
    function(ui, runtime, search, record, cache, ava_library){
        function AVA_CustomerCertsBeforeLoad(context){
            try{
                var cForm = context.form;
                var nRecord = context.newRecord;
                var executionContext = runtime.executionContext;

                if(executionContext == 'USERINTERFACE'){
                    var avaConfigCache = cache.getCache({
                        name: 'avaConfigCache',
                        scope: cache.Scope.PROTECTED
                    });

                    var configCache = avaConfigCache.get({
                        key: 'avaConfigObjRec',
                        loader: ava_library.AVA_LoadValuesToGlobals
                    });

                    if(configCache != null && configCache.length > 0){
                        configCache = JSON.parse(configCache);
                    }
                    
                    cForm.clientScriptModulePath = './AVA_CLI_Entity.js';
                    if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('AvaCert2Svc') != -1){
                        var addressBookSublist = cForm.getSublist({
                            id: 'addressbook'
                        });
                        
                        if(addressBookSublist != null){
                            addressBookSublist.addField({
                                id : 'custpage_ava_email',
                                type : ui.FieldType.EMAIL,
                                label : 'Email'
                            });
                            
                            if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW){
                                var recType = nRecord.type;

                                var searchRecord = search.create({
                                    type : 'customrecord_avacertemail',
                                    filters : (recType == 'partner') ? ['custrecord_avapartnerid', 'anyof', nRecord.id] : ['custrecord_avacustomerid', 'anyof', nRecord.id],
                                    columns : ['custrecord_ava_email', 'custrecord_avaaddressid']
                                });

                                var searchResult = searchRecord.run();
                                searchResult = searchResult.getRange({
                                    start : 0,
                                    end : 1000
                                });

                                if(context.type == context.UserEventType.EDIT){
                                    var flag = 0;

                                    if(recType == 'partner' && configCache.AVA_CustomerCode != null && (configCache.AVA_CustomerCode == 0 || configCache.AVA_CustomerCode == 1 || configCache.AVA_CustomerCode == 2 || configCache.AVA_CustomerCode == 6)){
                                        flag = 1;
                                    }
                                    if(flag == 0){
                                        addressBookSublist.addButton({
                                            id : 'custpage_ava_createcustomer',
                                            label : 'Add customer to CertCapture',
                                            functionName : 'AVA_CreateCustomerAvaCert()'
                                        });
                                        addressBookSublist.addButton({
                                            id : 'custpage_ava_updatecustomer',
                                            label : 'Update customer in CertCapture',
                                            functionName : 'AVA_UpdateCustomerDetails()'
                                        });
                                        addressBookSublist.addButton({
                                            id : 'custpage_ava_initiateexempt',
                                            label : 'Request exemption certificate',
                                            functionName : 'AVA_InitiateExemptCert()'
                                        });
                                        addressBookSublist.addButton({
                                            id : 'custpage_ava_getcertificates',
                                            label : 'Retrieve Certificate(s)',
                                            functionName : 'AVA_GetCertificates()'
                                        });
                                        addressBookSublist.addButton({
                                            id : 'custpage_ava_getcertificatestatus',
                                            label : 'Retrieve Certificate(s) Status',
                                            functionName : 'AVA_CertificatesStatus()'
                                        });

                                        var selectCriteria = addressBookSublist.addField({
                                            id : 'custpage_ava_communicationmode',
                                            type : ui.FieldType.SELECT,
                                            label : 'Communication Mode'
                                        });
                                        selectCriteria.addSelectOption({
                                            value : '0',
                                            text : ''
                                        });
                                        
                                        selectCriteria.addSelectOption({
                                            value : 'EMAIL',
                                            text : 'Email'
                                        });
                                        
                                        selectCriteria.addSelectOption({
                                            value : 'FAX',
                                            text : 'Fax'
                                        });
                                        
                                        selectCriteria.addSelectOption({
                                            value : 'DOWNLOAD',
                                            text : 'Download'
                                        });
                                        selectCriteria.setDefaultValue = '0';
                                    }
                                }
                                
                                var lineItemCount = nRecord.getLineCount({
                                    sublistId: 'addressbook'
                                });

                                for(var k = 0; k < lineItemCount && searchResult != null && searchResult.length > 0; k++){
                                    var addId = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'id',
                                        line: k
                                    });
                                    addId = addId.toString();
                                    
                                    for(var m = 0; m <  searchResult.length; m++){
                                        if(searchResult[m].getValue('custrecord_avaaddressid') == addId){
                                            nRecord.setSublistValue({
                                                sublistId : 'addressbook',
                                                fieldId : 'custpage_ava_email',
                                                line : k,
                                                value : searchResult[m].getValue('custrecord_ava_email')
                                            });
                                            break;
                                        }
                                    }
                                }
                            }
                            
                        }
                    }
                }
            }
            catch(err){
                log.debug({
                    title: 'AVA_CustomerCertsBeforeLoad Try/Catch Error',
                    details: err.message
                });
            }
        }

        function AVA_CustomerCertsAfterSubmit(context){
            try{
                var nRecord = context.newRecord;
                var executionContext = runtime.executionContext;

                if(executionContext == 'USERINTERFACE'){
                    var avaConfigCache = cache.getCache({
                        name: 'avaConfigCache',
                        scope: cache.Scope.PROTECTED
                    });

                    var configCache = avaConfigCache.get({
                        key: 'avaConfigObjRec',
                        loader: ava_library.AVA_LoadValuesToGlobals
                    });

                    if(configCache != null && configCache.length > 0){
                        configCache = JSON.parse(configCache);
                    }

                    if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('AvaCert2Svc') != -1){
                        if(context.type == context.UserEventType.CREATE && nRecord.getValue('isinactive') == false){
                            var custRec = record.load({
                                type: nRecord.type,
                                id: nRecord.id
                            });

                            var lineItemCount = custRec.getLineCount({
                                sublistId: 'addressbook'
                            });

                            for(var i = 0; i < lineItemCount; i++){
                                var email = nRecord.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'custpage_ava_email',
                                    line: i
                                });
                                var addId = custRec.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'id',
                                    line: i
                                });

                                if(email != null && email.length > 0){
                                    var rec = record.create({
                                        type : 'customrecord_avacertemail'
                                    });

                                    if(nRecord.type == 'partner'){
                                        rec.setValue({
                                            fieldId : 'custrecord_avapartnerid',
                                            value : nRecord.id
                                        });
                                    }
                                    else{
                                        rec.setValue({
                                            fieldId : 'custrecord_avacustomerid',
                                            value : nRecord.id
                                        });
                                    }
                                    
                                    rec.setValue({
                                        fieldId : 'custrecord_avaaddressid',
                                        value : (addId).toString()
                                    });
                                    rec.setValue({
                                        fieldId : 'custrecord_ava_email',
                                        value : email
                                    });
                                    rec.setValue({
                                        fieldId : 'custrecord_avacustinternalid',
                                        value : (nRecord.id).toString()
                                    });
                                    var recId = rec.save({});
                                }   
                            }
                        }
                        else if(context.type == context.UserEventType.EDIT){

                            var custRec = record.load({
                                type: nRecord.type,
                                id: nRecord.id
                            });

                            var searchRecord = search.create({
                                type : 'customrecord_avacertemail',
                                filters : (nRecord.type == 'partner') ? ['custrecord_avapartnerid', 'anyof', nRecord.id] : ['custrecord_avacustomerid', 'anyof', nRecord.id],
                                columns : ['custrecord_ava_email', 'custrecord_avaaddressid']
                            });

                            var searchResult = searchRecord.run();
                            searchResult = searchResult.getRange({
                                start : 0,
                                end : 1000
                            });

                            var addressBookLineCount = custRec.getLineCount({
                                sublistId: 'addressbook'
                            });

                            for(var ii = 0; searchResult != null && ii < searchResult.length; ii++){
                                var addressIdDelete = 'F';

                                for(var j = 0; j < addressBookLineCount && addressBookLineCount <= 10000; j++){
                                    var lineItemValue = custRec.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'id',
                                        line: j
                                    });
                                    
                                    if(searchResult[ii].getValue('custrecord_avaaddressid') == lineItemValue){
                                        addressIdDelete = 'T';
                                        break; 
                                    }
                                }

                                if(addressIdDelete == 'F'){
                                    record.delete({
                                        type: 'customrecord_avacertemail',
                                        id: searchResult[ii].id
                                    });
                                }
                            }

                            var lineCount = custRec.getLineCount({
                                sublistId: 'addressbook'
                            });

                            searchResult = searchRecord.run();
                            searchResult = searchResult.getRange({
                                start : 0,
                                end : 1000
                            });

                            for(var iii = 0; iii < lineCount && lineCount <= 10000; iii++){
                                var rec, existFlag = 'F', changeFlag = 0, delRec;

                                var addId = custRec.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'id',
                                    line: iii
                                });
                                addId = (addId).toString();

                                var email = nRecord.getSublistValue({
                                    sublistId: 'addressbook',
                                    fieldId: 'custpage_ava_email',
                                    line: iii
                                });

                                for(var customRec = 0; searchResult != null && customRec < searchResult.length; customRec++){
                                    if(searchResult[customRec].getValue('custrecord_avaaddressid') == addId){
                                        if(email != null && email.length > 0){
                                            if(searchResult[customRec].getValue('custrecord_ava_email') != email){
                                                record.submitFields({
                                                    type : 'customrecord_avacertemail',
                                                    id : searchResult[customRec].id,
                                                    values : {'custrecord_ava_email' : email}
                                                });
                                                changeFlag = 1;//Record exists but value changed
                                            }
                                            else{
                                                changeFlag = 2;//Record exists but value is not changed
                                            }
                                        }
                                        else{
                                            delRec = searchResult[customRec].id;
                                            changeFlag = 3;//Record exists with blank value
                                        }
                                        existFlag = 'T';
                                        break;
                                    }
                                }
                                
                                if(email != null && email.length > 0){
                                    if(existFlag == 'F' && changeFlag == 0 && nRecord.getValue('isinactive') == false){
                                        rec = record.create({
                                            type : 'customrecord_avacertemail'
                                        });

                                        if(nRecord.type == 'partner'){
                                            rec.setValue({
                                                fieldId : 'custrecord_avapartnerid',
                                                value : nRecord.id
                                            });
                                        }
                                        else{
                                            rec.setValue({
                                                fieldId : 'custrecord_avacustomerid',
                                                value : nRecord.id
                                            });
                                        }

                                        rec.setValue({
                                            fieldId : 'custrecord_avaaddressid',
                                            value : addId
                                        });
                                        rec.setValue({
                                            fieldId : 'custrecord_ava_email',
                                            value : email
                                        });
                                        rec.setValue({
                                            fieldId : 'custrecord_avacustinternalid',
                                            value : (nRecord.id).toString()
                                        });
                                        var recId = rec.save({});
                                    }
                                }
                                else{
                                    if(existFlag == 'T' && changeFlag == 3){
                                        record.delete({
                                            type : 'customrecord_avacertemail',
                                            id : delRec
                                        });
                                    }
                                }
                            }
                        }
                        else if(context.type == context.UserEventType.DELETE){
                            var searchRecord = search.create({
                                type : 'customrecord_avacertemail',
                                filters : ['custrecord_avacustinternalid', 'is', (nRecord.id).toString()]
                            });

                            var searchResult = searchRecord.run();
                            searchResult = searchResult.getRange({
                                start : 0,
                                end : 1000
                            });

                            for(var i = 0; searchResult != null && i < searchResult.length; i++){
                                record.delete({
                                    type : 'customrecord_avacertemail',
                                    id : searchResult[i].id
                                });
                            }
                        }
                    }
                }
            }
            catch(err){
                log.debug({
                    title: 'AVA_CustomerCertsAfterSubmit Try/Catch Error',
                    details: err.message
                });
            }
        }

        return{
            beforeLoad: AVA_CustomerCertsBeforeLoad,
            afterSubmit: AVA_CustomerCertsAfterSubmit
        };
    }
);