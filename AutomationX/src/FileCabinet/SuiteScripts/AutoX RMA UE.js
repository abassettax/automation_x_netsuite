/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define([
    'N/email', 'N/search', 'N/record', 'N/log', 'N/url'
], function (email, search, record, log, url) {

    function beforeSubmit(context) {
        log.debug({
            title: 'afterSubmit',
            details: 'context.type: ' + context.type
        });
        if (context.type === context.UserEventType.DELETE) {
            return;
        } else {
            // if (context.type === context.UserEventType.CREATE) {
                var rmaRec = context.newRecord;
                var returnReason = rmaRec.getValue('custbody82');
                log.debug({
                    title: 'beforeSubmit',
                    details: 'returnReason: ' + returnReason
                });
                if (returnReason == '2' || returnReason == '10') {  //customer error and buy backs
                    //check line items for index of fee. if no fee, need to add
                    //91338 is the id for the AX Restocking Fee other charge item
                    //if not found, total all lines, multiply by 25%, use a quantity of 1 and a negative rate of the 25% value
                    //validate we should use the -1, confirm with Adrienne how it sets up on the CRM
                    var lineCount = rmaRec.getLineCount({
                        sublistId: 'item'
                    });
                    var index = -1;
                    var totalAmount = 0;
                    for (var i = 0; i < lineCount; i++) {
                        var item = rmaRec.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: i
                        });
                        if (item == 91338) {
                            index = i;
                        } else {
                            var lineAmount = rmaRec.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'amount',
                                line: i
                            });
                            totalAmount = parseFloat(totalAmount) + parseFloat(lineAmount);
                        }
                    }
                    log.debug({
                        title: 'beforeSubmit',
                        details: 'index: ' + index
                    });
                    log.debug({
                        title: 'beforeSubmit',
                        details: 'totalAmount: ' + totalAmount
                    });
                    var restockingFee = (-0.25*totalAmount).toFixed(2); //negative so that the fee goes against the credit
                    //determine max restocking fee to charge
                    // if (restockingFee > 1000) {
                    //     restockingFee = 1000;
                    // }
                    log.debug({
                        title: 'beforeSubmit',
                        details: 'restockingFee: ' + restockingFee
                    });
                    if (index != -1) {
                        //verify and reset value of existing line
                        rmaRec.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantity',
                            line: index,
                            value: 1
                        });
                        rmaRec.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            line: index,
                            value: restockingFee
                        });
                    } else {
                        //charge not present, add
                        rmaRec.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            line: lineCount,
                            value: 91338
                        });
                        rmaRec.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantity',
                            line: lineCount,
                            value: 1
                        });
                        rmaRec.setSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            line: lineCount,
                            value: restockingFee
                        });
                    }
                } 
            // }
        }
    }
    return {beforeSubmit: beforeSubmit};
});