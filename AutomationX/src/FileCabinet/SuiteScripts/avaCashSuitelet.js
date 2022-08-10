function avaCash() {

   ///////////////////////////////////117	
   ///***************************
   var linemax = 12000000;      //***********************************************************************************
   ///***************************

   ////total ap 
   var totalAPColumns = new Array();
   totalAPColumns[0] = new nlobjSearchColumn("balance", null, null).setSort(false);
   var totalAPSearch = nlapiSearchRecord("account", null,
      [
         ["internalidnumber", "equalto", "117"]
      ],
      totalAPColumns
   );
   ///////////////////////

   ////rec not billed
   var recNotbilledColumns = new Array();
   recNotbilledColumns[0] = new nlobjSearchColumn("balance", null, null).setSort(false);
   var recNotbilledSearch = nlapiSearchRecord("account", null,
      [
         ["internalidnumber", "equalto", "109"]
      ],
      recNotbilledColumns
   );
   ///////////////////////

   /////////////////////////////////// AP Totals
   var APcolumns = new Array();
   APcolumns[0] = new nlobjSearchColumn("amount", null, "SUM");
   APcolumns[1] = new nlobjSearchColumn("formuladate", null, "MAX").setFormula("CASE WHEN {duedate} <= {today}-7 THEN {duedate}  ELSE NULL  END");
   APcolumns[2] = new nlobjSearchColumn("formulacurrency", null, "SUM").setFormula("CASE WHEN {duedate} <= {today}-7 THEN {amount}  ELSE NULL  END");
   APcolumns[3] = new nlobjSearchColumn("formuladate", null, "MAX").setFormula("CASE WHEN {duedate} <= {today}-15 THEN {duedate}  ELSE NULL  END");
   APcolumns[4] = new nlobjSearchColumn("formulacurrency", null, "SUM").setFormula("CASE WHEN {duedate} <= {today}-15 THEN {amount}  ELSE NULL  END");
   APcolumns[5] = new nlobjSearchColumn("formuladate", null, "MAX").setFormula("CASE WHEN {duedate} <= {today}-20 THEN {duedate}  ELSE NULL  END");
   APcolumns[6] = new nlobjSearchColumn("formulacurrency", null, "SUM").setFormula("CASE WHEN {duedate} <= {today}-20 THEN {amount}  ELSE NULL  END");
   APcolumns[7] = new nlobjSearchColumn("formuladate", null, "MAX").setFormula("CASE WHEN {duedate} <= {today}-25 THEN {duedate}  ELSE NULL  END");
   APcolumns[8] = new nlobjSearchColumn("formulacurrency", null, "SUM").setFormula("CASE WHEN {duedate} <= {today}-25 THEN {amount}  ELSE NULL  END");
   APcolumns[9] = new nlobjSearchColumn("formuladate", null, "MAX").setFormula("CASE WHEN {duedate} <= {today}-35 THEN {duedate}  ELSE NULL  END");
   APcolumns[10] = new nlobjSearchColumn("formulacurrency", null, "SUM").setFormula("CASE WHEN {duedate} <= {today}-35 THEN {amount}  ELSE NULL  END");

   var vendorbillSearch = nlapiSearchRecord("vendorbill", null,
      [
         ["type", "anyof", "VendBill"],
         "AND",
         ["status", "anyof", "VendBill:A", "VendPymt:Z", "VendBill:D"],
         "AND",
         ["mainline", "is", "T"],
         "AND",
         ["memorized", "is", "F"]
      ],
      APcolumns
   );




   ///////GL Cash https://system.na3.netsuite.com/app/common/search/search.nl?cu=T&e=T&id=4005#
   var transactionSearch = nlapiSearchRecord("transaction", null,
      [
         ["account", "anyof", "124"],
         "AND",
         ["posting", "is", "T"],
         "AND",
         ["trandate", "onorbefore", "thismonth"]
      ],

      [
         new nlobjSearchColumn("amount", null, "SUM")
      ]
   );

   var transactionSearch2 = nlapiSearchRecord("transaction", null,
      [
         ["account", "anyof", "1123"],
         "AND",
         ["posting", "is", "T"],
         "AND",
         ["trandate", "onorbefore", "thismonth"]
      ],

      [
         new nlobjSearchColumn("amount", null, "SUM")
      ]
   );

   var transactionSearch3 = nlapiSearchRecord("transaction", null,
      [
         ["account", "anyof", "1146"],
         "AND",
         ["posting", "is", "T"],
         "AND",
         ["trandate", "onorbefore", "thismonth"]
      ],

      [
         new nlobjSearchColumn("amount", null, "SUM")
      ]
   );

   ///////// lineOS https://system.na3.netsuite.com/app/common/search/search.nl?cu=T&e=T&id=4003#
   var accountSearchA = nlapiSearchRecord("account", null,
      [
         ["number", "startswith", "2-0700400"]
      ],
      [
         new nlobjSearchColumn("balance", null, null)
      ]
   );
   //////////////glundepfunds https://system.na3.netsuite.com/app/common/search/search.nl?cu=T&e=T&id=4002#
   var accountSearch = nlapiSearchRecord("account", null,
      [
         ["number", "startswith", "1-0560000"]
      ],
      [
         new nlobjSearchColumn("balance", null, null)
      ]
   );
   ////////////////

   var content = "";

   var AmountRecNotBilled = recNotbilledSearch[0].getValue(nlobjSearchColumn("balance", null, null));

   var glCash = transactionSearch[0].getValue(nlobjSearchColumn("amount", null, "SUM"));
   var glCash2 = transactionSearch2[0].getValue(nlobjSearchColumn("amount", null, "SUM"));
   var glCash3 = transactionSearch3[0].getValue(nlobjSearchColumn("amount", null, "SUM"));
   var glundepfunds = accountSearch[0].getValue(nlobjSearchColumn("balance", null, null));
   var lineOS = accountSearchA[0].getValue(nlobjSearchColumn("balance", null, null));
   var cashAVA = parseInt(linemax) + parseInt(glCash) + parseInt(glCash2) + parseInt(glCash3) + parseInt(glundepfunds) + parseInt(lineOS);

   var sevenplus = vendorbillSearch[0].getValue(APcolumns[1]);
   var fifteenplus = vendorbillSearch[0].getValue(APcolumns[3]);
   var twentyplus = vendorbillSearch[0].getValue(APcolumns[5]);
   var twentyfiveplus = vendorbillSearch[0].getValue(APcolumns[7]);
   var thirtyfiveplus = vendorbillSearch[0].getValue(APcolumns[9]);

   var sevenplusamount = vendorbillSearch[0].getValue(APcolumns[2]);
   var fifteenplusamount = vendorbillSearch[0].getValue(APcolumns[4]);
   var twentyplusamount = vendorbillSearch[0].getValue(APcolumns[6]);
   var twentyfiveplusamount = vendorbillSearch[0].getValue(APcolumns[8]);
   var thirtyfiveplusamount = vendorbillSearch[0].getValue(APcolumns[10]);
   var totalap = totalAPSearch[0].getValue(totalAPColumns[0]);
   var totalapPlusRecNotBilled = Math.abs(parseInt(totalap)) + Math.abs(parseInt(AmountRecNotBilled));

   var FormatedAmountRecNotBilled = '$' + parseFloat(Math.abs(AmountRecNotBilled)).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var FormatedglCash = '$' + parseFloat(glCash).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var FormatedglCash2 = '$' + parseFloat(glCash2).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var FormatedglCash3 = '$' + parseFloat(glCash3).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var Formatedglundepfunds = '$' + parseFloat(glundepfunds).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var FormatedlineOS = '$' + parseFloat(lineOS).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var FormatedcashAVA = '$' + parseFloat(cashAVA).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var Formatedlinemax = '$' + parseFloat(linemax).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

   var Formatedsevenplusamount = '$' + parseFloat(sevenplusamount).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var Formatedfifteenplusamount = '$' + parseFloat(fifteenplusamount).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var Formatedtwentyplusamount = '$' + parseFloat(twentyplusamount).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var Formatedtwentyfiveplusamount = '$' + parseFloat(twentyfiveplusamount).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var Formatedthirtyfiveplusamount = '$' + parseFloat(thirtyfiveplusamount).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
   var Formatedtotalap = '$' + parseFloat(Math.abs(totalap)).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

   var FormatedtotalapPlusRecNotBilled = '$' + parseFloat(totalapPlusRecNotBilled).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

   content += "<table style=\"table-layout:auto; width:800px\"> <tr> <th align=\"center\"  style= \"border-bottom: solid; background-color:#dadada; width:200px\"></TH> <th align=\"center\"  style= \"border-bottom: solid;   background-color:#dadada;  padding: 5;  width:200px\"> Amount </TH>  <th align=\"center\"  style= \"border-bottom: solid; border-left: solid;  background-color:#dadada;   width:200px\"> Days Past Due </br> <font size =2>(Due Date <=)</font> </TH>     <th align=\"center\"  style= \"border-bottom: solid;   background-color:#dadada;   width:200px\"> Past Due Amount </TH></tr>" +

      "<tr ><td><table align=\"center\"><tr><td align=\"center\"> G\L Cash - 3808: </td></tr><tr><td align=\"center\"> G\L Cash - 2906: </td></tr><tr><td align=\"center\"> G\L Cash - 3205: </td></tr></table></td><td><table ><tr><td align=\"center\">" + FormatedglCash + "</td></tr><tr><td align=\"center\">" + FormatedglCash2 + "</td></tr><tr><td align=\"center\">" + FormatedglCash3 + "</td></tr></table></td>   <td style=\" padding: 2px; border-left: solid;  text-align:center; \" > 7+  <font size =2>(" + sevenplus + ")</font </td><td style=\" padding: 2px;  text-align: left;\"> " + Formatedsevenplusamount + "</td> </tr>" +

      "<tr style=\"  padding: 2px;   background-color: #f2f4f7 \"><td style=\" padding: 2px;  text-align: center;  \" > G\L Undeposited Funds: </td>  <td>" + Formatedglundepfunds + "</td><td style=\" padding: 2px; border-left: solid;  text-align:center; \" > 15+  <font size =2>(" + fifteenplus + ")</font </td><td style=\"  text-align: left;\"> " + Formatedfifteenplusamount + "</td></tr>  " +

      "<tr><td style=\" padding: 2px;  text-align: center; \" > Line Max: </td>  <td>" + Formatedlinemax + "</td> <td style=\" padding: 2px; border-left: solid;  text-align:center; \" > 20+  <font size =2>(" + twentyplus + ")</font </td><td style=\" padding: 2px;  text-align: left;\"> " + Formatedtwentyplusamount + "</td></tr>  " +

      "<tr style=\" background-color: #f2f4f7;  padding: 2px;\"><td style=\"  padding: 2px; text-align: center; \"> Line Outstanding: </td>  <td>" + FormatedlineOS + "</td> <td style=\" border-left: solid;  padding: 2px; text-align:center; \" > 25+  <font size =2>(" + twentyfiveplus + ")</font </td><td style=\"  padding: 2px; text-align: left;\"> " + Formatedtwentyfiveplusamount + "</td></tr>  " +

      "<tr style= \" font-weight: bold;  padding: 2px; \" ><td style= \"border-top: solid;  padding: 2px;  background-color: #dadada; text-align: center \" > Available Cash:</td>  <td  style= \"border-top: solid;  padding: 2px; background-color: #dadada \">" + FormatedcashAVA + "</td>" +
      "<td style= \"border-top: solid;  padding: 2px; border-left: solid; background-color: #dadada; text-align: center \" > Total AP:</td>  <td  style= \"border-top: solid;  padding: 2px;  background-color: #dadada \">" + Formatedtotalap + "</td></tr> " +

      "<tr style= \" padding: 2px; font-weight: bold; \" ><td style= \"   padding: 2px; background-color: #dadada; text-align: center \" > Received not billed:</td>  <td  style= \"   padding: 2px; background-color: #dadada \">" + FormatedAmountRecNotBilled + "</td>" +
      "<td style= \"  padding: 2px; border-left: solid;  background-color: #dadada; text-align: center \" >   Total AP & Rec Not Billed:</td>  <td  style= \"   padding: 2px; background-color: #dadada \">" + FormatedtotalapPlusRecNotBilled + "</td></tr></table> ";


   response.write(content);
}
