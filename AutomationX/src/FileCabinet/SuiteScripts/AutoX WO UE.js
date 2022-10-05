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
            } else {
                var woRecOld = context.oldRecord;
                var oldStatus = woRecOld.getValue({
                    fieldId: 'orderstatus'
                });
                var woRecId = context.newRecord.id;
                var woRec = context.newRecord;
                var newStatus = woRec.getValue({
                    fieldId: 'orderstatus'
                });
                log.debug({
                    title: 'afterSubmit',
                    details: 'Checking status. Old: ' + oldStatus + ' | New: ' + newStatus
                });
                if (oldStatus != newStatus && newStatus == 'B') {
                    //Planned -> Released
                    //Set date started value. Send email
                    var woRecObj = record.load({
                        type: record.Type.WORK_ORDER,
                        id: woRecId,
                        isDynamic: true,
                    });
                    var today = new Date();
                    woRecObj.setValue({
                        fieldId: 'custbody_ax_wo_startdate',
                        value: today
                    });

                    var recipients = [];
                    var salesTeamLines = woRecObj.getLineCount({
                        sublistId: 'salesteam'
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'salesTeamLines: ' + JSON.stringify(salesTeamLines)
                    });
                    for (var i = 0; i < salesTeamLines; i++) {
                        var salesTeamMember = woRecObj.getSublistValue({
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
                        title: 'afterSubmit',
                        details: 'recipients: ' + JSON.stringify(recipients)
                    });

                    woRecObj.save();

                    if (recipients.length > 0) {
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
    
                        var emailBody = 'A WO has been released to be built. <br><br>Location: '+locationName+'<br>WO Link: ';
                        var baseUrl = url.resolveDomain({
                            hostType: url.HostType.APPLICATION,
                            accountId: '422523'
                        });
                        var woUrl = url.resolveRecord({
                            recordType: record.Type.WORK_ORDER,
                            recordId: woRecId
                        });
                        emailBody += baseUrl + woUrl;          
                        email.send({
                            author: '11360',
                            recipients: recipients,
                            subject: 'WO Released for Build',
                            body: emailBody,
                            relatedRecords: {
                                transactionId: woRecId
                            }
                        });
                        log.debug({
                            title: 'afterSubmit',
                            details: 'WO Released Email Sent'
                        });
                    }
                } else if (oldStatus != newStatus && newStatus == 'A') {
                    //Releaed -> Planned
                    //Remove date started value. Send email
                    var woRecObj = record.load({
                        type: record.Type.WORK_ORDER,
                        id: woRecId,
                        isDynamic: true,
                    });
                    woRecObj.setValue({
                        fieldId: 'custbody_ax_wo_startdate',
                        value: ''
                    });

                    var recipients = [];
                    var salesTeamLines = woRecObj.getLineCount({
                        sublistId: 'salesteam'
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'salesTeamLines: ' + JSON.stringify(salesTeamLines)
                    });
                    for (var i = 0; i < salesTeamLines; i++) {
                        var salesTeamMember = woRecObj.getSublistValue({
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
                        title: 'afterSubmit',
                        details: 'recipients: ' + JSON.stringify(recipients)
                    });

                    woRecObj.save();

                    if (recipients.length > 0) {
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
    
                        var emailBody = 'A WO has been reset to Planned. <br><br>Location: '+locationName+'<br>WO Link: ';
                        var baseUrl = url.resolveDomain({
                            hostType: url.HostType.APPLICATION,
                            accountId: '422523'
                        });
                        var woUrl = url.resolveRecord({
                            recordType: record.Type.WORK_ORDER,
                            recordId: woRecId
                        });
                        emailBody += baseUrl + woUrl;       
                        email.send({
                            author: '11360',
                            recipients: recipients,
                            subject: 'WO Reset to Planned',
                            body: emailBody,
                            relatedRecords: {
                                transactionId: woRecId
                            }
                        });
                        log.debug({
                            title: 'afterSubmit',
                            details: 'WO Reset to Planned Email Sent'
                        });
                    }
                }
            }
        }
    }
    return {afterSubmit: afterSubmit};
});