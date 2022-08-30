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
            var itemReceiptRec = context.newRecord;
            // var itemReceiptId = context.newRecord.id;
            var irParent = itemReceiptRec.getValue({
                fieldId: 'createdfrom'
            });
            log.debug({
                title: 'created from:',
                details: irParent
            });
            var parentLookup = search.lookupFields({
                type: search.Type.TRANSACTION,
                id: irParent,
                columns: ['type']
            });
            var parentType = parentLookup.type[0].value;
            log.debug({
                title: 'created from type:',
                details: parentType
            });
            if (parentType == 'PurchOrd') {   //must be IR on a PO
                var receiptDate = itemReceiptRec.getValue({
                    fieldId: 'trandate'
                });
                log.debug({
                    title: 'receiptDate: ',
                    details: receiptDate
                });
                var itemsArr = [];
                var numLines = itemReceiptRec.getLineCount({
                    sublistId: 'item'
                });
                log.debug({
                    title: 'receipt numLines: ',
                    details: numLines
                });
                for (var i = 0; i < numLines; i++) {
                    var receiveItem = itemReceiptRec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemreceive',
                        line: i
                    });
                    log.debug({
                        title: 'receiveItem: ',
                        details: receiveItem
                    });
                    if (receiveItem) {
                        var lineItem = itemReceiptRec.getSublistValue({
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
                        if (itemType == 'InvtPart') {
                            var itemRecType = record.Type.INVENTORY_ITEM;
                            itemsArr.push({
                                item: lineItem,
                                type: itemRecType
                            });
                        }
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
                                custitem76: receiptDate
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
    }
    return {afterSubmit: afterSubmit};
});