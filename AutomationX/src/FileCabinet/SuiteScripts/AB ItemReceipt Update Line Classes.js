/**THIS IS  AN UNFINISHED SCRIPT TO MEANT TO SAVE INVOICES TO A FILE IN MASS.  
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/record', 'N/search'],
function (record, search) { 
    function execute(context) {
		var irsToUpdate = getIRsToUpdate();
        log.debug({
            title: 'irsToUpdate:',
            details: irsToUpdate.length + ' | ' + JSON.stringify(irsToUpdate)
        });
        for (var i = 0; i < irsToUpdate.length; i++) {
            var recId = irsToUpdate[i];
            var irRec = record.load({
                type: record.Type.ITEM_RECEIPT,
                id: recId
            });
            var mainClass = irRec.getValue({
                fieldId: 'class'
            });
            log.debug('mainClass', mainClass);
            var itemLines = irRec.getLineCount({
                sublistId: 'item'
            });
            log.debug('itemLines', itemLines);
            for (var j = 0; j < itemLines; j++) {
                irRec.setSublistValue({
                    sublistId: 'item',
                    fieldId : 'class',
                    line : j,
                    value : mainClass
                });
            }
            irRec.save({
                ignoreMandatoryFields: true
            });
            log.debug({
                title: 'irs updated:',
                details: 'IR id: ' + recId
            });
        }
    }
    function getIRsToUpdate() {
        var searchId = 'customsearch7425'
        var searchObj = search.load({
            type: search.Type.TRANSACTION,
            id: searchId
        });
        var allResults = getAllResults(searchObj);
        log.debug('allResults', JSON.stringify(allResults));
        var irsToUpdate = [];
        for (var i = 0; i < allResults.length; i++) {
            var id = allResults[i].getValue(allResults[i].columns[0]);
            irsToUpdate.push(id);
        }
        return irsToUpdate;
    }
    function getAllResults(searchObj) {
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
    }
    return {
        execute: execute
    };
});