/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define([
    'N/record', 'N/search', 'N/log',
], function (record, search, log) {

    function afterSubmit(context) {

        if (context.type != context.UserEventType.CREATE) {
            return;
        } else {
            var rec = context.newRecord;
            // var itemReceiptId = context.newRecord.id;

            var date = rec.getValue({
                fieldId: 'trandate'
            });
            log.debug({
                title: 'date: ',
                details: date
            });
            var cust = rec.getValue({
                fieldId: 'entity'
            });
            log.debug({
                title: 'cust: ',
                details: cust
            });
            var itemsArr = [];
            var numLines = rec.getLineCount({
                sublistId: 'item'
            });
            log.debug({
                title: 'numLines: ',
                details: numLines
            });
            for (var i = 0; i < numLines; i++) {
                var lineItem = rec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: i
                });
                var itemLookup = search.lookupFields({
                    type: search.Type.ITEM,
                    id: lineItem,
                    columns: ['type']
                });
                var itemType = itemLookup.type[0].value;
                var recordType = null;
                switch (itemType) {   // Compare item type to its record type counterpart
                    case 'InvtPart':
                    recordType = record.Type.INVENTORY_ITEM;
                    break;
                    case 'NonInvtPart':
                        recordType = record.Type.NON_INVENTORY_ITEM;
                        break;
                    case 'Service':
                        recordType = record.Type.SERVICE_ITEM;
                        break;
                    case 'Assembly':
                        recordType = record.Type.ASSEMBLY_ITEM;
                        break;                 
                    case 'Kit':
                        recordType = record.Type.KIT_ITEM; //Kit/Package	
                        break;
                    case 'Group':
                        recordType = record.Type.ITEM_GROUP; //Item Group
                        break;
                    default:
               }
               if (recordType != null && recordType != undefined && recordType != '') {
                itemsArr.push({
                    item: lineItem,
                    type: recordType
                });
               }
            }
            log.debug({
                title: 'itemsArr: ',
                details: JSON.stringify(itemsArr)
            });
            for (var i = 0; i < itemsArr.length; i++) {
                try {
                    record.submitFields({
                        type: itemsArr[i].type,
                        id: itemsArr[i].item,
                        values: {
                            custitem113: date,
                            custitem114: cust
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields : true
                        }
                    });
                    log.debug({
                        title: 'updated item: ',
                        details: itemsArr[i]
                    });
                } catch (e) {
                    log.debug({
                        title: 'failed updating item: ',
                        details: itemsArr[i] + ' | details: ' + e
                    });
                }
            }
        }
    }
    return {afterSubmit: afterSubmit};
});