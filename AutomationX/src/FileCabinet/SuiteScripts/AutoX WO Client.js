/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/search'],
    function (search) {
        function fieldChanged(context) {
            var isNew = context.currentRecord.isNew;
            var currentRecord = context.currentRecord;
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
                var fieldName = context.fieldId;
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
            } else {
                return true;
            }
        }
        return {
            fieldChanged: fieldChanged,
        };
    });