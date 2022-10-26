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
                var values = {};
                log.debug({
                    title: 'afterSubmit',
                    details: 'rec: ' + JSON.stringify(rec)
                });
                var rfSmartUser = rec.getValue({
                    fieldId: 'custrecord_rfs_external_user'
                });
                log.debug({
                    title: 'afterSubmit',
                    details: 'rfSmartUser: ' + rfSmartUser
                });
                var createdFrom = rec.getValue({
                    fieldId: 'custrecord_transaction'
                });
                log.debug({
                    title: 'afterSubmit',
                    details: 'createdFrom: ' + createdFrom
                });
                var empResults = getEmployee(rfSmartUser);
                var transactionLookup = search.lookupFields({
                    type: search.Type.ITEM_RECEIPT,
                    id: createdFrom,
                    columns: ['location','class','custbody102']
                });
                log.debug({
                    title: 'afterSubmit',
                    details: 'transactionLookup: ' + JSON.stringify(transactionLookup)
                });
                if (transactionLookup.custbody102[0]) {
                    var receivedBy = transactionLookup.custbody102[0].value;
                } else {
                    var receivedBy = '';
                }
                if (empResults.length > 0 && (receivedBy && receivedBy == '')) {
                    var empId = empResults[0];
                    values.custbody102 = empId;
                }
                var location = transactionLookup.location[0].value;
                log.debug({
                    title: 'afterSubmit',
                    details: 'location: ' + location
                });
                if (location && location != '') {
                    var locationLookup = search.lookupFields({
                        type: search.Type.LOCATION,
                        id: location,
                        columns: ['custrecord154']
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'locationLookup: ' + JSON.stringify(locationLookup)
                    });
                    if (locationLookup.custrecord154[0]) {
                        var locationClass = locationLookup.custrecord154[0].value;
                    } else {
                        var locationClass = '';
                    }
                    if (transactionLookup.class[0]) {
                        var irClass = transactionLookup.class[0].value;
                    } else {
                        var irClass = '';
                    }
                    if (irClass && irClass == '') {
                        values.class = locationClass;
                    }
                }
                log.debug({
                    title: 'afterSubmit',
                    details: 'values: ' + JSON.stringify(values)
                });
                record.submitFields({
                    type: record.Type.ITEM_RECEIPT,
                    id: createdFrom,
                    values: values
                });
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