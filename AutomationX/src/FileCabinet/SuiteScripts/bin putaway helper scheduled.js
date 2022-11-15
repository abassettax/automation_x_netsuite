/**THIS IS  AN UNFINISHED SCRIPT TO MEANT TO SAVE INVOICES TO A FILE IN MASS.  
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
 define(['N/record', 'N/https'],
 function (record, https) { 
     function execute(context) {
         var binWksht = record.create({
            type: record.Type.BIN_WORKSHEET,
            isDynamic: true
        });
        binWksht.setValue({
            fieldId: 'location',
            value: '17' //WHL | 236 is WHL OS
        });
        binWksht.setValue({
            fieldId: 'memo',
            value: 'init bin putaway'
        });
        //TODO: change to full data len
        for (var i = 0; i < 10; i++) {
            binWksht.selectLine({
                sublistId: 'item',
                line: i
            });
            var lineItem = binWksht.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item'
            });
            var lineQty = binWksht.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity'
            });
            log.debug('data', 'lineItem: ' + lineItem);
            log.debug('data', 'lineQty: ' + lineQty);
            // var dataIndex = findWithAttr(allData,'item',lineItem);
            // log.debug('Inputs', 'dataIndex: ' + dataIndex);
            var invDet = binWksht.getCurrentSublistSubrecord({sublistId: 'item', fieldId: 'inventorydetail'});
            var invAssignment = invDet.getSublist({
                sublistId: 'inventoryassignment'
            });
            log.debug('data', 'invAssignment: ' + JSON.stringify(invAssignment));
            invDet.selectNewLine({sublistId: 'inventoryassignment'});
            invDet.setCurrentSublistValue({sublistId: 'inventoryassignment ', fieldId: 'binnumber', value: '38845'}); //WHS-Receiving bin id | WHL-OS-Receiving is 38846
            invDet.setCurrentSublistValue({sublistId: 'inventoryassignment ', fieldId: 'quantity', value: lineQty});
            invDet.commitLine({sublistId: 'inventoryassignment'});
            binWksht.commitLine({sublistId: 'item'});
        }
        var recId = binWksht.save();
        log.debug('Complete', 'wksht id: ' + recId);
    //     var response = https.post({
    //         url: 'https://422523.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=2453&deploy=1',
    //         body: 'My POST Data'
    //     });
    //     log.debug('Inputs', 'response: ' + response.body);
     }
    //  function findWithAttr(array, attr, value) {
    //     for(var i = 0; i < array.length; i += 1) {
    //         if(array[i][attr] === value) {
    //             return i;
    //         }
    //     }
    //     return -1;
    // }
     return {
         execute: execute
     };
 });