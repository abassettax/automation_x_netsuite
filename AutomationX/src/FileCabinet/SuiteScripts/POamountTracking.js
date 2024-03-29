function poamounttracking(type) {

  if (type == 'view' && nlapiGetFieldValue('custbody_sourceday_po_sd') == "F") {

    //add/remove buttons here as needed for POs based on role
    //only show edit if PO vendor is 2491 - Credit Card Purchase Tracker %
    //Edit id: edit
    //Close id: closeremaining
    var vendor = nlapiGetFieldValue('entity');
    var userRole = nlapiGetRole();
    var allowedRoles = [3,1052,1115,1003,1060,1054];
    if (vendor != '2491' && allowedRoles.indexOf(parseInt(userRole))== -1) {
      form.removeButton('edit');
      form.removeButton('closeremaining');
      form.removeButton('secondaryedit');
      form.removeButton('secondarycloseremaining');
    } else {
      //EmailPOButton
      //customscript855   customscript357
      var approvalStatus = nlapiGetFieldValue('approvalstatus');
      if (approvalStatus == '2') {  //Approved
        var materialStatus = nlapiGetFieldValue('custbody6');
        if (materialStatus == '1') {
          form.addButton('custpage_emailpo', 'Email Untransmitted PO', 'SendPOEmailRefreshes() ');
        } else if (materialStatus == '7') {
          form.addButton('custpage_emailpo', 'Email Unconfirmed PO', 'SendPOEmailRefreshes() ');
        }
      }
    }
    form.setScript('customscript357'); // sets the script on the client side
  } else {
    alert("Sourceday PO = T")
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  var purchaseorderSearch = nlapiSearchRecord("purchaseorder", null,
    [
      ["type", "anyof", "PurchOrd"],
      "AND",
      ["trandate", "within", "thisweek"],
      "AND",
      ["mainline", "is", "T"]
    ],
    [
      new nlobjSearchColumn("amount", null, "SUM")
    ]
  );

  var purchaseorderSearch2 = nlapiSearchRecord("purchaseorder", null,
    [
      ["type", "anyof", "PurchOrd"],
      "AND",
      ["trandate", "within", "thismonth"],
      "AND",
      ["mainline", "is", "T"]
    ],
    [
      new nlobjSearchColumn("amount", null, "SUM")
    ]
  );

  var COGScolumns = new Array();
  COGScolumns[0] = new nlobjSearchColumn("formulacurrency", null, "SUM").setFormula("CASE WHEN( {accounttype} = 'Cost of Goods Sold' ) THEN {grossamount} ELSE 0 END").setSort(true);

  var transactionSearch = nlapiSearchRecord("transaction", null,
    [
      ["trandate", "within", "lastrollingquarter"],
      "AND",
      ["posting", "is", "T"],
      "AND",
      ["accounttype", "anyof", "COGS"],
      "AND",
      ["item.type", "anyof", "Assembly", "InvtPart", "Service", "Kit", "Group"],
      "AND",
      ["class", "anyof", "@ALL@"]
    ],
    COGScolumns
  );



  var WA = purchaseorderSearch[0].getValue("amount", null, "SUM") * 1;
  var WAFormated = '$' + parseFloat(WA).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

  var MA = purchaseorderSearch2[0].getValue("amount", null, "SUM");
  var MAFormated = '$' + parseFloat(MA).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

  var RQCOGS = transactionSearch[0].getValue(COGScolumns[0]) / 3;
  var RQCOGSWEEK = RQCOGS / 4;
  var RQCOGSFormated = '$' + parseFloat(RQCOGS).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

  var weeklypercent = ((WA / RQCOGSWEEK) * 100).toFixed(2);
  var monthlypercent = ((MA / RQCOGS) * 100).toFixed(2);


  var povalues = '</br><font   size=\"2\">This Weeks Purchases: ' + WAFormated + ' (' + weeklypercent + '%)</br></br>This Months Purchases: ' + MAFormated + ' (' + monthlypercent + '%)</br></br>Three Months Average COGS: ' + RQCOGSFormated + '</font>';
  //<p> <img src=\"https://system.na3.netsuite.com/core/media/media.nl?id=5036290&c=422523&h=b11f0dfdf73eb3447d37\" style=\"width: 480px; height: 270px;\"></p>
  nlapiSetFieldValue('custbody164', povalues);
}