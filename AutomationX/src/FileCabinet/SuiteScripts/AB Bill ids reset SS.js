/**THIS IS  AN UNFINISHED SCRIPT TO MEANT TO SAVE INVOICES TO A FILE IN MASS.  
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/log', 'N/record', 'N/search'],
function (log, record, search) { 
    function execute(context) {
		var recIds = getBills();
        for (var i = 0; i < recIds.length; i++) {
            try {
                var recId = recIds[i].id;
                var recType = recIds[i].type;
                // log.debug('recId', recId);
                // log.debug('recType', recType);
                if (recType == 'VendBill') {
                    recType = record.Type.VENDOR_BILL
                } else if (recType == 'VendCred') {
                    recType = record.Type.VENDOR_CREDIT
                } else {
                    recType = record.Type.EXPENSE_REPORT
                }
                // log.debug('recType 2', recType);
                record.submitFields({
                    type: recType,
                    id: recId,
                    values: {
                        custbody209: recId
                    }
                });
            } catch (e) {
                log.error('error updating custom id field', e);
            }
            
            // var tranRec = record.load({ 
            //     type: recType, 
            //     id: recId, 
            //     isDynamic: true 
            // });
            // tranRec.setValue({
            //     fieldId: 'custbody209',
            //     value: recId
            // });
            // tranRec.save({
            //     ignoreMandatoryFields: true
            // });
        }
    }

    var getBills = function () {
        var searchId = 'customsearch7538'
        var searchObj = search.load({
            type: 'transaction',
            id: searchId
        });
        var allResults = getAllResults(searchObj);
        var billResults = [];
        for (var i = 0; i < allResults.length; i++) {
            var type = allResults[i].getValue(allResults[i].columns[1]);
            var id = allResults[i].getValue(allResults[i].columns[3]);
            var memorized = allResults[i].getValue(allResults[i].columns[5]) ? 'T' : 'F';
            billResults.push({
                id: id,
                type: type,
                mem: memorized
            });
        }
        log.debug('billResults', JSON.stringify(billResults));
        return billResults;
    };

    var getAllResults = function (searchObj) {
        try {
            var searchResultsArr = new Array();
            var startCount = 0;

            do {
                var searchResults = searchObj.run().getRange({
                    start: startCount,
                    end: startCount + 1000
                });
                startCount = startCount + 1000;
                for (var i = 0; i < searchResults.length; i++) {
                    searchResultsArr.push(searchResults[i]);
                }
            } while (searchResults.length >= 1000)
            return searchResultsArr;
        } catch (e) {
            log.error('Error in getAllResults',e)
        }
    };

    return {
        execute: execute
    };
});