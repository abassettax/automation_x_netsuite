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
                var pricebookId = runtime.getCurrentScript().getParameter({ name: 'custscript_ax_pricebook_id' });
                log.debug({
                    title: 'pricebookId:',
                    details: pricebookId
                });
                var updatePrices = JSON.parse(runtime.getCurrentScript().getParameter({ name: 'custscript_ax_pricebook_prices' }));
                log.debug({
                    title: 'updatePrices:',
                    details: JSON.stringify(updatePrices)
                });
                var finalData = [];
                var allCustomers = getPricebookCustomers(pricebookId);
                log.debug({
                    title: 'allCustomers:',
                    details: allCustomers.length + ' | ' + JSON.stringify(allCustomers)
                });
                for (var i = 0; i < allCustomers.length; i++) {
                    finalData.push({
                        customer: allCustomers[i],
                        pricedata: updatePrices
                    });
                }
                log.debug('finalData', JSON.stringify(finalData));
                log.debug('getInputData', 'OUT');
                return finalData;
            } catch (e) {
                log.error('getInputData', e);
            }
        }
        var reduce = function (context) {
            var values = JSON.parse(context.values[0]);
            var cust = values.customer;
            var updatePrices = values.pricedata;
            var custLookup = search.lookupFields({
                type: search.Type.CUSTOMER,
                id: cust,
                columns: ['parent']
            });
            if (custLookup.parent[0]) {
                var parent = custLookup.parent[0].value;
            }
            //check to see if there is a parent customer if so update that customer
            if (parent) {
                var custLookup2 = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: parent,
                    columns: ['custentity333']
                });
                if (custLookup2.custentity333 == "T") {
                    cust = parent;
                }
            }
            ///end customer check
            var custRecord = record.load({
                type: record.Type.CUSTOMER,
                id: cust,
                isDynamic: true
            });
            // log.debug('custRecord', JSON.stringify(custRecord));
            for (var i = 0; i < updatePrices.length; i++) {
                var item = updatePrices[i].item;
                var rate = updatePrices[i].rate;
                log.debug('lineCount', custRecord.getLineCount({sublistId:'itempricing'}));
                for (var j = 0; j <= custRecord.getLineCount({sublistId:'itempricing'}); j++) {
                    var thisitemid = custRecord.getSublistValue({
                        sublistId: 'itempricing',
                        fieldId: 'item', 
                        line: j
                    });
                    // log.debug('thisitemid', thisitemid);
                    if (item == thisitemid && rate) {
                        log.debug('match found, setting value');
                        custRecord.selectLine({
                            sublistId: 'itempricing',
                            line: j
                        });
                        custRecord.setSublistValue({
                            sublistId: 'itempricing',
                            fieldId: 'level', 
                            line: j,
                            value: -1   //Custom price level
                        });
                        custRecord.setSublistValue({
                            sublistId: 'itempricing',
                            fieldId: 'price', 
                            line: j,
                            value: rate
                        });
                        custRecord.commitLine({
                            sublistId: 'itempricing'
                        });
                        break;
                    }
                }
                if (item != thisitemid && rate) {
                    log.debug('no match found, creating value');
                    custRecord.selectNewLineItem({
                        sublistId: 'itempricing'
                    });
                    log.debug('test','after new line');
                    custRecord.setCurrentSublistValue({
                        sublistId: 'itempricing',
                        fieldId: 'item',
                        value: item
                    });
                    log.debug('test','after item');
                    custRecord.setCurrentSublistValue({
                        sublistId: 'itempricing',
                        fieldId: 'level',
                        value: -1,
                        ignoreFieldChange: true
                    });
                    log.debug('test','after level');
                    custRecord.setCurrentSublistValue({
                        sublistId: 'itempricing',
                        fieldId: 'price',
                        value: rate,
                        ignoreFieldChange: true
                    });
                    log.debug('test','after price');
                    custRecord.commitLine({
                        sublistId: 'itempricing'
                    });
                    log.debug('test','after commit');
                }
            }    
            custRecord.save({
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
        function getPricebookCustomers(pricebookId) {
            //TODO: add filter for dates
            var customrecord1280SearchObj = search.create({
                type: "customrecord1280",
                filters:
                [
                   ["isinactive","is","F"], 
                   "AND", 
                   ["internalid","anyof",pricebookId]
                ],
                columns:
                [
                   search.createColumn({
                      name: "internalid",
                      join: "CUSTRECORD319",
                      label: "Internal ID"
                   })
                ]
             });
            var allResults = getAllResults(customrecord1280SearchObj);
            log.debug('allResults', JSON.stringify(allResults));
            var custIds = [];
            for (var i = 0; i < allResults.length; i++) {
                var custId = allResults[i].getValue(allResults[i].columns[0]);
                // log.debug('custId', custId);
                custIds.push(custId);
            }
            return custIds;
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