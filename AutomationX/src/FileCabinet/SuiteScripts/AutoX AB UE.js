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
                //TODO: check on emails, rework for partials. May need to move to assemblies instead, run each time one is saved
                var abRec = context.newRecord;
                log.debug({
                    title: 'afterSubmit',
                    details: 'abRec: ' + JSON.stringify(abRec)
                });
                log.debug({
                    title: 'afterSubmit',
                    details: 'Sending AB Built Email'
                });
                var recordid = context.newRecord.id;
                var buildItem = abRec.getText({
                    fieldId: 'item'
                });
                var buildQty = abRec.getValue({
                    fieldId: 'quantity'
                });
                log.debug({
                    title: 'afterSubmit',
                    details: 'buildQty' + buildQty
                });
                var createdFrom = abRec.getValue({
                    fieldId: 'createdfrom'
                });
                var woFields = search.lookupFields({
                    type: search.Type.WORK_ORDER,
                    id: createdFrom,
                    columns: ['quantity','built']
                });
                var woFields = search.lookupFields({
                    type: search.Type.WORK_ORDER,
                    id: createdFrom,
                    columns: ['quantity','built']
                });
                var woQty = woFields.quantity;
                var woBuilt = woFields.built;
                log.debug({
                    title: 'afterSubmit',
                    details: 'woQty' + woQty + ' | woBuilt: ' + woBuilt
                });
                
                //load sales team member sublist, get lines and add as recipients
                var woRec = record.load({
					type: record.Type.WORK_ORDER,
					id: createdFrom,
                    isDynamic: true,
				});
                var woStatus = woRec.getField({
                    fieldId: 'orderstatus'
                });
                var axStatus = woRec.getField({
                    fieldId: 'custbody237'
                });
                if (woStatus == 'G') {
                    //WO fully built, update AX Status field
                    woRec.setValue({
                        fieldId: 'custbody237',
                        value: '3'
                    });
                } else if (axStatus != '2') {
                    woRec.setValue({
                        fieldId: 'custbody237',
                        value: '2'
                    });
                }
                var recipients = [];
                var salesTeamLines = woRec.getLineCount({
                    sublistId: 'salesteam'
                });
                log.debug({
                    title: 'afterSubmit',
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
                woRec.save();
                log.debug({
                    title: 'afterSubmit',
                    details: 'recipients: ' + JSON.stringify(recipients)
                });

                if (recipients.length > 0) {
                    var emailBody = 'An Assembly Build for one of your Work Orders has been completed.<br><br>Assembly Item: '+buildItem+'<br>Quantity Built: '+buildQty+'<br>WO Qty Remaining: '+(woQty - woBuilt)+'<br>Build Link: ';
                    var baseUrl = url.resolveDomain({
                        hostType: url.HostType.APPLICATION,
                        accountId: '422523'
                    });
                    var woUrl = url.resolveRecord({
                        recordType: record.Type.ASSEMBLY_BUILD,
                        recordId: recordid
                    });
                    emailBody += baseUrl + woUrl                
                    email.send({
                        author: '11360',
                        recipients: recipients,
                        subject: 'Build Completed for WO',
                        body: emailBody,
                        relatedRecords: {
                            transactionId: recordid
                        }
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'AB Email Sent'
                    });
                }
            }
        }
    }
    return {afterSubmit: afterSubmit};
});