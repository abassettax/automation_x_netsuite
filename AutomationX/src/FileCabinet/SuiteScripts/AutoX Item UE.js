/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define([
    'N/email', 'N/runtime', 'N/record', 'N/log', 'N/url'
], function (email, runtime, record, log, url) {

    function afterSubmit(context) {
        log.debug({
            title: 'afterSubmit',
            details: 'context.type: ' + context.type
        });
        log.debug({
            title: 'afterSubmit',
            details: 'runtime.executionContext: ' + runtime.executionContext
        });
        var itemRec = context.newRecord;
        var itemType = itemRec.type;
        log.debug({
            title: 'afterSubmit',
            details: 'itemType: ' + itemType
        });
        //check record type, only run for inv part items
        if (runtime.executionContext !== runtime.ContextType.MAP_REDUCE && itemType == 'inventoryitem') {
            if (context.type === context.UserEventType.DELETE || context.type === context.UserEventType.CREATE ) {
                return;
            } else {
                try {
                    var changeThreshold = .07;
                    var oldItemRec = context.oldRecord;
                    var oldPurchasePrice = oldItemRec.getValue({
                        fieldId: 'cost'
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'oldPurchasePrice: ' + oldPurchasePrice
                    });
                    //get vendor sublist prices - itemvendor | vendor | purchaseprice
                    var oldVendorLines = oldItemRec.getLineCount({
                        sublistId: 'itemvendor'
                    });
                    var oldVendorData = [];
                    for (var i = 0; i < oldVendorLines; i++) {
                        var vendor = oldItemRec.getSublistValue({
                            sublistId: 'itemvendor',
                            fieldId: 'vendor',
                            line: i
                        });
                        var vendorName = oldItemRec.getSublistText({
                            sublistId: 'itemvendor',
                            fieldId: 'vendor',
                            line: i
                        });
                        var price = oldItemRec.getSublistValue({
                            sublistId: 'itemvendor',
                            fieldId: 'purchaseprice',
                            line: i
                        });
                        oldVendorData.push({
                            vendor: vendor,
                            vendorname: vendorName,
                            price: price
                        });
                    }
                    log.debug({
                        title: 'afterSubmit',
                        details: 'oldVendorData: ' + JSON.stringify(oldVendorData)
                    });

                    var ax5Code = itemRec.getValue({
                        fieldId: 'custitem35'
                    });
                    var itemName = itemRec.getValue({
                        fieldId: 'itemid'
                    });
                    var purchasePrice = itemRec.getValue({
                        fieldId: 'cost'
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'purchasePrice: ' + purchasePrice
                    });
                    //get vendor sublist prices - itemvendor | purchaseprice
                    var vendorLines = itemRec.getLineCount({
                        sublistId: 'itemvendor'
                    });
                    var vendorData = [];
                    for (var i = 0; i < vendorLines; i++) {
                        var vendor = itemRec.getSublistValue({
                            sublistId: 'itemvendor',
                            fieldId: 'vendor',
                            line: i
                        });
                        var vendorName = itemRec.getSublistText({
                            sublistId: 'itemvendor',
                            fieldId: 'vendor',
                            line: i
                        });
                        var price = itemRec.getSublistValue({
                            sublistId: 'itemvendor',
                            fieldId: 'purchaseprice',
                            line: i
                        });
                        vendorData.push({
                            vendor: vendor,
                            vendorname: vendorName,
                            price: price
                        });
                    }
                    log.debug({
                        title: 'afterSubmit',
                        details: 'vendorData: ' + JSON.stringify(vendorData)
                    });

                    //need to check diffs. check for null vals before calculating price percent changes. ignore any that are null in oldRec state.
                    //catalog which prices are off. main, or specific vendor line keyed by vendor id. use in email body.

                    var mainOldPriceCheck = (oldPurchasePrice == null || oldPurchasePrice == '' || oldPurchasePrice == 0);
                    var priceChangeCheck = false;
                    var failNotes = '';
                    if (!mainOldPriceCheck) {
                        var mainDiff = purchasePrice - oldPurchasePrice;
                        var mainPercentChange = mainDiff/oldPurchasePrice;
                        log.debug({
                            title: 'afterSubmit',
                            details: 'mainPercentChange: ' + mainPercentChange
                        });
                        if (mainPercentChange > changeThreshold) {
                            priceChangeCheck = true;
                            failNotes += 'Main Purchase Price | Old Price: $' + oldPurchasePrice + ' | New Price: $' + purchasePrice + ' | Change: ' + (mainPercentChange*100).toFixed(2) + '%';
                        }
                    }
                    
                    for (var i = 0; i < vendorData.length; i++) {
                        var vendor = vendorData[i].vendor;
                        var vendorName = vendorData[i].vendorname;
                        var price = vendorData[i].price;
                        var oldIndex = findWithAttr(oldVendorData, 'vendor', vendor);
                        if (oldIndex != -1) {
                            var oldPrice = oldVendorData[oldIndex].price;
                            var lineOldPriceCheck = (oldPrice == null || oldPrice == '' || oldPrice == 0);
                            if (!lineOldPriceCheck) {
                                var diff = price - oldPrice;
                                var linePercentChange = diff/oldPrice;
                                log.debug({
                                    title: 'afterSubmit',
                                    details: 'linePercentChange: ' + linePercentChange
                                });
                                if (linePercentChange > changeThreshold) {
                                    priceChangeCheck = true;
                                    if (failNotes == '') {
                                        failNotes += 'Vendor Purchase Price - ' + vendorName + ' | Old Price: $' + oldPrice + ' | New Price: $' + price + ' | Change: ' + (linePercentChange*100).toFixed(2) + '%';
                                    } else {
                                        failNotes += '<br>Vendor Purchase Price - ' + vendorName + ' | Old Price: $' + oldPrice + ' | New Price: $' + price + ' | Change: ' + (linePercentChange*100).toFixed(2) + '%';
                                    }
                                }
                            }
                        }
                    }
                    log.debug({
                        title: 'afterSubmit',
                        details: 'priceChangeCheck: ' + priceChangeCheck
                    });
                    log.debug({
                        title: 'afterSubmit',
                        details: 'failNotes' + failNotes
                    });
                    if (priceChangeCheck) {
                        log.debug({
                            title: 'afterSubmit',
                            details: 'Sending Price Diff > 7% Email'
                        });
                        var recordid = context.newRecord.id;
                        var emailBody = 'An item has had a recent price change of > 7%, please review.<br><br>Item: '+ax5Code+' | '+itemName+'<br>Link: ';
                        var baseUrl = url.resolveDomain({
                            hostType: url.HostType.APPLICATION,
                            accountId: '422523'
                        });
                        var itemUrl = url.resolveRecord({
                            recordType: record.Type.INVENTORY_ITEM,
                            recordId: recordid
                        });
                        emailBody += baseUrl + itemUrl
                        emailBody += '<br><br>' + failNotes                
                        email.send({
                            author: '48249',
                            recipients: ['joseph.fletcher@automation-x.com'],
                            subject: 'Item Price Change > 7%',
                            body: emailBody,
                        });
                        log.debug({
                            title: 'afterSubmit',
                            details: 'Price Diff > 7% Email Sent'
                        });
                    }
                } catch (e) {
                    log.error('AX Item UE error: ', e);
                }
            }
        }
    }
    function findWithAttr(array, attr, value) {
        for(var i = 0; i < array.length; i += 1) {
            if(array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    return {
        afterSubmit: afterSubmit
    };
});