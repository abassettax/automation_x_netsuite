/**
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType ClientScript
 */
 define(["require", "exports", "N/ui/message", "N/search", "N/runtime", "N/format"], function (require, exports, message, search, runtime, format) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pageInit = function (context) {
        var rfqType = getParameterFromURL('type');
        if (rfqType) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_rfqtype',
                value: rfqType,
                ignoreFieldChange: true
            });
        }
        var itemid = getParameterFromURL('itemid');
        if (itemid) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_itemid',
                value: itemid,
                ignoreFieldChange: true
            });
        }
        var tranid = getParameterFromURL('tranid');
        if (tranid) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_tranid',
                value: tranid,
                ignoreFieldChange: true
            });
        }
        var qty = getParameterFromURL('qty');
        if (qty) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_qty',
                value: qty,
                ignoreFieldChange: true
            });
        }
        var vendor = getParameterFromURL('vendor');
        if (vendor) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_vendor',
                value: vendor,
                ignoreFieldChange: true
            });
        }
        var cust = getParameterFromURL('customer');
        if (cust) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_cust',
                value: cust,
                ignoreFieldChange: true
            });
        }
        var deadline = getParameterFromURL('deadline');
        var deadlineParsed = format.parse({
            value: deadline,
            type: format.Type.DATE
        });
        if (deadlineParsed) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_due',
                value: deadlineParsed
            });
        }
    };
    exports.fieldChanged = function (context) {
        var currentRecord = context.currentRecord, FieldName = context.fieldId;
        var rfqType = currentRecord.getValue('custpage_rfqtype');
        var userName = runtime.getCurrentUser().name;
        var nameSplit = userName.split(',');
        var finalName = nameSplit[1].concat(' ' + nameSplit[0]);
        if (FieldName === 'custpage_rfqtype' ) {
            window.onbeforeunload = null;
            window.open('https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2472&deploy=1&compid=422523' + '&type=' + rfqType, '_self');
            return true;
        }
        if (FieldName === 'custpage_tranid' ) {
            //validate transaction type based on rfq type. qt/so for 1, po for 2.
            var tranId = currentRecord.getValue('custpage_tranid');
            var tranSearch = search.lookupFields({
                type: search.Type.TRANSACTION,
                id: tranId,
                columns: ['type']
            });
            var tranType = tranSearch.type[0].value;
            if (rfqType == '1') {
                if (tranType != 'Estimate' &&  tranType != 'SalesOrd') {
                    var myMsg = message.create({
                        title: 'INVALID TRANSACTION',
                        message: 'The transaction you have selected for this RFQ is not a Sales Order or Quote. Please verify your transaction number and try again.',
                        type: message.Type.ERROR
                    });
                    myMsg.show({
                        duration: 10000 // will disappear after 5s
                    });
                    currentRecord.setValue({
                        fieldId: 'custpage_tranid',
                        value: '',
                        ignoreFieldChange: true
                    });
                    return false;
                }
            } else if (rfqType == '2') {
                if (tranType != 'PurchOrd') {
                    var myMsg = message.create({
                        title: 'INVALID TRANSACTION',
                        message: 'The transaction you have selected for this PO update is not a Purchase Order. Please verify your transaction number and try again.',
                        type: message.Type.ERROR
                    });
                    myMsg.show({
                        duration: 10000 // will disappear after 5s
                    });
                    currentRecord.setValue({
                        fieldId: 'custpage_tranid',
                        value: '',
                        ignoreFieldChange: true
                    });
                    return false;
                }
            }
            
            // var currSubject = currentRecord.getValue('custpage_subject');
            // var tranId = currentRecord.getText('custpage_tranid');
            // var splitTranId = tranId.split('#');
            // var tranIdNum = splitTranId[1];
            // if (!tranIdNum) {
            //     tranIdNum = '[Tran #]';
            // }
            
            // if (rfqType == '1') {
            //     var split = currSubject.split('5 Code:');
            //     var baseSubject = split[0];
            //     var itemId = currentRecord.getValue('custpage_itemid');
            //     if (!itemId) {
            //         itemId = '[5 Code]';
            //     } else {
            //         itemId = -1*itemId;
            //     }
            //     var newSubject = baseSubject.concat('5 Code: ' + itemId);
            //     newSubject = newSubject.concat(' | Tran #: ' + tranIdNum);
            //     var emailBodyNew = 'Hello,<br><br>I would like to submit a RFQ for '+itemId+' on '+tranIdNum+ '. Details below. Please reach out with any questions.<br><br>5 Code: '+itemId+'<br>Quantity: <b>[QTY]</b><br>Vendor: <b>[VND]</b><br>Customer: <b>[CUST]</b><br>Deadline: <b>[DUE]</b><br><br>[ADDITIONAL NOTES]<br><br>Thanks,<br>'+finalName;
            //     // alert('before set email body: ' + emailBodyNew);
            //     currentRecord.setValue({
            //         fieldId: 'custpage_emailbody',
            //         value: emailBodyNew,
            //         ignoreFieldChange: true
            //     });
            // } else {
            //     var split = currSubject.split('PO#:');
            //     var baseSubject = split[0];
            //     var newSubject = baseSubject.concat('PO#: ' + tranIdNum);
            //     var emailBodyNew = 'Hello,<br><br>I am requesting an update on '+tranIdNum+' to provide my customer(s).<br><br>Thanks,<br>'+finalName;
            //     currentRecord.setValue({
            //         fieldId: 'custpage_emailbody',
            //         value: emailBodyNew,
            //         ignoreFieldChange: true
            //     });
            // }
            // currentRecord.setValue({
            //     fieldId: 'custpage_subject',
            //     value: newSubject,
            //     ignoreFieldChange: true
            // });
            // return true;
        }
        // if (FieldName === 'custpage_urgent' ) {
        //     var urgent = currentRecord.getValue('custpage_urgent');
        //     var currSubject = currentRecord.getValue('custpage_subject');
        //     if (urgent) {
        //         var newSubject = 'URGENT | '.concat(currSubject);
        //     } else {
        //         var split = currSubject.split('URGENT | ');
        //         var newSubject = split[1];
        //     }
        //     currentRecord.setValue({
        //         fieldId: 'custpage_subject',
        //         value: newSubject,
        //         ignoreFieldChange: true
        //     });
        //     return true;
        // }
        if (FieldName === 'custpage_urgent' || FieldName === 'custpage_itemid' || FieldName === 'custpage_tranid' || FieldName === 'custpage_qty' || FieldName === 'custpage_vendor' || FieldName === 'custpage_cust' || FieldName === 'custpage_due'  || FieldName === 'custpage_notes' || FieldName === 'custpage_fivecode' ) {
            //depending on type, get all fields. Swap out nulls with placeholders. Reset subject/email body with info
            if (rfqType == '1') {
                var urgent = currentRecord.getValue('custpage_urgent');
                var itemId = currentRecord.getValue('custpage_itemid');
                if (!itemId) {
                    itemId = '[5 Code]';
                } else {
                    itemId = -1*itemId;
                }
                var tranId = currentRecord.getText('custpage_tranid');
                var splitTranId = tranId.split('#');
                var tranIdNum = splitTranId[1];
                if (!tranIdNum) {
                    tranIdNum = '[Tran #]';
                }
                var qty = currentRecord.getValue('custpage_qty');
                if (!qty) {
                    qty = '[QTY]';
                }
                var vendor = currentRecord.getText('custpage_vendor');
                if (!vendor) {
                    vendor = '[VND]';
                }
                var cust = currentRecord.getText('custpage_cust');
                if (!cust) {
                    cust = '[CST]';
                }
                var due = currentRecord.getText('custpage_due');
                if (!due) {
                    due = '[DUE]';
                }
                var notes = currentRecord.getValue('custpage_notes');

                if (urgent) {
                    var newSubject = 'URGENT RFQ | '+itemId+' | '+tranIdNum;
                } else {
                    var newSubject = 'RFQ | ' + itemId + ' | ' + tranIdNum;
                }
                currentRecord.setValue({
                    fieldId: 'custpage_subject',
                    value: newSubject,
                    ignoreFieldChange: true
                });
                if (notes != '') {
                    var newEmailBody = 'Hello,<br><br>I would like to submit a RFQ for ' + itemId + ' on ' + tranIdNum + ' . Details below. Please reach out with any questions.<br><br>5 Code: '+itemId+'<br>Quantity: '+qty+'<br>Vendor: '+vendor+'<br>Customer: '+cust+'<br>Deadline: '+due+'<br><br>'+notes+'<br><br>Thanks,<br>'+finalName;
                } else {
                    var newEmailBody = 'Hello,<br><br>I would like to submit a RFQ for ' + itemId + ' on ' + tranIdNum + ' . Details below. Please reach out with any questions.<br><br>5 Code: '+itemId+'<br>Quantity: '+qty+'<br>Vendor: '+vendor+'<br>Customer: '+cust+'<br>Deadline: '+due+'<br><br>Thanks,<br>'+finalName;
                }
                currentRecord.setValue({
                    fieldId: 'custpage_emailbody',
                    value: newEmailBody,
                    ignoreFieldChange: true
                });
            } else if (rfqType == '2') {
                var urgent = currentRecord.getValue('custpage_urgent');
                var tranId = currentRecord.getText('custpage_tranid');
                var splitTranId = tranId.split('#');
                var tranIdNum = splitTranId[1];
                if (!tranIdNum) {
                    tranIdNum = '[PO #]';
                }
                var notes = currentRecord.getValue('custpage_notes');

                if (urgent) {
                    var newSubject = 'URGENT PO Update | '+tranIdNum;
                } else {
                    var newSubject = 'PO Update | ' + tranIdNum;
                }
                currentRecord.setValue({
                    fieldId: 'custpage_subject',
                    value: newSubject,
                    ignoreFieldChange: true
                });
                if (notes != '') {
                    var newEmailBody = 'Hello,<br><br>I am requesting an update on ' + tranIdNum + ' to provide my customer(s).<br><br>'+notes+'<br><br>Thanks,<br>'+finalName;
                } else {
                    var newEmailBody = 'Hello,<br><br>I am requesting an update on ' + tranIdNum + ' to provide my customer(s).<br><br>Thanks,<br>'+finalName;
                }
                currentRecord.setValue({
                    fieldId: 'custpage_emailbody',
                    value: newEmailBody,
                    ignoreFieldChange: true
                });
            } else {
                var urgent = currentRecord.getValue('custpage_urgent');
                var fiveCode = currentRecord.getValue('custpage_fivecode');
                if (!fiveCode) {
                    fiveCode = '[5 Code]';
                }
                var notes = currentRecord.getValue('custpage_notes');

                if (urgent) {
                    var newSubject = 'URGENT Inactive/Direct 5 Code Inquiry | '+fiveCode;
                } else {
                    var newSubject = 'Inactive/Direct 5 Code Inquiry | ' + fiveCode;
                }
                currentRecord.setValue({
                    fieldId: 'custpage_subject',
                    value: newSubject,
                    ignoreFieldChange: true
                });
                if (notes != '') {
                    var newEmailBody = 'Hello,<br><br>Please reactivate ' + fiveCode + ' or provide an alternative that I can use.<br><br>'+notes+'<br><br>Thanks,<br>'+finalName;
                } else {
                    var newEmailBody = 'Hello,<br><br>Please reactivate ' + fiveCode + ' or provide an alternative that I can use.<br><br>Thanks,<br>'+finalName;
                }
                currentRecord.setValue({
                    fieldId: 'custpage_emailbody',
                    value: newEmailBody,
                    ignoreFieldChange: true
                });
            }
        }
        return true;
        // if (FieldName === 'custpage_itemid' ) {
        //     var currSubject = currentRecord.getValue('custpage_subject');
        //     var split = currSubject.split('5 Code:');
        //     var baseSubject = split[0];
        //     var itemId = currentRecord.getValue('custpage_itemid');
        //     if (!itemId) {
        //         itemId = '[5 Code]';
        //     } else {
        //         itemId = -1*itemId;
        //     }
        //     var newSubject = baseSubject.concat('5 Code: ' + itemId);
        //     if (rfqType == '1') {
        //         var tranId = currentRecord.getText('custpage_tranid');
        //         var splitTranId = tranId.split('#');
        //         var tranIdNum = splitTranId[1];
        //         if (!tranIdNum) {
        //             tranIdNum = '[Tran #]';
        //         }
        //         newSubject = newSubject.concat(' | Tran #: ' + tranIdNum);
        //         var emailBodyNew = 'Hello,<br><br>I would like to submit a RFQ for '+itemId+' on '+tranIdNum+ '. Details below. Please reach out with any questions.<br><br>5 Code: '+itemId+'<br>Quantity: <b>[QTY]</b><br>Vendor: <b>[VND]</b><br>Customer: <b>[CUST]</b><br>Deadline: <b>[DUE]</b><br><br>[ADDITIONAL NOTES]<br><br>Thanks,<br>'+finalName;
        //         currentRecord.setValue({
        //             fieldId: 'custpage_emailbody',
        //             value: emailBodyNew,
        //             ignoreFieldChange: true
        //         });
        //     }
        //     currentRecord.setValue({
        //         fieldId: 'custpage_subject',
        //         value: newSubject,
        //         ignoreFieldChange: true
        //     });
        //     return true;
        // }
        // if (FieldName === 'custpage_fivecode' ) {
        //     var currSubject = currentRecord.getValue('custpage_subject');
        //     var split = currSubject.split('5 Code:');
        //     var baseSubject = split[0];
        //     var fiveCode = currentRecord.getValue('custpage_fivecode');
        //     var newSubject = baseSubject.concat('5 Code: ' + fiveCode);
        //     currentRecord.setValue({
        //         fieldId: 'custpage_subject',
        //         value: newSubject,
        //         ignoreFieldChange: true
        //     });
        //     if (!fiveCode) {
        //         fiveCode = '[5 Code]';
        //     }
        //     var emailBodyNew = 'Hello,<br><br>Please reactivate '+fiveCode+' or provide an alternative that I can use.<br><br>Thanks,<br>'+finalName;
        //     currentRecord.setValue({
        //         fieldId: 'custpage_emailbody',
        //         value: emailBodyNew,
        //         ignoreFieldChange: true
        //     });
        //     return true;
        // }
    };
    // exports.saveRecord = function (context) {
    //     var currentRecord = context.currentRecord;
    //     var errors = false;
    //     if (errors) {
    //         var myMsg = message.create({
    //             title: 'ERROR PLACEHOLDER',
    //             message: 'Placeholder Error.',
    //             type: message.Type.ERROR
    //         });
    //         myMsg.show({
    //             duration: 10000 // will disappear after 5s
    //         });
    //         return false;
    //     } else {
    //         return true;
    //     }
    // };
    var getParameterFromURL = function (param) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] === param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return (false);
    };
});
