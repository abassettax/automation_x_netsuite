/// <reference path="References\Explore\SuiteScript\SuiteScriptAPI.js" />
/// <reference path="SharedLibrary_ServerSide.js" />
/**
 * Company			Explore Consulting
 * Copyright			2009 Explore Consulting, LLC
 * Type				NetSuite Server-Side SuiteScript
 * Version			1.0.0.0
 * Description
 **/
var g_finalTotal, g_splitFractionfinalTotal, g_finalShippingTotal, g_splitFractionShippingTotal;
g_finalTotal = g_splitFractionfinalTotal = g_finalShippingTotal = g_splitFractionShippingTotal = parseFloat('0');

var INVOICE_FORM = 262;


function onBeforeLoad(type, form, request) {}

function onBeforeSubmit(type) {}

function onAfterSubmit(type) {
	var customForm = nlapiGetFieldValue("customform");
	
    if (type == "create" && customForm!=INVOICE_FORM) {
        try {
            //obtain record ID
            var recordID = nlapiGetRecordId();
            ProcessRecord(recordID);
        } catch (e) {
            var msg = Logger.FormatException(e);
            Logger.Write(Logger.LogType.Error, "onAfterSubmit", msg);
            throw msg;
        }
    }
}

function roundUpCurrency( amount ){
	var temp_value = parseFloat('0');
	
	if(!isNaN(amount) && amount!=null)
		temp_value = parseFloat(amount);
	
	//Take any amount and round up ... using 2 decimal places.
	temp_value = Math.round(temp_value*100)/100;
	return temp_value.toFixed(2);
}

function ValidateTotals(numberofCopies) {

    numberofCopies = parseInt(numberofCopies);
    var splitSubTotal, splitDisTotal, splitTaxTotal, splitShippingTotal, splitHandlingTotal;

    if (numberofCopies > 1) {

        var subTotal 		= roundUpCurrency(nlapiGetFieldValue("subtotal"));
        var disTotal 		= roundUpCurrency(nlapiGetFieldValue("discounttotal"));
        var taxTotal 		= roundUpCurrency(nlapiGetFieldValue("taxtotal"));
        var shippingTotal 	= roundUpCurrency(nlapiGetFieldValue("shippingcost"));
        var handlingTotal 	= roundUpCurrency(nlapiGetFieldValue("handlingcost"));

        splitSubTotal = roundUpCurrency( subTotal / numberofCopies );
        Logger.Write(Logger.LogType.Debug, "ValidateTotals", "splitSubTotal: " + splitSubTotal.toString());
        
        splitDisTotal = roundUpCurrency( disTotal / numberofCopies );
        Logger.Write(Logger.LogType.Debug, "ValidateTotals", "splitDisTotal: " + splitDisTotal.toString());
        
        splitShippingTotal = roundUpCurrency( shippingTotal / numberofCopies );
        Logger.Write(Logger.LogType.Debug, "ValidateTotals", "splitShippingTotal: " + splitShippingTotal.toString());
        
        splitHandlingTotal = roundUpCurrency( handlingTotal / numberofCopies );
        Logger.Write(Logger.LogType.Debug, "ValidateTotals", "splitHandlingTotal: " + splitHandlingTotal.toString());

        if (splitShippingTotal <= 0) {
            g_finalTotal = splitSubTotal + splitDisTotal + splitShippingTotal + splitHandlingTotal;
            Logger.Write(Logger.LogType.Debug, "ValidateTotals", "splitShippingTotal <= 0: " + g_finalTotal.toString());
        }

        if (splitShippingTotal > 0) {
            g_finalShippingTotal = splitShippingTotal;
            g_finalTotal = splitSubTotal + splitDisTotal + splitHandlingTotal;
            Logger.Write(Logger.LogType.Debug, "ValidateTotals", "splitShippingTotal > 0: " + g_finalShippingTotal.toString());
            Logger.Write(Logger.LogType.Debug, "ValidateTotals", "splitShippingTotal > 0: " + g_finalTotal.toString());
        }

        Logger.Write(Logger.LogType.Debug, "ValidateTotals", "g_finalTotal: " + g_finalTotal.toString());
        
        if (g_finalTotal > 0) {
            if (!is_int(g_finalTotal.toString())) {
                g_splitFractionfinalTotal = parseFloat(g_finalTotal) - parseInt(g_finalTotal); // Get fractional part
                if (g_splitFractionfinalTotal > 0) {
                    g_splitFractionfinalTotal = 1 - g_splitFractionfinalTotal;
                    g_finalTotal = g_finalTotal + g_splitFractionfinalTotal;
                }
            }
        }
        
        Logger.Write(Logger.LogType.Debug, "ValidateTotals", "g_finalTotal: " + g_finalTotal.toString());

        Logger.Write(Logger.LogType.Debug, "ValidateTotals", "g_finalShippingTotal: " + g_finalShippingTotal.toString());
        if (g_finalShippingTotal > 0) {
            if (!is_int(g_finalShippingTotal.toString())) {
                g_splitFractionShippingTotal = parseFloat(g_finalShippingTotal) - parseInt(g_finalShippingTotal); // Get fractional part
                if (g_splitFractionShippingTotal > 0) {
                    g_splitFractionShippingTotal = 1 - g_splitFractionShippingTotal;
                    g_finalShippingTotal = g_finalShippingTotal + g_splitFractionShippingTotal;
                }
            }
        }
        
        Logger.Write(Logger.LogType.Debug, "ValidateTotals", "g_finalShippingTotal: " + g_finalShippingTotal.toString());
    }
}


function BuildItemQtyList(record, n, qtyList) {

    var lineItemCount = parseInt(record.getLineItemCount("item"));

    for (var i = 1; i <= lineItemCount; i++) {

        var qty = parseInt(record.getLineItemValue("item", "quantity", i));
        qty = qty / n;
        qtyList.push(qty);
    }
}


function ProcessRecord(recordID) {
    // Loading record
    var record = nlapiLoadRecord("invoice", recordID);
    Logger.Write(Logger.LogType.Debug, "ProcessRecord", "Processing Invoice ID: " + recordID.toString());
    var invoicesArray = new Array();
    var actualFinalTotal = 0;
    var qtyList = new Array();

    if (record != null) {
        var custId = parseInt(record.getFieldValue("entity"));
        Logger.Write(Logger.LogType.Debug, "ProcessRecord", "Invoice is for Customer ID: " + custId.toString());

        //if (custId == 930) 
        //{		        
        var tranId = record.getFieldValue("tranid");
        Logger.Write(Logger.LogType.Debug, "ProcessRecord", "Invoice Transaction ID: " + tranId.toString());
        var subTotal = parseFloat(record.getFieldValue("subtotal"));
        Logger.Write(Logger.LogType.Debug, "ProcessRecord", "Invoice Sub Total: " + subTotal.toString());
        var numberOfCopies = parseInt(record.getFieldValue("custbody_totalnumberofchildinvoices"));
        Logger.Write(Logger.LogType.Debug, "ProcessRecord", "Invoice - Requested Num of Copies: " + numberOfCopies.toString());

        if (numberOfCopies > 1 && subTotal > 0) {
            Logger.Write(Logger.LogType.Debug, "ProcessRecord", "Begin record conversion. ID: " + recordID.toString());
            Logger.Write(Logger.LogType.Debug, "ProcessRecord", "numberOfCopies: " + numberOfCopies.toString());
            var r, invr, id;

            ValidateTotals(numberOfCopies);
            BuildItemQtyList(record, numberOfCopies, qtyList);

            // create copies
            for (var i = 0; i < numberOfCopies; i++) {
                actualFinalTotal = 0;
                r = nlapiCopyRecord("invoice", recordID);
                modifyInvoice(
                r, tranId, g_finalTotal, g_finalShippingTotal, (i + 1), numberOfCopies, qtyList);

                id = nlapiSubmitRecord(r, true, true);
                invr = nlapiLoadRecord("invoice", id);
                invoicesArray.push(invr.getFieldValue("tranid"));
            }

            // close original invoice
            // (zero out all line items)
            modifyOriginalInvoice(record, invoicesArray);

            // edit sales order fields
            if(r.getFieldValue("createdfrom")!=null && r.getFieldValue("createdfrom").length>0)
            	modifySalesOrder(record, invoicesArray, numberOfCopies);
        }
        //}
    }
}

function getCustomCodeValue(r, fieldName, invNbr) {

    var customCodeFieldValue = r.getFieldValue(fieldName);
    if (customCodeFieldValue == null) {
        return "";
    }

    var mySplitResult = customCodeFieldValue.split(",");
    if (mySplitResult != null) {

        if (mySplitResult.length == 1) {
            return customCodeFieldValue;
        }

        if (mySplitResult.length > 1) {
            return mySplitResult[invNbr - 1];
        }
    }

    return "";
}

function modifyInvoice(r, tranId, finalTotal, finalShippingTotal, invNbr, numberOfCopies, qtyList) {
    var lineItemCount = parseInt(r.getLineItemCount("item"));
    var lineItemSplit = finalTotal / lineItemCount;

    r.setFieldValue("custbody_totalnumberofchildinvoices", "");
    r.setFieldValue("custbody_originalinvoicennumber", tranId);
    r.setFieldValue("custbody_childinvoicenumber", "Invoice " + invNbr + " of " + numberOfCopies);

    for (var i = 1; i <= lineItemCount; i++) {
        r.setLineItemValue("item", "amount", i, lineItemSplit);
        r.setLineItemValue("item", "quantity", i, qtyList[i - 1]);
        //*r.setLineItemValue("item", "taxrate1", i, 0);                
    }

    r.setFieldValue("discountrate", 0);
    r.setFieldValue("discounttotal", 0);
    //*r.setFieldValue("taxtotal", 0);
    r.setFieldValue("shippingtax1rate", 0);
    r.setFieldValue("shippingcost", finalShippingTotal);
    r.setFieldValue("handlingtax1rate", 0);
    r.setFieldValue("handlingcost", 0);

    // Edit Custom Codes
    //Well Site Name
    r.setFieldValue("custbody8", getCustomCodeValue(r, "custbody8", invNbr));
    //Well Number
    r.setFieldValue("custbody9", getCustomCodeValue(r, "custbody9", invNbr));
    //Accounting #
    r.setFieldValue("custbody10", getCustomCodeValue(r, "custbody10", invNbr));
    //GL Account
    r.setFieldValue("custbody74", getCustomCodeValue(r, "custbody74", invNbr));
    //Technician Name
    r.setFieldValue("custbody38", getCustomCodeValue(r, "custbody38", invNbr));
    //Code
    r.setFieldValue("custbody11", getCustomCodeValue(r, "custbody11", invNbr));
    //Plant Code
    r.setFieldValue("custbody69", getCustomCodeValue(r, "custbody69", invNbr));
    //Approver ID
    r.setFieldValue("custbody73", getCustomCodeValue(r, "custbody73", invNbr));
    //Reasons Code
    r.setFieldValue("custbody67", getCustomCodeValue(r, "custbody67", invNbr));
    //Online Paykey/UserID
    r.setFieldValue("custbody87", getCustomCodeValue(r, "custbody87", invNbr));
    
    //FIX FOR Mike
    //Make sure Shipment Detail field is copied over.
    r.setFieldValue("custbody16", getCustomCodeValue(r, "custbody16", invNbr));
    r.setFieldValue("trackingNumbers", getCustomCodeValue(r, "trackingNumbers", invNbr));
    r.setFieldValue("linkedTrackingNumbers", getCustomCodeValue(r, "linkedTrackingNumbers", invNbr));
}

function modifySalesOrder(r, invoicesArray, numberofCopies) {
    // edit original invoice numbers 	   
    var sorecord = nlapiLoadRecord("salesorder", r.getFieldValue("createdfrom"));
    
    if(sorecord!=null){
	    Logger.Write(Logger.LogType.Debug, "modifySalesOrder", "Original sales Order Id: " + sorecord.getId());
	
	    var str = "";
	    str = sorecord.getFieldValue("custbody_originalinvoicennumber");
	    if (str != null && str.length > 0) {
	        sorecord.setFieldValue("custbody_originalinvoicennumber", str + ", " + r.getFieldValue("tranid"));
	    } else {
	        sorecord.setFieldValue("custbody_originalinvoicennumber", r.getFieldValue("tranid"));
	    }
	
	    // edit child invoice numbers 
	    var childInvoicesStr = "";
	    for (var i = 0; i < invoicesArray.length; i++) {
	        childInvoicesStr = childInvoicesStr + invoicesArray[i] + ", ";
	        Logger.Write(Logger.LogType.Debug, "modifySalesOrder - Child Invoices List", childInvoicesStr);
	    }
	
	    str = sorecord.getFieldValue("custbody_childinvoicenumber");
	    if (str != null && str.length > 0) {
	        sorecord.setFieldValue("custbody_childinvoicenumber", str + ", " + childInvoicesStr);
	    } else {
	        sorecord.setFieldValue("custbody_childinvoicenumber", childInvoicesStr);
	    }
	
	    // save sales order
	    nlapiSubmitRecord(sorecord, true, true);
	    Logger.Write(Logger.LogType.Debug, "modifySalesOrder", "Sales order updated");
    }
    else{
    	Logger.Write(Logger.LogType.Debug, "modifySalesOrder", "Was not generated from a Sales Order");
    }
}


function modifyOriginalInvoice(r, invoicesArray) {
    var lineItemCount = parseInt(r.getLineItemCount("item"));

    // Modify invoice - sel line item amounts to zero
    for (var i = 1; i <= lineItemCount; i++) {
        r.setLineItemValue("item", "amount", i, 0);
    }

    r.setFieldValue("subtotal", 0);
    r.setFieldValue("discounttotal", 0);
    r.setFieldValue("taxtotal", 0);
    r.setFieldValue("shippingcost", 0);
    r.setFieldValue("handlingcost", 0);
    r.setFieldValue("custbody_totalnumberofchildinvoices", invoicesArray.length);
    
    // edit child invoice numbers 
    var childInvoicesStr = "";
    for (var i = 0; i < invoicesArray.length; i++) {
        childInvoicesStr = childInvoicesStr + invoicesArray[i] + ", ";
        Logger.Write(Logger.LogType.Debug, "modifyOriginalInvoice - Child Invoices List", childInvoicesStr);
    }
    
    r.setFieldValue("custbody_childinvoicenumber", childInvoicesStr);

    // save invoice
    nlapiSubmitRecord(r, true, true);

    Logger.Write(Logger.LogType.Debug, "modifyOriginalInvoice", "Orignal invoice zerored out.");
}