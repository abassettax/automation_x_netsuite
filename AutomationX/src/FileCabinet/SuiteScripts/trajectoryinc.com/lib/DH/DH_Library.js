/**
 * @NApiVersion 2.x
 */
 define(["require", "exports", "N/record"], function (require, exports, record) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var VENDOR;
    (function (VENDOR) {
        VENDOR[VENDOR["DARREN_HILL"] = 30448] = "DARREN_HILL";
    })(VENDOR = exports.VENDOR || (exports.VENDOR = {}));
    var EMPLOYEE;
    (function (EMPLOYEE) {
        EMPLOYEE[EMPLOYEE["MIKE_HARRIS"] = 3354] = "MIKE_HARRIS";
    })(EMPLOYEE = exports.EMPLOYEE || (exports.EMPLOYEE = {}));
    var SUBSIDIARY;
    (function (SUBSIDIARY) {
        SUBSIDIARY[SUBSIDIARY["VGS"] = 15] = "VGS";
    })(SUBSIDIARY = exports.SUBSIDIARY || (exports.SUBSIDIARY = {}));
    var DEPARTMENT;
    (function (DEPARTMENT) {
        DEPARTMENT[DEPARTMENT["BALANCE_SHEET"] = 202] = "BALANCE_SHEET";
        DEPARTMENT[DEPARTMENT["PROCUREMENT"] = 2] = "PROCUREMENT";
    })(DEPARTMENT = exports.DEPARTMENT || (exports.DEPARTMENT = {}));
    var CLASS;
    (function (CLASS) {
        CLASS[CLASS["SHARED_SOLUTION"] = 5] = "SHARED_SOLUTION";
    })(CLASS = exports.CLASS || (exports.CLASS = {}));
    var ITEM;
    (function (ITEM) {
        ITEM[ITEM["AXBLANKLINE"] = 1277] = "AXBLANKLINE";
    })(ITEM = exports.ITEM || (exports.ITEM = {}));
    var SHIPMETHOD;
    (function (SHIPMETHOD) {
        SHIPMETHOD[SHIPMETHOD["UPSNEXTDAY"] = 1222] = "UPSNEXTDAY";
    })(SHIPMETHOD = exports.SHIPMETHOD || (exports.SHIPMETHOD = {}));
    exports.FIELDS = {
        TRANSACTION: {
            BODY: {
                IsReStockPO: 'custbody72',
                POFollowUpEmail: 'custbody_po_follow_up',
                PurchasingNotes: 'custbody34',
                IsExpedite: 'custbody70',
                IsDropShip: 'custbody147',
                LinkedSalesOrder: 'custbody184',
                isWillCall: 'custbody179',
                MaterialStatus: 'custbody6' // List/Record (Material Status)
            },
            COLUMN: {
                AX5Code: 'custcol38',
                CreateType: 'custcol90',
                PurchaseRequest: 'custcol91',
                RelatedTransaction: 'custcol74',
                SalesOrder: 'custcol89',
                isDropShip: 'custcol4',
            }
        },
        ITEM: {
            AX5Code: 'custitem35',
            MonthsOnHand: 'custitem_tjinc_monthsonhand',
            AverageDemand: 'custitem_tjinc_averagedemand'
        },
        LOCATION: {
            IsPlanningEdgeLocation: 'custrecord17'
        }
    };
    exports.updateSalesOrder = function (salesOrderInfo) {
        var salesOrder = record.load({
            type: record.Type.SALES_ORDER,
            id: salesOrderInfo.id,
            isDynamic: true
        });
        salesOrderInfo.salesOrderLineInfos.forEach(function (salesOrderLineInfo) {
            // Watch for index (as SS2.0 uses zero based)
            var ss2LineIndex = salesOrderLineInfo.lineId - 1;
            salesOrder.selectLine({ sublistId: 'item', line: ss2LineIndex });
            if (salesOrderLineInfo.relatedTransactionId) {
                salesOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: exports.FIELDS.TRANSACTION.COLUMN.RelatedTransaction, value: salesOrderLineInfo.relatedTransactionId });
            }
            if (salesOrderLineInfo.purchaseRequestId) {
                salesOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: exports.FIELDS.TRANSACTION.COLUMN.PurchaseRequest, value: salesOrderLineInfo.purchaseRequestId });
            }
            salesOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: exports.FIELDS.TRANSACTION.COLUMN.CreateType, value: '' });
            salesOrder.commitLine({ sublistId: 'item' });
        });
        salesOrder.save();
    };
    exports.updateWorkOrder = function (workOrderInfo) {
        var workOrder = record.load({
            type: record.Type.WORK_ORDER,
            id: workOrderInfo.id,
            isDynamic: true
        });
        workOrderInfo.workOrderLineInfos.forEach(function (workOrderLineInfos) {
            // Watch for index (as SS2.0 uses zero based)
            var ss2LineIndex = workOrderLineInfos.lineId - 1;
            workOrder.selectLine({ sublistId: 'item', line: ss2LineIndex });
            if (workOrderLineInfos.relatedTransactionId) {
                workOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: exports.FIELDS.TRANSACTION.COLUMN.RelatedTransaction, value: workOrderLineInfos.relatedTransactionId });
            }
            if (workOrderLineInfos.purchaseRequestId) {
                workOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: exports.FIELDS.TRANSACTION.COLUMN.PurchaseRequest, value: workOrderLineInfos.purchaseRequestId });
            }
            workOrder.setCurrentSublistValue({ sublistId: 'item', fieldId: exports.FIELDS.TRANSACTION.COLUMN.CreateType, value: '' });
            workOrder.commitLine({ sublistId: 'item' });
        });
        workOrder.save();
    };
});
