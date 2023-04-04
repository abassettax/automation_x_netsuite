function replaceLetter(str) { return str.replace(/,/g, '\n'); }
debugger;
var st = replaceLetter('hahaha');
function markshipped() {

  var stat = nlapiGetFieldValue('status');
  var idd = nlapiGetRecordId();

  if (stat == "Pick/Pack for Shipping") {
    var rec = nlapiLoadRecord('itemfulfillment', idd); rec.setFieldValue('custbody102', nlapiGetUser()); rec.setFieldValue('shipstatus', "C"); rec.setFieldValue('custbody95', 0); nlapiSubmitRecord(rec);
    location.reload();

  }
  if (stat == "Committed Pull") {
    var rec = nlapiLoadRecord('itemfulfillment', idd); rec.setFieldValue('shipstatus', "B"); nlapiSubmitRecord(rec);
    location.reload();
  }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function fchange(type, name) {

  var createf = nlapiGetFieldValue('createdfrom');
  var createft = nlapiLookupField('transaction', createf, 'type', true);

  /*if(name =='quantity' && createft =='Transfer Order' && type == 'edit'){
    
    
   var newqty =  nlapiGetCurrentLineItemValue('item', 'quantity')
  //var quantityreceived = 
  //  alert(1);
  
    var transferorderSearch = nlapiSearchRecord("transferorder",null,
  [
     ["type","anyof","TrnfrOrd"], 
     "AND", 
     ["internalidnumber","equalto","3040030"], 
     "AND", 
     ["mainline","is","F"], 
     "AND", 
     ["transferorderquantityreceived","greaterthan","0"], 
     "AND", 
     ["item.internalidnumber","equalto","60726"]
  ], 
  [
     new nlobjSearchColumn("ordertype").setSort(false), 
     new nlobjSearchColumn("mainline"), 
     new nlobjSearchColumn("tranid"), 
     new nlobjSearchColumn("transferorderquantityreceived"), 
     new nlobjSearchColumn("transferorderquantityshipped"), 
     new nlobjSearchColumn("quantity"), 
     new nlobjSearchColumn("transferorderquantityreceived")
  ]
  );
    alert(1);
  if(transferorderSearch)
    {
   var qtyRec = transferorderSearch[0].getValue('transferorderquantityreceived',null,null);   
  alert(qtyRec);
    }
  
  }
    */

  var docLocation = nlapiGetLineItemValue('item', 'location', 1);
  if (name == 'shipstatus' && nlapiGetContext().getExecutionContext() == 'userinterface' && docLocation != '69') {
    var user = nlapiGetUser();
    var getUserMultiLocationID = nlapiLookupField('employee', user, 'custentity353', false);
    var userMultiLocation = ""; if (getUserMultiLocationID) { userMultiLocation = getUserMultiLocationID; }
    var userMultiLocationText = nlapiLookupField('employee', user, 'custentity353', true);
    //var user_location = nlapiLookupField('employee', user, 'location', true);
    //var user_location2 = nlapiLookupField('employee', user, 'custentity180', true);
    //var user_location3 = nlapiLookupField('employee', user, 'custentity190', true);
    nlapiSetFieldValue('generateintegratedshipperlabel', "F");

    var totallines = 0;

    var MultiLocationString = replaceLetter(userMultiLocationText);

    for (var i = 1; i <= 1; i++) //nlapiGetLineItemCount('item')
    {
      var ff_location = nlapiGetLineItemText('item', 'location', i);
      var ff = nlapiGetLineItemValue('item', 'itemreceive', i);
      var stat = nlapiGetFieldValue('shipstatus');

      var stats = (stat === "C") ? nlapiDisableField('custbody102', false) : nlapiDisableField('custbody102', true);    // sets shipped by to enabled or disabled based off of shipping status
      if (stat == "C") { nlapiSetFieldValue('custbody102', nlapiGetUser()); }
      //var totlines=0;

      if ((userMultiLocation.indexOf(docLocation) == -1) && ff == "T" && stat == "C") //ff_location != user_location &&  ff_location != user_location2     &&  ff_location != user_location3 &&
      {
        //totlines=1;
        totallines = 1;
      }
    }

    if (totallines >= 1) //&& Udept != 2 && Udept != 15 && Udept != 3 && Udept != 8 && Urole != 1052
    {

      alert("One or more selected line items are shipping out of a location not listed as one of your shipping locations.  You may only mark fulfillment's shipped out of the following locations: \n \n " + "\n" + MultiLocationString + "\n\n" + "Please have the location that is listed on the fulfillment finish processing the shipment or contact your administrator to add additional shipping locations.");
      //+ user_location +" \n "+  user_location2    +" \n "+     user_location3  
      stat = "B";
      nlapiSetFieldValue('shipstatus', stat);
      //nlapiSetFieldValue('generateintegratedshipperlabel', "F");
      // return true;
    }
  } else if (docLocation == '69') {
    // alert('skipping main block, checking integrated ship fld')
    //TODO: testing for reset of int shipping label field for rfs sen fn
    var intShipping = nlapiGetFieldValue('generateintegratedshipperlabel');
    if (intShipping == 'T' || intShipping == true) {
      nlapiSetFieldValue('generateintegratedshipperlabel', "F");
    }
  }
  return true;
}

//---------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------

function onSaveFulfillment() {
  var docLocation = nlapiGetLineItemValue('item', 'location', 1);
  if (docLocation != '69') {
    if (nlapiGetFieldValue('customform') == 350) { nlapiSetFieldValue('customform', 305); }

    if (nlapiGetFieldValue('tranid')) {

      var stat = nlapiGetFieldValue('shipstatus');
      var ccost = nlapiGetFieldValue('custbody95');
      var shipb = nlapiGetFieldValue('custbody102')

      if ((stat == "C") && ((ccost == "") || (shipb == "")) && nlapiGetContext().getExecutionContext() == 'userinterface') {
        alert("Please enter a value for CARRIER COST: and/or SHIPPED BY:\n \nCarrier Cost is the cost provided by the shipping company.  Please use standard millage rates for deliveries");

        return false;
      }

    }
  } else {
    // alert('docLocation is seneca, validating integrated shipping fld')
    //TODO: testing for reset of int shipping label field for rfs sen fn
    var intShipping = nlapiGetFieldValue('generateintegratedshipperlabel');
    if (intShipping == 'T' || intShipping == true) {
      nlapiSetFieldValue('generateintegratedshipperlabel', "F");
    }
  }
  return true;
}
