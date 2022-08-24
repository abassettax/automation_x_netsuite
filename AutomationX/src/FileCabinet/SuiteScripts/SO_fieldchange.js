function getParameterFromURL(param) {
  if (param = (new RegExp('[?&]' + encodeURIComponent(param) + '=([^&]*)')).exec(location.search))
    return decodeURIComponent(param[1]);
}

function deleteline(type) {
  if (type == 'item') {
    var SOid = nlapiGetRecordId();

    var lineid = nlapiGetCurrentLineItemValue('item', 'line');
    if (SOid && nlapiGetRecordType() == 'salesorder' && lineid && nlapiGetCurrentLineItemValue('item', 'quantity')) {
      var salesorderSearch = nlapiSearchRecord("salesorder", null, [["type", "anyof", "SalesOrd"], "AND", ["mainline", "is", "F"], "AND", ["internalidnumber", "equalto", SOid], "AND", ["line", "equalto", lineid]], [
        new nlobjSearchColumn("quantitypicked"),
        new nlobjSearchColumn("quantitypacked")
      ]);

      var qtypicked = salesorderSearch[0].getValue('quantitypicked');
      var qtyPacked = salesorderSearch[0].getValue('quantitypacked');
      var statusmessage = ' \n\n Quantity Pulled: ' + qtypicked + '\n Quantity PickPacked:  ' + qtyPacked + '\n Quantity Fulfilled:  ' + nlapiGetCurrentLineItemValue('item', 'quantityfulfilled') + '\n Quantity Invoiced:  ' + nlapiGetCurrentLineItemValue('item', 'quantitybilled');
      if (qtypicked > nlapiGetCurrentLineItemValue('item', 'quantitybilled')) { alert('This line has a quantity fulfilled and can not be deleted. ' + statusmessage); return false; }
    }
  }
  return true;
}

function Pageintquote() {

  //////start copy 


  var IsCopy = getParameterFromURL('axCopy');
  if (IsCopy == 'yes' && nlapiGetFieldValue('tranid') == 'To Be Generated') {
    var copyrecordid = getParameterFromURL('currentrecordID');
    var copyrecordtype = nlapiGetRecordType();
    var copyrecord = nlapiLoadRecord(copyrecordtype, copyrecordid);

    copyrecord.getFieldValue('custentity149');

    var copyrecordclass = copyrecord.getFieldValue("class"); //Class
    var copyrecordlocation = copyrecord.getFieldValue("location"); //location
    var copyrecordcustbody173 = copyrecord.getFieldValue("custbody173"); //Techname
    var copyrecordcustbody38 = copyrecord.getFieldValue("custbody38"); //sellname
    var copyrecordcustbody8 = copyrecord.getFieldValue("custbody8"); //wellnumber
    var copyrecordcustbody9 = copyrecord.getFieldValue("custbody9"); //accountingnum
    var copyrecordcustbody10 = copyrecord.getFieldValue("custbody10"); //plantcode
    var copyrecordcustbody73 = copyrecord.getFieldValue("custbody73"); //approverid
    var copyrecordcustbody11 = copyrecord.getFieldValue("custbody11"); //code
    var copyrecordcustbody67 = copyrecord.getFieldValue("custbody67"); //reasoncode
    var copyrecordcustbody74 = copyrecord.getFieldValue("custbody74"); //glaccount
    var copyrecordcustbody87 = copyrecord.getFieldValue("custbody87"); //paykey
    var copyrecordshipaddresslist = copyrecord.getFieldValue("shipaddresslist"); //shipto
    var copyrecordcustbody34 = copyrecord.getFieldValue("custbody34"); //purchasenotes
    var copyrecordcustbody35 = copyrecord.getFieldValue("custbody35"); //ffnotes
    var copyrecordcustbody36 = copyrecord.getFieldValue("custbody36"); //invnotes
    var copyrecordshipcarrier = copyrecord.getFieldValue("shipcarrier"); //shipcarrier
    var copyrecordshipmethod = copyrecord.getFieldValue("shipmethod"); //shipmethod
    var copyrecordshippingcost = copyrecord.getFieldValue("shippingcost"); //shippingcost
    var copyrecordbilladdresslist = copyrecord.getFieldValue("billaddresslist"); //billaddresslist


    /*nlapiSetFieldValue("class" , copyrecordclass); // Class
    nlapiSetFieldValue("location" , copyrecordlocation); // location
    nlapiSetFieldValue("custbody173" , copyrecordcustbody173); // Techname
    nlapiSetFieldValue("custbody38" , copyrecordcustbody38); // sellname
    nlapiSetFieldValue("custbody8" , copyrecordcustbody8); // wellnumber
    nlapiSetFieldValue("custbody9" , copyrecordcustbody9); // accountingnum
    nlapiSetFieldValue("custbody10" , copyrecordcustbody10); // plantcode
    nlapiSetFieldValue("custbody73" , copyrecordcustbody73); // approverid
    nlapiSetFieldValue("custbody11" , copyrecordcustbody11); // code
    nlapiSetFieldValue("custbody67" , copyrecordcustbody67); // reasoncode
    nlapiSetFieldValue("custbody74" , copyrecordcustbody74); // glaccount
    nlapiSetFieldValue("custbody87" , copyrecordcustbody87); // paykey
    nlapiSetFieldValue("shipaddresslist" , copyrecordshipaddresslist); // shipto
    nlapiSetFieldValue("custbody34" , copyrecordcustbody34); // purchasenotes
    nlapiSetFieldValue("custbody35" , copyrecordcustbody35); // ffnotes
    nlapiSetFieldValue("custbody36" , copyrecordcustbody36); // invnotes
    nlapiSetFieldValue("shipcarrier" , copyrecordshipcarrier); // shipcarrier
    nlapiSetFieldValue("shipmethod" , copyrecordshipmethod); // shipmethod
    nlapiSetFieldValue("shippingcost" , copyrecordshippingcost); // shippingcost
    nlapiSetFieldValue("billaddresslist" , copyrecordbilladdresslist); // billaddresslist
    */


    if (copyrecordclass) { nlapiSetFieldValue("class", copyrecordclass); }// Class
    if (copyrecordlocation) { nlapiSetFieldValue("location", copyrecordlocation); }// location
    if (copyrecordcustbody173) { nlapiSetFieldValue("custbody173", copyrecordcustbody173); }// Techname
    if (copyrecordcustbody38) { nlapiSetFieldValue("custbody38", copyrecordcustbody38); }// sellname
    if (copyrecordcustbody8) { nlapiSetFieldValue("custbody8", copyrecordcustbody8); }// wellnumber
    if (copyrecordcustbody9) { nlapiSetFieldValue("custbody9", copyrecordcustbody9); } // accountingnum
    if (copyrecordcustbody10) { nlapiSetFieldValue("custbody10", copyrecordcustbody10); } // plantcode
    if (copyrecordcustbody73) { nlapiSetFieldValue("custbody73", copyrecordcustbody73); }// approverid
    if (copyrecordcustbody11) { nlapiSetFieldValue("custbody11", copyrecordcustbody11); }// code
    if (copyrecordcustbody67) { nlapiSetFieldValue("custbody67", copyrecordcustbody67); }// reasoncode
    if (copyrecordcustbody74) { nlapiSetFieldValue("custbody74", copyrecordcustbody74); }// glaccount
    if (copyrecordcustbody87) { nlapiSetFieldValue("custbody87", copyrecordcustbody87); }// paykey
    if (copyrecordshipaddresslist) { nlapiSetFieldValue("shipaddresslist", copyrecordshipaddresslist); } // shipto
    if (copyrecordcustbody34) { nlapiSetFieldValue("custbody34", copyrecordcustbody34); } // purchasenotes
    if (copyrecordcustbody35) { nlapiSetFieldValue("custbody35", copyrecordcustbody35); }// ffnotes
    if (copyrecordcustbody36) { nlapiSetFieldValue("custbody36", copyrecordcustbody36); }// invnotes
    if (copyrecordshipcarrier) { nlapiSetFieldValue("shipcarrier", copyrecordshipcarrier); } // shipcarrier
    if (copyrecordshipmethod) { nlapiSetFieldValue("shipmethod", copyrecordshipmethod); } // shipmethod
    if (copyrecordshippingcost) { nlapiSetFieldValue("shippingcost", copyrecordshippingcost); } // shippingcost
    if (copyrecordbilladdresslist) { nlapiSetFieldValue("billaddresslist", copyrecordbilladdresslist); } // billaddresslist





    //add line items
    var lineCount = copyrecord.getLineItemCount('item');
    for (var i = 1; i <= lineCount; i++) {
      var itemss = copyrecord.getLineItemValue('item', 'item', i);
      var qty = copyrecord.getLineItemValue('item', 'quantity', i); if (!qty) { qty = ""; }
      var desc = copyrecord.getLineItemValue('item', 'description', i);
      var solocation = copyrecord.getLineItemValue('item', 'location', i);
      var closed = copyrecord.getLineItemValue('item', 'isclosed', i);
      if (closed != "T") {
        nlapiSelectNewLineItem('item');
        nlapiSetCurrentLineItemValue('item', 'item', itemss, true, true);
        nlapiSetCurrentLineItemValue('item', 'quantity', qty, true, true);
        nlapiSetCurrentLineItemValue('item', 'location', solocation, true, true);
        nlapiSetCurrentLineItemValue('item', 'isclosed', closed, true, true);
        nlapiCommitLineItem('item');
      }
    }


  }




  //     end copy 

  //reset PO Lines
  if (nlapiGetFieldValue('tranid') == 'To Be Generated' && nlapiGetRecordType() == 'salesorder') {

    var lineCount = parseInt(nlapiGetLineItemCount('item'));
    for (x = 1; x <= lineCount; x++) {
      if (nlapiGetLineItemValue("item", "item", x)) {
        nlapiSelectLineItem("item", x);
        if (nlapiGetCurrentLineItemValue('item', 'item') != 0) {
          nlapiSetCurrentLineItemValue("item", "custcol91", null);
          nlapiSetCurrentLineItemValue("item", "custcol74", null);
          nlapiCommitLineItem("item");
        }
      }

      // End reset PO lines
    }
  }

  /////////////////////////////////////////////////////////////////////Check Credit Balance
  // total / balance / unbilledorders / creditlimit
  var cust = nlapiGetFieldValue("entity");
  if (cust) {
    var fields = ['balance', 'unbilledorders', 'creditlimit'];
    var columns = nlapiLookupField('customer', cust, fields);
    var Cbalance = columns.balance;
    var Cunbilledorders = columns.unbilledorders;
    var Ccreditlimit = columns.creditlimit;
    var Thisordertotal = 0; if (!nlapiGetRecordId()) { Thisordertotal = nlapiGetFieldValue("total"); }

    var Ctotal = parseInt(Cbalance) + parseInt(Cunbilledorders) + parseInt(Thisordertotal);
    var Creditremaining = parseInt(Ccreditlimit) - parseInt(Ctotal);

    if (Creditremaining < 0) { alert('Warning: Customer balance of $' + Ctotal + ' exceeds credit limit of $' + Ccreditlimit); }

  }

  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  if (nlapiGetFieldValue('custbody125') == 12 && nlapiGetRecordType() == 'salesorder') { nlapiSetFieldValue('custbody125', ""); }
  if (nlapiGetRecordType() == 'estimate') {

    var fldValues = getParameterFromURL('taskid');

    if (fldValues && nlapiGetFieldValue('custbody125') == "") { nlapiSetFieldValue('custbody125', 12); nlapiSetFieldValue('custbody167', fldValues); }

  }

}
////////////////////////////////////
function psourceitem(type, name) {

  if (name == 'item' && nlapiGetFieldValue('customform') != 303) {
    var uid = nlapiGetCurrentLineItemValue('item', 'item');
    var custn = nlapiGetFieldValue('entity');
    if (custn) {
      var ischild = nlapiLookupField('customer', custn, 'parent');

      //check to see if there is a parent customer if so use that customer
      if (ischild) {
        custn = ischild;
      }
      //////////////////////////
      if (uid && custn) {
        var partnumbersSearchcolumns = new Array();
        partnumbersSearchcolumns[0] = new nlobjSearchColumn("formulatext", null, null).setFormula("'Customer Part #:' ||  {custrecord161} ||case when {custrecord162} IS NOT NULL THEN '  Contract Line#:' || {custrecord162}else NULL END");
        var partnumbersSearch = nlapiSearchRecord("customrecord455", null,
          [
            ["custrecord159", "anyof", uid],
            "AND",
            ["custrecord160", "anyof", custn]
          ],
          partnumbersSearchcolumns
        );
        //////////////////////
        if (partnumbersSearch) {
          var itemdescold = nlapiGetCurrentLineItemValue('item', 'description');
          var new5codewithcustpartnumbers = partnumbersSearch[0].getValue(partnumbersSearchcolumns[0]);
          var newitemdesc = itemdescold + '\n\n' + new5codewithcustpartnumbers
          nlapiSetCurrentLineItemValue('item', 'description', newitemdesc);
        }
      }
    }     ///////////////////////////end set 5 codes
    // alert(1);
    var itemType = nlapiGetCurrentLineItemValue('item', 'itemtype');
    var rectypes = nlapiGetRecordType();


    //alert(rectypes) ;
    if (itemType == 'InvtPart' && nlapiGetFieldValue('location'))//&& rectypes == 'estimate'
    {

      var linelocationleadtime = nlapiGetFieldValue('location'); //nlapiGetCurrentLineItemValue("item", "location");
      // alert(linelocationleadtime);
      var filters = new Array();
      filters[0] = new nlobjSearchFilter("internalidnumber", null, "equalto", uid);
      filters[1] = new nlobjSearchFilter("custrecord17", "inventorylocation", "is", "T");   //new nlobjSearchFilter("inventorylocation", null, "anyof",linelocationleadtime );  ["inventorylocation.custrecord17","is","T"]
      filters[2] = new nlobjSearchFilter("type", null, "anyof", ["InvtPart", "Assembly"]);

      var columns = new Array();
      //columns[0] = new nlobjSearchColumn("locationquantityavailable",null,null);
      columns[0] = new nlobjSearchColumn("formulanumeric", null, "SUM").setFormula("CASE WHEN {inventorylocation.internalid} =" + linelocationleadtime + "THEN {locationquantityavailable} ELSE NULL END");//"SUM"

      columns[1] = new nlobjSearchColumn("locationquantityavailable", null, "SUM");
      columns[2] = new nlobjSearchColumn("custitem69", null, "GROUP");
      columns[3] = new nlobjSearchColumn("formulanumeric", null, "AVG").setFormula("CASE WHEN {inventorylocation.internalid} =" + linelocationleadtime + "THEN {locationleadtime} ELSE NULL END");  // new nlobjSearchColumn("locationleadtime",null,null);
      columns[4] = new nlobjSearchColumn("formulanumeric", null, "GROUP").setFormula("CASE WHEN {inventorylocation.internalid} =" + linelocationleadtime + "THEN {inventorylocation} ELSE NULL END"); //new nlobjSearchColumn("inventorylocation",null,null);

      var itemSearch = nlapiSearchRecord("item", null, filters, columns);

      if (itemSearch) {

        var avalocal = itemSearch[0].getValue(columns[0]);
        var avacompany = itemSearch[0].getValue(columns[1]);
        var overstock = itemSearch[0].getValue(columns[2]);
        var locationlead = itemSearch[0].getValue(columns[3]);
        var inventorylocation = itemSearch[0].getValue(columns[4]);
        var lineqty = nlapiGetCurrentLineItemValue("item", "quantity");
        var itemreavglead = Math.round(nlapiLookupField('inventoryitem', uid, 'custitem82'));
        var leadtimevalue = '';

        if (locationlead > 0) { leadtimevalue = locationlead; }
        else if (itemreavglead) { leadtimevalue = itemreavglead; }
        else { leadtimevalue = null; }



        if ((avalocal * 1) >= (lineqty * 1)) {
          leadtimevalue = 'Local Availability';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }
        else if (avalocal > 0 && avacompany >= lineqty) {
          leadtimevalue = 'Partial Local Availability / Remainder Available to Ship';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }
        else if (avalocal > 0 && avacompany == avalocal && (avacompany * 1) < (lineqty * 1)) {
          leadtimevalue = 'Partial Local Availability /' + leadtimevalue + ' Days On Remaining';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }

        else if ((avacompany * 1) >= (lineqty * 1) && avalocal < .01) {
          leadtimevalue = 'Available to Ship';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }
        else if (avacompany > 0 && avacompany < lineqty) {
          leadtimevalue = 'Partial Avalibility to Ship/ ' + leadtimevalue + ' Days On Remaining';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }

        else if (locationlead > 0) {
          leadtimevalue = locationlead + ' Days';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }
        else if (leadtimevalue > 0) {
          leadtimevalue += " Days";
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }
        else {
          leadtimevalue = ''; nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }

      }

    }


    ///////////////////////////////////////endoverstock

    ///////////////////////////////////////////overstock
    ///////////////////////////////////////////overstock
    ///////////////////////////////////////////overstock
    ///////////////////////////////////////////overstock
    /*
    
       var overstock = nlapiGetCurrentLineItemValue('item',  "custcol87");
      
      
        if(overstock == "Z"  ) 
                     {
    if(avalocal >0)
    {
    return true; 
    }
    else if (avacompany >0)
    {
    
     var filtersCA = new Array ();
    filtersCA[0] = new nlobjSearchFilter("internalidnumber",null, "equalto",uid);
    filtersCA[1] = new nlobjSearchFilter("custrecord17", "inventorylocation","is","T" );
    filtersCA[2] = new nlobjSearchFilter("locationquantityavailable", null,"greaterthan","0" );
    filtersCA[3] = new nlobjSearchFilter("type",null, "anyof",["InvtPart","Assembly" ]);
    
    var columnsCA = new Array();
    columnsCA[0] = new nlobjSearchColumn("inventorylocation",null,null);
    columnsCA[1] = new nlobjSearchColumn("locationquantityavailable",null,null).setSort(true);
    columnsCA[2] = new nlobjSearchColumn("locationquantityavailable",null,null);
    columnsCA[3] = new nlobjSearchColumn("quantityavailable",null,null); 
    
    var itemSearchCA = nlapiSearchRecord("item",null,filtersCA, columnsCA);
      if(itemSearchCA){
    
    var avalocal = itemSearchCA[0].getValue(columnsCA[2]);
    var avacompany = itemSearchCA[0].getValue(columnsCA[3]);
    var newlocation = itemSearchCA[0].getValue(columns[0]);
    
    //alert(newlocation);
       nlapiSetCurrentLineItemValue('item', 'location', newlocation);
       var newlocationtext = nlapiGetCurrentLineItemText('item', 'location');
        
     
        var descplain = nlapiGetCurrentLineItemValue('item', 'custcol_linenumber');
        var descbold = descplain + "-ES"
    
        nlapiSetCurrentLineItemValue('item', 'custcol_linenumber', descbold);
        
       alert("This item has excess stock at another location.  The location for this line item has been changed to:\n\n " +newlocationtext+ " \n \n Please ship or transfer this product from the new location." );
     return true;
      }
    }
    else
    {
    return true;
    }
                     }
    ///////////////////////////////////////endoverstock
    ///////////////////////////////////////endoverstock
    ///////////////////////////////////////endoverstock
    */
  }
}

function Fchanged(type, name) {
  //////////////////////////////end get contact approver   
  if (name == 'custbody173') {

    var approverName = nlapiLookupField('contact', nlapiGetFieldValue('custbody173'), 'custentity356');
    if (approverName) { nlapiSetFieldValue('custbody73', approverName); }
  }
  //////////////////////////////end get contact approver   

  if (name == 'custbody226' && nlapiGetFieldValue('custbody226')) {
    var custCodeFields = ['custrecord265', 'custrecord266', 'custrecord267', 'custrecord268', 'custrecord269', 'custrecord270', 'custrecord271', 'custrecord272', 'custrecord273', 'custrecord274'];

    var custCodeColumns = nlapiLookupField('customrecord665', nlapiGetFieldValue('custbody226'), custCodeFields);

    var TechnicianNameCustCodeLookup = custCodeColumns.custrecord265;
    var WellsiteNameCustCodeLookup = custCodeColumns.custrecord266;
    var WellNumberCustCodeLookup = custCodeColumns.custrecord267;
    var AccountingNumCustCodeLookup = custCodeColumns.custrecord268;
    var PlantCodeCustCodeLookup = custCodeColumns.custrecord269;
    var ApproverIdCustCodeLookup = custCodeColumns.custrecord270;
    var CodeCustCodeLookup = custCodeColumns.custrecord271;
    var ReasonCodesCustCodeLookup = custCodeColumns.custrecord272;
    var GlAccountCustCodeLookup = custCodeColumns.custrecord273;
    var OnlinePaykeyUseridCustCodeLookup = custCodeColumns.custrecord274;

    if (TechnicianNameCustCodeLookup) { nlapiSetFieldValue('custbody38', TechnicianNameCustCodeLookup); }
    if (WellsiteNameCustCodeLookup) { nlapiSetFieldValue('custbody8', WellsiteNameCustCodeLookup); }
    if (WellNumberCustCodeLookup) { nlapiSetFieldValue('custbody9', WellNumberCustCodeLookup); }
    if (AccountingNumCustCodeLookup) { nlapiSetFieldValue('custbody10', AccountingNumCustCodeLookup); }
    if (PlantCodeCustCodeLookup) { nlapiSetFieldValue('custbody69', PlantCodeCustCodeLookup); }
    if (ApproverIdCustCodeLookup) { nlapiSetFieldValue('custbody73', ApproverIdCustCodeLookup); }
    if (CodeCustCodeLookup) { nlapiSetFieldValue('custbody11', CodeCustCodeLookup); }
    if (ReasonCodesCustCodeLookup) { nlapiSetFieldValue('custbody67', ReasonCodesCustCodeLookup); }
    if (GlAccountCustCodeLookup) { nlapiSetFieldValue('custbody74', GlAccountCustCodeLookup); }
    if (OnlinePaykeyUseridCustCodeLookup) { nlapiSetFieldValue('custbody87', OnlinePaykeyUseridCustCodeLookup); }

  }




  if (name == 'custbody216') { nlapiSetFieldValue('custbody38', ''); for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) { nlapiSetLineItemValue('item', 'custcol102', i, ''); } } // Clear TECHNICIAN NAME
  if (name == 'custbody217') { nlapiSetFieldValue('custbody8', ''); for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) { nlapiSetLineItemValue('item', 'custcol103', i, ''); } } // Clear WELLSITE NAME 
  if (name == 'custbody218') { nlapiSetFieldValue('custbody9', ''); for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) { nlapiSetLineItemValue('item', 'custcol104', i, ''); } } // Clear WELL NUMBER 
  if (name == 'custbody219') { nlapiSetFieldValue('custbody10', ''); for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) { nlapiSetLineItemValue('item', 'custcol105', i, ''); } } // Clear ACCOUNTING # 
  if (name == 'custbody220') { nlapiSetFieldValue('custbody69', ''); for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) { nlapiSetLineItemValue('item', 'custcol106', i, ''); } } // Clear PLANT CODE 
  if (name == 'custbody221') { nlapiSetFieldValue('custbody73', ''); for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) { nlapiSetLineItemValue('item', 'custcol107', i, ''); } } // Clear APPROVER ID 
  if (name == 'custbody222') { nlapiSetFieldValue('custbody11', ''); for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) { nlapiSetLineItemValue('item', 'custcol108', i, ''); } } // Clear CODE 
  if (name == 'custbody223') { nlapiSetFieldValue('custbody67', ''); for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) { nlapiSetLineItemValue('item', 'custcol109', i, ''); } } // Clear REASON CODES 
  if (name == 'custbody224') { nlapiSetFieldValue('custbody74', ''); for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) { nlapiSetLineItemValue('item', 'custcol110', i, ''); } } // Clear GL ACCOUNT
  if (name == 'custbody225') { nlapiSetFieldValue('custbody87', ''); for (var i = 1; i <= nlapiGetLineItemCount('item'); i++) { nlapiSetLineItemValue('item', 'custcol111', i, ''); } } // Clear ONLINE PAYKEY/USERID



  if (name == 'isclosed') {
    var SOid = nlapiGetRecordId();
    var lineid = nlapiGetCurrentLineItemValue('item', 'line');
    if (SOid && nlapiGetCurrentLineItemValue('item', 'isclosed') == "T") {

      var salesorderSearch = nlapiSearchRecord("salesorder", null, [["type", "anyof", "SalesOrd"], "AND", ["mainline", "is", "F"], "AND", ["internalidnumber", "equalto", SOid], "AND", ["line", "equalto", lineid]], [
        new nlobjSearchColumn("quantitypicked"),
        new nlobjSearchColumn("quantitypacked")
      ]);

      var qtypicked = salesorderSearch[0].getValue('quantitypicked');
      var qtyPacked = salesorderSearch[0].getValue('quantitypacked');
      var statusmessage = ' \n\n Quantity Pulled: ' + qtypicked + '\n Quantity PickPacked:  ' + qtyPacked + '\n Quantity Fulfilled:  ' + nlapiGetCurrentLineItemValue('item', 'quantityfulfilled') + '\n Quantity Invoiced:  ' + nlapiGetCurrentLineItemValue('item', 'quantitybilled');
      if (qtypicked > nlapiGetCurrentLineItemValue('item', 'quantitybilled')) {
        alert('This line has a quantity fulfilled greater than billed so cannot be closed.  Please finish processing the shipped quantity before closing. ' + statusmessage);
        nlapiSetCurrentLineItemValue('item', 'isclosed', "F");
      } else if (nlapiGetCurrentLineItemValue('item', 'isclosed') == 'T' && (qtypicked <= 0 || !qtypicked)) {
        nlapiSetCurrentLineItemValue('item', 'quantity', 0); alert('This line has been closed and the quantity set to 0.');
      }
      else { nlapiSetCurrentLineItemValue('item', 'quantity', qtypicked); alert('This line has been closed and the quantity set to the quantity Invoiced.') }
    }
  }
  //////////////////////////////////////////////////////////////////////////////////
  if (name == 'costestimatetype') { if (nlapiGetCurrentLineItemValue('item', 'costestimatetype') == 'CUSTOM') { alert('Please enter the unit cost into EST. EXTENDED COST field. '); } }  // set extented cost based off of unit price * qty
  if (name == 'costestimate') { var newcost = nlapiGetCurrentLineItemValue('item', 'quantity') * nlapiGetCurrentLineItemValue('item', 'costestimate'); nlapiSetCurrentLineItemValue('item', 'costestimate', newcost, false); }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////start purchasing request
  /// alert if po request already exists.  
  if (name == 'custcol90' && nlapiGetCurrentLineItemValue('item', 'custcol90') != '') {
    // alert(nlapiGetCurrentLineItemValue('item', 'custcol90' ));
    var stockrequest = nlapiGetCurrentLineItemValue('item', 'custcol91');
    var relatedrecord = nlapiGetCurrentLineItemValue('item', 'custcol74');
    var lineclosed = nlapiGetCurrentLineItemValue('item', 'isclosed');
    // var ItemType =nlapiGetCurrentLineItemValue('item', 'itemtype' ); 

    var linetype = nlapiGetCurrentLineItemValue('item', 'itemtype');
    if (linetype == 'Assembly' && nlapiGetCurrentLineItemValue('item', 'custcol90') != 5) { alert('You are attempting to create a purchase order for a Assembly item.  Please save your sales order and create a workorder after saving.'); nlapiSetCurrentLineItemValue('item', 'custcol90', ''); return false; }
    var hasLocation = nlapiGetCurrentLineItemValue('item', 'location');

    if (!hasLocation && nlapiGetCurrentLineItemValue('item', 'item') != 1277) { alert("Please Select a Location for this line before attempting to create a PO."); nlapiSetCurrentLineItemValue('item', 'custcol90', ''); return false; }
    var hasvendor = nlapiGetCurrentLineItemValue('item', 'povendor');

    if (!hasvendor && nlapiGetCurrentLineItemValue('item', 'item') != 1277 && linetype != 'Assembly') { alert("Please Select a Vendor for this line before attempting to create a PO."); nlapiSetCurrentLineItemValue('item', 'custcol90', ''); return false; }

    if (stockrequest && lineclosed == 'F') {
      var stockrequeststatus = nlapiLookupField('customrecord463', stockrequest, 'custrecord214');
      if (stockrequeststatus != 3) { alert('This line is already associated with a Purchase Order/Request or Work Order.'); nlapiSetCurrentLineItemValue('item', 'custcol90', ''); }

      if (stockrequeststatus == 3) { nlapiSetCurrentLineItemValue('item', 'custcol91', '', false, true); }
    }
    else if ((relatedrecord || lineclosed != 'T') && linetype == 'Assembly' && nlapiGetCurrentLineItemValue('item', 'custcol90') != 5) { nlapiSetCurrentLineItemValue('item', 'custcol90', 1, false, true); }
    else if (relatedrecord || lineclosed == 'T' && (linetype != 'InvtPart' || linetype != 'Service' || linetype != 'Assembly')) { alert('This line is already associated with a Purchase Order/Request, Work Order, the line is closed or the item type is not supported.'); nlapiSetCurrentLineItemValue('item', 'custcol90', '', false, true); }
  }
  /////////
  if (name == 'custrecord187') {
    //  alert(12);
    var headerlocation = nlapiGetFieldValue('location');
    var headerisstock = '';
    var headernotes = '';
    var headerclass = nlapiGetFieldValue('class');
    var customers = nlapiGetFieldText('entity');
    //alert(customers);
    nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord192', headerlocation);
    nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord203', headerclass);
    nlapiSetCurrentLineItemText('recmachcustrecord221', 'custrecord202', customers);
  }
  if (name == 'custrecord192') {
    var items = nlapiGetCurrentLineItemValue('recmachcustrecord221', 'custrecord187');
    var loc = nlapiGetCurrentLineItemValue('recmachcustrecord221', 'custrecord192');


    ////////////////////////////demand search////////////  
    var columns = new Array();
    columns[0] = new nlobjSearchColumn("locationpreferredstocklevel", null, "MAX");
    columns[1] = new nlobjSearchColumn("locationquantityonhand", null, "MAX");
    columns[2] = new nlobjSearchColumn("locationquantitycommitted", null, "MAX");
    columns[3] = new nlobjSearchColumn("locationquantityavailable", null, "MAX");
    columns[4] = new nlobjSearchColumn("locationquantitybackordered", null, "MAX");
    columns[5] = new nlobjSearchColumn("locationquantityonorder", null, "MAX");
    columns[6] = new nlobjSearchColumn("locationquantityintransit", null, "MAX");
    columns[7] = new nlobjSearchColumn("formulanumeric", null, "SUM").setFormula("  CASE WHEN ({transaction.location}= {inventorylocation} ) THEN  {transaction.quantity}/3 ELSE NULL END");
    columns[8] = new nlobjSearchColumn("custitem_tjinc_averagedemand", null, "AVG");
    columns[9] = new nlobjSearchColumn("custitem_tjinc_monthsonhand", null, "AVG");
    columns[10] = new nlobjSearchColumn("quantityavailable", null, "AVG");
    columns[11] = new nlobjSearchColumn("locationleadtime", null, "MAX");
    columns[12] = new nlobjSearchColumn("leadtime", null, "MAX");
    columns[13] = new nlobjSearchColumn("custitem35", null, "GROUP");
    columns[14] = new nlobjSearchColumn("vendor", null, "GROUP");
    columns[15] = new nlobjSearchColumn("cost", null, "MAX");

    var transactionSearch = nlapiSearchRecord("item", null,
      [
        [["locationquantityonhand", "greaterthan", "0"], "OR", ["locationpreferredstocklevel", "greaterthan", "0"], "OR", ["locationquantityonorder", "greaterthan", "0"], "OR", ["inventorylocation.custrecord17", "is", "T"]],
        "AND",
        [["transaction.type", "anyof", "SalesOrd"], "AND", ["transaction.mainline", "is", "F"], "AND", ["transaction.trandate", "onorafter", "daysago90"]],
        "AND",
        ["inventorylocation", "anyof", loc],
        "AND",
        ["internalidnumber", "equalto", items]
      ], columns
    );
    if (transactionSearch) {
      var Lava = 0;
      var fivecode = '';
      var locleadtime = 0;
      var leadtime = 0;
      var moh = 0;
      var avaDemand = 0;
      var LocavaDemand = 0;
      var prefvendor = '';

      var Lava = transactionSearch[0].getValue(columns[3]);
      var fivecode = transactionSearch[0].getValue(columns[13]);
      var locleadtime = transactionSearch[0].getValue(columns[11]);
      var leadtime = transactionSearch[0].getValue(columns[12]);
      var moh = transactionSearch[0].getValue(columns[9]);
      var avaDemand = transactionSearch[0].getValue(columns[8]);
      var LocavaDemand = Math.round(transactionSearch[0].getValue(columns[7]));
      var prefvendor = transactionSearch[0].getValue(columns[14]);
      var loconorder = transactionSearch[0].getValue(columns[5]);
      var ItemPP = transactionSearch[0].getValue(columns[15]);

      var adjleadtime = 0; if (locleadtime) { adjleadtime = locleadtime; } else { adjleadtime = leadtime; }

      nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord188', fivecode);
      nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord193', LocavaDemand);
      nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord191', avaDemand);
      nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord195', adjleadtime);
      nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord197', prefvendor);
      nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord209', Lava); //
      nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord217', loconorder); //
      nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord220', ItemPP);
      return true;
    }
    else {
      /////////////////////////////////nodemand

      var items = nlapiGetCurrentLineItemValue('recmachcustrecord221', 'custrecord187');
      var loc = nlapiGetCurrentLineItemValue('recmachcustrecord221', 'custrecord192');
      //    alert(items);

      ////////////////////////////no demand search////////////  
      var columnsD = new Array();
      columnsD[0] = new nlobjSearchColumn("locationpreferredstocklevel", null, "MAX");
      columnsD[1] = new nlobjSearchColumn("locationquantityonhand", null, "MAX");
      columnsD[2] = new nlobjSearchColumn("locationquantitycommitted", null, "MAX");
      columnsD[3] = new nlobjSearchColumn("locationquantityavailable", null, "MAX");
      columnsD[4] = new nlobjSearchColumn("locationquantitybackordered", null, "MAX");
      columnsD[5] = new nlobjSearchColumn("locationquantityonorder", null, "MAX");
      columnsD[6] = new nlobjSearchColumn("locationquantityintransit", null, "MAX");
      columnsD[7] = new nlobjSearchColumn("locationquantityintransit", null, "MAX");
      columnsD[8] = new nlobjSearchColumn("custitem_tjinc_averagedemand", null, "AVG");
      columnsD[9] = new nlobjSearchColumn("custitem_tjinc_monthsonhand", null, "AVG");
      columnsD[10] = new nlobjSearchColumn("quantityavailable", null, "AVG");
      columnsD[11] = new nlobjSearchColumn("locationleadtime", null, "MAX");
      columnsD[12] = new nlobjSearchColumn("leadtime", null, "MAX");
      columnsD[13] = new nlobjSearchColumn("custitem35", null, "GROUP");
      columnsD[14] = new nlobjSearchColumn("vendor", null, "GROUP");

      var ItemDemand = nlapiSearchRecord("item", null,
        [
          ["inventorylocation", "anyof", loc],
          "AND",
          ["internalidnumber", "equalto", items]
        ],
        columnsD
      );
      if (ItemDemand) {
        var Lava = 0;
        var fivecode = '';
        var locleadtime = 0;
        var leadtime = 0;
        var moh = 0;
        var avaDemand = 0;
        var LocavaDemand = 0;
        var prefvendor = '';

        var Lava = ItemDemand[0].getValue(columnsD[3]);
        var fivecode = ItemDemand[0].getValue(columnsD[13]);
        var locleadtime = ItemDemand[0].getValue(columnsD[11]);
        var leadtime = ItemDemand[0].getValue(columnsD[12]);
        var moh = ItemDemand[0].getValue(columnsD[9]);
        var avaDemand = ItemDemand[0].getValue(columnsD[8]);
        var LocavaDemand = 0;   // Math.round(ItemDemand[0].getValue(columnsD[7]));   
        var prefvendor = ItemDemand[0].getValue(columnsD[14]);


        var adjleadtime = 0; if (locleadtime) { adjleadtime = locleadtime; } else { adjleadtime = leadtime; }

        nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord188', fivecode);
        nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord193', LocavaDemand);
        nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord191', avaDemand);
        nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord195', adjleadtime);
        nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord197', prefvendor);
        nlapiSetCurrentLineItemValue('recmachcustrecord221', 'custrecord209', Lava);
        return true;




      }
    }
  }
  ///////////////////////////  end purchasing request

  if (name == 'ccnumber') {
    // alert(nlapiGetFieldValue('ccnumber'));
    if (nlapiGetFieldValue('ccnumber')) {

      //if( !nlapiGetFieldValue('paymentmethod')){nlapiSetFieldValue('paymentmethod',8);       }
      nlapiSetFieldValue('terms', 8);
      nlapiSetFieldMandatory('ccsecuritycode', true);
    }
    else {
      var cust = nlapiGetFieldValue('entity');
      if (cust) {
        var termss = nlapiLookupField('customer', cust, 'terms');
        nlapiSetFieldValue('terms', termss);
        // alert(2);
      }
    }
  }




  if (name == 'item' && nlapiGetFieldValue('customform') != 303) {
    var lineCount = parseInt(nlapiGetLineItemCount('item'));
    var lineForCustCodes = parseInt(lineCount);

    ///////////////////////start copy cust code lines
    var PerLineTechnicianName = nlapiGetLineItemValue('item', 'custcol102', lineCount); if (nlapiGetFieldValue('custbody216') == 'T') { nlapiSetCurrentLineItemValue('item', 'custcol102', PerLineTechnicianName); }
    var PerLineWellsiteName = nlapiGetLineItemValue('item', 'custcol103', lineCount); if (nlapiGetFieldValue('custbody217') == 'T') { nlapiSetCurrentLineItemValue('item', 'custcol103', PerLineWellsiteName); }
    var PerLineWellNumber = nlapiGetLineItemValue('item', 'custcol104', lineCount); if (nlapiGetFieldValue('custbody218') == 'T') { nlapiSetCurrentLineItemValue('item', 'custcol104', PerLineWellNumber); }
    var PerLineAccounting = nlapiGetLineItemValue('item', 'custcol105', lineCount); if (nlapiGetFieldValue('custbody219') == 'T') { nlapiSetCurrentLineItemValue('item', 'custcol105', PerLineAccounting); }
    var PerLinePlantCode = nlapiGetLineItemValue('item', 'custcol106', lineCount); if (nlapiGetFieldValue('custbody220') == 'T') { nlapiSetCurrentLineItemValue('item', 'custcol106', PerLinePlantCode); }
    var PerLineApproverId = nlapiGetLineItemValue('item', 'custcol107', lineCount); if (nlapiGetFieldValue('custbody221') == 'T') { nlapiSetCurrentLineItemValue('item', 'custcol107', PerLineApproverId); }
    var PerLineCode = nlapiGetLineItemValue('item', 'custcol108', lineCount); if (nlapiGetFieldValue('custbody222') == 'T') { nlapiSetCurrentLineItemValue('item', 'custcol108', PerLineCode); }
    var PerLineReasonCodes = nlapiGetLineItemValue('item', 'custcol109', lineCount); if (nlapiGetFieldValue('custbody223') == 'T') { nlapiSetCurrentLineItemValue('item', 'custcol109', PerLineReasonCodes); }
    var PerLineGlAccount = nlapiGetLineItemValue('item', 'custcol110', lineCount); if (nlapiGetFieldValue('custbody224') == 'T') { nlapiSetCurrentLineItemValue('item', 'custcol110', PerLineGlAccount); }
    var PerLineOnlinePaykeyUserid = nlapiGetLineItemValue('item', 'custcol111', lineCount); if (nlapiGetFieldValue('custbody225') == 'T') { nlapiSetCurrentLineItemValue('item', 'custcol111', PerLineOnlinePaykeyUserid); }



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    if (nlapiGetCurrentLineItemText("item", "item").indexOf("New Item") !== -1 && nlapiGetRecordType() != "estimate") {
      alert("You are attempting to add a quick add item. Quick Item add is only available from a quote. Please add items to a quote and convert to a Sales Order.");
      nlapiSetCurrentLineItemValue("item", "item", null, false);
      return false;
    }

    //alert("love you shaylee");
    var uid = nlapiGetCurrentLineItemValue('item', 'item');

    var headerlocation = nlapiGetFieldValue('location');
    nlapiSetCurrentLineItemValue('item', 'location', headerlocation, false, true);

    lineCount = parseInt(lineCount + 1); //var newlinenum = 
    nlapiSetCurrentLineItemValue('item', 'custcol_linenumber', lineCount);
    if (headerlocation) {

      ////////////////old overstock location
    }


  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////
  if (name == 'quantity' && nlapiGetFieldValue('customform') != 303) {

    var itemType = nlapiGetCurrentLineItemValue('item', 'itemtype');
    var rectypes = nlapiGetRecordType();


    //alert(rectypes) ;
    if (itemType == 'InvtPart' && rectypes == 'estimate') {
      var uid = nlapiGetCurrentLineItemValue('item', 'item');
      var linelocationleadtime = nlapiGetFieldValue('location'); //nlapiGetCurrentLineItemValue("item", "location");

      var filters = new Array();
      filters[0] = new nlobjSearchFilter("internalidnumber", null, "equalto", uid);
      filters[1] = new nlobjSearchFilter("custrecord17", "inventorylocation", "is", "T");   //new nlobjSearchFilter("inventorylocation", null, "anyof",linelocationleadtime );  ["inventorylocation.custrecord17","is","T"]
      filters[2] = new nlobjSearchFilter("type", null, "anyof", ["InvtPart", "Assembly"]);

      var columns = new Array();
      //columns[0] = new nlobjSearchColumn("locationquantityavailable",null,null);
      columns[0] = new nlobjSearchColumn("formulanumeric", null, "SUM").setFormula("CASE WHEN {inventorylocation.internalid} =" + linelocationleadtime + "THEN {locationquantityavailable} ELSE NULL END");//"SUM"

      columns[1] = new nlobjSearchColumn("locationquantityavailable", null, "SUM");
      columns[2] = new nlobjSearchColumn("custitem69", null, "GROUP");
      columns[3] = new nlobjSearchColumn("formulanumeric", null, "AVG").setFormula("CASE WHEN {inventorylocation.internalid} =" + linelocationleadtime + "THEN {locationleadtime} ELSE NULL END");  // new nlobjSearchColumn("locationleadtime",null,null);
      columns[4] = new nlobjSearchColumn("formulanumeric", null, "GROUP").setFormula("CASE WHEN {inventorylocation.internalid} =" + linelocationleadtime + "THEN {inventorylocation} ELSE NULL END"); //new nlobjSearchColumn("inventorylocation",null,null);

      var itemSearch = nlapiSearchRecord("item", null, filters, columns);


      if (itemSearch) {

        var avalocal = itemSearch[0].getValue(columns[0]);
        var avacompany = itemSearch[0].getValue(columns[1]);
        var overstock = itemSearch[0].getValue(columns[2]);
        var locationlead = itemSearch[0].getValue(columns[3]);
        var inventorylocation = itemSearch[0].getValue(columns[4]);
        var lineqty = nlapiGetCurrentLineItemValue("item", "quantity");
        var itemreavglead = Math.round(nlapiLookupField('inventoryitem', uid, 'custitem82'));
        var leadtimevalue = '';

        if (locationlead > 0) { leadtimevalue = locationlead; }
        else if (itemreavglead) { leadtimevalue = itemreavglead; }
        else { leadtimevalue = null; }



        if ((avalocal * 1) >= (lineqty * 1)) {
          leadtimevalue = 'Local Availability';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }
        else if (avalocal > 0 && avacompany >= lineqty) {
          leadtimevalue = 'Partial Local Availability / Remainder Available to Ship';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }
        else if (avalocal > 0 && avacompany == avalocal && (avacompany * 1) < (lineqty * 1)) {
          leadtimevalue = 'Partial Local Availability /' + leadtimevalue + ' Days On Remaining';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }

        else if ((avacompany * 1) >= (lineqty * 1) && avalocal < .01) {
          leadtimevalue = 'Available to Ship';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }
        else if (avacompany > 0 && avacompany < lineqty) {
          leadtimevalue = 'Partial Availability to Ship/ ' + leadtimevalue + ' Days On Remaining';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }

        else if (locationlead > 0) {
          leadtimevalue = locationlead + ' Days';
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }
        else if (leadtimevalue > 0) {
          leadtimevalue += " Days";
          nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }
        else {
          leadtimevalue = ''; nlapiSetCurrentLineItemValue("item", "custcol83", leadtimevalue, false);   // return true;
        }

      }

    }
    return true;

  }




  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  if (name == 'entity') {

    var cust = nlapiGetFieldValue('entity');
    ////////////////////////////////////start hold status

    var axholdstatus = "";
    if (cust) { axholdstatus = nlapiLookupField('customer', cust, 'custentity327'); }

    /////////////////////////////////////////////////////////////////////Check Credit Balance
    // total / balance / unbilledorders / creditlimit
    if (cust) {
      var fields = ['balance', 'unbilledorders', 'creditlimit'];
      var columns = nlapiLookupField('customer', cust, fields);
      var Cbalance = columns.balance;
      var Cunbilledorders = columns.unbilledorders;
      var Ccreditlimit = columns.creditlimit;
      var Thisordertotal = 0; if (!nlapiGetRecordId()) { Thisordertotal = nlapiGetFieldValue("total"); }

      var Ctotal = parseInt(Cbalance) + parseInt(Cunbilledorders) + parseInt(Thisordertotal);
      var Creditremaining = parseInt(Ccreditlimit) - parseInt(Ctotal);
      var creditmes = "";
      if (Creditremaining < 0) { creditmes = "Customer has exceeded credit limit. Order can not be fulfilled. Please contact accounting to discuss solutions. <br/><br/>  "; }
    }
    /////////////////////////////////////////////////////////////////
    if (axholdstatus == 3 || axholdstatus == 4 || axholdstatus == 9 || axholdstatus == 7 || Creditremaining < 0) {

      var holdmessage = "<div> <font size=\"2\" ><B>";
      var searchURL = "";
      if (type == 'edit') {
        searchURL = ' <tr><td style=\"  nowrap=\"\"  height=\"15px\" valign=\"top\" ><input type=\"button\" style =\"border-radius: 3px; height:100%;  background-color:#F2F2F2; \"   value=\" Click to View Past Due Invoices \" id=\"custformbutton_customscript350_9\" name=\"custformbutton_customscript350_9\" onclick=\"nsapiButtonCall(\'button\', \'customscript350\', \'viewpastdue\'); return false;\" ></td></tr><br/>';
      }
      else { searchURL = "Click EDIT to view past due invoices." }



      var softholdmessage = "Customer account is Past Due and has been placed on <u>SOFT CREDIT HOLD</u>.  Please contact accounting to lift the hold for the remanider of the day.<br/><br/>";
      var onholdmessage = "Customer account is Past Due and has been placed on <u>CREDIT HOLD</u>. Please resolve outstanding invoces before processing order.<br/><br/>";
      var forceholdmessage = "Customer account is Past Due and has been placed on <u>HARD CREDIT HOLD</u>. Please contact accounting.<br/><br/>";

      if (Creditremaining < 0) { holdmessage += creditmes; }
      if (axholdstatus == 3) { holdmessage += softholdmessage; holdmessage += searchURL; }
      if (axholdstatus == 4) { holdmessage += onholdmessage; holdmessage += searchURL; }
      if (axholdstatus == 9) { holdmessage += forceholdmessage; holdmessage += searchURL; }

      holdmessage += "</b></font></div >";
      // nlapiLogExecution('Debug', 'holdmessage', holdmessage);
      nlapiSetFieldValue('custbody172', holdmessage);
    }

    //// end of user id

    ////////////////////////////////////end hold status
    if (cust) {




      nlapiSetFieldValue('custbody69', "");
      nlapiSetFieldValue('custbody73', "");

      var record = nlapiLoadRecord('customer', cust);


      //-------------------------------------------------------------------
      var cust_invInstructions = record.getFieldValue('custentity251');  //custentity251
      var cust_location = record.getFieldValue('custentity180');
      var cust_class = record.getFieldValue('custentity149');
      //-------------------------------------------------------------------

      //alert(nlapiGetFieldValue('terms'));
      if (nlapiGetFieldValue('terms') != 8) {
        var custterms = record.getFieldValue('terms');
        nlapiSetFieldValue('terms', custterms);
        nlapiSetFieldValue('creditcard', "");
      }

      //-----------------------------------------------------------------------

      if (nlapiGetFieldValue('custbody73') == "") {
        var aprover = record.getFieldValue('custentity158');
        nlapiSetFieldValue('custbody73', aprover);
      }

      if (nlapiGetFieldValue('custbody69') == "") {
        var plantcode = record.getFieldValue('custentity157');
        nlapiSetFieldValue('custbody69', plantcode);
      }

      //---------------------------------

      var cust_wellsitename = record.getFieldValue('custentity_req_wellsitename');
      var order_wellsitename = nlapiGetFieldValue('custbody8');

      var cust_wellnumber = record.getFieldValue('custentity_req_wellnumber');
      var order_wellnumber = nlapiGetFieldValue('custbody9');

      var cust_accountingnum = record.getFieldValue('custentity_req_accountingnumber');
      var order_accountingnum = nlapiGetFieldValue('custbody10');

      var cust_glaccount = record.getFieldValue('custentity_req_glaccount');
      var order_glaccount = nlapiGetFieldValue('custbody74');

      var cust_techname = record.getFieldValue('custentity_req_techname');
      var order_techname = nlapiGetFieldValue('custbody38');

      var cust_xtocode = record.getFieldValue('custentity_req_xtocode');
      var order_xtocode = nlapiGetFieldValue('custbody11');

      var cust_plantcode = record.getFieldValue('custentity_req_plantcode');
      var order_plantcode = nlapiGetFieldValue('custbody69');

      var cust_approverid = record.getFieldValue('custentity_req_approverid');
      var order_approverid = nlapiGetFieldValue('custbody73');

      var cust_xtoreasoncodes = record.getFieldValue('custentity_req_xto_reason_codes');
      var order_xtoreasoncodes = nlapiGetFieldValue('custbody67');

      var cust_paykey_userId_required = nlapiLookupField('customer', cust, 'custentity187');
      var order_paykey_userId_required = nlapiGetFieldValue('custbody7');

      var cust_po_required = nlapiLookupField('customer', cust, 'custentity193');
      var order_po_required = nlapiGetFieldValue('otherrefnum');

      var req = 'Required'
      var blank = ""

      //-------------------------

      if (order_wellsitename == req) {
        nlapiSetFieldValue('custbody8', blank, null, false);
      }

      if (cust_wellnumber == req) {
        nlapiSetFieldValue('custbody9', blank, null, false);
      }

      if (order_accountingnum == req) {
        nlapiSetFieldValue('custbody10', blank, null, false);
      }

      if (order_glaccount == req) {
        nlapiSetFieldValue('custbody74', blank, null, false);
      }

      if (order_techname == req) {
        nlapiSetFieldValue('custbody88', blank, null, false);
      }

      if (order_xtocode == req) {
        nlapiSetFieldValue('custbody11', blank, null, false);
      }

      if (order_plantcode == req) {
        nlapiSetFieldValue('custbody69', blank, null, false);
      }

      if (order_approverid == req) {
        nlapiSetFieldValue('custbody73', blank, null, false);
      }

      if (order_xtoreasoncodes == req) {
        nlapiSetFieldValue('custbody67', blank, null, true);
      }


      if (order_paykey_userId_required == req) {
        nlapiSetFieldValue('custbody7', blank, null, true);
      }

      if (order_po_required == req) {
        nlapiSetFieldValue('otherrefnum', blank, null, true);
      }

      //------------------------


      if (cust_wellsitename == "T" && order_wellsitename == "") {
        nlapiSetFieldValue('custbody8', req, null, false);
      }

      if (cust_wellnumber == "T" && order_wellnumber == "") {
        nlapiSetFieldValue('custbody9', req, null, false);
      }

      if (cust_accountingnum == "T" && order_accountingnum == "") {
        nlapiSetFieldValue('custbody10', req, null, false);
      }

      if (cust_glaccount == "T" && order_glaccount == "") {
        nlapiSetFieldValue('custbody74', req, null, false);
      }

      if (cust_techname == "T" && order_techname == "") {
        nlapiSetFieldValue('custbody88', req, null, false);
      }

      if (cust_xtocode == "T" && order_xtocode == "") {
        nlapiSetFieldValue('custbody11', req, null, false);
      }

      if (cust_plantcode == "T" && order_plantcode == "") {
        nlapiSetFieldValue('custbody69', req, null, false);
      }

      if (cust_approverid == "T" && order_approverid == "") {
        nlapiSetFieldValue('custbody73', req, null, false);
      }

      if (cust_xtoreasoncodes == "T" && order_xtoreasoncodes == "") {
        nlapiSetFieldValue('custbody67', req, null, true);
      }

      if (cust_paykey_userId_required == "T" && order_paykey_userId_required == "") {
        nlapiSetFieldValue('custbody7', 182, null, true);
      }

      if (cust_po_required == "T" && order_po_required == "") {
        nlapiSetFieldValue('otherrefnum', req, null, true);
      }


      //------------------------

      var empty = "";
      nlapiSetFieldText('custbody36', empty);


      nlapiSetFieldValue('class', cust_class);
      nlapiSetFieldValue('location', cust_location);
      nlapiSetFieldValue('custbody36', cust_invInstructions);


    }
    //------------------------------------------------------------------------------------


    return true;

  }

  //if(type === 'item' && name == 'location' )
  //	{
  //var linepricegroup=nlapiGetCurrentLineItemValue('item', 'price')
  //nlapiSetCurrentLineItemValue('item', 'price', linepricegroup);
  //  }
  return true;
}


//-------------------------------------------------------------------------------

/////////////////////////////////////////////////////////////////////////////////////////////////////////
