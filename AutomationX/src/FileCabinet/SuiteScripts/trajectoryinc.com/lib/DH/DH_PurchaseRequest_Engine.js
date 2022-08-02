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
            options.purchaseRequests.forEach(function (purchaseRequest) {
                var createPurchaseRequestResponse = exports.createPurchaseRequest({
                    employeeId: options.employeeId,
                    purchaseRequest: purchaseRequest
                });
                if (createPurchaseRequestResponse.purchaseRequest && createPurchaseRequestResponse.purchaseRequest.fromSalesOrderProcess) {
                    processablePurchaseRequests.push(createPurchaseRequestResponse.purchaseRequest);
                }
                if (createPurchaseRequestResponse.salesOrderLineInfo) {
                    salesOrderId = purchaseRequest.salesOrderId;
                    salesOrderLineInfos.push(createPurchaseRequestResponse.salesOrderLineInfo);
                }
            });
            if (salesOrderId > 0 && salesOrderLineInfos.length > 0) {
                DH_Library_1.updateSalesOrder({
                    id: salesOrderId,
                    salesOrderLineInfos: salesOrderLineInfos
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
            options.purchaseRequest.internalId = "" + purchaseRequestItemDetail.Id;
            createPurchaseRequestResponse.purchaseRequest = options.purchaseRequest;
            createPurchaseRequestResponse.salesOrderLineInfo = {
                lineId: options.purchaseRequest.salesOrderLine,
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
                                        id: +purchaseRequest.internalId,
                                        itemId: purchaseRequest.itemId,
                                        quantity: purchaseRequest.quantity
                                    };
                                    if (purchaseRequest.salesOrderId && +purchaseRequest.salesOrderId > 0) {
                                        purchaseRequestInfo.salesOrderId = +purchaseRequest.salesOrderId;
                                    }
                                    if (purchaseRequest.salesOrderLine && +purchaseRequest.salesOrderLine >= 0) { // Be careful, Sales Order index could be zero
                                        purchaseRequestInfo.salesOrderLineId = +purchaseRequest.salesOrderLine;
                                    }
                                    if (purchaseRequest.description) {
                                        purchaseRequestInfo.description = purchaseRequest.description;
                                    }
                                    if (purchaseRequest.vendorNotes) {
                                        purchaseRequestInfo.vendorNotes = purchaseRequest.vendorNotes;
                                    }
                                    purchaseRequestInfos.push(purchaseRequestInfo);
                                    if (lineNotes.indexOf("Purchasing Request #" + purchaseRequest.internalId) === -1) {
                                        if (purchaseRequest.purchasingNotes && purchaseRequest.purchasingNotes.length > 0) {
                                            lineNotes.push("Purchasing Request #" + purchaseRequest.internalId + ": " + purchaseRequest.purchasingNotes);
                                        }
                                        else {
                                            lineNotes.push("Purchasing Request #" + purchaseRequest.internalId);
                                        }
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
                    line.purchaseRequestInfos.forEach(function (purchaseRequestInfo) {
                        linkRelatedTransaction(purchaseRequestInfo, transactionId, options.transaction.type, line.notes);
                    });
                    // Group by SalesOrder
                    // @ts-ignore
                    var salesOrderGroups = _.groupBy(line.purchaseRequestInfos, function (purchaseRequestInfo) {
                        return +purchaseRequestInfo.salesOrderId;
                    });
                    _.each(salesOrderGroups, function (purchaseRequestInfos) {
                        if (purchaseRequestInfos[0].salesOrderId > 0) {
                            var salesOrderLineInfo_1 = [];
                            purchaseRequestInfos.forEach(function (purchaseRequestInfo) {
                                if (purchaseRequestInfo.salesOrderLineId && +purchaseRequestInfo.salesOrderLineId >= 0) { // Be careful, Sales Order Line could be zero
                                    salesOrderLineInfo_1.push({
                                        lineId: +purchaseRequestInfo.salesOrderLineId,
                                        purchaseRequestId: purchaseRequestInfo.id,
                                        relatedTransactionId: transactionId
                                    });
                                }
                            });
                            DH_Library_1.updateSalesOrder({
                                id: purchaseRequestInfos[0].salesOrderId,
                                salesOrderLineInfos: salesOrderLineInfo_1
                            });
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
                    updatePurchaseRequest({
                        purchaseRequestInfo: purchaseRequestInfo,
                        purchaseRequestProcessingStatus: PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.Reject,
                        lineNotes: line.notes
                    });
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
            switch (options.poType) {
                case PurchaseRequestItemDetail_1.CreateType.ExpeditePO:
                    purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsExpedite, value: true });
                    purchaseOrder.setValue({ fieldId: 'shipmethod', value: DH_Library_1.SHIPMETHOD.UPSNEXTDAY });
                    break;
                case PurchaseRequestItemDetail_1.CreateType.DropShipPO:
                    purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsDropShip, value: true });
                    break;
                case PurchaseRequestItemDetail_1.CreateType.WillCallPO:
                    purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.isWillCall, value: true });
                    break;
                default:
                    purchaseOrder.setValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.IsReStockPO, value: true });
                    break;
            }
            options.lines.forEach(function (line, index) {
                lineDescriptions = [];
                lineVendorNotes = [];
                if (lineNotes.indexOf(line.notes) === -1) {
                    lineNotes.push(line.notes);
                }
                var salesOrders = [];
                var salesOrderIds = [];
                line.purchaseRequestInfos.forEach(function (purchaseRequestInfo) {
                    if (purchaseRequestInfo.salesOrderId && purchaseRequestInfo.salesOrderId > 0) {
                        var poSoLinkage = {
                            purchaseOrderLineId: index,
                            salesOrderId: purchaseRequestInfo.salesOrderId,
                            itemId: purchaseRequestInfo.itemId,
                            quantity: purchaseRequestInfo.quantity
                        };
                        if (purchaseRequestInfo.salesOrderLineId && purchaseRequestInfo.salesOrderLineId > 0) {
                            poSoLinkage.salesOrderLineId = purchaseRequestInfo.salesOrderLineId;
                        }
                        poSOLinkages.push(poSoLinkage);
                        // Get the tranid of the Sales Order
                        var details = search.lookupFields({
                            type: search.Type.SALES_ORDER,
                            id: purchaseRequestInfo.salesOrderId,
                            columns: ['tranid']
                        });
                        if (salesOrders.indexOf(details.tranid) === -1) {
                            salesOrders.push(details.tranid); // remove duplicates
                        }
                        salesOrderIds.push(purchaseRequestInfo.salesOrderId);
                    }
                    if (purchaseRequestInfo.description) {
                        lineDescriptions.push(purchaseRequestInfo.description);
                    }
                    if (purchaseRequestInfo.vendorNotes) {
                        lineVendorNotes.push(purchaseRequestInfo.vendorNotes);
                    }
                });
                // In the case of a dropship, I need to pull the ShipTo from the Sales Order forward to the DropShip PO ShipTo
                if (options.poType === PurchaseRequestItemDetail_1.CreateType.DropShipPO && salesOrderIds.length > 0) {
                    var salesOrder = record.load({ type: record.Type.SALES_ORDER, id: salesOrderIds[0] });
                    purchaseOrder.setValue({ fieldId: 'shipaddress', value: salesOrder.getValue({ fieldId: 'shipaddress' }) });
                }
                purchaseOrder.selectNewLine({ sublistId: 'item' });
                purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: line.itemId });
                purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: line.quantity });
                purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'location', value: line.locationId });
                if (line.rate != '' && line.rate!= null && line.rate != undefined) {
                    purchaseOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: line.rate });
                }
                // Allow the 'rate' to be overrideen by the incoming estimated cost 'rate' field
                if (line.isCustomPrice) {
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
                transferOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: line.rate });
                transferOrder.commitLine({ sublistId: 'item' });
            });
            return transferOrder.save();
        };
        var linkRelatedTransaction = function (purchaseRequestInfo, transactionId, purchaseRequestProcessingStatus, lineNotes) {
            updatePurchaseRequest({
                purchaseRequestInfo: purchaseRequestInfo,
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
                id: options.purchaseRequestInfo.id,
                values: updateValues
            });
        };
    });
