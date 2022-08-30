/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */

define(
    ['N/record', 'N/search', 'N/format', 'N/log'],
    function (record, search, format, log) {

        var getInputData = function () {
            log.debug('getInputData', 'IN');
            try {
                var activeItems = getActiveItems();
                log.debug({
                    title: 'activeItems:',
                    details: activeItems.length + ' | ' + JSON.stringify(activeItems)
                });
                var itemPurchases = getPurchaseData();
                log.debug({
                    title: 'itemPurchases:',
                    details: itemPurchases.length + ' | ' + JSON.stringify(itemPurchases)
                });
                var itemSubmitData = [];
                for (var i = 0; i < activeItems.length; i++) {
                    var itemId = activeItems[i];
                    var itemPurchasesIndex = findWithAttr(itemPurchases, 'item', itemId);
                    if (itemPurchasesIndex != -1) {
                        //set last purchase date to date from results
                        var datePurchased = itemPurchases[itemPurchasesIndex].date;
                    } else {
                        //set last purchase date to null
                        var datePurchased = null;
                    }
                    itemSubmitData.push({
                        item: itemId,
                        val: datePurchased
                    });
                }
            } catch (e) {
                log.error('getInputData', e);
            }
            log.debug('getInputData', 'OUT');
            log.debug('itemSubmitData', JSON.stringify(itemSubmitData));
            return itemSubmitData;
        }
        var reduce = function (context) {
            // log.debug('REDUCE', 'context: ' + JSON.stringify(context));
            //the context key contains the transaction internal id
            var key = context.key;
            //Netsuite encapsulates the values in an array, getting the first position we get the value object
            var values = JSON.parse(context.values[0]);
            if(values.val != null) {
                var formattedDate = format.parse({
                    value: values.val,
                    type: format.Type.DATE
                });
            } else {
                var formattedDate = null;
            }

            record.submitFields({
                type: record.Type.INVENTORY_ITEM,
                id: values.item,
                values: {
                    custitem76: formattedDate
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields : true
                }
            });
        }
        var summarize = function (summary) {
            log.debug('SUMMARIZE In');
            summary.reduceSummary.errors.iterator().each(function (key, value) {
                var o_error = JSON.parse(value);
                var msg = 'Key: ' + key + '. Error in line: ' + o_error.cause.lineNumber + ', error message: ' + o_error.message + '\n';
                log.debug('SUMMARIZE REDUCE ERROR', msg);
                return true;
            });
            log.debug('SUMMARIZE Out');
        }
        function getActiveItems() {
            var searchId = 'customsearch7168'
            var itemSearch = search.load({
                type: search.Type.ITEM,
                id: searchId
            });

            var allResults = getAllResults(itemSearch);
            var items = [];
            for (var i = 0; i < allResults.length; i++) {
                var itemId = allResults[i].getValue(allResults[i].columns[0]);
                items.push(itemId);
            }
            return items;
        }
        function getPurchaseData() {
            var searchId = 'customsearch_ax_purch_lastpurchdate_2'
            var poSearch = search.load({
                type: search.Type.TRANSACTION,
                id: searchId
            });
            var allResults = getAllResults(poSearch);
            var itemPurchases = [];
            for (var i = 0; i < allResults.length; i++) {
                var itemId = allResults[i].getValue(allResults[i].columns[0]);
                var date =  allResults[i].getValue( allResults[i].columns[3]);
                itemPurchases.push({
                    item: itemId,
                    date: date
                });
            }
            return itemPurchases;
        }
        function findWithAttr(array, attr, value) {
            for(var i = 0; i < array.length; i += 1) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
            return -1;
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
            getInputData: getInputData,
            reduce: reduce,
            summarize: summarize
        };

    });