/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define([
    'N/search', 'N/record', 'N/log'
], function (search, record, log) {

    function afterSubmit(context) {
        log.debug({
            title: 'afterSubmit',
            details: 'context.type: ' + context.type
        });
        if (context.type === context.UserEventType.DELETE) {
            return;
        } else {
            if (context.type === context.UserEventType.CREATE) {
                var rec = context.newRecord;
                log.debug({
                    title: 'afterSubmit',
                    details: 'rec: ' + JSON.stringify(rec)
                });
                var rfSmartUser = rec.getValue({
                    fieldId: 'custrecord_rfs_external_user'
                });
                log.debug({
                    title: 'afterSubmit',
                    details: 'rfSmartUser' + rfSmartUser
                });
                var createdFrom = rec.getValue({
                    fieldId: 'custrecord_transaction'
                });
                log.debug({
                    title: 'afterSubmit',
                    details: 'createdFrom' + createdFrom
                });
                var empResults = getEmployee(rfSmartUser);
                if (empResults.length > 0) {
                    var empId = empResults[0];
                    record.submitFields({
                        type: record.Type.ITEM_RECEIPT,
                        id: createdFrom,
                        values: {
                            custbody102: empId
                        }
                    });
                }
            }
        }
    }
    function getEmployee(rfSmartUser) {
        var empIds = [];
        var employeeSearchObj = search.create({
            type: "employee",
            filters:
            [
               ["entityid","contains",rfSmartUser], 
               "AND", 
               ["isinactive","is","F"]
            ],
            columns:
            [
               search.createColumn({name: "internalid", label: "Internal ID"}),
               search.createColumn({name: "email", label: "Email"})
            ]
         });
         employeeSearchObj.run().each(function(result){
            // .run().each has a limit of 4,000 results
            empIds.push(result.getValue('internalid'));
            return true;
         });
         log.debug({
            title: 'getEmployee',
            details: 'empIds: ' + JSON.stringify(empIds)
        });
        return empIds;
    }
    return {afterSubmit: afterSubmit};
});