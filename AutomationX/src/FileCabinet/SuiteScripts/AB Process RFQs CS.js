/**
 *
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType ClientScript
 */
define(["require", "exports", "N/ui/message", "./DH_Library"], function (require, exports, message, DH_Library_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pageInit = function (context) {
        // var screenHeight = screen.height - 400;
        var filterVendor = getParameterFromURL('vendor');
        if (filterVendor) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_filtervendorid',
                value: filterVendor,
                ignoreFieldChange: true
            });
        }
    };
    exports.fieldChanged = function (context) {
        var currentRecord = context.currentRecord, FieldName = context.fieldId;
        if (FieldName === 'custpage_filtervendorid' ) {
            var vendor_1 = currentRecord.getValue('custpage_filtervendorid');
            window.onbeforeunload = null;
            window.open('https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2488&deploy=1&compid=422523' + '&vendor=' + vendor_1, '_self');
            return true;
        }
    };
    exports.saveRecord = function (context) {
        var currentRecord = context.currentRecord;
        var lineCount = currentRecord.getLineCount({
            sublistId: 'custpagesublist'
        });
        var zeroLines = true;
        var missingEmail = false;
        var missingEmails = [];
        var missingLinesText = '';
        for (var i = 0; i < lineCount; i++) {
            var processLine = currentRecord.getSublistValue({
                sublistId: 'custpagesublist',
                fieldId: 'process',
                line: i
            });
            if (processLine == true) {
                zeroLines = false;
                var email = currentRecord.getSublistValue({
                    sublistId: 'custpagesublist',
                    fieldId: 'vendoremail',
                    line: i
                });
                if (email == '') {
                    missingEmail = true;
                    missingEmails.push(i);
                }
            }
        }
        if (zeroLines) {
            var myMsg = message.create({
                title: 'NO SELECTION',
                message: 'None of the RFQs were selected to process. Please select at least one and fill in the required fields before submitting.',
                type: message.Type.ERROR
            });
            myMsg.show({
                duration: 10000 // will disappear after 5s
            });
            return false;
        } else if (missingEmail) {
            for (var i = 0; i < missingEmails.length; i++) {
                missingLinesText += (missingEmails[i] + 1);
                if (i < missingEmails.length - 1) {
                    missingLinesText += ', ';
                }
            }
            var myMsg = message.create({
                title: 'MISSING EMAILS',
                message: 'Part of your selection is missing an email. Please review lines '+ missingLinesText +' and enter an email for them before submitting.',
                type: message.Type.ERROR
            });
            myMsg.show({
                duration: 10000 // will disappear after 5s
            });
            return false;
        } else {
            return true;
        }
    };
    var getParameterFromURL = function (param) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] === param) {
                return decodeURIComponent(pair[1]);
            }
        }
        return (false);
    };
    // exports.clearalllines = function () {
    //     var url =  document.URL;
    //     window.location.href = url + '&clearAll=T';
    // };
    exports.reset = function () {
        window.open('https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2488&deploy=1&compid=422523', '_self');
        return true;
    };
});
