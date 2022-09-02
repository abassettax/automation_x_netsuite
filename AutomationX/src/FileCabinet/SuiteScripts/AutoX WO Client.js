/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/search', 'N/ui/message'],
    function (search, message) {
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
                    minDate.setDate(minDate.getDate() + 7);
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
                            alert("Need by Date must be at least one week from today.  Resetting date to one week out. Please pick a date one week out or later.");
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
            } else {
                return true;
            }
        }
        function saveRecord (context) {
            //check lines that want to transfer, validate from location is set and from location has enough available qty
            var currentRecord = context.currentRecord;
            var lineCount = currentRecord.getLineCount({
                sublistId: 'item'
            });
            var failedLine;
            var badTOLine = false;
            for (var i = 0; i < lineCount; i++) {
                var processType = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol90',
                    line: i
                });
                if (processType == '5') {
                    var quantity = currentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i
                    });
                    var fromLocation = currentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol114',
                        line: i
                    });
                    var availQty = currentRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol115',
                        line: i
                    });
                    if (fromLocation == '' || (availQty == '' || availQty == 0)) {
                        badTOLine = true;
                        failedLine = (i+1);
                    }
                }
            }
            if (badTOLine) {
                var myMsg = message.create({
                    title: 'INVALID TRANSFER REQUEST',
                    message: 'One or more of the lines you selected for a Transfer does not have a from location set and/or it does not have enough quantity to transfer. Please correct this line before submitting. Line: ' + failedLine + '.',
                    type: message.Type.ERROR
                });
                myMsg.show({
                    duration: 10000
                });
                return false;
            } else {
                return true;
            }
        }
        return {
            fieldChanged: fieldChanged,
            saveRecord: saveRecord
        };
    });