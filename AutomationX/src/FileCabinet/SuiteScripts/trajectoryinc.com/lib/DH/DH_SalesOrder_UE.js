/**
 * Module Description...
 *
 * @file TC_License_UE.js
 * @copyright 2018 Darren Hill Consulting Inc.
 * @author Darren Hill darren@darrenhillconsulting.ca
 *
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType UserEventScript
 */
define(["require", "exports", "./PurchaseRequestItemDetail", "./DH_Library", "N/task", "N/runtime", "N/log", "N/redirect", "./DH_PurchaseRequest_Engine"], function (require, exports, PurchaseRequestItemDetail_1, DH_Library_1, task, runtime, log, redirect, DH_PurchaseRequest_Engine_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var DUMMY_PR = 1000;
    // Carry forward the description field (as users may overwrite with vendor details), save it on the Item Description in the Purchase Request.  Use on the Purchase Order line (description)
    var isProcessable = function (context, lineIndex) {
        var itemType = context.newRecord.getSublistValue({ sublistId: 'item', fieldId: 'itemtype', line: lineIndex });
        var itemSubType = context.newRecord.getSublistValue({ sublistId: 'item', fieldId: 'itemsubtype', line: lineIndex });
        return itemType === 'InvtPart' || itemType === 'Service' && (itemSubType === 'Sale' || itemSubType === 'Resale');
    };
    exports.beforeSubmit = function (context) {
        if (runtime.executionContext !== runtime.ContextType.MAP_REDUCE) {
            for (var i = 0, lineCount = +context.newRecord.getLineCount({ sublistId: 'item' }); i < lineCount; i = i + 1) {
                var createType = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: DH_Library_1.FIELDS.TRANSACTION.COLUMN.CreateType });
                var relatedTransactionId = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: DH_Library_1.FIELDS.TRANSACTION.COLUMN.RelatedTransaction });
                var purchaseRequestId = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: DH_Library_1.FIELDS.TRANSACTION.COLUMN.PurchaseRequest });
                // Ensure both Related and PR's are blank
                if (isProcessable(context, i) && !(relatedTransactionId > 0) && !(purchaseRequestId > 0)) {
                    switch (createType) {
                        case PurchaseRequestItemDetail_1.CreateType.PurchaseOrder:
                        case PurchaseRequestItemDetail_1.CreateType.ExpeditePO:
                        case PurchaseRequestItemDetail_1.CreateType.DropShipPO:
                        case PurchaseRequestItemDetail_1.CreateType.WillCallPO:
                            // Move this to a BeforeSubmit and populate the 'Purchase Request' column with a dummy value (1000) on evey line that was processed
                            // Popuating this value allows a client-script to prevent the user from entering a value in the CreateType field .. thus preventing re-generating the line
                            log.debug('beforeSubmit - Attemping to set Dummy PR', "line: " + i);
                            context.newRecord.setSublistValue({ sublistId: 'item', line: i, fieldId: DH_Library_1.FIELDS.TRANSACTION.COLUMN.PurchaseRequest, value: DUMMY_PR });
                            break;
                        case PurchaseRequestItemDetail_1.CreateType.TransferOrder:
                            context.newRecord.setSublistValue({ sublistId: 'item', line: i, fieldId: DH_Library_1.FIELDS.TRANSACTION.COLUMN.CreateType, value: '' });
                            break;
                    }
                }
            }
        }
    };
    exports.afterSubmit = function (context) {
        if (runtime.executionContext !== runtime.ContextType.MAP_REDUCE) {
            var purchaseRequests = [];
            var employeeId = +runtime.getCurrentUser().id;
            if (employeeId === DH_Library_1.VENDOR.DARREN_HILL) {
                employeeId = DH_Library_1.EMPLOYEE.MIKE_HARRIS;
            }
            for (var i = 0, lineCount = +context.newRecord.getLineCount({ sublistId: 'item' }); i < lineCount; i = i + 1) {
                var createType = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: DH_Library_1.FIELDS.TRANSACTION.COLUMN.CreateType });
                var relatedTransactionId = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: DH_Library_1.FIELDS.TRANSACTION.COLUMN.RelatedTransaction });
                var purchaseRequestId = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: DH_Library_1.FIELDS.TRANSACTION.COLUMN.PurchaseRequest });
                var costEstimateType = context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'costestimatetype' });
                var quantity = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'quantity' });
                var estimatedCost = -1;
                var vendorNotes = null;
                var nextLineIndex = (i + 1);
                // Ensure both Related and PR's are blank
                if (isProcessable(context, i) && !(relatedTransactionId > 0) && (purchaseRequestId === DUMMY_PR || !(purchaseRequestId > 0))) {
                    switch (createType) {
                        case PurchaseRequestItemDetail_1.CreateType.PurchaseOrder:
                        case PurchaseRequestItemDetail_1.CreateType.ExpeditePO:
                        case PurchaseRequestItemDetail_1.CreateType.DropShipPO:
                        case PurchaseRequestItemDetail_1.CreateType.WillCallPO:
                            // If the estimate 'Cost Est Type' (standard field) is Custom, carry through the Est Extended Cost as the Unit Cost (divide Est Extended Cost / by Qty ) and use as 'estimatedCost'
                            if (costEstimateType === 'CUSTOM') {
                                estimatedCost = +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'costestimaterate' });
                            }
                            // Make sure we don't look too far ahead!
                            if (nextLineIndex < lineCount) {
                                // Check the next line for Vendor Notes
                                var nextLineItemId = +context.newRecord.getSublistValue({ sublistId: 'item', line: nextLineIndex, fieldId: 'item' });
                                var nextLineCreateType = +context.newRecord.getSublistValue({ sublistId: 'item', line: nextLineIndex, fieldId: DH_Library_1.FIELDS.TRANSACTION.COLUMN.CreateType });
                                if (nextLineItemId === DH_Library_1.ITEM.AXBLANKLINE && nextLineCreateType === createType) {
                                    // Process this as the vendorNotes:
                                    vendorNotes = context.newRecord.getSublistValue({ sublistId: 'item', line: nextLineIndex, fieldId: 'description' });
                                }
                            }

                            purchaseRequests.push({
                                processingStatus: PurchaseRequestItemDetail_1.PurchaseRequestProcessingStatus.PurchaseOrder,
                              LocationPreferredStockLevel: +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'custcol112' }),   /// MH ADDED
                                vendorId: +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'povendor' }),
                                locationId: +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'location' }),
                                email: runtime.getCurrentUser().email,
                                fromLocationId: -1,
                                itemId: +context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'item' }),
                                internalId: '-1',
                                quantity: quantity,
                                salesOrderId: +context.newRecord.id,
                                salesOrderLine: i + 1,
                                purchasingNotes: context.newRecord.getValue({ fieldId: DH_Library_1.FIELDS.TRANSACTION.BODY.PurchasingNotes }),
                                estimatedCost: estimatedCost,
                                fromSalesOrderProcess: createType !== PurchaseRequestItemDetail_1.CreateType.PurchaseOrder,
                                description: context.newRecord.getSublistValue({ sublistId: 'item', line: i, fieldId: 'description' }),
                                purchaseOrderType: createType,
                                isCustomPrice: estimatedCost !== -1,
                                vendorNotes: vendorNotes
                            });
                            // Skip the next line, if it was vendor notes
                            if (vendorNotes !== null) {
                                i = i + 1;
                            }
                            break;
                    }
                }
            }
            // Send to Purchase Request Creation process
            if (purchaseRequests.length > 0) {
                log.debug('afterSubmit - purchaseRequests', purchaseRequests);
                if (purchaseRequests.length > 10) {
                    var purchaseRequestProcessor = task.create({
                        taskType: task.TaskType.MAP_REDUCE
                    });
                    purchaseRequestProcessor.scriptId = 'customscript_dh_pr_create_mr';
                    purchaseRequestProcessor.deploymentId = null; // Setting this to null forces Netsuite to select the next available 'idle' deployment
                    purchaseRequestProcessor.params = {
                        custscript_dh_owner: employeeId,
                        custscript_dh_sopurchaserequests: JSON.stringify(purchaseRequests)
                    };
                    purchaseRequestProcessor.submit();
                }
                else {
                    var processablePurchaseRequests = DH_PurchaseRequest_Engine_1.createPurchaseRequests({
                        employeeId: employeeId,
                        purchaseRequests: purchaseRequests
                    });
                    var transactions = DH_PurchaseRequest_Engine_1.determineTransactions({
                        employeeId: employeeId,
                        purchaseRequests: processablePurchaseRequests
                    });
                    transactions.forEach(function (transaction) {
                        DH_PurchaseRequest_Engine_1.createTransaction({
                            transaction: transaction
                        });
                    });
                    // Redirect back to itself
                    redirect.toRecord({
                        type: context.newRecord.type,
                        id: context.newRecord.id
                    });
                    log.audit('afterSubmit - Remaining Usage', runtime.getCurrentScript().getRemainingUsage());
                }
            }
        }
    };
});
