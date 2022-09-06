/**
*@NApiVersion 2.x
*@NScriptType UserEventScript
*/
define([
    'N/record', 'N/log', 'N/search',
], function (record, log, search) {

    function beforeSubmit(context) {

        if (context.type != context.UserEventType.CREATE) {
            return;
        } else {
            var invRec = context.newRecord;
            var invTaxTotal = invRec.getValue('taxtotal');
            log.debug({
                title: 'beforeSubmit',
                details: 'invTaxTotal: ' + invTaxTotal
            });
            var invLocation = invRec.getValue('location');
            log.debug({
                title: 'beforeSubmit',
                details: 'invoice location: ' + invLocation
            });
            var invShipState = invRec.getValue('shipstate');
            log.debug({
                title: 'beforeSubmit',
                details: 'invoice ship state: ' + invShipState
            });
            var shipMethod = invRec.getValue('shipmethod');
            if (invShipState == 'CO' && shipMethod != 4605 && invTaxTotal> 0) {   //must be CO, a delivery, and cust in not tax exempt
                var numLines = invRec.getLineCount({
                    sublistId: 'item'
                });
                // log.debug({
                //     title: 'beforeSubmit',
                //     details: 'invoice numLines: ' + numLines
                // });
                invRec.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: 91637,
                    line: numLines
                });
                // log.debug({
                //     title: 'beforeSubmit',
                //     details: 'set item'
                // });
                invRec.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: 1,
                    line: numLines
                });
                // log.debug({
                //     title: 'beforeSubmit',
                //     details: 'set qty'
                // });
                invRec.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'location',
                    value: invLocation,
                    line: numLines
                });
                // log.debug({
                //     title: 'beforeSubmit',
                //     details: 'set location'
                // });
                invRec.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'taxcode',
                    value: '4123',    //CO.EXEMPT (Sales Tax - Exempt, CO)
                    line: numLines
                });
                // log.debug({
                //     title: 'beforeSubmit',
                //     details: 'set taxcode'
                // });
                invRec.setValue({
                    fieldId: 'custbody_ax_co_delfee',
                    value: true
                });
            }
        }
    }
    return {beforeSubmit: beforeSubmit};
});