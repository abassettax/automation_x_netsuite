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
                var itemReceipts = getItemReceipts();
                log.debug({
                    title: 'itemReceipts:',
                    details: itemReceipts.length + ' | ' + JSON.stringify(itemReceipts)
                });
                log.debug('getInputData', 'OUT');
                return itemReceipts;
            } catch (e) {
                log.error('getInputData', e);
            }
        }
        var reduce = function (context) {
            // log.debug('REDUCE', 'context: ' + JSON.stringify(context));
            //the context key contains the transaction internal id
            var key = context.key;
            //Netsuite encapsulates the values in an array, getting the first position we get the value object
            var values = JSON.parse(context.values[0]);
            var tranId = values.id;
            var itemVal = values.value;
            var landedCost = values.cost;
            var landedPer = (parseFloat(landedCost)/parseFloat(itemVal)*100);
            var irRec = record.load({
                type: record.Type.ITEM_RECEIPT,
                id: tranId
            });
            var landedSource = irRec.getValue({
                fieldId: 'landedcostsource1'
            });
            log.debug('landedSource', landedSource);
            irRec.setValue({
                fieldId: 'custbody238',
                value: landedSource,
                ignoreFieldChange: true
            });
            irRec.setValue({
                fieldId: 'custbody187',
                value: landedPer,
                ignoreFieldChange: true
            });
            log.debug('irRec', JSON.stringify(irRec));
            irRec.save({
                ignoreMandatoryFields: true
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
        function getItemReceipts() {
            var searchId = 'customsearch7315'
            var itemSearch = search.load({
                type: search.Type.TRANSACTION,
                id: searchId
            });
            var allResults = getAllResults(itemSearch);
            log.debug('allResults', JSON.stringify(allResults));
            var irIds = [];
            var irData = [];
            for (var i = 0; i < allResults.length; i++) {
                var tranid = allResults[i].getValue(allResults[i].columns[0]);
                // log.debug('tranid', tranid);
                var itemval = allResults[i].getValue(allResults[i].columns[11]);
                // log.debug('itemval', itemval);
                var itemcost = allResults[i].getValue(allResults[i].columns[13]);
                // log.debug('itemcost', itemcost);
                if (irIds.indexOf(tranid) == -1) {
                    irIds.push(tranid);
                    irData.push({
                        id: tranid,
                        value: parseFloat(itemval),
                        cost: parseFloat(itemcost)
                    });
                } else {
                    irData[irIds.indexOf(tranid)].value = irData[irIds.indexOf(tranid)].value + parseFloat(itemval);
                    irData[irIds.indexOf(tranid)].cost = irData[irIds.indexOf(tranid)].cost + parseFloat(itemcost);
                }
            }
            return irData;
        }
        // function findWithAttr(array, attr, value) {
        //     for(var i = 0; i < array.length; i += 1) {
        //         if(array[i][attr] === value) {
        //             return i;
        //         }
        //     }
        //     return -1;
        // }
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