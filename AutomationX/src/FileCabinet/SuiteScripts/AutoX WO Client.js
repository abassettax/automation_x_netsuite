/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/search', 'N/ui/message'],
    function (search, message) {
        function pageInit(context) {
            if (context.mode == 'create') {
				var currentRecord = context.currentRecord;
                currentRecord.setValue({
                    fieldId: 'orderstatus',
                    value: 'A'
                });
			}
        }
        function fieldChanged(context) {
            var isNew = context.currentRecord.isNew;
            var currentRecord = context.currentRecord;
            var fieldName = context.fieldId;
            var sublist = context.sublistId;
            var line = context.line
            var validateDate;
            if (isNew) {
                validateDate = true;
            } else {
                var status = currentRecord.getValue({
                    fieldId: 'status'
                });
                if (status == 'Released' || status == 'Planned') {
                    validateDate = true;
                }
            }
            if (validateDate) {
                if (fieldName == 'custbody_as_need_by_date') {
                    var newDate = currentRecord.getValue({
                        fieldId: 'custbody_as_need_by_date'
                    });
                    // alert('newDate: ' + newDate.getDate());
                    var minDateRaw = new Date();
                    var minDateYear = minDateRaw.getFullYear();
                    var minDateMonth = minDateRaw.getMonth();
                    var minDateDay = minDateRaw.getDate();
                    var minDate = new Date(minDateYear, minDateMonth, minDateDay, 0, 0, 0, 0);
                    minDate.setDate(minDate.getDate() + 28);    //4 weeks out
                    // alert('minDate: ' + minDate.getDate());
                    if (newDate == '') {
                        currentRecord.setValue({
                            fieldId: 'custbody_as_need_by_date',
                            value: minDate,
                            ignoreFieldChange: true
                        });
                        return true
                    } else {
                        //both are dates, we can compare
                        if (newDate < minDate) {
                            //throw error, return false
                            var dateFormatted = (minDate.getMonth()+1)+'/'+minDate.getDate()+'/'+minDate.getFullYear();
                            alert("Need by Date must be at least four weeks from today. Please pick a date of " + dateFormatted + " or later.");
                            currentRecord.setValue({
                                fieldId: 'custbody_as_need_by_date',
                                value: minDate,
                                ignoreFieldChange: true
                            });
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            } 
            if (sublist == 'item' && (fieldName == 'item' || fieldName == 'custcol114')) {
                var itemID = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item'
                });
                var fromLocation = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol114'
                });
                if (itemID != '' && fromLocation != '') {
                    var itemAvail = 0;
                    var filters = [];
                    var itemFilter = ['internalid', 'anyof'];
                    itemFilter.push(itemID.toString());
                    var locationFilter = ['inventorylocation', 'anyof'];
                    locationFilter.push(fromLocation.toString());
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
                    currentRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol115',
                        value: itemAvail
                    });
                }
                if (fromLocation == '') {
                    currentRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol115',
                        value: ''
                    });
                }
            } else if (sublist == 'item' && (fieldName == 'custcol90' || fieldName == 'custcol117')) {
                //TODO: validate fieldChanged behavior
                var purchReq = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol90'
                });
                var prType = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol117'
                });
                if (purchReq == '1' && prType == '') {
                    currentRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol117',
                        value: '1',
                        ignoreFieldChange: true
                    });
                }
                if (purchReq == '' || purchReq == '5') {
                    currentRecord.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol117',
                        value: '',
                        ignoreFieldChange: true
                    });
                }
            } else {
                return true;
            }
        }
        function validateLine (context) {
            //TODO: validate new function, replaced save record behavior
            var o_rec = context.currentRecord;
                var i_prVal, i_prType, i_loc, i_qty, i_qtyavail;
                try {
                    if (context.sublistId === 'item') {
                        i_prVal = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol90' });
                        i_prType = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol117' });
                        i_prVendor = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'povendor' });

                        i_loc = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol114' });
                        i_qty = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity' });
                        i_qtyavail = o_rec.getCurrentSublistValue({ sublistId: 'item', fieldId: 'custcol115' });

                        // log.debug('Purchase Request: ', i_prVal);
                        if (i_prVal) {
                            if (i_prVal == '1') {
                                //if PR, validate selection for purchase request type
                                if (i_prType == '') {
                                    alert('The current line you selected for a Purchase Request does not have a Purchase Request Type set. Please correct this line before submitting.')
                                    return false;
                                }
                                //if PR, validate selection for Vendor
                                if (i_prVendor == '') {
                                    alert('The current line you selected for a Purchase Request does not have a Vendor set. Please correct this line before submitting.')
                                    return false;
                                }
                            }
                            if (i_prVal == '5') {
                                //TODO: since only Tech Services is placing WOs, can we allow them to transfer from panel shops?
                                if (i_loc == '218' || i_loc == '219') {
                                    alert('The current line you selected for a Transfer is attempting to transfer from a panel shop. Please choose a different transfer location before submitting.')
                                    return false;
                                }
                                //if TO, validate selection for ship loc (and qty avail > qty)
                                if (i_loc == '' || (i_qtyavail == '' || i_qtyavail == 0 || i_qtyavail < i_qty)) {
                                    alert('The current line you selected for a Transfer does not have a from Ship Loc set and/or it does not have enough quantity to transfer. Please correct this line before submitting.')
                                    return false;
                                }
                                
                            }
                        }
                    }
                    return true;
                } catch (e) {
                    log.error('_cs_so_purchasereq', e);
                    return true;
                }
        }
        function saveRecord (context) {
            if (context.mode == 'create') {
				var currentRecord = context.currentRecord;
                //default to Planned
                currentRecord.setValue({
                    fieldId: 'orderstatus',
                    value: 'A'
                });
			}
            return true;
        //     //check lines that want to transfer, validate from location is set and from location has enough available qty
        //     //also need to validate PR lines any make sure pr type isn't empty
        //     var currentRecord = context.currentRecord;
        //     var lineCount = currentRecord.getLineCount({
        //         sublistId: 'item'
        //     });
        //     var failedLine;
        //     var badTOLine = false;
        //     var badPRLine = false;
        //     for (var i = 0; i < lineCount; i++) {
        //         var processType = currentRecord.getSublistValue({
        //             sublistId: 'item',
        //             fieldId: 'custcol90',
        //             line: i
        //         });
        //         if (processType == '5') {
        //             var quantity = currentRecord.getSublistValue({
        //                 sublistId: 'item',
        //                 fieldId: 'quantity',
        //                 line: i
        //             });
        //             var fromLocation = currentRecord.getSublistValue({
        //                 sublistId: 'item',
        //                 fieldId: 'custcol114',
        //                 line: i
        //             });
        //             var availQty = currentRecord.getSublistValue({
        //                 sublistId: 'item',
        //                 fieldId: 'custcol115',
        //                 line: i
        //             });
        //             if (fromLocation == '' || (availQty == '' || availQty == 0 || availQty < quantity)) {
        //                 badTOLine = true;
        //                 failedLine = (i+1);
        //             }
        //         }
        //         var prType = currentRecord.getSublistValue({
        //             sublistId: 'item',
        //             fieldId: 'custcol117',
        //             line: i
        //         });
        //         if (processType != '' && (prType == '')) {
        //             badPRLine = true;
        //             failedLine = (i+1);
        //         }
        //     }
        //     if (badTOLine) {
        //         var myMsg = message.create({
        //             title: 'INVALID TRANSFER REQUEST',
        //             message: 'One or more of the lines you selected for a Transfer does not have a from location set and/or it does not have enough quantity to transfer. Please correct this line before submitting. Line: ' + failedLine + '.',
        //             type: message.Type.ERROR
        //         });
        //         myMsg.show({
        //             duration: 10000
        //         });
        //         return false;
        //     } else if (badPRLine) {
        //         //TODO: validate this gets thrown on save
        //         var myMsg = message.create({
        //             title: 'INVALID PURCHASE REQUEST',
        //             message: 'One or more of the lines you selected for a Purchase Request does not have a Purchase Request Type set. Please correct this line before submitting. Line: ' + failedLine + '.',
        //             type: message.Type.ERROR
        //         });
        //         myMsg.show({
        //             duration: 10000
        //         });
        //         return false;
        //     } else {
        //         return true;
        //     }
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            validateLine: validateLine,
            saveRecord: saveRecord
        };
    });