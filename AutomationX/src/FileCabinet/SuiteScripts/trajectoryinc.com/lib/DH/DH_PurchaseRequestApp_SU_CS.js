/**
 * Module Description...
 *
 * @file DH_PurchaseRequest_SU_CS.js
 * @copyright 2018 Darren Hill Consulting Inc.
 * @author Darren Hill darren@darrenhillconsulting.ca
 *
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType ClientScript
 */
 define(["require", "exports", "N/ui/message", "./DH_Library"], function (require, exports, message, DH_Library_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pageInit = function (context) {
        var screenHeight = screen.height - 400;
        var filterLocation = getParameterFromURL('locationFilter');
        if (filterLocation) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_filterlocationid',
                value: filterLocation,
                ignoreFieldChange: true
            });
        }
        var filterPrType = getParameterFromURL('prType');
              if (filterPrType) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_prtype',
                value: filterPrType,
                ignoreFieldChange: true
            });
        // } else {
        //     var currentRecord = context.currentRecord;
        //     currentRecord.setValue({
        //         fieldId: 'custpage_prtype',
        //         value: '1',
        //         ignoreFieldChange: true
        //     });
        }
        var filterax5code = getParameterFromURL('ax5code');
              if (filterax5code) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_ax5code',
                value: filterax5code,
                ignoreFieldChange: true
            });
        }
        var filterSourcing = getParameterFromURL('sourcing');
              if (filterSourcing) {
            var currentRecord = context.currentRecord;
            currentRecord.setValue({
                fieldId: 'custpage_sourcing',
                value: filterSourcing,
                ignoreFieldChange: true
            });
        }
        if (screenHeight < 400) {
            screenHeight = 400;
        }
        document.getElementById('custpagesublist_splits').parentElement.style.overflow = 'auto';
        // document.getElementById('custpagesublist_splits').parentElement.style.height = screenHeight + 'px';
        document.getElementById('custpagesublist_splits').parentElement.addEventListener('scroll', function () {
            var translate = 'translate(0,' + this.scrollTop + 'px)';
            var allTh = document.querySelectorAll('tr#custpagesublist_headerrow.uir-machine-headerrow');
            for (var i = 0; i < allTh.length; i++) {
                // noinspection TypeScriptUnresolvedletiable
                // @ts-ignore
                allTh[i].style.transform = translate;
            }
        });
    };
    exports.fieldChanged = function (context) {
        var currentRecord = context.currentRecord, FieldName = context.fieldId;
        if (FieldName === 'custpage_filterlocationid'  || FieldName === 'custpage_ax5code' || FieldName === 'custpage_prtype' || FieldName === 'custpage_sourcing') {
            var location_1 = currentRecord.getValue('custpage_filterlocationid');
            var prType = currentRecord.getValue('custpage_prtype');
            var ax5code = currentRecord.getValue('custpage_ax5code');
            var sourcing = currentRecord.getValue('custpage_sourcing');
            window.open('https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2456&deploy=1&compid=422523' + '&locationFilter=' + location_1 + '&prType=' + prType + '&ax5code=' + ax5code + '&sourcing=' + sourcing, '_self');
            return true;
        }
      
    };
    exports.saveRecord = function (context) {
        var currentRecord = context.currentRecord;
        var lineCount = currentRecord.getLineCount({
            sublistId: 'custpagesublist'
        });
        var failedLine;
        var zeroLines = true;
        var emptyStatus = false;
        // var typesArray = [];
        var methodsArray = [];
        for (var i = 0; i < lineCount; i++) {
            var processLine = currentRecord.getSublistValue({
                sublistId: 'custpagesublist',
                fieldId: 'process',
                line: i
            });
            if (processLine == true) {
                zeroLines = false;
                var status = currentRecord.getSublistValue({
                    sublistId: 'custpagesublist',
                    fieldId: 'status',
                    line: i
                });
                if (status == '') {
                    emptyStatus = true;
                    failedLine = (i+1);
                    break;
                }
            }
        }
        if (zeroLines) {
            var myMsg = message.create({
                title: 'NO SELECTION',
                message: 'None of the purchase requests were selected to process. Please select at least one and fill in the required fields before submitting.',
                type: message.Type.ERROR
            });
            myMsg.show({
                duration: 10000 // will disappear after 5s
            });
            return false;
        // allow empty status to just update the PR records with notes/assigning to sourcing
        // } else if (emptyStatus) {
        //     var myMsg = message.create({
        //         title: 'NO ACTION ON LINE ' + failedLine,
        //         message: 'At least one of the requests you selected does not have an Action set. Please fill in the required fields before submitting.',
        //         type: message.Type.ERROR
        //     });
        //     myMsg.show({
        //         duration: 10000 // will disappear after 5s
        //     });
        //     return false;
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
    exports.reset = function () {
        window.open('https://422523.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2456&deploy=1&compid=422523', '_self');
        return true;
    };
});
