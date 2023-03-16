/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/search', 'N/runtime', '/SuiteBundles/Bundle 310544/TJINC_NS_Library_SS2.js'],
    function (search, runtime, tj) {
        function fieldChanged(context) {
            // alert('entry');
            var currentRecord = context.currentRecord;
            var fieldName = context.fieldId;
            var sublist = context.sublistId;
            // alert('field: ' + fieldName + ' | sublist: ' + sublist);
            try {
                if (sublist == 'item' && (fieldName == 'item' || fieldName == 'quantity' || fieldName == 'location' || fieldName == 'costestimatetype' || fieldName == 'custcol121')) {
                    var itemID = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });
                    var location = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'location'
                    });
                    var qty = +currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });
                    //Added override to handle extenuating circumstances. Everything will still default unless users check the box on individual lines, which will push them to only do that when necessary (hopefully)
                    var overrideDef = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol121'
                    });
                    var costEst = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'costestimate'
                    });
                    // alert('vals: ' + itemID + ' | ' + location + ' | ' + overrideDef + ' | ' + costEst);
                    if (itemID != '' && location != '' && !overrideDef && costEst !== '') {
                        //check item type. if non-inv, then use custom. else, check inv. if in stock and sufficient inv, use avg cost. else, use pp.
                        // "costestimatetypelist": [
                        //     "AVGCOST",
                        //     "CUSTOM",
                        //     "ITEMDEFINED",
                        //     "LASTPURCHPRICE",
                        //     "PREFVENDORRATE",
                        //     "PURCHORDERRATE",
                        //     "PURCHPRICE"
                        //     ]
                        var itemLookup = search.lookupFields({
                            type: search.Type.ITEM,
                            id: itemID,
                            columns: ['type']
                        });
                        var itemType = itemLookup.type[0].value;
                        var currentType = currentRecord.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'costestimatetype'
                        });
                        // alert('currentType: ' + currentType);
                        var currentTypeText = currentRecord.getCurrentSublistText({
                            sublistId: 'item',
                            fieldId: 'costestimatetype'
                        });
                        //need to validate committed qty before checking avail
                        var committed = +currentRecord.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantitycommitted'
                        });
                        if (isNaN(committed)){
                            committed = 0;
                        }
                        var fulfilled = +currentRecord.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantityfulfilled'
                        });
                        if (isNaN(fulfilled)){
                            fulfilled = 0;
                        }
                        var remaining = parseFloat(qty) - parseFloat(fulfilled);
                        if (remaining && remaining > 0) {

                        }// alert('currentTypeText: ' + currentTypeText);
                        if (itemType == 'Assembly') {
                            //need to force to custom and define cost based on members. using derived did not result in the correct/expected cost
                            var buildCost;
                            var assemblyitemSearchObj = search.create({
                               type: "assemblyitem",
                               filters:
                               [
                                   ["isinactive","is","F"], 
                                   "AND", 
                                   ["type","anyof","Assembly"], 
                                   "AND", 
                                   ["internalid","anyof",itemID]
                               ],
                               columns:
                               [
                                   search.createColumn({
                                       name: "formulanumeric",
                                       summary: "SUM",
                                       formula: "CASE WHEN {memberitem.type} = 'Service' THEN ({memberquantity}*{memberitem.costestimate}) WHEN {memberitem.type} = 'Assembly/Bill of Materials' THEN ({memberquantity}*{memberitem.price})*0.6 ELSE ({memberquantity}*{memberitem.cost}) END",
                                       label: "Formula (Numeric)"
                                   })
                               ]
                            });
                            assemblyitemSearchObj.run().each(function(result){
                               // .run().each has a limit of 4,000 results
                               buildCost = result.getValue((result.columns[0]));
                               return true;
                            });
                            if (currentTypeText != 'Custom') {
                                currentRecord.setCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'costestimatetype',
                                    value: 'CUSTOM',
                                    ignoreFieldChange: true
                                });
                                currentRecord.setCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'costestimate',
                                    value: (buildCost*qty).toFixed(2)
                                });
                                tj.alert('Cost Estimate has been defaulted to the estimated cost for this build.  Please change or update if needed.');
                            }
                        } else if (itemType == 'NonInvtPart') {
                            if (currentTypeText != 'Custom') {
                                currentRecord.setCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'costestimatetype',
                                    value: 'CUSTOM'
                                });
                            }
                        } else {
                            var itemAvail = 0;
                            var filters = [];
                            var itemFilter = ['internalid', 'anyof'];
                            itemFilter.push(itemID.toString());
                            var locationFilter = ['inventorylocation', 'anyof'];
                            locationFilter.push(location.toString());
                            var fullFilter = [];
                            fullFilter.push(itemFilter);
                            fullFilter.push('AND');
                            fullFilter.push(locationFilter);
                            filters.push(fullFilter);
    
                            search.create({
                                type: 'item',
                                filters: filters,
                                columns: [
                                    'inventorylocation',
                                    'locationquantityavailable'
                                ]
                            }).run().each(function (result) {
                                itemAvail = +result.getValue(result.columns[1])
                                return true;
                            });
                            // alert('avail: ' + itemAvail);
                            // alert('committed: ' + committed);
                            // alert('fulfilled: ' + fulfilled);
                            if (itemAvail > 0 || committed == remaining) {
                                // alert('if');
                                // alert('qty: ' + qty);
                                var diff = committed + itemAvail - remaining;
                                // alert('diff: ' + diff);
                                // alert('check: ' + (diff == 0 || diff > 0) );
                                // alert(currentTypeText != 'Average Cost');
                                if (diff >= 0) {
                                    if (currentTypeText != 'Average Cost') {
                                        currentRecord.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'costestimatetype',
                                            value: 'AVGCOST'
                                        });
                                    }
                                } else {
                                    // alert(currentTypeText != 'Purchase Price');
                                    if (currentTypeText != 'Purchase Price') {
                                        currentRecord.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'costestimatetype',
                                            value: 'PURCHPRICE'
                                        });
                                    }
                                }
                            } else {
                                // alert('else');
                                // alert(currentTypeText != 'Purchase Price');
                                if (currentTypeText != 'Purchase Price') {
                                    currentRecord.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'costestimatetype',
                                        value: 'PURCHPRICE'
                                    });
                                }
                            }
                        }
                    }
                    return true;
                }
            } catch (e) {
                return true;
            }
        }
        //execution order issues causing line to return true and submit prior to field change. causes cost est types to be duplicated on next line. added forceSyncSourcing to fix
        function validateLine (context) {
            //reset cost est type on line validate to handle edge cases
            var currentRecord = context.currentRecord;
            var sublist = context.sublistId;
            // alert('sublist: ' + sublist);
            try {
                if (sublist == 'item') {
                    var itemID = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'item'
                    });
                    var location = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'location'
                    });
                    var qty = +currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });
                    //Added override to handle extenuating circumstances. Everything will still default unless users check the box on individual lines, which will push them to only do that when necessary (hopefully)
                    var overrideDef = currentRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol121'
                    });
                    // var costEst = currentRecord.getCurrentSublistValue({
                    //     sublistId: 'item',
                    //     fieldId: 'costestimate'
                    // });
                    // alert('vals: ' + itemID + ' | ' + location + ' | ' + overrideDef);
                    if (itemID != '' && location != '' && !overrideDef) {
                        //check item type. if non-inv, then use custom. else, check inv. if in stock and sufficient inv, use avg cost. else, use pp.
                        // "costestimatetypelist": [
                        //     "AVGCOST",
                        //     "CUSTOM",
                        //     "ITEMDEFINED",
                        //     "LASTPURCHPRICE",
                        //     "PREFVENDORRATE",
                        //     "PURCHORDERRATE",
                        //     "PURCHPRICE"
                        //     ]
                        var itemLookup = search.lookupFields({
                            type: search.Type.ITEM,
                            id: itemID,
                            columns: ['type']
                        });
                        var itemType = itemLookup.type[0].value;
                        var currentType = currentRecord.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'costestimatetype'
                        });
                        // alert('currentType: ' + currentType);
                        var currentTypeText = currentRecord.getCurrentSublistText({
                            sublistId: 'item',
                            fieldId: 'costestimatetype'
                        });
                        //need to validate committed qty before checking avail
                        var committed = +currentRecord.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantitycommitted'
                        });
                        if (isNaN(committed)){
                            committed = 0;
                        }
                        var fulfilled = +currentRecord.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantityfulfilled'
                        });
                        if (isNaN(fulfilled)){
                            fulfilled = 0;
                        }
                        var remaining = parseFloat(qty) - parseFloat(fulfilled);
                        if (remaining && remaining > 0) {

                        }// alert('currentTypeText: ' + currentTypeText);
                        if (itemType == 'Assembly') {
                            //need to force to custom and define cost based on members. using derived did not result in the correct/expected cost
                            var buildCost;
                            var assemblyitemSearchObj = search.create({
                               type: "assemblyitem",
                               filters:
                               [
                                   ["isinactive","is","F"], 
                                   "AND", 
                                   ["type","anyof","Assembly"], 
                                   "AND", 
                                   ["internalid","anyof",itemID]
                               ],
                               columns:
                               [
                                   search.createColumn({
                                       name: "formulanumeric",
                                       summary: "SUM",
                                       formula: "CASE WHEN {memberitem.type} = 'Service' THEN ({memberquantity}*{memberitem.costestimate}) WHEN {memberitem.type} = 'Assembly/Bill of Materials' THEN ({memberquantity}*{memberitem.price})*0.6 ELSE ({memberquantity}*{memberitem.cost}) END",
                                       label: "Formula (Numeric)"
                                   })
                               ]
                            });
                            assemblyitemSearchObj.run().each(function(result){
                               // .run().each has a limit of 4,000 results
                               buildCost = result.getValue((result.columns[0]));
                               return true;
                            });
                            // if (currentTypeText != 'Custom') {
                                currentRecord.setCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'costestimatetype',
                                    value: 'CUSTOM',
                                    ignoreFieldChange: true
                                });
                                currentRecord.setCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'costestimate',
                                    value: (buildCost*qty).toFixed(2),
                                    forceSyncSourcing: true
                                });
                                // tj.alert('Cost Estimate has been defaulted to the estimated cost for this build.  Please change or update if needed.');
                            // }
                        }
                    }
                    return true;
                }
            } catch (e) {
                return true;
            }
        }
        return {
            fieldChanged: fieldChanged,
            validateLine: validateLine
        };
    });