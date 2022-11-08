/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */

 define(
    ['N/record', 'N/search', 'N/format', 'N/log', 'N/runtime'],
    function (record, search, format, log, runtime) {

        var getInputData = function (context) {
            log.debug('getInputData', 'IN');
            try {
                var openSales = getSales();
                log.debug({
                    title: 'openSales:',
                    details: openSales.length + ' | ' + JSON.stringify(openSales)
                });
                log.debug('getInputData', 'OUT');
                return openSales;
            } catch (e) {
                log.error('getInputData', e);
            }
        }
        var reduce = function (context) {
            var values = JSON.parse(context.values[0]);
            var soId = values.id;
            var commitVal = values.commit;
            var backVal = values.back;
            record.submitFields({
                type: record.Type.SALES_ORDER,
                id: soId,
                values: {
                    custbody239: commitVal,
                    custbody240: backVal
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
        function getSales() {
            var searchId = 'customsearch7346'   //customsearch7345 all open sos search. current id is just open sos where values are off
            var salesSearch = search.load({
                type: search.Type.TRANSACTION,
                id: searchId
            });
            var allResults = getAllResults(salesSearch);
            log.debug('allResults', JSON.stringify(allResults));
            var soData = [];
            for (var i = 0; i < allResults.length; i++) {
                var tranid = allResults[i].getValue(allResults[i].columns[0]);
                // log.debug('tranid', tranid);
                var committedVal = allResults[i].getValue(allResults[i].columns[8]);
                // log.debug('itemval', itemval);
                var backorderedVal = allResults[i].getValue(allResults[i].columns[9]);
                // log.debug('itemcost', itemcost);
                //unique list, don't need to aggregate
                soData.push({
                    id: tranid,
                    commit: parseFloat(committedVal),
                    back: parseFloat(backorderedVal)
                });
            }
            return soData;
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