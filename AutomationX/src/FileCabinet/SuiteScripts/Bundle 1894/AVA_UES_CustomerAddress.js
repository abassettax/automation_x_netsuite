/******************************************************************************************************
	Script Name - AVA_UES_CustomerAddress.js
	Company -     Avalara Technologies Pvt Ltd.
******************************************************************************************************/

/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
*/

define(['N/ui/serverWidget', 'N/runtime', 'N/search', 'N/record', 'N/cache', './utility/AVA_Library'],
    function(ui, runtime, search, record, cache, ava_library){
        function AVA_CustomerAddressBeforeLoad(context){
            try{
                var cForm = context.form;
                var nRecord = context.newRecord;
                var executionContext = runtime.executionContext;

                if(executionContext == 'USERINTERFACE' || executionContext == 'USEREVENT' || executionContext == 'WEBSERVICES' || executionContext == 'CSVIMPORT' || executionContext == 'SCHEDULED' || executionContext == 'SUITELET'){
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
                    var baseRecordType = nRecord.getValue('baserecordtype');

                    var useTaxAssessment;
                    if(baseRecordType == 'vendor' && configCache.AVA_EnableUseTax == true){
                        useTaxAssessment = cForm.getField({
                            id: 'custentity_ava_usetaxassessment'
                        });
                        useTaxAssessment.updateDisplayType({
                            displayType: ui.FieldDisplayType.NORMAL
                        });
                    }

                    if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('AddressSvc') != -1 && (configCache.AVA_DisableAddValidation == false || configCache.AVA_DisableAddValidation == 'F')){
                        var addressBookSublist = cForm.getSublist({
                            id: 'addressbook'
                        }); 

                        if(addressBookSublist != null){
                            addressBookSublist.addButton({
                                id : 'custpage_ava_validateaddress',
                                label : 'Validate Address',
                                functionName : 'AVA_ValidateAddress(0)'
                            });
                            
                            if(configCache.AVA_EnableAddValFlag == true){
                                var addval = addressBookSublist.addField({
                                    id : 'custpage_ava_addval',
                                    type : ui.FieldType.CHECKBOX,
                                    label : 'Validated'
                                });
                                addval.updateDisplayType({
                                    displayType: ui.FieldDisplayType.DISABLED
                                });
                            }

                            if(baseRecordType != 'vendor'){
                                addressBookSublist.addField({
                                    id : 'custpage_ava_latitude',
                                    type : ui.FieldType.TEXT,
                                    label : 'Latitude'
                                });
                                addressBookSublist.addField({
                                    id : 'custpage_ava_longitude',
                                    type : ui.FieldType.TEXT,
                                    label : 'Longitude'
                                });
                            }
                        }

                        if(context.type == context.UserEventType.EDIT || context.type == context.UserEventType.VIEW){
                            if(addressBookSublist != null && baseRecordType != 'vendor'){
                                var searchRecord = search.create({
                                    type : 'customrecord_avacoordinates',
                                    filters :  ['custrecord_ava_custid', 'anyof', nRecord.id],
                                    columns : ['custrecord_ava_addid', 'custrecord_ava_latitude', 'custrecord_ava_longitude', 'custrecord_ava_custid']
                                });
                                var searchResult = searchRecord.run();
                                searchResult = searchResult.getRange({
                                    start : 0,
                                    end : 1000
                                });

                                var addressLineCount = nRecord.getLineCount({
                                    sublistId: 'addressbook'
                                });

                                for(var i = 0; i < addressLineCount && searchResult != null && searchResult.length > 0; i++){
                                    var addId = nRecord.getSublistValue({
                                        sublistId : 'addressbook',
                                        fieldId : 'id',
                                        line : i
                                    });

                                    for(var j = 0; j < searchResult.length; j++){
                                        if(searchResult[j].getValue('custrecord_ava_addid') == addId){
                                            nRecord.setSublistValue({
                                                sublistId : 'addressbook',
                                                fieldId : 'custpage_ava_latitude',
                                                line : i,
                                                value : searchResult[j].getValue('custrecord_ava_latitude')
                                            });
                                            nRecord.setSublistValue({
                                                sublistId : 'addressbook',
                                                fieldId : 'custpage_ava_longitude',
                                                line : i,
                                                value : searchResult[j].getValue('custrecord_ava_longitude')
                                            });
                                            break;
                                        }
                                    }
                                }
                            }

                            if(addressBookSublist != null && configCache.AVA_EnableAddValFlag == true){
                                var searchRecord = search.create({
                                    type : 'customrecord_avaaddvalflag',
                                    filters : (baseRecordType == 'vendor') ? ['custrecord_avavendorid', 'anyof', nRecord.id] : ['custrecord_avacustid', 'anyof', nRecord.id],
                                    columns : ['custrecord_ava_address_id', 'custrecord_ava_addressvalidated', 'custrecord_ava_custvendinternalid']
                                });

                                var searchResult = searchRecord.run();
                                searchResult = searchResult.getRange({
                                    start : 0,
                                    end : 1000
                                });

                                var lineItemCount = nRecord.getLineCount({
                                    sublistId: 'addressbook'
                                });

                                for(var k =0; k < lineItemCount && searchResult != null && searchResult.length > 0; k++){
                                    var addId = nRecord.getSublistValue({
                                        sublistId : 'addressbook',
                                        fieldId : 'id',
                                        line : k
                                    });

                                    for(var m = 0; m < searchResult.length; m++){
                                        if(searchResult[m].getValue('custrecord_ava_address_id') == addId){
                                            nRecord.setSublistValue({
                                                sublistId : 'addressbook',
                                                fieldId : 'custpage_ava_addval',
                                                line : k,
                                                value : searchResult[m].getValue('custrecord_ava_addressvalidated')
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
                    title: 'AVA_CustomerAddressBeforeLoad Try/Catch Error',
                    details: err.message
                });
            }
        }   
        
        function AVA_CustomerAddressAfterSubmit(context){
            try{
                var nRecord = context.newRecord;
                var executionContext = runtime.executionContext;

                if(executionContext == 'USERINTERFACE' || executionContext == 'USEREVENT' || executionContext == 'WEBSERVICES' || executionContext == 'CSVIMPORT' || executionContext == 'SCHEDULED' || executionContext == 'SUITELET'){
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

                    if(configCache.AVA_ServiceTypes != null && configCache.AVA_ServiceTypes.search('AddressSvc') != -1){
                        var baseRecordType = nRecord.getValue('baserecordtype');

                        if(baseRecordType != 'vendor'){
                            if(context.type == context.UserEventType.CREATE && nRecord.getValue('isinactive') == false){
                                var custRec = record.load({
                                    type: record.Type.CUSTOMER,
                                    id: nRecord.id
                                });

                                var lineItemCount = custRec.getLineCount({
                                    sublistId: 'addressbook'
                                });

                                for(var i = 0; i < lineItemCount; i++){
                                    var latitude = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_latitude',
                                        line: i
                                    });
                                    var longitude = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_longitude',
                                        line: i
                                    });

                                    var addId = custRec.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'id',
                                        line: i
                                    });

                                    if(latitude != null && latitude.length > 0 && longitude != null && longitude.length > 0){
                                        var rec = record.create({
                                            type : 'customrecord_avacoordinates'
                                        });
                                        rec.setValue({
                                            fieldId : 'custrecord_ava_custid',
                                            value : nRecord.id
                                        });
                                        rec.setValue({
                                            fieldId : 'custrecord_ava_addid',
                                            value : (addId).toString()
                                        });
                                        rec.setValue({
                                            fieldId : 'custrecord_ava_latitude',
                                            value : latitude
                                        });
                                        rec.setValue({
                                            fieldId : 'custrecord_ava_longitude',
                                            value : longitude
                                        });
                                        rec.setValue({
                                            fieldId : 'custrecord_ava_customerinternalid',
                                            value : (nRecord.id).toString()
                                        });
                                        var recId = rec.save({});
                                    }   
                                }
                            }
                            else if(context.type == context.UserEventType.EDIT){

                                var custRec = record.load({
                                    type: record.Type.CUSTOMER,
                                    id: nRecord.id
                                });

                                var searchRecord = search.create({
                                    type : 'customrecord_avacoordinates',
                                    filters : ['custrecord_ava_custid', 'anyof', nRecord.id],
                                    columns : ['custrecord_ava_addid', 'custrecord_ava_latitude', 'custrecord_ava_longitude', 'custrecord_ava_custid']
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

                                        if(searchResult[ii].getValue('custrecord_ava_addid') == lineItemValue){
                                            addressIdDelete = 'T';
                                            break; 
                                        }
                                    }

                                    if(addressIdDelete == 'F'){
                                        record.delete({
                                            type: 'customrecord_avacoordinates',
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
                                    var rec, existFlag = 'F', changeFlag = 0, delRecId;

                                    var addId = custRec.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'id',
                                        line: iii
                                    });
                                    addId = (addId).toString();

                                    var latitude = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_latitude',
                                        line: iii
                                    });
                                
                                    var longitude = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_longitude',
                                        line: iii
                                    });

                                    for(var customRec = 0; searchResult != null && customRec < searchResult.length; customRec++){
                                        if(searchResult[customRec].getValue('custrecord_ava_addid') == addId){
                                            if(latitude != null && latitude.length > 0 && longitude != null && longitude.length >0){
                                                if(searchResult[customRec].getValue('custrecord_ava_latitude') != latitude){
                                                    record.submitFields({
                                                        type : 'customrecord_avacoordinates',
                                                        id : searchResult[customRec].id,
                                                        values : {'custrecord_ava_latitude' : latitude}
                                                    });
                                                    changeFlag = 1;//Record exists but value changed
                                                }
                                                else{
                                                    changeFlag = 2;//Record exists but value is not changed
                                                }

                                                if(searchResult[customRec].getValue('custrecord_ava_longitude') != longitude){
                                                    record.submitFields({
                                                        type : 'customrecord_avacoordinates',
                                                        id : searchResult[customRec].id,
                                                        values : {'custrecord_ava_longitude' : longitude}
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
                                    
                                    if(latitude != null && latitude.length > 0 && longitude != null && longitude.length > 0){
                                        if(existFlag == 'F' && changeFlag == 0 && nRecord.getValue('isinactive') == false){
                                            rec = record.create({
                                                type : 'customrecord_avacoordinates'
                                            });
                                            rec.setValue({
                                                fieldId : 'custrecord_ava_custid',
                                                value : nRecord.id
                                            });
                                            rec.setValue({
                                                fieldId : 'custrecord_ava_addid',
                                                value : addId
                                            });
                                            rec.setValue({
                                                fieldId : 'custrecord_ava_latitude',
                                                value : latitude
                                            });
                                            rec.setValue({
                                                fieldId : 'custrecord_ava_longitude',
                                                value : longitude
                                            });
                                            rec.setValue({
                                                fieldId : 'custrecord_ava_customerinternalid',
                                                value : (nRecord.id).toString()
                                            });
                                            var recId = rec.save({});
                                        }
                                    }
                                    else{
                                        if(existFlag == 'T' && changeFlag == 3){
                                            if(executionContext == 'USERINTERFACE'){
                                                record.delete({
                                                    type : 'customrecord_avacoordinates',
                                                    id : delRec
                                                });
                                            }
                                        }
                                    }   
                                }
                            }
                            else if(context.type == context.UserEventType.DELETE){
                                var searchRecord = search.create({
                                    type : 'customrecord_avacoordinates',
                                    filters : ['custrecord_ava_customerinternalid', 'is', (nRecord.id).toString()]
                                });

                                var searchResult = searchRecord.run();
                                searchResult = searchResult.getRange({
                                    start : 0,
                                    end : 1000
                                });

                                for(var i = 0; searchResult != null && i < searchResult.length; i++){
                                    record.delete({
                                        type : 'customrecord_avacoordinates',
                                        id : searchResult[i].id
                                    });
                                }
                            }   
                        }

                        if(configCache.AVA_DisableAddValidation == false && configCache.AVA_EnableAddValFlag == true && executionContext == 'USERINTERFACE'){
                            if(context.type == context.UserEventType.CREATE && nRecord.getValue('isinactive') == false){
                                var custRec = record.load({
                                    type: baseRecordType,
                                    id: nRecord.id
                                });

                                var lineItemCount = custRec.getLineCount({
                                    sublistId: 'addressbook'
                                }); 

                                for(var k = 0; k < lineItemCount; k++){
                                    var addId = custRec.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'id',
                                        line: k
                                    });

                                    var addVal = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_addval', 
                                        line: k
                                    });

                                    var rec = record.create({
                                        type : 'customrecord_avaaddvalflag'
                                    });

                                    if(baseRecordType == 'vendor'){
                                        rec.setValue({
                                            fieldId : 'custrecord_avavendorid',
                                            value : nRecord.id
                                        });
                                    }   
                                    else{
                                        rec.setValue({
                                            fieldId : 'custrecord_avacustid',
                                            value : nRecord.id
                                        });
                                    }

                                    rec.setValue({
                                        fieldId : 'custrecord_ava_address_id',
                                        value : (addId).toString()
                                    });
                                    rec.setValue({
                                        fieldId : 'custrecord_ava_addressvalidated',
                                        value : (addVal == 'T') ? true : false 
                                    });
                                    rec.setValue({
                                        fieldId : 'custrecord_ava_custvendinternalid',
                                        value : (nRecord.id).toString()
                                    });
                                    var recId = rec.save({});
                                }   
                            }
                            else if(context.type == context.UserEventType.EDIT){

                                var custRec = record.load({
                                    type: baseRecordType,
                                    id: nRecord.id
                                });
                                
                                var searchRecord = search.create({
                                    type : 'customrecord_avaaddvalflag',
                                    filters : (baseRecordType == 'customer') ? ['custrecord_avacustid', 'anyof', nRecord.id] : ['custrecord_avavendorid', 'anyof', nRecord.id],
                                    columns : ['custrecord_ava_address_id', 'custrecord_ava_addressvalidated', 'custrecord_ava_custvendinternalid']
                                });

                                var searchResult = searchRecord.run();
                                searchResult = searchResult.getRange({
                                    start : 0,
                                    end : 1000
                                });

                                var lineItemCount = custRec.getLineCount({
                                    sublistId: 'addressbook'
                                });

                                for(var jj = 0; searchResult != null && jj < searchResult.length; jj++){
                                    var addressIdDelete = 'F';

                                    for(var kk = 0; kk < lineItemCount && lineItemCount <= 10000; kk++){
                                        var lineItemValue = custRec.getSublistValue({
                                            sublistId: 'addressbook',
                                            fieldId: 'id',
                                            line: kk
                                        });

                                        if(searchResult[jj].getValue('custrecord_ava_address_id') == lineItemValue){
                                            addressIdDelete = 'T';
                                            break;
                                        }
                                    }

                                    if(addressIdDelete == 'F'){
                                        record.delete({
                                            type: 'customrecord_avaaddvalflag',
                                            id: searchResult[jj].id
                                        });
                                    }
                                }

                                searchResult = searchRecord.run();
                                searchResult = searchResult.getRange({
                                    start : 0,
                                    end : 1000
                                });

                                for(var jjj = 0; jjj < lineItemCount && lineItemCount <= 10000; jjj++){
                                    var rec, existFlag = 'F', changeFlag = 0, delRec;
                                    
                                    var addId = custRec.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'id',
                                        line: jjj
                                    });
                                    addId = (addId).toString();

                                    var addVal = nRecord.getSublistValue({
                                        sublistId: 'addressbook',
                                        fieldId: 'custpage_ava_addval',
                                        line: jjj
                                    });

                                    for(var customRec = 0; searchResult != null && customRec < searchResult.length; customRec++){
                                        if(searchResult[customRec].getValue('custrecord_ava_address_id') == addId){
                                            record.submitFields({
                                                type : 'customrecord_avaaddvalflag',
                                                id : searchResult[customRec].id,
                                                values : {'custrecord_ava_addressvalidated' : addVal}
                                            });    
                                            existFlag = 'T';
                                            break;
                                        }
                                    }

                                    if(existFlag == 'F' && nRecord.getValue('isinactive') == false){
                                        rec = record.create({
                                            type : 'customrecord_avaaddvalflag'
                                        });

                                        if(baseRecordType == 'vendor'){
                                            rec.setValue({
                                                fieldId : 'custrecord_avavendorid',
                                                value : nRecord.id
                                            });
                                        }   
                                        else{
                                            rec.setValue({
                                                fieldId : 'custrecord_avacustid',
                                                value : nRecord.id
                                            });
                                        }
                                        rec.setValue({
                                            fieldId : 'custrecord_ava_address_id',
                                            value : addId
                                        });
                                        rec.setValue({
                                            fieldId : 'custrecord_ava_addressvalidated',
                                            value : (addVal == 'T') ? true : false
                                        });
                                        rec.setValue({
                                            fieldId : 'custrecord_ava_custvendinternalid',
                                            value : (nRecord.id).toString()
                                        });
                                        var recId = rec.save({});
                                    }
                                }
                            }
                            else if(context.type == context.UserEventType.DELETE){
                                var searchRecord = search.create({
                                    type : 'customrecord_avaaddvalflag',
                                    filters : ['custrecord_ava_custvendinternalid', 'is', (nRecord.id).toString()]
                                });

                                var searchResult = searchRecord.run();
                                searchResult = searchResult.getRange({
                                    start : 0,
                                    end : 1000
                                });

                                for(var i = 0; searchResult != null && i < searchResult.length; i++){
                                    record.delete({
                                        type : 'customrecord_avaaddvalflag',
                                        id : searchResult[i].id
                                    });
                                }
                            }   
                        }
                    }
                }
            }
            catch(err){
                log.debug({
                    title: 'AVA_CustomerAddressAfterSubmit Try/Catch Error',
                    details: err.message
                });
            }
        }

        return{
            beforeLoad: AVA_CustomerAddressBeforeLoad,
            afterSubmit: AVA_CustomerAddressAfterSubmit
        };
    }  
);