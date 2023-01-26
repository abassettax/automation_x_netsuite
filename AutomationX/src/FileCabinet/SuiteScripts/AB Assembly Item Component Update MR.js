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
                var itemsToUpdate = getAssemblyItems();
                log.debug({
                    title: 'itemsToUpdate:',
                    details: itemsToUpdate.length + ' | ' + JSON.stringify(itemsToUpdate)
                });
                //also need to check items that have values set but are not in results
                var itemsToUpdate2 = getAssemblyItems2();
                log.debug({
                    title: 'itemsToUpdate2:',
                    details: itemsToUpdate2.length + ' | ' + JSON.stringify(itemsToUpdate2)
                });
                var activeComponents = [];
                for (var i = 0; i < itemsToUpdate.length; i++) {
                    var itemId = itemsToUpdate[i].item;
                    activeComponents.push(itemId);
                }
                log.debug({
                    title: 'activeComponents:',
                    details: activeComponents.length + ' | ' + JSON.stringify(activeComponents)
                });
                var extras = [];
                for (var i = 0; i < itemsToUpdate2.length; i++) {
                    var itemId = itemsToUpdate2[i];
                    var activeIndex = activeComponents.indexOf(itemId);
                    if (activeIndex == -1) {
                        extras.push(itemId);
                        itemsToUpdate.push({
                            item: itemId,
                            assemblies: [],
                            active: false
                        });
                    }
                }
                log.debug({
                    title: 'extras:',
                    details: extras.length + ' | ' + JSON.stringify(extras)
                });
                log.debug({
                    title: 'itemsToUpdate final:',
                    details: itemsToUpdate.length + ' | ' + JSON.stringify(itemsToUpdate)
                });
                log.debug('getInputData', 'OUT');
                return itemsToUpdate;
            } catch (e) {
                log.error('getInputData', e);
            }
        }
        var reduce = function (context) {
            var values = JSON.parse(context.values[0]);
            log.debug('values', JSON.stringify(values));
            var itemId = values.item;
            var assemblies = values.assemblies;
            var type = values.active;

            if (type) {
                record.submitFields({
                    type: record.Type.INVENTORY_ITEM,
                    id: itemId,
                    values: {
                        custitem119: true,
                        custitem120: assemblies
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields : true
                    }
                });
            } else {
                record.submitFields({
                    type: record.Type.INVENTORY_ITEM,
                    id: itemId,
                    values: {
                        custitem119: false,
                        custitem120: null
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields : true
                    }
                });
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
        function getAssemblyItems() {
            var searchId = 'customsearch7431'
            var searchObj = search.load({
                type: search.Type.ITEM,
                id: searchId
            });
            var allResults = getAllResults(searchObj);
            log.debug('allResults', JSON.stringify(allResults));
            var itemsArr = [];
            var itemsToUpdate = [];
            for (var i = 0; i < allResults.length; i++) {
                var memId = parseFloat(allResults[i].getValue(allResults[i].columns[0]));
                var assemId = parseFloat(allResults[i].getValue(allResults[i].columns[2]));
                var checkIndex = itemsArr.indexOf(memId);
                if (checkIndex == -1) {
                    itemsArr.push(memId);
                    itemsToUpdate.push({
                        item: memId,
                        assemblies: [assemId],
                        active: true
                    });
                } else {
                    itemsToUpdate[checkIndex].assemblies.push(assemId);
                }                
            }
            return itemsToUpdate;
        }
        function getAssemblyItems2() {
            var searchId = 'customsearch7433'
            var searchObj = search.load({
                type: search.Type.ITEM,
                id: searchId
            });
            var allResults = getAllResults(searchObj);
            log.debug('allResults', JSON.stringify(allResults));
            var itemsArr = [];
            for (var i = 0; i < allResults.length; i++) {
                var itemId = parseFloat(allResults[i].getValue(allResults[i].columns[0]));
                itemsArr.push(itemId);           
            }
            return itemsArr;
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