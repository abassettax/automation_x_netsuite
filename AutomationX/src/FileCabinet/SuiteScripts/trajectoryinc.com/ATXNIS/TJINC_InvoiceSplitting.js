/**
 * Copyright (c) 2011 Trajectory Inc.
 * 165 John St. 3rd Floor, Toronto, ON, Canada, M5T 1X3
 * www.trajectoryinc.com
 * All Rights Reserved.
 */

/**
 * @System: Netsuite - Production
 * @Author: Darren Hill
 * @Company: Trajectory Inc. / Kuspide Canada Inc.
 * @CreationDate: 2012/03/16
 * @GeneralDescription: This script is to enforce Swish Data specific Time Sheet rules.
 * @LastModificationDate: 2012/03/22
 * @LastModificationAuthor: Darren Hill
 * @LastModificationDescription: Creation
 * @NamingStandard: TJINC_NSJ-1-1
 * @Version 1.0
 */

var INVOICE_FORM = 262;

/*
 * @Function: roundUpCurrency
 * @Purpose: This function loads
 * @Parameters: Type (default) Defaults record Type
 *              Name (default) the field that is being updated
 *              linenum (default) the line index of the lineitem
 * @Returns: N/A
 */

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

/*
 * @Function: TJINC_OnSave
 * @Purpose: This function loads
 * @Parameters: Type (default) Defaults record Type
 *              Name (default) the field that is being updated
 *              linenum (default) the line index of the lineitem
 * @Returns: N/A
 */

function TJINC_AfterSubmit(type) {
    'use strict';
    var id, numberOfCopies, invoicesArray, originalInvoice, i, j, k, invNbr, childInvoice, lineAmt, lineQty, lineItemCount, salesOrder, str;

    numberOfCopies = parseInt(nlapiGetFieldValue('custbody_totalnumberofchildinvoices'), 10);

    if (numberOfCopies > 0) {
        invoicesArray = [];
        originalInvoice = nlapiLoadRecord('invoice', nlapiGetRecordId());

        nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', 'Splitting Invoice ' + originalInvoice.getFieldValue('tranid') + ' into ' + numberOfCopies.toString() + ' seperate invoices');

        // create copies
        for (i = 0; i < numberOfCopies; i = i + 1) {
            invNbr = i + 1;

            //Create Child Invoice
            nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', 'Creating Invoice ' + invNbr.toString() + ' of ' + numberOfCopies.toString());
            childInvoice = nlapiCopyRecord('invoice', nlapiGetRecordId());

            //Set up the header fields
            childInvoice.setFieldValue('trandate', originalInvoice.getFieldValue('trandate'));
            childInvoice.setFieldValue('custbody_totalnumberofchildinvoices', '');
            childInvoice.setFieldValue('custbody_originalinvoicennumber', originalInvoice.getFieldValue('tranid'));
            childInvoice.setFieldValue('custbody_childinvoicenumber', 'Invoice ' + invNbr + ' of ' + numberOfCopies);

            //Process each lineitem
            lineItemCount = parseInt(childInvoice.getLineItemCount('item'), 10);

            for (j = 1; j <= lineItemCount; j = j + 1) {
                lineAmt = roundUpCurrency(childInvoice.getLineItemValue('item', 'amount', j) / numberOfCopies);
                lineQty = childInvoice.getLineItemValue('item', 'quantity', j) / numberOfCopies;
                nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', 'Checking vals ' + lineAmt + ' | ' + lineQty);
                // var lineDetRec = childInvoice.viewLineItemSubrecord('item', 'inventorydetail', j);
                // nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', 'lineDetRec ' + JSON.stringify(lineDetRec));
                // var detLines = lineDetRec.getLineItemCount('inventoryassignment');
                // var binNum = lineDetRec.getLineItemValue('inventoryassignment', 'binnumber', 1);
                // nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', 'binNum: ' + binNum);
                childInvoice.selectLineItem('item', j);
                childInvoice.setCurrentLineItemValue('item', 'amount', lineAmt);
                childInvoice.setCurrentLineItemValue('item', 'quantity', lineQty);
                var compSubRecord = childInvoice.editCurrentLineItemSubrecord('item', 'inventorydetail');
                compSubRecord.selectLineItem('inventoryassignment', 1);
                // compSubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', binNum);
                compSubRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', lineQty);
                compSubRecord.commitLineItem('inventoryassignment');
                compSubRecord.commit();
                childInvoice.commitLineItem('item');
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
            //childInvoice.setFieldValue('linkedtrackingnumbers', originalInvoice.getFieldValue('linkedtrackingnumbers') );
            //childInvoice.setFieldValue('handlingtaxcode', 9162);
            //childInvoice.setFieldValue('shippingtaxcode', 9162);
            id = nlapiSubmitRecord(childInvoice, true, false);
            invoicesArray.push(nlapiLookupField('invoice', id, 'tranid'));
            //url_servlet = nlapiResolveURL('SUITELET', 187, 1);
            //url_servlet = url_servlet + '&invoiceId=' + id;
            //nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', 'Resubmitting (avaTax) ' + url_servlet);
            //nlapiRequestURL(url_servlet);
        }

        //Modify THIS Invoice
        lineItemCount = parseInt(originalInvoice.getLineItemCount('item'), 10);

        nlapiLogExecution('DEBUG', 'TJINC_AfterSubmit', 'Zeroing out ' + lineItemCount + ' line items');

        // Modify invoice - set line item amounts to zero
        for (k = 1; k <= lineItemCount; k = k + 1) {
            originalInvoice.setLineItemValue('item', 'amount', k, 0);
            originalInvoice.setLineItemValue('item', 'tax1Amt', k, 0);
            originalInvoice.setLineItemValue('item', 'quantity', k, 0);
            //TODO: remove line inv det
            originalInvoice.selectLineItem('item', k);
            var invDetailSubrecord = originalInvoice.viewCurrentLineItemSubrecord('item', 'inventorydetail');
            if (invDetailSubrecord != null) {
                originalInvoice.removeCurrentLineItemSubrecord('item', 'inventorydetail');
                originalInvoice.commitLineItem('item');
            }
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
            salesOrder = nlapiLoadRecord('salesorder', nlapiGetFieldValue('createdfrom'));

            if (salesOrder !== null) {

                //Update original Invoice Numbers
                str = salesOrder.getFieldValue('custbody_originalinvoicennumber');
                if (str !== null && str.length > 0) {
                    salesOrder.setFieldValue('custbody_originalinvoicennumber', str + ', ' + originalInvoice.getFieldValue('tranid'));
                } else {
                    salesOrder.setFieldValue('custbody_originalinvoicennumber', originalInvoice.getFieldValue('tranid'));
                }

                //Update original Child Invoice Numbers
                str = salesOrder.getFieldValue('custbody_childinvoicenumber');
                if (str !== null && str.length > 0) {
                    salesOrder.setFieldValue('custbody_childinvoicenumber', str + ', ' + invoicesArray.join());
                } else {
                    salesOrder.setFieldValue('custbody_childinvoicenumber', invoicesArray.join());
                }

                // save sales order
                nlapiSubmitRecord(salesOrder, true, false);
            }
        }
    }
}

function reSubmitInvoice(request, response) {
    'use strict';
    var i_invoiceId, originalInvoice;
    i_invoiceId = request.getParameter('invoiceId') === null || isNaN(request.getParameter('invoiceId')) ? -1 : parseInt(request.getParameter('invoiceId'), 10);
    i_invoiceId = isNaN(i_invoiceId) ? -1 : i_invoiceId;
    if (i_invoiceId !== -1) {
        nlapiLogExecution('DEBUG', 'reSubmitInvoice', 'Request to resubmit Invoice ' + i_invoiceId.toString());
        originalInvoice = nlapiLoadRecord('invoice', i_invoiceId);
        id = nlapiSubmitRecord(originalInvoice, true, false);
    }
}