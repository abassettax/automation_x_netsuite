require(['N/currentRecord'],
    function(currentRecord) {
        //NEED TO SELECT HEADER LOCATION FIRST
        var rec = currentRecord.get(); 
        var items = rec.getLineCount({sublistId: 'item'}); 
        var data = [];
        console.log('# items: ' + items);
        for (var i = 0; i < items; i++) {
            var lineItem = rec.getSublistValue({sublistId: 'item', fieldId: 'item', line: i});
            var lineQty = rec.getSublistValue({sublistId: 'item', fieldId: 'quantity', line: i});
            // rec.selectLine({sublistId: 'item', line: i});
            // var invDet = rec.getCurrentSublistSubrecord({sublistId: 'item', fieldId: 'inventorydetail'});
            // if (i == 0) {
            //     console.log('before push');
            // }
            data.push({
                item: lineItem,
                qty: lineQty
            });
            if (i == 0) {
                console.log('data: ' + JSON.stringify(data));
            }
            
            // var s= document.getElementById('inventoryassignment_binnumber_display');
            // s.value = 38845;
            // if (i == 0) {
            //     console.log('test 1')
            // }
            // var s= document.getElementById('quantity_formattedValue');
            // s.value = lineQty;
            // if (i == 0) {
            //     console.log('test 2')
            // }

            // invDet.selectNewLine({sublistId: 'inventoryassignment'});
            // invDet.setCurrentSublistValue({sublistId: 'inventoryassignment ', fieldId: 'tobinnumber', value: 38845}); //receiving bin id
            // invDet.setCurrentSublistValue({sublistId: 'inventoryassignment ', fieldId: 'quantity', value: lineQty});
            // invDet.cancelLine({sublistId: 'item'});
            // rec.cancelLine({sublistId: 'item'});
        }
        console.log('data: ' + data.length + JSON.stringify(data));
    }
);
