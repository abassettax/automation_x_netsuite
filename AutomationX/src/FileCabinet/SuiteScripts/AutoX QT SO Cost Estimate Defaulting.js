/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/search', 'N/runtime'],
    function (search, runtime) {
        function fieldChanged(context) {
            // alert('entry');
            var currentRecord = context.currentRecord;
            var fieldName = context.fieldId;
            var sublist = context.sublistId;
            // alert('field: ' + fieldName + ' | sublist: ' + sublist);
            //TODO: causes infinite loop when cost est type is blank, somehow not getting set even though we explicitly set it
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
                // alert('vals: ' + itemID + ' | ' + location + ' | ' + overrideDef);
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
                    // alert('currentTypeText: ' + currentTypeText);
                    if (itemType == 'NonInvtPart' || itemType == 'Assembly') {
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
                        if (itemAvail > 0) {
                            // alert('if');
                            // alert('qty: ' + qty);
                            if (qty && qty > 0) {
                                var diff = itemAvail - qty;
                                // alert('diff: ' + diff);
                                // alert('check: ' + (diff == 0 || diff > 0) );
                                // alert(currentTypeText != 'Average Cost');
                                if (diff == 0 || diff > 0) {
                                    if (currentTypeText != 'Average Cost') {
                                        currentRecord.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'costestimatetype',
                                            value: 'AVGCOST'
                                        });
                                        // var currentTypeText = currentRecord.getCurrentSublistText({
                                        //     sublistId: 'item',
                                        //     fieldId: 'costestimatetype'
                                        // });
                                        // alert('new currentTypeText: ' + currentTypeText);
                                    }
                                } else {
                                    // alert(currentTypeText != 'Purchase Price');
                                    if (currentTypeText != 'Purchase Price') {
                                        currentRecord.setCurrentSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'costestimatetype',
                                            value: 'PURCHPRICE'
                                        });
                                        // var currentTypeText = currentRecord.getCurrentSublistText({
                                        //     sublistId: 'item',
                                        //     fieldId: 'costestimatetype'
                                        // });
                                        // alert('new currentTypeText: ' + currentTypeText);
                                    }
                                }
                            // } else if (currentTypeText != 'Average Cost') {
                            //     currentRecord.setCurrentSublistValue({
                            //         sublistId: 'item',
                            //         fieldId: 'costestimatetype',
                            //         value: 'AVGCOST'
                            //     });
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
                                // var currentTypeText = currentRecord.getCurrentSublistText({
                                //     sublistId: 'item',
                                //     fieldId: 'costestimatetype'
                                // });
                                // alert('new currentTypeText: ' + currentTypeText);
                            }
                        }
                    }
                }
                return true;
            }
        }
        return {
            fieldChanged: fieldChanged
        };
    });