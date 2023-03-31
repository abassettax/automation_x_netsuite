function UpdateIRBillPricing() {
  if (nlapiGetCurrentLineItemValue('item', 'item')) { nlapiCommitLineItem('item'); }
  var poidupdate = nlapiGetRecordId();
  ///////////start vendor bill
  var billColumn = new Array();
  billColumn[0] = new nlobjSearchColumn("internalid", "billingTransaction", "GROUP").setSort(false);

  var vendorBillSearch = nlapiSearchRecord("purchaseorder", null,
    [
      ["type", "anyof", "PurchOrd"],
      "AND",
      ["internalidnumber", "equalto", poidupdate],
      "AND",
      ["mainline", "is", "F"],
      "AND",
      ["rate", "greaterthan", "0.00"],
      "AND",
      ["billingtransaction.internalidnumber", "isnotempty", ""]
    ],
    billColumn
  );

  if (vendorBillSearch) {
    // alert(vendorBillSearch.length);
    for (var x = 0; vendorBillSearch != null && x < vendorBillSearch.length; x++) {

      var thisBill = vendorBillSearch[x].getValue(billColumn[0]);
      var thisBillRecord = nlapiLoadRecord('vendorbill', thisBill)

      var column = new Array();
      column[0] = new nlobjSearchColumn("tranid").setSort(false);
      column[1] = new nlobjSearchColumn("statusref");
      column[2] = new nlobjSearchColumn("custcol38");
      column[3] = new nlobjSearchColumn("item");
      column[4] = new nlobjSearchColumn("linesequencenumber");
      column[5] = new nlobjSearchColumn("internalid", "billingTransaction", null);
      column[6] = new nlobjSearchColumn("statusref", "billingTransaction", null);
      column[7] = new nlobjSearchColumn("tranid", "billingTransaction", null);
      column[8] = new nlobjSearchColumn("rate", "billingTransaction", null);
      column[9] = new nlobjSearchColumn("linesequencenumber", "billingTransaction", null);
      column[10] = new nlobjSearchColumn("internalid", "fulfillingTransaction", null);
      column[11] = new nlobjSearchColumn("tranid", "fulfillingTransaction", null);
      column[12] = new nlobjSearchColumn("rate", "fulfillingTransaction", null);
      column[13] = new nlobjSearchColumn("linesequencenumber", "fulfillingTransaction", null);


      var purchaseorderSearch = nlapiSearchRecord("purchaseorder", null,
        [
          ["type", "anyof", "PurchOrd"],
          "AND",
          ["internalidnumber", "equalto", poidupdate],
          "AND",
          ["mainline", "is", "F"],
          "AND",
          ["rate", "greaterthan", "0.00"],
          "AND",
          ["billingtransaction.internalidnumber", "equalto", parseInt(thisBill)]
        ],
        column
      );


      for (var i = 0; purchaseorderSearch != null && i < purchaseorderSearch.length; i++) {

        var PO = purchaseorderSearch[i].getValue(column[0]);
        var poStatus = purchaseorderSearch[i].getValue(column[1]);
        var poFiveCode = purchaseorderSearch[i].getValue(column[2]);
        var poItem = purchaseorderSearch[i].getValue(column[3]);
        var poLine = purchaseorderSearch[i].getValue(column[4]);
        var poRate = nlapiGetLineItemValue('item', 'rate', poLine); //alert(poRate);
        var bill = purchaseorderSearch[i].getValue(column[5]);
        var billStatus = purchaseorderSearch[i].getValue(column[6]);
        var billLine = purchaseorderSearch[i].getValue(column[9]);
        var ir = purchaseorderSearch[i].getValue(column[10]);
        var irLine = purchaseorderSearch[i].getValue(column[13]);

        thisBillRecord.selectLineItem('item', billLine);
        thisBillRecord.setCurrentLineItemValue('item', 'rate', poRate);
        thisBillRecord.commitLineItem('item');

        nlapiSubmitRecord(thisBillRecord, true)
      }


    }
  }
  ////////////End Vendor bill


  ////////start IR update

  var irColumn = new Array();
  irColumn[0] = new nlobjSearchColumn("internalid", "fulfillingTransaction", "GROUP").setSort(false);

  var irSearch = nlapiSearchRecord("purchaseorder", null,
    [
      ["type", "anyof", "PurchOrd"],
      "AND",
      ["internalidnumber", "equalto", poidupdate],
      "AND",
      ["mainline", "is", "F"],
      "AND",
      ["rate", "greaterthan", "0.00"],
      "AND",
      ["fulfillingTransaction.internalidnumber", "isnotempty", ""]
    ],
    irColumn
  );

  if (irSearch) {
    // alert(irSearch.length);
    for (var h = 0; irSearch != null && h < irSearch.length; h++) {

      var thisIr = irSearch[h].getValue(irColumn[0]);
      var thisIrRecord = nlapiLoadRecord('itemreceipt', thisIr)

      var column = new Array();
      column[0] = new nlobjSearchColumn("tranid").setSort(false);
      column[1] = new nlobjSearchColumn("statusref");
      column[2] = new nlobjSearchColumn("custcol38");
      column[3] = new nlobjSearchColumn("item");
      column[4] = new nlobjSearchColumn("linesequencenumber");
      column[5] = new nlobjSearchColumn("internalid", "billingTransaction", null);
      column[6] = new nlobjSearchColumn("statusref", "billingTransaction", null);
      column[7] = new nlobjSearchColumn("tranid", "billingTransaction", null);
      column[8] = new nlobjSearchColumn("rate", "billingTransaction", null);
      column[9] = new nlobjSearchColumn("linesequencenumber", "billingTransaction", null);
      column[10] = new nlobjSearchColumn("internalid", "fulfillingTransaction", null);
      column[11] = new nlobjSearchColumn("tranid", "fulfillingTransaction", null);
      column[12] = new nlobjSearchColumn("rate", "fulfillingTransaction", null);
      column[13] = new nlobjSearchColumn("linesequencenumber", "fulfillingTransaction", null);


      var purchaseorderSearch = nlapiSearchRecord("purchaseorder", null,
        [
          ["type", "anyof", "PurchOrd"],
          "AND",
          ["internalidnumber", "equalto", poidupdate],
          "AND",
          ["mainline", "is", "F"],
          "AND",
          ["rate", "greaterthan", "0.00"],
          "AND",
          ["fulfillingTransaction.internalidnumber", "equalto", parseInt(thisIr)]
        ],
        column
      );

      for (var i = 0; purchaseorderSearch != null && i < purchaseorderSearch.length; i++) {
        var PO = purchaseorderSearch[i].getValue(column[0]);
        var poStatus = purchaseorderSearch[i].getValue(column[1]);
        var poFiveCode = purchaseorderSearch[i].getValue(column[2]);
        var poItem = purchaseorderSearch[i].getValue(column[3]);
        var poLine = purchaseorderSearch[i].getValue(column[4]);
        var poRate = nlapiGetLineItemValue('item', 'rate', poLine); //alert(poRate);
        var bill = purchaseorderSearch[i].getValue(column[5]);
        var billStatus = purchaseorderSearch[i].getValue(column[6]);
        var billLine = purchaseorderSearch[i].getValue(column[9]);
        var ir = purchaseorderSearch[i].getValue(column[10]);
        var irLine = purchaseorderSearch[i].getValue(column[13]);

        thisIrRecord.selectLineItem('item', irLine);
        thisIrRecord.setCurrentLineItemValue('item', 'rate', poRate);
        thisIrRecord.commitLineItem('item');

        nlapiSubmitRecord(thisIrRecord, true)
      }
    }
  }
  //////// End start IR update

  alert("Update Complete.  Don't forget to save the Purchase Order");
  return true;

}




function LogVendorContactFromSavedSearch(recid, Userid)  ///////////////// Logs vendor contact
{

  var OldReleaseNotes = nlapiLookupField('purchaseorder', recid, 'custbody45');
  var USERNAME = nlapiLookupField('employee', Userid, 'entityid');


  var now = new Date();
  var dd = now.getDate();
  var month = now.getMonth() + 1;
  var y = now.getFullYear();
  var lastsaved = month + '/' + dd + '/' + y;
  var daystoadd = 2;

  var nextactionday = now.getDay();
  if (nextactionday == 4) { daystoadd = 5; } else if (nextactionday == 5) { daystoadd = 4; }
  var nextactiondate = nlapiAddDays(now, daystoadd);

  var NAdd = nextactiondate.getDate();
  var NAmonth = nextactiondate.getMonth() + 1;
  var NAy = nextactiondate.getFullYear();
  var nextactiondateFormated = NAmonth + '/' + NAdd + '/' + NAy;

  var newreleasenotes = OldReleaseNotes + '</br>' + lastsaved + '  Contacted Vendor - ' + USERNAME;

  nlapiSubmitField('purchaseorder', recid, ['custbody45', 'custbody77', 'custbody71'], [newreleasenotes, lastsaved, nextactiondateFormated]);
  alert('Contact Logged');
  return true;
}





function POcreateEmail(recid, venid, Userid) /////////opens popup to send email from saved search
{

  var Screenheight = window.screen.availHeight;
  var ScreenWidth = window.screen.availWidth;

  Screenheight = parseInt(Screenheight) * .4;
  ScreenWidth = parseInt(ScreenWidth) * .4;

  var createEMailURL = 'https://system.na3.netsuite.com/app/crm/common/crmmessage.nl?transaction=' + recid + '&entity=' + venid + '&l=T&templatetype=EMAIL';


  var OldReleaseNotes = nlapiLookupField('purchaseorder', recid, 'custbody45');
  var USERNAME = nlapiLookupField('employee', Userid, 'entityid');

  var newwindow = window.open(createEMailURL, 'newemail' + recid + venid, 'height=' + Screenheight, 'width=' + ScreenWidth);
  if (window.focus) { newwindow.focus(); }

  var now = new Date();
  var dd = now.getDate();
  var month = now.getMonth() + 1;
  var y = now.getFullYear();
  var lastsaved = month + '/' + dd + '/' + y;
  var daystoadd = 2;

  var nextactionday = now.getDay();
  if (nextactionday == 4) { daystoadd = 5; } else if (nextactionday == 5) { daystoadd = 4; }
  var nextactiondate = nlapiAddDays(now, daystoadd);

  var NAdd = nextactiondate.getDate();
  var NAmonth = nextactiondate.getMonth() + 1;
  var NAy = nextactiondate.getFullYear();
  var nextactiondateFormated = NAmonth + '/' + NAdd + '/' + NAy;
  var newreleasenotes = OldReleaseNotes + '</br>' + lastsaved + ' Contacted Vendor - ' + USERNAME;
  nlapiSubmitField('purchaseorder', recid, ['custbody45', 'custbody77', 'custbody71'], [newreleasenotes, lastsaved, nextactiondateFormated]);
  alert('Contact Logged');


  return true;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//customsearch6116 and customsearch599
function SendPOEmailRefreshRunFromSearch(thisPOid) {
  if (thisPOid) {

    var pofields = ['custbody6', 'entity'];
    var rec = nlapiLookupField('purchaseorder', thisPOid, pofields);
    var vendorid = rec.entity;   //rec.getFieldValue('entity');
    var POtransmitEmail = nlapiLookupField('vendor', vendorid, 'email');
    if (rec.custbody6 != 7 && rec.custbody6 != 1 && rec.custbody6 != 8) { alert('This PO can not be auto emailed.'); return false; }
    if (!POtransmitEmail) { alert('Vendor is Missing PO transmision Email.  Please add PO Email To Vendor '); return false; }
    nlapiSubmitField("purchaseorder", thisPOid, 'custbody201', 'T');
    var createPOUrl = 'https://system.na3.netsuite.com/app/accounting/transactions/purchord.nl?id=' + thisPOid + '&whence=';
    window.open(createPOUrl, '_blank');
  }
  //return false;
}
//////////end run from saved search 
//
//
//
// off of button directly from PO
function SendPOEmailRefreshes() {
  var pofields = ['custbody6', 'entity'];
  var rec = nlapiLookupField('purchaseorder', nlapiGetRecordId(), pofields);   //nlapiLoadRecord('purchaseorder', nlapiGetRecordId());
  var vendorid = rec.entity;   //rec.getFieldValue('entity');
  var POtransmitEmail = nlapiLookupField('vendor', vendorid, 'email');
  // if (rec.custbody6 != 7) { alert('This PO has already been sent.'); return false; }
  // if (!POtransmitEmail) { alert('Vendor is Missing PO transmision Email.  Please add PO Email To Vendor '); return false; }
  nlapiSubmitField("purchaseorder", nlapiGetRecordId(), 'custbody201', 'T');
  var createPOUrl = window.location.href + '&selectedtab=cmmnctntab';
  window.open(createPOUrl, '_self');

}

function openitempo() {
  var uid = nlapiGetCurrentLineItemValue('item', 'item');

  if (!uid) { alert("Please select an item"); return true; }
  if (uid) {
    window.open("https://system.na3.netsuite.com/app/common/item/item.nl?id=" + uid, '_blank');
    return true;
  }
}
//end open items

function openiteminvpo() {
  var uid = nlapiGetCurrentLineItemValue('item', 'item');

  if (!uid) { alert("Please select an item to check inventory."); return true; }
  if (uid) {
    var w = screen.width - 50;
    window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID=" + uid + "&style=NORMAL&report=&grid=&searchid=3993&sortcol=Item_INVENTOCATION17_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F", "newwin", "dependent = yes, height=800, width=" + w + ", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");
    return true;
  }
}

function updateIRvendor() {
  alert("Starting Update.  Please wait.")
  var newVendor = nlapiGetFieldValue('entity');

  var lineCount = nlapiGetLineItemCount('links');
  for (x = 1; x <= lineCount; x++) {
    var irRec = nlapiGetLineItemValue('links', 'id', x);
    //alert(irRec);
    nlapiSubmitField("itemreceipt", irRec, 'entity', newVendor);

  }
  alert("Finished.  Don't forget to save.")
  //nlapiSubmitRecord();
  return true;
}

////////////
function tranHistory() {
  var uid = nlapiGetCurrentLineItemValue('item', 'item');
  var lineloc = nlapiGetCurrentLineItemValue('item', 'location');

  var sloc = "ALL";
  if (lineloc) { sloc = lineloc; }
  if (!uid && !lineloc) {
    alert("Please select a line to check inventory.");
    return true;
  }

  if (type == 'item' && uid == "") return true;
  {

    var w = screen.width - 50;
    var h = screen.height - 50;



    window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_LOCATION=" + sloc + "&Transaction_TYPE=SalesOrd&IT_Item_INTERNALID=" + uid + "&searchid=4847&whence=", "newwin", "dependent = yes, height=" + h + ", width=" + w + ", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");



    return true;
  }
  return true;
}

////////////////////////////////////////////////
function breakPOlink() {
  var rec = nlapiLoadRecord('purchaseorder', nlapiGetRecordId());

  var npurchasingnotes = "";

  var purchasingnotes = rec.getFieldValue('custbody34');
  if (purchasingnotes != null) {
    npurchasingnotes = purchasingnotes;
  }


  var cf = nlapiGetFieldText('createdfrom');

  var newpurchasingnotes = npurchasingnotes + " Original For:" + cf
  rec.setFieldValue('custbody34', newpurchasingnotes);



  var lineCount = rec.getLineItemCount('item');
  for (var i = lineCount; i >= 1; i--) {

    var itemss = rec.getLineItemValue('item', 'item', i);
    var qty = rec.getLineItemValue('item', 'quantity', i);
    var desc = rec.getLineItemValue('item', 'description', i);
    var qtyrec = rec.getLineItemValue('item', 'quantityreceived', i);
    var newqty = qty - qtyrec
    var expectedshipdate = rec.getLineItemValue('item', 'custcol11', i);
    var itemporate = rec.getLineItemValue('item', 'rate', i);
    var polocation = rec.getLineItemValue('item', 'location', i);
    var sonotes = rec.getLineItemValue('item', 'custcol17', i);
    var newlinedesc = "*** Original Line ***" + desc;


    if (qtyrec <= 0 || qtyrec == null) {
      rec.removeLineItem('item', i); //removing the line item to break the linkage between SO and PO

      //add the same line item values 
      rec.insertLineItem('item', i);
      rec.setCurrentLineItemValue('item', 'item', itemss, true);
      rec.setCurrentLineItemValue('item', 'quantity', qty, true);
      rec.setCurrentLineItemValue('item', 'description', desc, true);
      rec.setCurrentLineItemValue('item', 'custcol11', expectedshipdate, true);
      rec.setCurrentLineItemValue('item', 'rate', itemporate, true);
      rec.setCurrentLineItemValue('item', 'location', polocation, true);
      rec.setCurrentLineItemValue('item', 'custcol17', sonotes, true);
      rec.setCurrentLineItemValue('item', 'isclosed', "T", true);
      rec.commitLineItem('item');
    }


    if (qtyrec >= 0 && newqty > 0) {
      //add the same line item values with remaining qty

      rec.selectLineItem('item', i);
      rec.setCurrentLineItemValue('item', 'quantity', qtyrec, true); // sets original line qty to qty rec
      rec.setCurrentLineItemValue('item', 'description', newlinedesc, true);
      rec.commitLineItem('item');

      rec.insertLineItem('item', i);
      rec.setCurrentLineItemValue('item', 'item', itemss, true);
      rec.setCurrentLineItemValue('item', 'quantity', newqty, true);
      rec.setCurrentLineItemValue('item', 'description', desc, true);
      rec.setCurrentLineItemValue('item', 'custcol11', expectedshipdate, true);
      rec.setCurrentLineItemValue('item', 'rate', itemporate, true);
      rec.setCurrentLineItemValue('item', 'location', polocation, true);
      rec.setCurrentLineItemValue('item', 'custcol17', sonotes, true);
      rec.commitLineItem('item');
    }

  }

  nlapiSubmitRecord(rec, true);

  window.location.reload(true);

}  