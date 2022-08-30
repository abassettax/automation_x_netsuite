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
            if (context.type === context.UserEventType.CREATE) {
                var woRec = context.newRecord;
                var recordid = context.newRecord.id;
                var buildLocation = woRec.getValue({
                    fieldId: 'location'
                });
                if (buildLocation != '') {
                    var locationLookup = search.lookupFields({
                        type: search.Type.LOCATION,
                        id: buildLocation,
                        columns: ['name']
                    });
                    var locationName = locationLookup.name;
                } else {
                    var locationName = 'No Location Set';
                }
                log.debug({
                    title: 'afterSubmit',
                    details: 'woRec: ' + JSON.stringify(woRec)
                });
                var emailBody = 'A new WO has been created. <br><br>Location: '+locationName+'<br>WO Link: ';
                var baseUrl = url.resolveDomain({
                    hostType: url.HostType.APPLICATION,
                    accountId: '422523'
                });
                var woUrl = url.resolveRecord({
                    recordType: record.Type.WORK_ORDER,
                    recordId: recordid
                });
                emailBody += baseUrl + woUrl                
                email.send({
                    author: '11360',
                    recipients: ['panels@automation-x.com'],
                    subject: 'New WO Created',
                    body: emailBody,
                    relatedRecords: {
                        transactionId: recordid
                    }
                });
                log.debug({
                    title: 'afterSubmit',
                    details: 'New WO Email Sent'
                });
            }
        }
    }
    return {afterSubmit: afterSubmit};
});