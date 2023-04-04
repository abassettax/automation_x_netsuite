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
                var invItemsToUpdate = getInvItemPricing();
                log.debug({
                    title: 'invItemsToUpdate:',
                    details: invItemsToUpdate.length + ' | ' + JSON.stringify(invItemsToUpdate)
                });
                log.debug('getInputData', 'OUT');
                return invItemsToUpdate;
            } catch (e) {
                log.error('getInputData', e);
            }
        }
        var reduce = function (context) {
            var values = JSON.parse(context.values[0]);
            var itemId = values.item;
            var newPrice = values.price;
            var newLowPrice = values.lowprice;

            var invItem = record.load({ 
                type: record.Type.INVENTORY_ITEM.toLowerCase(), 
                id: itemId, 
                isDynamic: false 
            });
            var priceLines = invItem.getLineCount({
                sublistId: 'price'
            });
            for (var i = 0; i < priceLines; i++) {
                var priceLevel = invItem.getSublistValue({
                    sublistId: 'price',
                    fieldId: 'pricelevel',
                    line: i
                });
                if (priceLevel == '1') {
                    log.debug('Start price update','item id: ' + itemId);
                    var basePrice = invItem.getSublistValue({
                        sublistId: 'price',
                        fieldId: 'price_1_',
                        line: i
                    });
                    log.debug('old basePrice', basePrice);
                    log.debug('new basePrice', newPrice);
                    invItem.setSublistValue({
                        sublistId: 'price',
                        fieldId: 'price_1_',
                        line: i,
                        value: newPrice
                    });
                    break;
                }
                if (priceLevel == '157') {
                    log.debug('Start low price update','item id: ' + itemId);
                    var lowPrice = invItem.getSublistValue({
                        sublistId: 'price',
                        fieldId: 'price_1_',
                        line: i
                    });
                    log.debug('old lowPrice', lowPrice);
                    log.debug('new lowPrice', newLowPrice);
                    invItem.setSublistValue({
                        sublistId: 'price',
                        fieldId: 'price_1_',
                        line: i,
                        value: newLowPrice
                    });
                    break;
                }
            }
            invItem.save({ 
                enableSourcing: false, 
                ignoreMandatoryFields: true 
            });
            log.debug('Inv Item Price Updated','item id: ' + itemId);
        }
        var summarize = function (summary) {
            log.debug('SUMMARIZE In');
            summary.reduceSummary.errors.iterator().each(function (key, value) {
                var o_error = JSON.parse(value);
                var msg = 'Key: ' + key + ', error message: ' + o_error.message + '\n';
                log.debug('SUMMARIZE REDUCE ERROR', msg);
                return true;
            });
            log.debug('SUMMARIZE Out');
        }
        function getInvItemPricing() {
            var searchId = 'customsearch_ax_inv_prices_2'
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
                var lowestprice = parseFloat(allResults[i].getValue(allResults[i].columns[8]));
                if (actprice != expprice) {
                    assemblyItemsToUpdate.push({
                        item: itemid,
                        price: expprice,
                        lowprice: lowestprice
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