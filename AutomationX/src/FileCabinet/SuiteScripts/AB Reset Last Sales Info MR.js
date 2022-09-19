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
                var itemSales = getSalesData();
                log.debug({
                    title: 'itemSales:',
                    details: itemSales.length + ' | ' + JSON.stringify(itemSales)
                });
                var itemSubmitData = [];
                for (var i = 0; i < activeItems.length; i++) {
                    var itemId = activeItems[i].item;
                    var itemType = activeItems[i].type;
                    var itemSalesIndex = findWithAttr(itemSales, 'item', itemId);
                    if (itemSalesIndex != -1) {
                        //set last purchase date to date from results
                        var datePurchased = itemSales[itemSalesIndex].date;
                        var customer = itemSales[itemSalesIndex].cust;
                    } else {
                        //set last purchase date to null
                        var datePurchased = null;
                        var customer = null;
                    }
                    // if (i < 100) {
                    //     log.debug({
                    //         title: 'itemId:',
                    //         details: itemId
                    //     });
                    //     log.debug({
                    //         title: 'itemType:',
                    //         details: itemType
                    //     });
                    //     log.debug({
                    //         title: 'datePurchased:',
                    //         details: datePurchased
                    //     });
                    //     log.debug({
                    //         title: 'customer:',
                    //         details: customer
                    //     });
                    // }
                    itemSubmitData.push({
                        item: itemId,
                        type: itemType,
                        date: datePurchased,
                        cust: customer
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
            //the context key contains the transaction internal id
            var key = context.key;
            //Netsuite encapsulates the values in an array, getting the first position we get the value object
            var values = JSON.parse(context.values[0]);
            if(values.date != null) {
                var formattedDate = format.parse({
                    value: values.date,
                    type: format.Type.DATE
                });
            } else {
                var formattedDate = null;
            }
            var customer = values.cust;
            var type = values.type;

            switch (type) {   // Compare item type to its record type counterpart
                case 'InvtPart':
            	recordType = record.Type.INVENTORY_ITEM;
                break;
                case 'NonInvtPart':
                    recordType = record.Type.NON_INVENTORY_ITEM;
                    break;
                case 'Service':
                    recordType = record.Type.SERVICE_ITEM;
                    break;
                case 'Assembly':
                    recordType = record.Type.ASSEMBLY_ITEM;
                    break;                 
                case 'Kit':
                    recordType = record.Type.KIT_ITEM; //Kit/Package	
                    break;
                case 'Group':
                    recordType = record.Type.ITEM_GROUP; //Item Group
                    break;
                default:
           }

           log.debug('checking values before submit. key: ' + key, 'item: ' + values.item + ' | type: ' + recordType + ' | date: ' + formattedDate + ' | cust: ' + customer)

            record.submitFields({
                type: recordType,
                id: values.item,
                values: {
                    custitem113: formattedDate,
                    custitem114: customer
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
            var itemData = [];
            for (var i = 0; i < allResults.length; i++) {
                var itemId = allResults[i].getValue(allResults[i].columns[0]);
                var itemType = allResults[i].getValue(allResults[i].columns[3]);
                itemData.push({
                    item: itemId,
                    type: itemType
                });
            }
            return itemData;
        }
        function getSalesData() {
            var searchId = 'customsearch_as_last_purchase_item_cus_3'
            var soSearch = search.load({
                type: search.Type.TRANSACTION,
                id: searchId
            });
            var allResults = getAllResults(soSearch);
            var itemSales = [];
            for (var i = 0; i < allResults.length; i++) {
                var itemId = allResults[i].getValue(allResults[i].columns[0]);
                var customer = allResults[i].getValue( allResults[i].columns[4]);
                var date =  allResults[i].getValue( allResults[i].columns[5]);
                itemSales.push({
                    item: itemId,
                    date: date,
                    cust: customer
                });
            }
            return itemSales;
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