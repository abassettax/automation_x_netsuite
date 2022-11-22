/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */

 define(
    ['N/record', 'N/search', 'N/log'],
    function (record, search, log) {
        var getInputData = function () {
            log.debug('getInputData', 'IN');
            try {
                var assemblyItemsToUpdate = getAssemblyPricing();
                log.debug({
                    title: 'assemblyItemsToUpdate:',
                    details: assemblyItemsToUpdate.length + ' | ' + JSON.stringify(assemblyItemsToUpdate)
                });
                log.debug('getInputData', 'OUT');
                return assemblyItemsToUpdate;
            } catch (e) {
                log.error('getInputData', e);
            }
        }
        var reduce = function (context) {
            var values = JSON.parse(context.values[0]);
            var itemId = values.item;
            var newPrice = values.price;

            var assemblyItem = record.load({ 
                type: record.Type.ASSEMBLY_ITEM.toLowerCase(), 
                id: itemId, 
                isDynamic: false 
            });
            var priceLines = assemblyItem.getLineCount({
                sublistId: 'price'
            });
            for (var i = 0; i < priceLines; i++) {
                var priceLevel = assemblyItem.getSublistValue({
                    sublistId: 'price',
                    fieldId: 'pricelevel',
                    line: i
                });
                if (priceLevel == '1') {
                    log.debug('Start price update','item id: ' + itemId);
                    var basePrice = assemblyItem.getSublistValue({
                        sublistId: 'price',
                        fieldId: 'price_1_',
                        line: i
                    });
                    log.debug('old basePrice', basePrice);
                    log.debug('new basePrice', newPrice);
                    assemblyItem.setSublistValue({
                        sublistId: 'price',
                        fieldId: 'price_1_',
                        line: i,
                        value: newPrice
                    });
                    assemblyItem.save({ 
                        enableSourcing: false, 
                        ignoreMandatoryFields: true 
                    });
                    log.debug('Assembly Price Updated','item id: ' + itemId);
                    break;
                }
            }
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
        function getAssemblyPricing() {
            var searchId = 'customsearch_ax_assembly_prices'
            var searchObj = search.load({
                type: search.Type.ITEM,
                id: searchId
            });
            var allResults = getAllResults(searchObj);
            log.debug('allResults', JSON.stringify(allResults));
            var assemblyItemsToUpdate = [];
            for (var i = 0; i < allResults.length; i++) {
                var itemid = allResults[i].getValue(allResults[i].columns[0]);
                var actprice = parseFloat(allResults[i].getValue(allResults[i].columns[3]));
                var expprice = parseFloat(allResults[i].getValue(allResults[i].columns[4]));
                if (actprice != expprice) {
                    assemblyItemsToUpdate.push({
                        item: itemid,
                        price: expprice
                    });
                }
            }
            return assemblyItemsToUpdate;
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