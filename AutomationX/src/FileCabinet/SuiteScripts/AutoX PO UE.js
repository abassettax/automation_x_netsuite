/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define([
    'N/email', 'N/runtime', 'N/record', 'N/log', 'N/url'
], function (email, runtime, record, log, url) {

    function beforeSubmit(context) {
        var poRec = context.newRecord;
        log.debug({
            title: 'beforeSubmit',
            details: 'context.type: ' + context.type
        });
        log.debug({
            title: 'beforeSubmit',
            details: 'runtime.executionContext: ' + runtime.executionContext
        });
        var itemLines = poRec.getLineCount({
            sublistId: 'item'
        });
        log.debug('itemLines', itemLines);
        for (var j = 0; j < itemLines; j++) {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            poRec.setSublistValue({
                sublistId: 'item',
                fieldId : 'custcol11',
                line : j,
                value : tomorrow
            });
            poRec.setSublistValue({
                sublistId: 'item',
                fieldId : 'expectedreceiptdate',
                line : j,
                value : null
            });
        }
    }
    
    function afterSubmit(context) {
        log.debug({
            title: 'afterSubmit',
            details: 'context.type: ' + context.type
        });
        log.debug({
            title: 'afterSubmit',
            details: 'runtime.executionContext: ' + runtime.executionContext
        });
        if (runtime.executionContext !== runtime.ContextType.MAP_REDUCE) {
            if (context.type === context.UserEventType.DELETE) {
                return;
            } else {
                try {
                    var oldPoRec = context.oldRecord;
                    var oldDiscResolved = oldPoRec.getValue({
                        fieldId: 'custbody193'
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'oldDiscResolved: ' + oldDiscResolved
                    });
                    var poRec = context.newRecord;
                    var discResolved = poRec.getValue({
                        fieldId: 'custbody193'
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'discResolved: ' + discResolved
                    });
                    if (oldDiscResolved != discResolved && discResolved == true) {
                        log.debug({
                            title: 'afterSubmit',
                            details: 'Sending AB Built Email'
                        });
                        var recordid = context.newRecord.id;
                        var emailBody = 'A Purchase Order pricing discrepancy has been resolved, please review.<br><br>PO Link: ';
                        var baseUrl = url.resolveDomain({
                            hostType: url.HostType.APPLICATION,
                            accountId: '422523'
                        });
                        var poUrl = url.resolveRecord({
                            recordType: record.Type.PURCHASE_ORDER,
                            recordId: recordid
                        });
                        emailBody += baseUrl + poUrl                
                        email.send({
                            author: '48197',
                            recipients: ['clarinda.jose@automation-x.com','karen.dussaman@automation-x.com'],
                            subject: 'PO Discrepancy Resolved',
                            body: emailBody,
                            relatedRecords: {
                                transactionId: recordid
                            }
                        });
                        log.debug({
                            title: 'afterSubmit',
                            details: 'PO Disc Email Sent'
                        });
                    }
    
                    var oldPoRec = context.oldRecord;
                    var oldmatStatus = oldPoRec.getValue({
                        fieldId: 'custbody6'
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'oldmatStatus: ' + oldmatStatus
                    });
                    var poRec = context.newRecord;
                    var matStatus = poRec.getValue({
                        fieldId: 'custbody6'
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'matStatus: ' + matStatus
                    });
                    if (oldmatStatus != matStatus && (matStatus == 32 || matStatus == 33)) {
                        var recordid = context.newRecord.id;
                        var emailBody = 'A Purchase Order has been updated to Pending Prepayment/Deposit or Pending Final Prepayment/Deposit, please review.<br><br>PO Link: ';
                        var baseUrl = url.resolveDomain({
                            hostType: url.HostType.APPLICATION,
                            accountId: '422523'
                        });
                        var poUrl = url.resolveRecord({
                            recordType: record.Type.PURCHASE_ORDER,
                            recordId: recordid
                        });
                        emailBody += baseUrl + poUrl                
                        email.send({
                            author: '48197',
                            recipients: ['karen.dussaman@automation-x.com'],
                            subject: 'Purchase Order PrePayment Requested',
                            body: emailBody,
                            relatedRecords: {
                                transactionId: recordid
                            }
                        });
                        log.debug({
                            title: 'afterSubmit',
                            details: 'PO PrePayment Email Sent'
                        });
                    }
                } catch (e) {
                    log.error('AX PO UE error: ', e);
                }
            }
        }
    }
    return {
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
});