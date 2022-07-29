/**
 * Module Description...
 *
 * @file DH_ProcessPurchaseRequest_MR.js
 * @copyright 2018 Darren Hill Consulting Inc.
 * @author Darren Hill darren@darrenhillconsulting.ca
 *
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType MapReduceScript
 */
 define(["require", "exports", "N/runtime", "N/search", "N/url", "N/email", "N/log", "./DH_Library", "./DH_ProcessManager", "./DH_PurchaseRequest_Engine"], 
    function (require, exports, runtime, search, url, email, log, DH_Library_1, DH_ProcessManager_1, DH_PurchaseRequest_Engine_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getInputData = function () {
        return DH_PurchaseRequest_Engine_1.determineTransactions({
            employeeId: +runtime.getCurrentScript().getParameter({ name: 'custscript_tjinc_dh_employee' }),
            purchaseRequests: JSON.parse(runtime.getCurrentScript().getParameter({ name: 'custscript_tjinc_dh_purchaserequests' }))
        });
    };
    exports.map = function (context) {
        var transactionId = DH_PurchaseRequest_Engine_1.createTransaction({
            transaction: JSON.parse(context.value)
        });
        if (transactionId > 0) {
            context.write(transactionId.toString(), context.value);
        }
    };
    exports.summarize = function (context) {
        DH_ProcessManager_1.processingComplete();
        var employeeId = +runtime.getCurrentScript().getParameter({ name: 'custscript_tjinc_dh_employee' });
        if (employeeId === DH_Library_1.VENDOR.DARREN_HILL) {
            employeeId = DH_Library_1.EMPLOYEE.MIKE_HARRIS;
        }
        var emailBody = 'The following is a list of Error(s) and Transactions(s)<br/><br/>';
        var transactionSection = 'Transactions:<br/><br/>', hasTransactions = false;
        var errorSection = '<br/><br/>Errors:<br/>', hasErrors = false;
        context.output.iterator().each(function (key, value) {
            log.audit('summarize', key + " " + value);
            var tranDetails = search.lookupFields({
                type: search.Type.TRANSACTION,
                id: key,
                columns: ['type', 'tranid']
            });
            var tranURL = url.resolveRecord({
                recordType: tranDetails.type[0].value === 'PurchOrd' ? 'purchaseorder' : 'transferorder',
                recordId: key,
                isEditMode: false
            });
            hasTransactions = true;
            transactionSection += "<a href=\"" + tranURL + "\">" + tranDetails.type[0].text + " " + tranDetails.tranid + "</a><br/>";
            return true;
        });
        if (hasTransactions) {
            emailBody += transactionSection;
        }
        context.mapSummary.errors.iterator().each(function (key, error, executionNo) {
            log.error("Map error for Key: " + key + ", Execution No:  " + executionNo, error);
            hasErrors = true;
            errorSection += "Map error for Key: " + key + ", Execution No:  " + executionNo + " : " + error + "<br/>";
            return true;
        });
        if (hasErrors) {
            emailBody += errorSection;
        }
        if (isProcurementEmployee(employeeId) && (hasTransactions || hasErrors)) {
            email.send({
                author: employeeId,
                recipients: [employeeId],
                cc: ['darren@darrenhillconsulting.ca'],
                subject: 'Generated Purchase Request Transactions',
                body: emailBody
            });
        }
    };
    var isProcurementEmployee = function (employeeId) {
        var employeeInfo = search.lookupFields({
            type: search.Type.EMPLOYEE,
            id: employeeId,
            columns: ['department']
        });
        return +employeeInfo.department[0].value === DH_Library_1.DEPARTMENT.PROCUREMENT;
    };
});
