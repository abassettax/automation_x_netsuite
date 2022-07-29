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
define(["require", "exports", "N/runtime", "N/log", "./DH_Library"], function (require, exports, runtime, log, DH_Library_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getInputData = function () {
        var salesOrderInfos = JSON.parse(runtime.getCurrentScript().getParameter({ name: 'custscript_dh_so_infos' }));
        log.debug('getInputData - salesOrderInfos', salesOrderInfos);
        return salesOrderInfos;
    };
    exports.map = function (context) {
        var salesOrderInfo = JSON.parse(context.value);
        DH_Library_1.updateSalesOrder(salesOrderInfo);
        context.write(salesOrderInfo.id.toString(), JSON.stringify(salesOrderInfo));
    };
    exports.summarize = function (context) {
        context.mapSummary.errors.iterator().each(function (key, error, executionNo) {
            log.error("Map error for Key: " + key + ", Execution No:  " + executionNo, error);
            return true;
        });
        context.output.iterator().each(function (key, value) {
            log.audit("summarize: " + key, value);
            return true;
        });
    };
});
