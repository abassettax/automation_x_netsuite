/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define([
    'N/email', 'N/search', 'N/record', 'N/log', 'N/url'
], function (email, search, record, log, url) {

    function beforeSubmit(context) {

        if (context.type === context.UserEventType.DELETE) {
            return;
        } else {
            var woRec = context.newRecord;
            var sentWOBuiltEmail = woRec.getValue('custbody_ax_wo_builtemail');
            log.debug({
                title: 'beforeSubmit',
                details: 'email sent: ' + sentWOBuiltEmail
            });
            var woStatus = woRec.getValue('status');
            log.debug({
                title: 'beforeSubmit',
                details: 'woStatus: ' + woStatus
            });

            if (woStatus == 'Built' && !sentWOBuiltEmail) {
                log.debug({
                    title: 'beforeSubmit',
                    details: 'Sending WO Built Email'
                });
                var recordid = context.newRecord.id;
                
                //load sales team member sublist, get lines and add as recipients
                var recipients = [];
                var salesTeamLines = woRec.getLineCount({
                    sublistId: 'salesteam'
                });
                log.debug({
                    title: 'beforeSubmit',
                    details: 'salesTeamLines: ' + JSON.stringify(salesTeamLines)
                });
                for (var i = 0; i < salesTeamLines; i++) {
                    var salesTeamMember = woRec.getSublistValue({
                        sublistId: 'salesteam',
                        fieldId: 'employee',
                        line: i
                    });
                    var empLookup = search.lookupFields({
                        type: search.Type.EMPLOYEE,
                        id: salesTeamMember,
                        columns: ['email']
                    });
                    var empEmail = empLookup.email;
                    if (empEmail != '') {
                        recipients.push(empEmail)
                    }
                }
                log.debug({
                    title: 'beforeSubmit',
                    details: 'recipients: ' + JSON.stringify(recipients)
                });

                if (recipients.length > 0) {
                    var emailBody = 'Your WO has been built. WO Link: ';
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
                        recipients: recipients,
                        subject: 'WO Status Built',
                        body: emailBody,
                        relatedRecords: {
                            transactionId: recordid
                        }
                    });
                    woRec.setValue({fieldId: 'custbody_ax_wo_builtemail', value: true});
                    log.debug({
                        title: 'beforeSubmit',
                        details: 'Email Sent, WO field updated.'
                    });
                }
            }
        }
    }
    return {beforeSubmit: beforeSubmit};
});