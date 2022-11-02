/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define([
    'N/email', 'N/search', 'N/record', 'N/log', 'N/url'
], function (email, search, record, log, url) {

    function afterSubmit(context) {
        log.debug({
            title: 'afterSubmit',
            details: 'context.type: ' + context.type
        });
        if (context.type === context.UserEventType.DELETE) {
            return;
        } else {
            //TODO: check on emails, rework for partials. May need to move to assemblies instead, run each time one is saved
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
        }
    }
    return {afterSubmit: afterSubmit};
});