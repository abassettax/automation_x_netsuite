function buQuotaCard(request, response) {
  ////////////////////////sales search
  nlapiLogExecution('debug', 'entry', 'test');

  //TODO: split out JEs into a seperate column
  //income statement revenue current period
  var columnsA = new Array();
  columnsA[0] = new nlobjSearchColumn("class",null,"GROUP");
  columnsA[1] = new nlobjSearchColumn("amount", null, "SUM");
  nlapiLogExecution('debug', 'columnsA', JSON.stringify(columnsA));
  var incomeSearch = nlapiSearchRecord("transaction", null,
    [
      ["accounttype", "anyof", "Income", "OthIncome"],
      "AND",
      ["posting", "is", "T"],
      "AND",
      ["postingperiod", "rel", "TP"],
      "AND",
      ["type", "noneof", "Journal"]
    ],
    columnsA
  );
  nlapiLogExecution('debug', 'incomeSearch', JSON.stringify(incomeSearch));
  var incomeData = [];
  for (var i = 0; i < incomeSearch.length; i++) {
    var incomeClass = incomeSearch[i].getValue(columnsA[0]);
    var incomeVal = incomeSearch[i].getValue(columnsA[1]);
    incomeData.push({
      class: incomeClass,
      total: incomeVal
    });
  }
  nlapiLogExecution('debug', 'incomeData', JSON.stringify(incomeData));

  //income statement journals current period
  var columnsA = new Array();
  columnsA[0] = new nlobjSearchColumn("class",null,"GROUP");
  columnsA[1] = new nlobjSearchColumn("amount", null, "SUM");
  nlapiLogExecution('debug', 'columnsA', JSON.stringify(columnsA));
  var incomeJSearch = nlapiSearchRecord("transaction", null,
    [
      ["accounttype", "anyof", "Income", "OthIncome"],
      "AND",
      ["posting", "is", "T"],
      "AND",
      ["postingperiod", "rel", "TP"],
      "AND",
      ["type", "anyof", "Journal"]
    ],
    columnsA
  );
  nlapiLogExecution('debug', 'incomeJSearch', JSON.stringify(incomeJSearch));
  var incomeJData = [];
  for (var i = 0; i < incomeJSearch.length; i++) {
    var incomeClass = incomeJSearch[i].getValue(columnsA[0]);
    var incomeVal = incomeJSearch[i].getValue(columnsA[1]);
    incomeJData.push({
      class: incomeClass,
      total: incomeVal
    });
  }
  nlapiLogExecution('debug', 'incomeJData', JSON.stringify(incomeJData));

  //so fulfilled - pending billing
  var columnsA = new Array();
  columnsA[0] = new nlobjSearchColumn("class",null,"GROUP");
  columnsA[1] = new nlobjSearchColumn("formulanumeric", null, "SUM").setFormula("({quantityshiprecv}-{quantitybilled})*{rate}");
  nlapiLogExecution('debug', 'columnsA', JSON.stringify(columnsA));
  var pending1Search = nlapiSearchRecord("salesorder", null,
    [
      ["mainline", "is", "F"],
      "AND",
      ["applyingtransaction.type", "anyof", "ItemShip"],
      "AND",
      ["status", "anyof", "SalesOrd:E", "SalesOrd:F"],
      "AND",
      ["type", "anyof", "SalesOrd"],
      "AND",
      ["formulanumeric: {quantityshiprecv}-{quantitybilled}", "greaterthan", "0"],
      "AND",
      ["closed", "is", "F"],
      "AND",
      ["formulanumeric: CASE WHEN {custbodycuscol_inv_pref} = 'Single Invoice' AND {status} = 'Pending Billing/Partially Fulfilled' THEN 1 ELSE 0 END", "equalto", "0"],
      "AND",
      ["applyingtransaction.trandate", "onorbefore", "thismonth"]
    ],
    columnsA
  );
  nlapiLogExecution('debug', 'pending1Search', JSON.stringify(pending1Search));
  var pending1Data = [];
  for (var i = 0; i < pending1Search.length; i++) {
    var pending1Class = pending1Search[i].getValue(columnsA[0]);
    var pending1Val = pending1Search[i].getValue(columnsA[1]);
    pending1Data.push({
      class: pending1Class,
      total: pending1Val
    });
  }
  nlapiLogExecution('debug', 'pending1Data', JSON.stringify(pending1Data));

  //so fulfilled - single invoice
  var columnsA = new Array();
  columnsA[0] = new nlobjSearchColumn("class",null,"GROUP");
  columnsA[1] = new nlobjSearchColumn("formulanumeric", null, "SUM").setFormula("({quantityshiprecv}-{quantitybilled})*{rate}");
  nlapiLogExecution('debug', 'columnsA', JSON.stringify(columnsA));
  var pending2Search = nlapiSearchRecord("salesorder", null,
    [
      ["mainline", "is", "F"],
      "AND",
      ["applyingtransaction.type", "anyof", "ItemShip"],
      "AND",
      ["status", "anyof", "SalesOrd:E", "SalesOrd:F"],
      "AND",
      ["type", "anyof", "SalesOrd"],
      "AND",
      ["formulanumeric: {quantityshiprecv}-{quantitybilled}", "greaterthan", "0"],
      "AND",
      ["closed", "is", "F"],
      "AND",
      ["formulanumeric: CASE WHEN {custbodycuscol_inv_pref} = 'Single Invoice' AND {status} = 'Pending Billing/Partially Fulfilled' THEN 1 ELSE 0 END", "equalto", "1"],
      "AND",
      ["applyingtransaction.trandate", "onorbefore", "thismonth"]
    ],
    columnsA
  );
  nlapiLogExecution('debug', 'pending2Search', JSON.stringify(pending2Search));
  var pending2Data = [];
  for (var i = 0; i < pending2Search.length; i++) {
    var pending2Class = pending2Search[i].getValue(columnsA[0]);
    var pending2Val = pending2Search[i].getValue(columnsA[1]);
    pending2Data.push({
      class: pending2Class,
      total: pending2Val
    });
  }
  nlapiLogExecution('debug', 'pending2Data', JSON.stringify(pending2Data));

  //this is booked sales. can still show, but goals are for invoiced sales
  var columnsA = new Array();
  columnsA[0] = new nlobjSearchColumn("class", null, "GROUP").setSort(false);
  columnsA[1] = new nlobjSearchColumn("amount", null, "SUM");
  nlapiLogExecution('debug', 'columnsA', JSON.stringify(columnsA));

  var salesSearch = nlapiSearchRecord("salesorder", null,
    [
      ["type","anyof","SalesOrd"], 
      "AND", 
      ["postingperiod","rel","TP"], 
      "AND", 
      ["mainline","is","T"], 
      "AND", 
      ["status","noneof","SalesOrd:H","SalesOrd:C"],
      "AND",
      ["class", "anyof", "43", "51", "73", "40", "33", "46", "72", "25", "31", "39", "65"]
    ],
    columnsA
  );

  nlapiLogExecution('debug', 'salesSearch', JSON.stringify(salesSearch));
  var data = [];
  for (var i = 0; i < salesSearch.length; i++) {
    var salesClass = salesSearch[i].getValue(columnsA[0]);
    var salesVal = salesSearch[i].getValue(columnsA[1]);
    data.push({
      class: salesClass,
      total: salesVal
    });
  }
  nlapiLogExecution('debug', 'data', JSON.stringify(data));

  var buLabels = ['ArkLaTex', 'C. Rockies', 'Carlsbad NM', 'Mid-Con', 'N. Rockies', 'N. Texas', 'North East', 'S. Rockies', 'S. Texas', 'W. Texas', 'Automation-X'];
  var classIds = [[43], [51], [73], [40], [33], [46], [39, 72], [25], [31], [65], "all"]
  var buGoals0 = [480000, 350000, 505000, 1290000, 450000, 760000, 1320000, 130000, 775000, 1140000, 7200000];
  var buGoals1 = [495000, 360000, 515000, 1330000, 455000, 780000, 1360000, 135000, 800000, 1170000, 7400000];
  var buGoals2 = [510000, 370000, 530000, 1370000, 470000, 800000, 1395000, 135000, 820000, 1200000, 7600000];
  var buGoals3 = [515000, 375000, 540000, 1385000, 475000, 815000, 1405000, 140000, 830000, 1220000, 7700000];
  var buGoals4 = [535000, 390000, 560000, 1440000, 495000, 845000, 1465000, 140000, 860000, 1270000, 8000000];
  var buGoals5 = [545000, 400000, 575000, 1475000, 505000, 865000, 1505000, 145000, 885000, 1300000, 8200000];
  var buGoals6 = [565000, 415000, 595000, 1530000, 525000, 900000, 1550000, 150000, 920000, 1350000, 8500000];
  var buGoals7 = [585000, 430000, 615000, 1585000, 545000, 930000, 1615000, 155000, 950000, 1390000, 8800000];
  var buGoals8 = [595000, 435000, 620000, 1600000, 550000, 940000, 1630000, 160000, 960000, 1410000, 8900000];
  var buGoals9 = [605000, 445000, 635000, 1640000, 565000, 960000, 1665000, 165000, 980000, 1440000, 9100000];
  var buGoals10 = [615000, 450000, 640000, 1655000, 570000, 970000, 1685000, 165000, 990000, 1460000, 9200000];
  var buGoals11 = [630000, 455000, 655000, 1690000, 580000, 990000, 1725000, 170000, 1015000, 1490000, 9400000];
  var allGoals = [buGoals0, buGoals1, buGoals2, buGoals3, buGoals4, buGoals5, buGoals6, buGoals7, buGoals8, buGoals9, buGoals10, buGoals11];

  var today = new Date();
  var currMonth = today.getMonth();
  var currGoals = allGoals[currMonth];
  nlapiLogExecution('debug', 'currGoals', JSON.stringify(currGoals));

  var content = ''
  content += "<table font-family: \"Arial\"; style=\"font-size:16px\" ><tr><td><th align=\"center\" colspan =8  style= \"border-bottom: solid; \">Invoiced Sales Targets</br><font size=\"1\">Current Month</font><th align=\"center\" colspan =1  style= \"border-bottom: solid; border-left: solid;\">Booked Sales</br><font size=\"1\">Current Month</font> </td></tr>"
    + "<tr><td></td><td></td></tr><tr><th valign=\"middle\" bgcolor=\"#dadada\"><b>BU</b></th> <th align=\"center\" valign=\"top\" bgcolor=\"#dadada\"  style= \"border-left: solid; border-color: #000000; \"> Invoiced Sales </TH><th align=\"center\" valign=\"top\" bgcolor=\"#dadada\" > FF Pending Billing </TH><th align=\"center\" valign=\"top\" bgcolor=\"#dadada\" > FF Single Inv </TH><th align=\"center\" valign=\"top\" bgcolor=\"#dadada\" > Journals </TH><th align=\"center\" valign=\"top\" bgcolor=\"#dadada\"  style= \"border-left: solid; border-color: #000000; \"> Total </TH><th align=\"center\" valign=\"top\" bgcolor=\"#dadada\"> Target </Th> <th align=\"center\" bgcolor=\"#dadada\"><b> Remaining </b></th><th valign=\"middle\" bgcolor=\"#dadada\"><b> % Remaining </b></th><th align=\"center\" valign=\"top\" bgcolor=\"#dadada\"  style= \"border-left: solid; border-color: #000000; \"> Booked Sales </TH>";

  var runningSales = 0;
  var runningPending1 = 0;
  var runningPending2 = 0;
  var runningTotal = 0;
  var runningDiff = 0;
  var runningBooked = 0;
  var runningJournals = 0;

  for (var i = 0; i < buLabels.length - 1; i++) {
    if (i % 2 == 0) {
      content += "<tr>";
    }
    else {
      content += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
    }

    var matchingClassIds = classIds[i];
    var sales = 0;
    var pending1 = 0;
    var pending2 = 0;
    var booked = 0;
    var journals = 0;
    
    for (var j = 0; j < matchingClassIds.length; j++) {
      var index = findWithAttrLim(incomeData, 'class', matchingClassIds[j]);
      nlapiLogExecution('debug', 'index', index);
      if (index != -1) {
        sales = parseFloat(sales) + parseFloat(incomeData[index].total);
        runningSales = parseFloat(runningSales) + parseFloat(incomeData[index].total);
      }
      var index2 = findWithAttrLim(pending1Data, 'class', matchingClassIds[j]);
      nlapiLogExecution('debug', 'index', index2);
      if (index2 != -1) {
        pending1 = parseFloat(pending1) + parseFloat(pending1Data[index2].total);
        runningPending1 = parseFloat(runningPending1) + parseFloat(pending1Data[index2].total);
      }
      var index3 = findWithAttrLim(pending2Data, 'class', matchingClassIds[j]);
      nlapiLogExecution('debug', 'index', index3);
      if (index3 != -1) {
        pending2 = parseFloat(pending2) + parseFloat(pending2Data[index3].total);
        runningPending2 = parseFloat(runningPending2) + parseFloat(pending2Data[index3].total);
      }
      var index4 = findWithAttrLim(data, 'class', matchingClassIds[j]);
      nlapiLogExecution('debug', 'index4', index4);
      if (index4 != -1) {
        booked = parseFloat(booked) + parseFloat(data[index4].total);
        runningBooked = parseFloat(runningBooked) + parseFloat(data[index4].total);
      }
      var index5 = findWithAttrLim(incomeJData, 'class', matchingClassIds[j]);
      nlapiLogExecution('debug', 'index5', index5);
      if (index5 != -1) {
        journals = parseFloat(journals) + parseFloat(incomeJData[index5].total);
        runningJournals = parseFloat(runningJournals) + parseFloat(incomeJData[index5].total);
      }
    }
    var total = sales + pending1 + pending2 + journals;
    runningTotal = parseFloat(runningTotal) + total;
    var goal = parseFloat(currGoals[i]);
    var remaining = goal - total;
    runningDiff = parseFloat(runningDiff) + remaining;
    var percRemaining = 100 * (remaining / goal);


    content += "<td  ><b>" + buLabels[i] + "</b></td>" + "<td align= \"center\" style= \"border-left: solid;\">$" + sales.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td align= \"center\" >$" + pending1.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td align= \"center\" >$" + pending2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td align= \"center\">$" + journals.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td align= \"center\" style= \"border-left: solid;\">$" + total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td align= \"center\">$" + goal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    if (remaining > 0) {
      content += "</td>" + "<td align= \"center\" bgcolor=\"#c79999\">$" + remaining.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td align= \"center\" bgcolor=\"#c79999\">" + percRemaining.toFixed(2) + "%</td>"
    } else {
      content += "</td>" + "<td align= \"center\" bgcolor=\"#99c7a4\">$" + remaining.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td align= \"center\" bgcolor=\"#99c7a4\">" + percRemaining.toFixed(2) + "%</td>"
    }
    content += "<td align= \"center\" style= \"border-left: solid;\">$" + booked.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td></tr>";
  }
  var finalGoal = parseFloat(currGoals[buLabels.length - 1]);
  var finalRemaining = finalGoal - runningTotal;
  var finalPerc = 100 * (finalRemaining / finalGoal);
  content += "<tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><b> Automation-X </td>" + "<td style= \"border-top: solid; border-left: solid;  \"  bgcolor=\"#dadada\" align= \"center\" > <b>$" + runningSales.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td style= \"border-top: solid;   \"  bgcolor=\"#dadada\" align= \"center\" > <b>$" + runningPending1.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td style= \"border-top: solid;   \"  bgcolor=\"#dadada\" align= \"center\" > <b>$" + runningPending2.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td style= \"border-top: solid; \"  bgcolor=\"#dadada\" align= \"center\" > <b>$" + runningJournals.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td style= \"border-top: solid; border-left: solid;  \"  bgcolor=\"#dadada\" align= \"center\" > <b>$" + runningTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<td  style= \"border-top: solid; \" bgcolor=\"#dadada\" align= \"center\"> <b>$" + finalGoal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>";
  if (finalRemaining > 0) {
    content += "<td  style= \"border-top: solid; \" bgcolor=\"#c79999\" align= \"center\"> <b>$" + finalRemaining.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<TD  style= \"border-top: solid; \" bgcolor=\"#c79999\" align= \"center\"> <b>" + finalPerc.toFixed(2) + "%</td>";
  } else {
    content += "<td  style= \"border-top: solid; \" bgcolor=\"#99c7a4\" align= \"center\"> <b>$" + finalRemaining.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td>" + "<TD  style= \"border-top: solid; \" bgcolor=\"#99c7a4\" align= \"center\"> <b>" + finalPerc.toFixed(2) + "%</td>";
  }
  content += "<td style= \"border-top: solid; border-left: solid;  \"  bgcolor=\"#dadada\" align= \"center\" > <b>$" + runningBooked.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + "</td></table>";
  response.write(content);
}
function findWithAttrLim(array, attr, value) {
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] == value) {
      return i;
    }
  }
  return -1;z
}