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
define(["require", "exports", "N/file", "N/log"], function (require, exports, file, log) {
    Object.defineProperty(exports, "__esModule", { value: true });
    // noinspection JSUnusedLocalSymbols
    exports.getInputData = function (inputContext) {
        return file.load({
            id: 6350745
        });
    };
    // noinspection JSUnusedLocalSymbols
    exports.map = function (context) {
        log.debug('context', context);
        log.debug('context.key', context.key);
        log.debug('context.value', context.value);
        log.debug('context.errors', context.errors);
    };
});
