define(["require", "exports", "./DH_Library", "./PurchaseRequestItemDetail", "N/log", "./lodash", "N/record", "N/search"],
    function (require, exports, DH_Library_1, PurchaseRequestItemDetail_1, log, _, record, search) {
        Object.defineProperty(exports, "__esModule", { value: true });
        var TO_ORDER_STATUS;
        (function (TO_ORDER_STATUS) {
            TO_ORDER_STATUS["PendingFulfillment"] = "B";
        })(TO_ORDER_STATUS || (TO_ORDER_STATUS = {}));
        var APPROVAL_STATUS;
        (function (APPROVAL_STATUS) {
            APPROVAL_STATUS[APPROVAL_STATUS["PendingApproval"] = 2] = "PendingApproval";
        })(APPROVAL_STATUS || (APPROVAL_STATUS = {}));
        var ORDER_STATUS = {
            TRANSFER_ORDER: TO_ORDER_STATUS
        };
        exports.createPurchaseRequests = function (options) {
            var processablePurchaseRequests = [];
            // Create the Purchase Request
            if (options.employeeId === DH_Library_1.VENDOR.DARREN_HILL) {
                options.employeeId = DH_Library_1.EMPLOYEE.MIKE_HARRIS;
            }
            var salesOrderLineInfos = [];
            var salesOrderId = -1;
            var workOrderLineInfos = [];
            var workOrderId = -1;
            options.purchaseRequests.forEach(function (purchaseRequest) {
                var createPurchaseRequestResponse = exports.createPurchaseRequest({
                    employeeId: options.employeeId,
                    purchaseRequest: purchaseRequest
                });
                log.debug('getInputData - createPurchaseRequestResponse', JSON.stringify(createPurchaseRequestResponse));
                if (createPurchaseRequestResponse.purchaseRequest && createPurchaseRequestResponse.purchaseRequest.fromSalesOrderProcess) {
                    processablePurchaseRequests.push(createPurchaseRequestResponse.purchaseRequest);
                }
                if (createPurchaseRequestResponse.salesOrderLineInfo) {
                    salesOrderId = purchaseRequest.salesOrderId[0].id;
                    salesOrderLineInfos.push(createPurchaseRequestResponse.salesOrderLineInfo);
                }
                if (createPurchaseRequestResponse.workOrderLineInfo) {
                    workOrderId = purchaseRequest.workOrderId;[0].id;
                    workOrderLineInfos.push(createPurchaseRequestResponse.workOrderLineInfo);
                }
            });
            log.debug('getInputData - salesOrderId', salesOrderId + ' | ' + JSON.stringify(salesOrderLineInfos));
            if (salesOrderId > 0 && salesOrderLineInfos.length > 0) {
                DH_Library_1.updateSalesOrder({
                    id: salesOrderId,
                    salesOrderLineInfos: salesOrderLineInfos
                });
            }
            log.debug('getInputData - workOrderId', workOrderId + ' | ' + JSON.stringify(workOrderLineInfos));
            if (workOrderId > 0 && workOrderLineInfos.length > 0) {
                DH_Library_1.updateWorkOrder({
                    id: workOrderId,
                    workOrderLineInfos: workOrderLineInfos
                });
            }
            return processablePurchaseRequests;
        };
        // Only return the PurchaseRequest when it comes from the Sales Order Process
        exports.createPurchaseRequest = function (options) {
            var createPurchaseRequestResponse = {};
            // Create the Purchase Request
            if (options.employeeId === DH_Library_1.VENDOR.DARREN_HILL) {
                options.employeeId = DH_Library_1.EMPLOYEE.MIKE_HARRIS;
            }
            var purchaseRequestItemDetail = new PurchaseRequestItemDetail_1.PurchaseRequestItemDetail({ owner: options.employeeId, details: options.purchaseRequest });
            options.purchaseRequest.internalId = [purchaseRequestItemDetail.Id];
            createPurchaseRequestResponse.purchaseRequest = options.purchaseRequest;
            createPurchaseRequestResponse.salesOrderLineInfo = {
                lineId: options.purchaseRequest.salesOrderLine,
                purchaseRequestId: purchaseRequestItemDetail.Id
            };
            createPurchaseRequestResponse.workOrderLineInfo = {
                lineId: options.purchaseRequest.workOrderLine,
                purchaseRequestId: purchaseRequestItemDetail.Id
            };
            return createPurchaseRequestResponse;
        };
        // noinspection JSUnusedGlobalSymbols
        exports.determineTransactions = function (options) {
            if (options.employeeId === DH_Library_1.VENDOR.DARREN_HILL) {
                options.employeeId = DH_Library_1.EMPLOYEE.MIKE_HARRIS;
            }
            var transactions = [];
            log.debug('getInputData - purchaseRequests', options.purchaseRequests);
            // Group by PO Type
            // @ts-ignore
            var poTypeGroups = _.groupBy(options.purchaseRequests, function (purchaseRequest) {
                return +purchaseRequest.purchaseOrderType;
            });
            _.each(poTypeGroups, function (poTypeGroup) {
                // Group by Vendor
                // @ts-ignore
                var vendorGroups = _.groupBy(poTypeGroup, function (purchaseRequest) {
                    return +purchaseRequest.vendorId;
                });
                _.each(vendorGroups, function (vendorGroup) {
                    // Group by Location
                    // @ts-ignore
                    var locationGroups = _.groupBy(vendorGroup, function (purchaseRequest) {
                        return +purchaseRequest.locationId;
                    });
                    _.each(locationGroups, function (locationGroup) {
                        var transaction;
                        switch ("" + locationGroup[0].processingStatus) {
                            case PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.PurchaseOrder:
                                transaction = {
                                    type: PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.PurchaseOrder,
                                    locationId: locationGroup[0].locationId,
                                    vendorId: locationGroup[0].vendorId,
                                    email: locationGroup[0].email,
                                    poType: locationGroup[0].purchaseOrderType
                                };
                                break;
                            case PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.TransferOrder:
                                transaction = {
                                    type: PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.TransferOrder,
                                    locationId: locationGroup[0].locationId,
                                    employeeId: options.employeeId,
                                    transferLocationId: locationGroup[0].fromLocationId
                                };
                                break;
                            case PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.Reject:
                                transaction = {
                                    type: PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.Reject,
                                };
                                break;
                        }
                        transaction.lines = [];
                        // Group by Item
                        // @ts-ignore
                        var itemGroups = _.groupBy(locationGroup, function (purchaseRequest) {
                            return +purchaseRequest.itemId;
                        });
                        _.each(itemGroups, function (itemGroup) {
                            // Group by Item Rate
                            // @ts-ignore
                            var rateGroups = _.groupBy(itemGroup, function (purchaseRequest) {
                                return +purchaseRequest.estimatedCost;
                            });
                            var i_rate = itemGroup[0].rate;

                            _.each(rateGroups, function (rateGroup) {
                                var purchaseRequestInfos = [], lineNotes = [];
                                rateGroup.forEach(function (purchaseRequest) {
                                    var purchaseRequestInfo = {
                                        id: purchaseRequest.internalId,
                                        itemId: purchaseRequest.itemId,
                                        quantity: purchaseRequest.quantity
                                    };
                                    if (purchaseRequest.salesOrderId && purchaseRequest.salesOrderId.length > 0) {
                                        purchaseRequestInfo.salesOrderId = purchaseRequest.salesOrderId;
                                    }
                                    // if (purchaseRequest.salesOrderLine && +purchaseRequest.salesOrderLine >= 0) { // Be careful, Sales Order index could be zero
                                    //     purchaseRequestInfo.salesOrderLineId = +purchaseRequest.salesOrderLine;
                                    // }
                                    if (purchaseRequest.description) {
                                        purchaseRequestInfo.description = purchaseRequest.description;
                                    }
                                    if (purchaseRequest.vendorNotes) {
                                        purchaseRequestInfo.vendorNotes = purchaseRequest.vendorNotes;
                                    }
                                    purchaseRequestInfos.push(purchaseRequestInfo);
                                    if (lineNotes.indexOf("Purchasing Request #" + purchaseRequest.internalId) === -1) {
                                        // if (purchaseRequest.purchasingNotes && purchaseRequest.purchasingNotes.length > 0) {
                                            lineNotes.push("Purchasing Request #" + purchaseRequest.internalId + "\nPurch Notes: " + purchaseRequest.purchasingNotes + "\nSales Notes: " + purchaseRequest.salesNotes);
                                        // }
                                        // else {
                                        //     lineNotes.push("Purchasing Request #" + purchaseRequest.internalId);
                                        // }
                                    }
                                });
                                var quantity = _.sumBy(rateGroup, function (purchaseRequest) {
                                    return +purchaseRequest.quantity;
                                });
                                transaction.lines.push({
                                    itemId: rateGroup[0].itemId,
                                    quantity: quantity,
                                    estimatedCost: rateGroup[0].estimatedCost,
                                    rate: i_rate,
                                    locationId: rateGroup[0].locationId,
                                    notes: lineNotes.join('\n'),
                                    isCustomPrice: rateGroup[0].isCustomPrice,
                                    purchaseRequestInfos: purchaseRequestInfos
                                });
                            });
                        });
                        transactions.push(transaction);
                    });
                });
            });
            return transactions;
        };
        exports.createTransaction = function (options) {
            log.debug('getInputData - createTransaction', JSON.stringify(options));
            var transactionId = -1;
            if (options.transaction.type !== PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.Reject) {
                switch (options.transaction.type) {
                    case PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.PurchaseOrder:
                        transactionId = createPurchaseOrder(options.transaction);
                        break;
                    case PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.TransferOrder:
                        transactionId = createTranserOrder(options.transaction);
                        break;
                }
                options.transaction.lines.forEach(function (line) {
                    var soDataArr = [];
                    line.purchaseRequestInfos.forEach(function (purchaseRequestInfo) {
                        var prArr = purchaseRequestInfo.id;
                        for (var i = 0; i < prArr.length; i++) {
                            linkRelatedTransaction(prArr[i], transactionId, options.transaction.type, line.notes);
                        }
                        //reformatting sales data into raw array so it can be grouped prior to updating
                        var soArr = purchaseRequestInfo.salesOrderId;
                        for (var i = 0; i < soArr.length; i++) {
                            var soId = soArr[i].id;
                            var soLine = soArr[i].line;
                            var tranType = soArr[i].type;
                            soDataArr.push({
                                id: soId,
                                line: soLine,
                                type: tranType
                            });
                        }
                    });
                    // Group by SalesOrder
                    // @ts-ignore
                    var salesOrderGroups = _.groupBy(soDataArr, function (soData) {
                        return +soData.id;
                    });
                    _.each(salesOrderGroups, function (soData) {
                        if (soData[0].id > 0) {
                            var salesOrderLineInfo_1 = [];
                            soData.forEach(function (soData2) {
                                if (soData2.line && +soData2.line >= 0) { // Be careful, Sales Order Line could be zero
                                    salesOrderLineInfo_1.push({
                                        lineId: +soData2.line,
                                        // purchaseRequestId: purchaseRequestInfo.id,   //this is needed for replacing the placeholder 1000 pr record
                                        relatedTransactionId: transactionId
                                    });
                                }
                            });
                            if (soData[0].type == 'salesorder') {
                                DH_Library_1.updateSalesOrder({
                                    id: soData[0].id,
                                    salesOrderLineInfos: salesOrderLineInfo_1
                                });
                            } else {
                                DH_Library_1.updateWorkOrder({
                                    id: soData[0].id,
                                    workOrderLineInfos: salesOrderLineInfo_1
                                });
                            }
                        }
                    });
                });
            }
            else {
                rejectPurchaseRequest(options.transaction);
            }
            return transactionId;
        };
        var rejectPurchaseRequest = function (options) {
            options.lines.forEach(function (line) {
                line.purchaseRequestInfos.forEach(function (purchaseRequestInfo) {
                    var prArr = purchaseRequestInfo.id;
                    for (var i = 0; i < prArr.length; i++) {
                        updatePurchaseRequest({
                            prId: prArr[i],
                            purchaseRequestInfo: purchaseRequestInfo,
                            purchaseRequestProcessingStatus: PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.Reject,
                            lineNotes: line.notes
                        });
                    }
                    
                });
            });
        };
        var createPurchaseOrder = function (options) {
            var purchaseOrderId, poSOLinkages = [], lineNotes = [], lineDescriptions, lineVendorNotes, purchaseOrder = record.transform({
                fromType: record.Type.VENDOR,
                fromId: options.vendorId,
                toType: record.Type.PURCHASE_ORDER,
                isDynamic: true
            });
            
            log.debug('createPurchaseOrder - options', options);
            purchaseOrder.setValue({ fieldId: 'location', value: options.locationId });
            purchaseOrder.setValue({ fieldId: 'trandate', value: new Date() });
            purchaseOrder.setValue({ fieldId: 'approvalstatus', value: APPROVAL_STATUS.PendingApproval });
            purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.POFollowUpEmail, value: options.email });
            // switch (options.poType) {
            //     case PurchaseRequestItemDetail_1.CreateType.ExpeditePO:   //new prType list, Expedite
            //         purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsExpedite, value: true });
            //         purchaseOrder.setValue({ fieldId: 'shipmethod', value: DH_Library_1.SHIPMETHOD.UPSNEXTDAY });
            //         break;
            //     case PurchaseRequestItemDetail_1.CreateType.ExpeditePO:   //new prType list, Drop Ship
            //         purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsDropShip, value: true });
            //         break;
            //     case PurchaseRequestItemDetail_1.CreateType.ExpeditePO:   //new prType list, Will Call
            //         purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.isWillCall, value: true });
            //         break;
            //     default:
            //         purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsReStockPO, value: true });
            //         break;
            // }
            if (options.poType == '2') {
                purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsExpedite, value: true });
                purchaseOrder.setValue({ fieldId: 'shipmethod', value: DH_Library_1.SHIPMETHOD.UPSNEXTDAY });
            } else if (options.poType == '3') {
                purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsDropShip, value: true });
            } else if (options.poType == '4') {
                purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.isWillCall, value: true });
            } else if (options.poType == '5') {
                purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsExpedite, value: true });
                purchaseOrder.setValue({ fieldId: 'shipmethod', value: DH_Library_1.SHIPMETHOD.UPSNEXTDAY });
                purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsDropShip, value: true });
            } else {
                purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsReStockPO, value: true });
            }
            var salesOrderIds = [];
            options.lines.forEach(function (line, index) {
                lineDescriptions = [];
                lineVendorNotes = [];
                if (lineNotes.indexOf(line.notes) === -1) {
                    lineNotes.push(line.notes);
                }
                var salesOrders = [];
                line.purchaseRequestInfos.forEach(function (purchaseRequestInfo) {
                    var soArr = purchaseRequestInfo.salesOrderId;
                    for (var i = 0; i < soArr.length; i++) {
                        var soId = soArr[i].id;
                        var soLine = soArr[i].line;
                        if (soId && soId > 0) {
                            var poSoLinkage = {
                                purchaseOrderLineId: index,
                                salesOrderId: soId,
                                itemId: purchaseRequestInfo.itemId,
                                quantity: purchaseRequestInfo.quantity
                            };
                            if (soLine && soLine > 0) {
                                poSoLinkage.salesOrderLineId = soLine;
                            }
                            poSOLinkages.push(poSoLinkage);
                            // Get the tranid of the Sales Order
                            var details = search.lookupFields({
                                type: search.Type.SALES_ORDER,
                                id: soId,
                                columns: ['tranid']
                            });
                            if (salesOrders.indexOf(details.tranid) === -1) {
                                salesOrders.push(details.tranid); // remove duplicates
                            }
                            if (salesOrderIds.indexOf(soId) == -1) {
                                salesOrderIds.push(soId);
                            }
                        }
                    }
                    if (purchaseRequestInfo.description) {
                        lineDescriptions.push(purchaseRequestInfo.description);
                    }
                    if (purchaseRequestInfo.vendorNotes) {
                        lineVendorNotes.push(purchaseRequestInfo.vendorNotes);
                    }
                });
                purchaseOrder.selectNewLine({ sublistId: 'item' });
                purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: line.itemId });
                purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: line.quantity });
                purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: line.locationId });
                //this sets the rate. skip except for direct codes so items default to their system defined pricing always
                var itemLookup = search.lookupFields({
                    type: search.Type.ITEM,
                    id: line.itemId,
                    columns: ['type']
                });
                var itemType = itemLookup.type[0].value;
                if (line.rate != '' && line.rate!= null && line.rate != undefined && itemType == 'NonInvtPart') {
                    purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: line.rate });
                }
                // Allow the 'rate' to be overrideen by the incoming estimated cost 'rate' field
                if (line.isCustomPrice && itemType == 'NonInvtPart') {
                    purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: line.estimatedCost });
                }
                purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: DH_Library_1.FIELDS.TRANSACTION.COLUMN.SalesOrder, value: salesOrders.join(',') });
                if (lineDescriptions.length > 0) {
                    purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'description', value: lineDescriptions.join('\n') });
                }
                purchaseOrder.commitLine({ sublistId: 'item' });
                // Add any vendor Notes
                if (lineVendorNotes.length > 0) {
                    purchaseOrder.selectNewLine({ sublistId: 'item' });
                    purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: DH_Library_1.ITEM.AXBLANKLINE });
                    purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: line.locationId });
                    purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'description', value: lineVendorNotes.join('\n') });
                    purchaseOrder.commitLine({ sublistId: 'item' });
                }
            });
            log.debug('createPurchaseOrder - salesOrderIds', JSON.stringify(salesOrderIds));
            //set Related Transactions field
            purchaseOrder.setValue({ fieldId: 'custbody236', value: salesOrderIds });
            // In the case of a dropship, I need to pull the ShipTo from the Sales Order forward to the DropShip PO ShipTo
            if ((options.poType == '3' || options.poType == '5') && salesOrderIds.length > 0) {
                //alter structure to get id from first value in array. no consolidation, so is just an array with one json at pos 0, if consolidation, should be same cust/address so just get first id
                var salesOrder = record.load({ type: record.Type.SALES_ORDER, id: salesOrderIds[0] });
                purchaseOrder.setValue({ fieldId: 'shipaddress', value: salesOrder.getValue({ fieldId: 'shipaddress' }) });
            }
            if (lineNotes.length > 0) {
                purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.PurchasingNotes, value: lineNotes.join('\n') });
            }
            purchaseOrderId = +purchaseOrder.save();
            poSOLinkages.forEach(function (poSOLinkage) {
                poSOLinkage.purchaseOrderId = purchaseOrderId;
                createPOSOLinkage(poSOLinkage);
            });
            return purchaseOrderId;
        };
        var createPOSOLinkage = function (poSOLinkage) {
            try {
                var linkageRecord = record.create({
                    type: 'customrecord_dh_po_so_linkage',
                    isDynamic: true
                });
                linkageRecord.setValue({ fieldId: 'custrecord_po_so_linkage_po', value: poSOLinkage.purchaseOrderId });
                linkageRecord.setValue({ fieldId: 'custrecord_po_so_linkage_po_line', value: poSOLinkage.purchaseOrderLineId + 1 }); // Making this a non-Zero based index (for visual purposes)
                linkageRecord.setValue({ fieldId: 'custrecord_po_so_linkage_so', value: poSOLinkage.salesOrderId });
                if (poSOLinkage.salesOrderLineId && poSOLinkage.salesOrderLineId > 0) {
                    linkageRecord.setValue({ fieldId: 'custrecord_po_so_linkage_so_line', value: poSOLinkage.salesOrderLineId });
                }
                linkageRecord.setValue({ fieldId: 'custrecord_po_so_linkage_item', value: poSOLinkage.itemId });
                linkageRecord.setValue({ fieldId: 'custrecord_po_so_linkage_qty', value: poSOLinkage.quantity.toString() });
                return +linkageRecord.save();
            }
            catch (e) {
                log.error('Failed to create PO/SO Linkage', poSOLinkage);
            }
        };
        var createTranserOrder = function (options) {
            var transferOrder = record.create({
                type: record.Type.TRANSFER_ORDER,
                isDynamic: true
            });
            transferOrder.setValue({ fieldId: 'location', value: options.transferLocationId });
            transferOrder.setValue({ fieldId: 'transferlocation', value: options.locationId });
            transferOrder.setValue({ fieldId: 'employee', value: options.employeeId });
            transferOrder.setValue({ fieldId: 'orderstatus', value: ORDER_STATUS.TRANSFER_ORDER.PendingFulfillment });
            options.lines.forEach(function (line) {
                transferOrder.selectNewLine({ sublistId: 'item' });
                transferOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: line.itemId });
                transferOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: line.quantity });
                //TODO: default rate to last purchase price
                transferOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: line.rate });
                transferOrder.commitLine({ sublistId: 'item' });
            });
            var salesOrderIds = [];
            options.lines.forEach(function (line) {
                line.purchaseRequestInfos.forEach(function (purchaseRequestInfo) {
                    var soArr = purchaseRequestInfo.salesOrderId;
                    for (var i = 0; i < soArr.length; i++) {
                        var soId = soArr[i].id;
                        if (soId && soId > 0) {
                            if (salesOrderIds.indexOf(soId) == -1) {
                                salesOrderIds.push(soId);
                            }
                        }
                    }
                });
            });
            log.debug('createTranserOrder - salesOrderIds', JSON.stringify(salesOrderIds));
                //set Related Transactions field
                transferOrder.setValue({ fieldId: 'custbody236', value: salesOrderIds });
            return transferOrder.save();
        };
        var linkRelatedTransaction = function (prId, transactionId, purchaseRequestProcessingStatus, lineNotes) {
            updatePurchaseRequest({
                prId: prId,
                purchaseRequestProcessingStatus: purchaseRequestProcessingStatus,
                transactionId: transactionId,
                lineNotes: lineNotes
            });
        };
        var updatePurchaseRequest = function (options) {
            var updateValues = {};
            updateValues[PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.ProcessingStatus] = options.purchaseRequestProcessingStatus;
            if (options.transactionId && options.transactionId > 0) {
                updateValues[PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.RelatedTransaction] = options.transactionId;
            }
            if (options.lineNotes && options.lineNotes.length > 0) {
                updateValues[PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.FIELD.PurchaseNotes] = options.lineNotes;
            }
            record.submitFields({
                type: PurchaseRequestItemDetail_1.PurchaseRequestItemDetail.RECORD_TYPE,
                id: options.prId,
                values: updateValues
            });
        };
    });
