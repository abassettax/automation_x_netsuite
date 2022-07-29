function replacer(key, value) {
    'use strict';
    key = 0;
    if (typeof value === 'number' && !isFinite(value)) {
        return String(value);
    }
    return value;
}

function roundUpCurrency(amount) {
    'use strict';
    var temp_value = parseFloat('0');

    if (!isNaN(amount) && amount !== null) {
        temp_value = parseFloat(amount);
    }

    //Take any amount and round up ... using 2 decimal places.
    temp_value = Math.round(temp_value * 100) / 100;
    return temp_value.toFixed(2);
}

/*
 * @Function: getCustomCodeValue
 * @Purpose: This function loads
 * @Parameters: Type (default) Defaults record Type
 *              Name (default) the field that is being updated
 *              linenum (default) the line index of the lineitem
 * @Returns: N/A
 */

function getCustomCodeValue(r, fieldName, invNbr) {
    'use strict';
    var customCodeFieldValue, mySplitResult;
    customCodeFieldValue = r.getFieldValue(fieldName);
    if (customCodeFieldValue === null) {
        return '';
    }

    mySplitResult = customCodeFieldValue.split(',');
    if (mySplitResult !== null) {

        if (mySplitResult.length === 1) {
            return customCodeFieldValue;
        }

        if (mySplitResult.length > 1) {
            return mySplitResult[invNbr - 1];
        }
    }
    return '';
}

function Before_Load(type, form) {
    'use strict';
    var numberOfCopies, script;

    numberOfCopies = parseInt(nlapiGetFieldValue('custbody_totalnumberofchildinvoices'), 10);
    if (type.toString() === 'view' && numberOfCopies > 0) {
        script = "window.open('https://system.na3.netsuite.com/c.422523/site/InvoiceSplit/invoiceSplit.html', 'invoiceWinID', 'height=200,width=200');";
        form.addButton('custpage_generateinvoices', 'Split Invoice', script);
    }
}

function callInvoiceSplitRESTlet(request, response) {
    'use strict';
    var url, headers, myJSONText, restletResponse;
    url = 'https://rest.na3.netsuite.com/app/site/hosting/restlet.nl?script=199&deploy=1';
    headers = new Array();
    headers['User-Agent-x'] = 'SuiteScript-Call';
    headers['Authorization'] = 'NLAuth nlauth_account=422523, nlauth_email=Trajectory@automation-x.com,nlauth_signature=dD2I@7HL, nlauth_role=3';
    headers['Content-Type'] = 'application/json';
    var jsonobj = {
            'invoiceid' : 1
        };
    myJSONText = JSON.stringify(jsonobj, replacer);
    restletResponse = nlapiRequestURL(url, myJSONText, headers);
    response.write(restletResponse.body);
}

function InvoiceSplitRESTlet(datain) {
    'use strict';
    var systemJson, fields, values, id, invoicesArray, originalInvoice, i, j, k, invNbr, childInvoice, lineAmt, lineQty, lineItemCount, salesOrder, numberOfCopies;

    invoicesArray = [];
    originalInvoice = nlapiLoadRecord('invoice', datain.invoiceid);
    numberOfCopies = parseInt(originalInvoice.getFieldValue('custbody_totalnumberofchildinvoices'), 10);

    nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', 'Splitting Invoice ' + originalInvoice.getFieldValue('tranid') + ' into ' + numberOfCopies.toString() + ' seperate invoices');

    // create copies
    for (i = 0; i < numberOfCopies; i = i + 1) {
        invNbr = i + 1;

        //Create Child Invoice
        nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', 'Creating Invoice ' + invNbr.toString() + ' of ' + numberOfCopies.toString());
        childInvoice = nlapiCopyRecord('invoice', nlapiGetRecordId());

        //Set up the header fields
        childInvoice.setFieldValue('custbody_totalnumberofchildinvoices', '');
        childInvoice.setFieldValue('custbody_originalinvoicennumber', originalInvoice.getFieldValue('tranid'));
        childInvoice.setFieldValue('custbody_childinvoicenumber', 'Invoice ' + invNbr + ' of ' + numberOfCopies);

        //Process each lineitem
        lineItemCount = parseInt(childInvoice.getLineItemCount('item'), 10);

        for (j = 1; j <= lineItemCount; j = j + 1) {
            lineAmt = roundUpCurrency(childInvoice.getLineItemValue('item', 'amount', j) / numberOfCopies);
            lineQty = childInvoice.getLineItemValue('item', 'quantity', j) / numberOfCopies;
            childInvoice.setLineItemValue('item', 'amount', j, lineAmt);
            childInvoice.setLineItemValue('item', 'quantity', j, lineQty);
        }

        //Split out the Header Totals
        childInvoice.setFieldValue('discounttotal', roundUpCurrency(childInvoice.getFieldValue('discounttotal') / numberOfCopies));
        childInvoice.setFieldValue('shippingcost', roundUpCurrency(childInvoice.getFieldValue('shippingcost') / numberOfCopies));
        childInvoice.setFieldValue('handlingcost', roundUpCurrency(childInvoice.getFieldValue('handlingcost') / numberOfCopies));

        // Copy over Custom Codes
        //Well Site Name
        childInvoice.setFieldValue('custbody8', getCustomCodeValue(childInvoice, 'custbody8', invNbr));
        //Well Number
        childInvoice.setFieldValue('custbody9', getCustomCodeValue(childInvoice, 'custbody9', invNbr));
        //Accounting #
        childInvoice.setFieldValue('custbody10', getCustomCodeValue(childInvoice, 'custbody10', invNbr));
        //Code
        childInvoice.setFieldValue('custbody11', getCustomCodeValue(childInvoice, 'custbody11', invNbr));
        //Code
        childInvoice.setFieldValue('custbody13', getCustomCodeValue(childInvoice, 'custbody13', invNbr));
        //Code
        childInvoice.setFieldValue('custbody14', getCustomCodeValue(childInvoice, 'custbody14', invNbr));
        //Code
        childInvoice.setFieldValue('custbody15', getCustomCodeValue(childInvoice, 'custbody15', invNbr));
        //Make sure Shipment Detail field is copied over.
        childInvoice.setFieldValue('custbody16', getCustomCodeValue(childInvoice, 'custbody16', invNbr));
        //Technician Name
        childInvoice.setFieldValue('custbody38', getCustomCodeValue(childInvoice, 'custbody38', invNbr));
        //Technician Name
        childInvoice.setFieldValue('custbody39', getCustomCodeValue(childInvoice, 'custbody39', invNbr));
        //Technician Name
        childInvoice.setFieldValue('custbody60', getCustomCodeValue(childInvoice, 'custbody60', invNbr));
        //Technician Name
        childInvoice.setFieldValue('custbody62', getCustomCodeValue(childInvoice, 'custbody62', invNbr));
        //Reasons Code
        childInvoice.setFieldValue('custbody67', getCustomCodeValue(childInvoice, 'custbody67', invNbr));
        //Plant Code
        childInvoice.setFieldValue('custbody69', getCustomCodeValue(childInvoice, 'custbody69', invNbr));
        //Approver ID
        childInvoice.setFieldValue('custbody73', getCustomCodeValue(childInvoice, 'custbody73', invNbr));
        //GL Account
        childInvoice.setFieldValue('custbody74', getCustomCodeValue(childInvoice, 'custbody74', invNbr));
        //Online Paykey/UserID
        childInvoice.setFieldValue('custbody87', getCustomCodeValue(childInvoice, 'custbody87', invNbr));

        //Copy over Tracking Numbers
        //Netsuite doesn't allow copying TO the linkedtrackingnumbers field, so we'll place it in the Additional Tracking # field as a work-around.
        childInvoice.setFieldValue('trackingnumbers', originalInvoice.getFieldValue('linkedtrackingnumbers'));
        childInvoice.setFieldValue('shipdate', originalInvoice.getFieldValue('shipdate'));
        id = nlapiSubmitRecord(childInvoice, true, false);
        invoicesArray.push(nlapiLookupField('invoice', id, 'tranid'));
    }

    //Modify THIS Invoice
    lineItemCount = parseInt(originalInvoice.getLineItemCount('item'), 10);

    nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', 'Zeroing out ' + lineItemCount + ' line items');

    // Modify invoice - set line item amounts to zero
    for (k = 1; k <= lineItemCount; k = k + 1) {
        originalInvoice.setLineItemValue('item', 'amount', k, 0);
        originalInvoice.setLineItemValue('item', 'tax1Amt', k, 0);
        originalInvoice.setLineItemValue('item', 'quantity', k, 0);
    }

    originalInvoice.setFieldValue('subtotal', 0);
    originalInvoice.setFieldValue('discounttotal', 0);
    originalInvoice.setFieldValue('taxtotal', 0);
    originalInvoice.setFieldValue('tax2Total', 0);
    originalInvoice.setFieldValue('shippingcost', 0);
    originalInvoice.setFieldValue('handlingcost', 0);
    originalInvoice.setFieldValue('origtotal', 0);
    originalInvoice.setFieldValue('origtotal2', 0);
    originalInvoice.setFieldValue('amountremaining', 0);
    originalInvoice.setFieldValue('taxamountoverride', 0);
    originalInvoice.setFieldValue('total', 0);
    originalInvoice.setFieldValue('custbody_totalnumberofchildinvoices', invoicesArray.length);
    originalInvoice.setFieldValue('custbody_childinvoicenumber', invoicesArray.join());

    id = nlapiSubmitRecord(originalInvoice, true, false);

    //Update associated Sales Order
    if (nlapiGetFieldValue('createdfrom') !== null && nlapiGetFieldValue('createdfrom').length > 0) {
        //Modify Associated Sales Order
        salesOrder = nlapiLookupField('salesorder', nlapiGetFieldValue('createdfrom'), [ 'custbody_originalinvoicennumber', 'custbody_childinvoicenumber' ]);

        if (salesOrder !== null) {
            fields = [];
            values = [];
            //Update original Invoice Numbers
            fields.push('custbody_originalinvoicennumber');
            if (salesOrder.custbody_originalinvoicennumber !== null && salesOrder.custbody_originalinvoicennumber.length > 0) {
                values.push(salesOrder.custbody_originalinvoicennumber + ', ' + originalInvoice.getFieldValue('tranid'));
            } else {
                values.push(originalInvoice.getFieldValue('tranid'));
            }

            //Update original Child Invoice Numbers
            fields.push('custbody_originalinvoicennumber');
            if (salesOrder.custbody_childinvoicenumber !== null && salesOrder.custbody_childinvoicenumber.length > 0) {
                values.push(salesOrder.custbody_childinvoicenumber + ', ' + invoicesArray.join());
            } else {
                values.push(invoicesArray.join());
            }
            // save sales order
            nlapiSubmitField('salesorder', nlapiGetFieldValue('createdfrom'), fields, values);
        }
    }
    systemJson = {'message': 'success!'};
    return systemJson;
}