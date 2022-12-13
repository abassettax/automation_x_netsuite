function PO_OnSave(type) {


  //var loc = nlapiGetFieldValue('location');
  //var locationmismatch = 0;

  //for ( x = 1; x <= nlapiGetLineItemCount('item'); x++)
  // var item_count = nlapiGetLineItemCount('item');
  //for (var t = 1; item_count != null && t <= item_count; t++)
  //	{
  //var itemloc = nlapiGetLineItemValue('item', 'location', t);
  //if (itemloc != loc){locationmismatch++;}
  //	}
  //if(locationmismatch > 0){ alert("One or more line locations does not match the header location.  Please update the line locations."); return false;}

  //----------------------------------------------------------------------------
  var tranid = nlapiGetRecordId();
  var oldPO = "";
  if (tranid) { var oldPO = nlapiLoadRecord('purchaseorder', tranid); }
  var linepricechange = 0;

  var lineCount = parseInt(nlapiGetLineItemCount('item'));
  for (x = 1; x <= lineCount; x++) {
    nlapiSetLineItemValue('item', 'custcol_linenumber', x, x);
    if (tranid) {
      var oldprice = parseFloat(oldPO.getLineItemValue('item', 'rate', x)).toFixed(2);
      var newprice = parseFloat(nlapiGetLineItemValue('item', 'rate', x)).toFixed(2);
      var PriceChange = parseFloat(newprice - oldprice).toFixed(2);
      var PercentChange = ((1 - (oldprice / newprice)))
      // alert(PriceChange + ' ' + PercentChange);
      if (oldprice < newprice && oldprice && PriceChange > 1 && PercentChange > .02) { linepricechange = linepricechange + 1; }
    }
  }

  var rec = nlapiGetFieldValue('custbody_po_follow_up');


  var sendemail = nlapiGetFieldValue('custbody76');


  var porecord = new Array();
  porecord['transaction'] = nlapiGetRecordId();

  var date = new Date();
  var month = (date.getMonth() + 1);
  var day = date.getDate();
  var year = date.getFullYear();

  var today = (month + "/" + day + "/" + year);

  nlapiSetFieldValue('custbody77', today);

  var VenHoldCheck = nlapiGetFieldValue('custbody6'); //37

  var soid = nlapiGetFieldValue('custbody184');
  var SO = nlapiGetFieldValue('custbody184'); //nlapiGetFieldText('createdfrom');

  if (nlapiGetFieldValue('custbody147') == "T") //&& soid != null  && soid != "" )
  {

    //var address = nlapiLookupField('salesorder', soid , 'shipaddress');
    //nlapiSetFieldValue('shipaddress',address);
    var recid = nlapiGetRecordId();
    if (recid) {
      var columnsD = new Array();
      columnsD[0] = new nlobjSearchColumn("formulatext", null, "GROUP").setFormula("{custrecord_po_so_linkage_so.shipaddress}").setSort(false);

      var purchaseorderSearch = nlapiSearchRecord("customrecord_dh_po_so_linkage", null,
        [["custrecord_po_so_linkage_po.internalidnumber", "equalto", recid]],
        columnsD
      );
      if (purchaseorderSearch) {
        if (purchaseorderSearch.length > 1) { alert('This PO has multiple Sales Order with different ship to addresses. Please update sales order addresses to match.'); }
        else {
          var soaddress = "";
          var linkedSO = "";
          for (var b = 0; purchaseorderSearch != null && b < purchaseorderSearch.length; b++) {
            soaddress = purchaseorderSearch[b].getValue(columnsD[0]);
          }

          nlapiSetFieldValue('shipaddress', soaddress);
        }
      }
    }

  }

  var hasPOemail = nlapiGetFieldValue('custbody_po_follow_up'); //updated to look for follow up email not if its linked to SO    
  if (hasPOemail) {
    var CFtype = "salesorder"
    if (SO.startsWith("Sales")) { CFtype = 'salesorder'; }

    //////////start get customers
    var columnsD = new Array();
    columnsD[0] = new nlobjSearchColumn("custrecord241", null, "GROUP").setSort(false);
    columnsD[1] = new nlobjSearchColumn("formulatext", null, "GROUP").setFormula("{custrecord241}");
    columnsD[2] = new nlobjSearchColumn("custbody38", "CUSTRECORD_PO_SO_LINKAGE_SO", "GROUP"); //Tech
    columnsD[3] = new nlobjSearchColumn("custbody9", "CUSTRECORD_PO_SO_LINKAGE_SO", "GROUP"); //well number
    columnsD[4] = new nlobjSearchColumn("custbody8", "CUSTRECORD_PO_SO_LINKAGE_SO", "GROUP"); //Well Name 
    columnsD[5] = new nlobjSearchColumn("custbody73", "CUSTRECORD_PO_SO_LINKAGE_SO", "GROUP"); // approver
    columnsD[6] = new nlobjSearchColumn("otherrefnum", "CUSTRECORD_PO_SO_LINKAGE_SO", "GROUP"); //Cust PO

    var customrecord_dh_po_so_linkageSearch = nlapiSearchRecord("customrecord_dh_po_so_linkage", null,
      [
        ["custrecord_po_so_linkage_po.internalidnumber", "equalto", tranid],
        "AND",
        ["custrecord_po_so_linkage_so_line", "isnotempty", ""]
      ],
      columnsD
    );

    var CUS = "";
    var thisCust = "";
    var tech = "";
    var WellNumber = "";
    var wellName = "";
    var approver = "";
    var customerPO = "";

    var Thistech = "";
    var ThisWellNumber = "";
    var ThiswellName = "";
    var Thisapprover = "";
    var ThiscustomerPO = "";

    if (customrecord_dh_po_so_linkageSearch) {
      var lineCount = parseInt(customrecord_dh_po_so_linkageSearch.length);
      for (b = 0; b < lineCount && customrecord_dh_po_so_linkageSearch; b++) {
        thisCust = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[1]);
        CUS += thisCust;

        Thistech = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[2]);
        ThisWellNumber = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[3]);
        ThiswellName = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[4]);
        Thisapprover = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[5]);
        ThiscustomerPO = customrecord_dh_po_so_linkageSearch[b].getValue(columnsD[6]);

        tech += Thistech + ",";
        WellNumber += ThisWellNumber + ",";
        wellName += ThiswellName + ",";
        approver += Thisapprover + ",";
        customerPO += ThiscustomerPO + ",";

      }
    }
    //////////////////////////end get customers


    //if(!rec && SO && CFtype !=""){  rec = nlapiLookupField(CFtype,soid,'custbody_po_follow_up'); nlapiSetFieldValue('custbody_po_follow_up', rec );   }



    if (sendemail == "T" && rec != "" && rec != " " && rec != null && VenHoldCheck != 37 && nlapiGetFieldValue('custbody90') == 'T')  //soid != null &&  && soid != "" && SO != null 
    {

      var PO = nlapiGetFieldValue('tranid');
      var NA = nlapiGetFieldValue('custbody71');
      var MS = nlapiGetFieldText('custbody6');
      var RN = nlapiGetFieldValue('custbody45');
      var VN = nlapiGetFieldText('entity');

      var redate = nlapiGetLineItemValue('item', 'custcol11', 1, 1);

      var author = nlapiGetUser();

      var rec = nlapiGetFieldValue('custbody_po_follow_up');

      //--------------------------


      //alert(rec);
      var sub = ("PO Update " + PO + " Created From " + SO + " Vendor: " + VN + " Customer : " + CUS + " ( " + tech + " )");
      if (!CUS) { sub = "PO Update " + PO + " Created From Stock Request for  Vendor: " + VN; }
      var body = (PO + " created from " + SO + " for " + CUS + " containg items from " + VN + " has been Updated <br><br>" + " <b>Next Action: </b>" + NA + "<br>" + " <b>Material Status: </b>" + MS + "<br>" + " <b>Expected Ship Date(Line1):</b> " + redate + "<br><br>" + " <b>Release Notes:</b><br> " + RN + "<BR><BR> This email is an automated email alerting you that a change has been made to a Purchase Order related to one of your orders. <b>Tech:</b> " + tech + " <b>WellName/Number </b>" + wellName + " / " + wellName + " <b>Approver</b> " + approver + " <b>Customer PO </b>" + customerPO + "               Please call purchasing with additional questions.");
      if (!CUS) {
        sub = "PO Update " + PO + " Created from a Purchasing Request for Vendor: " + VN;
        body = PO + " created from a Purchasing Request from " + VN + " has been Updated <br><br>" + " <b>Next Action: </b>" + NA + "<br>" + " <b>Material Status: </b>" + MS + "<br>" + " <b>Expected Ship Date(Line1):</b> " + redate + "<br><br>" + " <b>Release Notes:</b><br> " + RN + "<BR><BR> This email is an automated email alerting you that a change has been made to a Purchase Order related to one of your requests.  Please call purchasing with additional questions.";
      }

      nlapiSendEmail(author, rec, sub, body, null, null, porecord);
      //return(true);

    }

    /////start price change email

    var loc = nlapiGetFieldValue('location');
    var locEmail = nlapiGetFieldValue('custbody195'); //nlapiLookupField('location', loc, 'custrecordpopricechange'); //custbody195
    var rec = nlapiGetFieldValue('custbody_po_follow_up');

    //alert(loc);alert(locEmail);
    if (((SO != null && sendemail == "T") || locEmail) && (rec || locEmail) && linepricechange > 0 && tranid) //check to see if price changed
    {
      //alert('in');
      var tranid = nlapiGetRecordId();
      // alert(tranid);
      var pocolumns = new Array();
      pocolumns[0] = new nlobjSearchColumn("line", null, "GROUP").setSort(false);
      pocolumns[1] = new nlobjSearchColumn("date", "lineSystemNotes", "MAX");
      pocolumns[2] = new nlobjSearchColumn("linesequencenumber", null, "GROUP");

      //run search
      var purchaseorderSearch = nlapiSearchRecord("purchaseorder", null,
        [

          ["linesystemnotes.field", "anyof", "TRANLINE.RUNITPRICE"],
          "AND",
          ["type", "anyof", "PurchOrd"],
          "AND",
          ["formulanumeric:  TO_NUMBER({linesystemnotes.newvalue}) -  TO_NUMBER({linesystemnotes.oldvalue})", "greaterthan", "1"],
          "AND",
          ["formulanumeric: 1- ( TO_NUMBER({linesystemnotes.oldvalue}) /  NULLIF(TO_NUMBER({linesystemnotes.newvalue}),0))", "greaterthan", "0.02"],
          "AND",
          ["status", "anyof", "PurchOrd:B", "PurchOrd:D", "PurchOrd:E", "PurchOrd:A", "PurchOrd:C", "PurchCon:R"],
          "AND",
          ["mainline", "is", "F"],
          "AND",
          ["internalidnumber", "equalto", tranid],
          "AND",
          ["type", "anyof", "PurchOrd"]
        ],

        pocolumns

      );

      //    alert(1);
      var content = "<table>  <th style=\" background-color: #f2f4f7 \"> # </th> <th style=\" background-color: #f2f4f7 \"> 5Code </th>  <th style=\" background-color: #f2f4f7 \"> Item </th> <th style=\" background-color: #f2f4f7 \"> Old Price </th> <th style=\" background-color: #f2f4f7 \"> New Price </th><th style=\" background-color: #f2f4f7 \"> Change Amount</th> <th style=\" background-color: #f2f4f7 \"> % of Price Change </th><th style=\" background-color: #f2f4f7 \">Change Date/Time  </th>   "
      for (var i = 1; i <= parseInt(nlapiGetLineItemCount('item')); i++) {

        var POline = i; //purchaseorderSearch[i].getValue(pocolumns[0]);

        var oldprice = parseFloat(oldPO.getLineItemValue('item', 'rate', POline)).toFixed(2);
        var newprice = parseFloat(nlapiGetLineItemValue('item', 'rate', POline)).toFixed(2);
        var PriceChange = parseFloat(newprice - oldprice).toFixed(2);
        var PercentChange = 5; //((1- (oldprice/newprice)) );

        if (oldprice < newprice && PriceChange > 1 && PercentChange > .02) {
          if (i % 2 == 0) {
            content += "<tr>";
          }
          else {
            content += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
          }

          var polinedispay = nlapiGetLineItemValue('item', 'custcol_linenumber', POline);
          var fivecode = nlapiGetLineItemValue('item', 'custcol38', POline);
          var itemdesc = nlapiGetLineItemValue('item', 'description', POline);
          var PriceChangeAmount = '$' + parseFloat(newprice - oldprice).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          var PercentOfChange = ((1 - (oldprice / newprice)) * 100).toFixed(2) + ' %';
          var SystemNoteDateTime = new Date();
          var oldpriceformated = parseFloat(oldprice).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          var newpriceformated = parseFloat(newprice).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");


          /// if not null feed get each line before and after price run calculations  // if current item rate = saved skip 
          content += "<td>" + polinedispay + "</td>" + "<td>" + fivecode + "</td>" + "<td>" + itemdesc + "</td>" + "<td>$" + oldpriceformated + "</td>" + "<td>$" + newpriceformated + "</td>" + "<td>" + PriceChangeAmount + "</td>" + "<td>" + PercentOfChange + "</td>" + "<td>" + SystemNoteDateTime + "</td>";
          content += "</tr>";
        }

      }

      content += "</table>";
      // alert(content);
      // alert(2);


      var PO = nlapiGetFieldValue('tranid');
      var NA = nlapiGetFieldValue('custbody71');
      var MS = nlapiGetFieldText('custbody6');
      var RN = nlapiGetFieldValue('custbody45');
      var VN = nlapiGetFieldText('entity');
      //var CUS  = nlapiLookupField('transaction', soid, 'entity', true);
      var redate = nlapiGetLineItemValue('item', 'custcol11', 1, 1);

      //alert(redate);


      var author = nlapiGetUser();

      //alert('setemail');
      if (locEmail && rec != locEmail) { locEmail = ['database@automation-x.com', locEmail]; } else { locEmail = 'database@automation-x.com'; }
      //--------------------------

      //alert("To Email");
      var sub = ("PO Line Item Price Change Alert: " + PO + " Created From " + SO + " Vendor: " + VN + " Customer : " + CUS);
      var body = ("Please review the price changes and contact purchasing if you would like to hold this purchase order while an alternative is sourced.<br> <b>NOTE: This PO will continue to be processed unless purchasing is notified.</b><br><br>" + content + "<br><br> " + PO + " created from " + SO + " for " + CUS + " containing items from " + VN + " has had pricing changes <br><br>" + " <b>Next Action: </b>" + NA + "<br>" + " <b>Material Status: </b>" + MS + "<br>" + " <b>Expected Ship Date(Line1):</b> " + redate + "<br><br>" + " <b>Release Notes:</b><br> " + RN + "<BR><BR> Please review the price changes and contact purchasing if you would like to hold this purchase order while an alternative is sourced.<br> <b>NOTE: This PO will continue to be processed unless purchasing is notified.</b><br><br>");
      var pricechangeTrue = 0;
      //alert(VenHoldCheck);
      //  if (rec){}
      if (VenHoldCheck != 37) { nlapiSendEmail(author, rec, sub, body, locEmail, 'mike.harris@automation-x.com', porecord); }
      else { var rec = 'database@automation-x.com'; nlapiSendEmail(author, rec, sub, body, locEmail, ['mike.harris@automation-x.com'], porecord); }
      //return(true);

      //  alert('sent');
    }
    ///////end price change email



  }

  return (true);
}


