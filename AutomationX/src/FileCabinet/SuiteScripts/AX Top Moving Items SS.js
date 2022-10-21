/**THIS IS  AN UNFINISHED SCRIPT TO MEANT TO SAVE INVOICES TO A FILE IN MASS.  
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/record', 'N/search', 'N/log'],
function (record, search, log) { 
    function execute(context) {
        var itemSalesSearch = search.load({id:"7278",type:"transaction"});
        log.debug('itemSalesSearch', JSON.stringify(itemSalesSearch));
        var salesTotal = 0;
        var itemData = [];
        var assemblyItems = [];
        //TODO: if type is assembly, need to determine children. need recursive function to determine all dependent items
        var allResults = getAllResults(itemSalesSearch);
        log.debug('allResults', JSON.stringify(allResults));
        for (var i = 0; i < allResults.length; i++) {
            var itemid = allResults[i].getValue({
                name: 'internalid',
                join: 'item',
                summary: 'GROUP'
            });
            var itemtype = allResults[i].getValue({
                name: 'type',
                join: 'item',
                summary: 'GROUP'
            });
            if (itemtype != 'InvPart') {
                assemblyItems.push(itemid);
            }
            var salescontr = allResults[i].getValue({
                name: 'amount',
                summary: 'SUM'
            });
            itemData.push({
                item: itemid,
                type: itemtype,
                sales: salescontr
            });
            salesTotal = parseFloat(salesTotal) + parseFloat(salescontr);
        }
        var allDependentComponents = getAllAssemblyComponents(assemblyItems);
        log.debug('allDependentComponents', allDependentComponents);
		log.debug('itemData', JSON.stringify(itemData));
        log.debug('salesTotal', salesTotal);
        var percTotal = 0;
        for (var i = 0; i < itemData.length; i++) {
            log.debug('itemData[i]', itemData[i]);
            try {
                var item = itemData[i].item;
                var itemType = itemData[i].type;
                var recordType = null;
                log.debug('itemType', itemType + ' | ' + typeof(itemType));
                log.debug('itemType checks', (itemType == 'InvtPart') + ' | ' + (itemType == 'Assembly') + ' | ' + (itemType == 'Group') + ' | ' + (itemType == 'Kit'));
                if (itemType == 'InvtPart') {
                    recordType = record.Type.INVENTORY_ITEM;
                } else if (itemType == 'Assembly') {
                    recordType = record.Type.ASSEMBLY_ITEM;
                } else if (itemType == 'Group') {
                    recordType = record.Type.ITEM_GROUP;
                } else if (itemType == 'Kit') {
                    recordType = record.Type.KIT_ITEM;
                }
                log.debug('recordType', recordType + ' | ' + typeof(recordType));
                if (recordType) {
                    var sales = itemData[i].sales;
                    var percOfTotal = 100*parseFloat(sales)/parseFloat(salesTotal);
                    log.debug('percOfTotal', percOfTotal);
                    if (parseFloat(percTotal) < 85) {
                        percTotal = parseFloat(percTotal) + parseFloat(percOfTotal);
                        record.submitFields({
                            type: recordType,
                            id: item,
                            values: {
                                custitem111: true
                            }
                        });
                    } else {
                        if (allDependentComponents.indexOf(item) != -1) {
                            record.submitFields({
                                type: recordType,
                                id: item,
                                values: {
                                    custitem111: true
                                }
                            });
                        } else {
                            record.submitFields({
                                type: recordType,
                                id: item,
                                values: {
                                    custitem111: false
                                }
                            });
                        }
                    }
                }
            } catch (e) {
                log.error('error in record updates', 'i: ' + i + ' | itemid: ' + item + ' | type det: ' + itemType + ' | error: ' + e);
                break;
            }
            log.debug('percTotal', percTotal);
        }
    }
    function getAllAssemblyComponents(assemblyItems) {
        var assemblies = [];
        var components = [];
        var itemSearchObj = search.create({
            type: "item",
            filters:
            [
               ["type","anyof","Assembly","Kit","Group"], 
               "AND", 
               ["isinactive","is","F"], 
               "AND", 
               ["memberitem.type","anyof","Assembly","InvtPart","Group","Kit"],
               "AND",
               ["internalid","anyof",assemblyItems],
            ],
            columns:
            [
               search.createColumn({name: "internalid", label: "Internal ID"}),
               search.createColumn({name: "memberitem", label: "Member Item"}),
               search.createColumn({name: "memberquantity", label: "Member Quantity"}),
               search.createColumn({
                  name: "type",
                  join: "memberItem",
                  label: "Type"
               })
            ]
        });
        var allResults = getAllResults(itemSearchObj);
        log.debug('allResults', JSON.stringify(allResults));
        for (var i = 0; i < allResults.length; i++) {
            var itemid = allResults[i].getValue({
                name: 'memberitem',
            });
            var itemtype = allResults[i].getValue({
                name: 'type',
                join: 'memberItem',
            });
            if (itemtype != 'InvPart') {
                assemblies.push(itemid);
            }
            components.push(itemid);
        }
        if (assemblies.length > 0) {
            log.debug('more assemblies found, reiterating', JSON.stringify(assemblies));
            var allDependentComponents = getAllAssemblyComponents(assemblies);
            components.concat(allDependentComponents);
        }
        return components
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