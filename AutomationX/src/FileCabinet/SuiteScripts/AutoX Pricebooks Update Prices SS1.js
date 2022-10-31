function updateprices() {
    var pricebookId = nlapiGetContext().getSetting('SCRIPT','custscript_ax_pricebook_id_ss');
    nlapiLogExecution('debug', 'pricebookId', pricebookId);
    var updatePrices = JSON.parse(nlapiGetContext().getSetting('SCRIPT','custscript_ax_pricebook_prices_ss'));
    nlapiLogExecution('debug', 'updatePrices', JSON.stringify(updatePrices));
    var finalData = [];
    var allCustomers = getPricebookCustomers(pricebookId);
    nlapiLogExecution('debug', 'allCustomers', allCustomers.length + ' | ' + JSON.stringify(allCustomers));
    for (var i = 0; i < allCustomers.length; i++) {
        finalData.push({
            customer: allCustomers[i],
            pricedata: updatePrices
        });
    }
    nlapiLogExecution('debug', 'finalData', JSON.stringify(finalData));
    for (var i = 0; i < finalData.length; i++) {
        // nlapiLogExecution('debug', 'index i', i);
        var cust = finalData[i].customer;
        var updatePrices = finalData[i].pricedata;

        //removed since we need specific pricing on all customers listed on a pricebook, even if they are children
        // var ischild = nlapiLookupField('customer', cust, 'parent');
        // //check to see if there is a parent customer if so update that customer
        // if (ischild) {
        //     if (nlapiLookupField('customer', ischild, 'custentity333') == "T") { cust = ischild; }
        // }
        var custRec = nlapiLoadRecord('customer', cust);
        for (x = 0; x < updatePrices.length; x++) {
            // nlapiLogExecution('debug', 'index x', x);
            var item = updatePrices[x].item;
            var price = updatePrices[x].rate;

            for (j = 1; j <= custRec.getLineItemCount('itempricing'); j++) {

                var thisitemid = custRec.getLineItemValue('itempricing', 'item', j);
                if (item == thisitemid && price) {
                    custRec.setLineItemValue('itempricing', 'level', j, -1);
                    custRec.setLineItemValue('itempricing', 'price', j, price);
                    //alert("Customer Price Record Updated");
                    break;
                }
            }
            if (item != thisitemid && price) {
                custRec.selectNewLineItem('itempricing');
                custRec.setCurrentLineItemValue('itempricing', 'item', item);
                custRec.setCurrentLineItemValue('itempricing', 'level', -1);
                custRec.setCurrentLineItemValue('itempricing', 'price', price);
                custRec.commitLineItem('itempricing');
            }
        }
        nlapiSubmitRecord(custRec, false, true);
        nlapiLogExecution('debug', 'customer rec updated', cust);
    }

    return true;
}
function getPricebookCustomers(pricebookId) {
    var customrecord1280Search = nlapiSearchRecord("customrecord1280",null,
    [
    ["internalid","anyof",pricebookId], 
    ], 
    [
    new nlobjSearchColumn("internalid","CUSTRECORD319",null)
    ]
    );
    nlapiLogExecution('debug', 'getPricebookCustomers customrecord1280Search', JSON.stringify(customrecord1280Search));
    var custIds = [];
    for (var k = 0; k < customrecord1280Search.length; k++) {
        var custId = customrecord1280Search[k].getValue("internalid","CUSTRECORD319",null);
        custIds.push(custId);
    }
    return custIds;
}