/**
 * Module Description...
 *
 * @file DH_CreatePurchaseRequest_MR.js
 * @copyright 2018 Darren Hill Consulting Inc.
 * @author Darren Hill darren@darrenhillconsulting.ca
 *
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType MapReduceScript
 */
define(["require", "exports", "N/runtime", "N/task", "N/log", "./DH_Library", "./DH_PurchaseRequest_Engine"], function (require, exports, runtime, task, log, DH_Library_1, DH_PurchaseRequest_Engine_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getInputData = function () {
        var purchaseRequests = JSON.parse(runtime.getCurrentScript().getParameter({ name: 'custscript_dh_sopurchaserequests' }));
        log.debug('getInputData - purchaseRequests', purchaseRequests);
        return purchaseRequests;
    };
    exports.map = function (context) {
        var createPurchaseRequestResponse = DH_PurchaseRequest_Engine_1.createPurchaseRequest({
            employeeId: +runtime.getCurrentScript().getParameter({ name: 'custscript_dh_owner' }),
            purchaseRequest: JSON.parse(context.value)
        });
        if (createPurchaseRequestResponse.purchaseRequest.fromSalesOrderProcess) {
            context.write(createPurchaseRequestResponse.purchaseRequest.internalId, JSON.stringify(createPurchaseRequestResponse.purchaseRequest));
        }
        else {
            DH_Library_1.updateSalesOrder({
                id: createPurchaseRequestResponse.purchaseRequest.salesOrderId,
                salesOrderLineInfos: [createPurchaseRequestResponse.salesOrderLineInfo]
            });
        }
    };
    exports.summarize = function (context) {
        // Send new Purchase Requests to Processor
        var purchaseRequests = [];
        var employeeId = +runtime.getCurrentScript().getParameter({ name: 'custscript_dh_owner' });
        if (employeeId === DH_Library_1.VENDOR.DARREN_HILL) {
            employeeId = DH_Library_1.EMPLOYEE.MIKE_HARRIS;
        }
        context.mapSummary.errors.iterator().each(function (key, error, executionNo) {
            log.error("Map error for Key: " + key + ", Execution No:  " + executionNo, error);
            return true;
        });
        context.output.iterator().each(function (key, value) {
            log.audit('summarize', key);
            purchaseRequests.push(JSON.parse(value));
            return true;
        });
        var purchaseRequestProcessor = task.create({
            taskType: task.TaskType.MAP_REDUCE
        });
        purchaseRequestProcessor.scriptId = 'customscript_dh_purchase_request_mr';
        purchaseRequestProcessor.deploymentId = null; // Setting this to null forces Netsuite to select the next available 'idle' deployment
        purchaseRequestProcessor.params = {
            custscript_dh_employee: employeeId,
            custscript_dh_purchaserequests: JSON.stringify(purchaseRequests)
        };
        purchaseRequestProcessor.submit();
    };
});
