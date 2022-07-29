function factorsofcashflow ()
{
  
  
    ////total ap 
var totalAPColumns = new Array();
totalAPColumns[0] = new nlobjSearchColumn("balance",null, null).setSort(false); 
var totalAPSearch = nlapiSearchRecord("account",null,
[
   ["internalidnumber","equalto","117"]
], 
totalAPColumns
);
///////////////////////

////rec not billed
var recNotbilledColumns = new Array();
recNotbilledColumns[0] =     new nlobjSearchColumn("balance",null, null).setSort(false); 
var recNotbilledSearch = nlapiSearchRecord("account",null,
[
   ["internalidnumber","equalto","109"]
], 
recNotbilledColumns
);
///////////////////////


//////////////inventory Levels
var invColumns = new Array();
 invColumns[0] = new nlobjSearchColumn("balance",null,"SUM");

var InvSearch = nlapiSearchRecord("account",null,
[
   ["parent","anyof","840"]
], 
invColumns
);
///////////////////end inventory
var ISColumns = new Array();
ISColumns[0]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN( {accountingperiod.startdate} >= (add_months(trunc(sysdate,'mm'),-1))) AND ( {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-1)) ) AND ( {accounttype} = 'Income' OR {accounttype}= 'Other Income' ) THEN {grossamount}  ELSE 0 END"); //lm I
ISColumns[1]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  ( {accountingperiod.startdate} >=  (add_months(trunc(sysdate,'mm'),-1)) ) AND ( {accountingperiod.enddate} <=  last_day(add_months(trunc(sysdate,'mm'),-1)) ) AND ( {accounttype} = 'Cost of Goods Sold' ) THEN   {grossamount}  ELSE 0 END"); //LM Cogs
ISColumns[2]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  ( {accountingperiod.startdate} >=  (add_months(trunc(sysdate,'mm'),-1)) ) AND        ( {accountingperiod.enddate} <=  last_day(add_months(trunc(sysdate,'mm'),-1)) ) AND ( {accounttype} = 'Expense' ) THEN   {grossamount}  ELSE 0 END"); //LM E
ISColumns[3]= new nlobjSearchColumn("formulatext",null,"GROUP"), 
ISColumns[4]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN ( {accountingperiod.startdate} >=(add_months(trunc(sysdate,'mm'),-3)) ) AND ( {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-1)) ) AND ( {accounttype} = 'Income'  ) THEN {grossamount}  ELSE 0 END");//LQ I
ISColumns[5]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  ( {accountingperiod.startdate} >=  (add_months(trunc(sysdate,'mm'),-3)) ) AND ( {accountingperiod.enddate} <=  last_day(add_months(trunc(sysdate,'mm'),-1)) ) AND ( {accounttype} = 'Cost of Goods Sold' ) THEN   {grossamount}  ELSE 0 END");//LQ cogs
ISColumns[6]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  ( {accountingperiod.startdate} >=  (add_months(trunc(sysdate,'mm'),-3)) ) AND ( {accountingperiod.enddate} <=  last_day(add_months(trunc(sysdate,'mm'),-1)) ) AND ( {accounttype} = 'Expense' ) THEN   {grossamount}  ELSE 0 END"); //LQ E
ISColumns[7]= new nlobjSearchColumn("formulatext",null,"GROUP"), 
ISColumns[8]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN ( {accountingperiod.startdate} >= (add_months(trunc(sysdate,'mm'),-12)) ) AND ( {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-1)) ) AND ( {accounttype} = 'Income' ) THEN {grossamount} ELSE 0 END");//LY I
ISColumns[9]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  ( {accountingperiod.startdate} >=  (add_months(trunc(sysdate,'mm'),-12)) ) AND ( {accountingperiod.enddate} <=  last_day(add_months(trunc(sysdate,'mm'),-1)) ) AND ( {accounttype} = 'Cost of Goods Sold' ) THEN   {grossamount}  ELSE 0 END"); //LY
ISColumns[10]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  ( {accountingperiod.startdate} >=  (add_months(trunc(sysdate,'mm'),-12)) ) AND ( {accountingperiod.enddate} <=  last_day(add_months(trunc(sysdate,'mm'),-1)) ) AND ( {accounttype} = 'Expense' ) THEN   {grossamount}  ELSE 0 END");//LY
////////////end current year

////// start compare income 
ISColumns[11]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN ({accountingperiod.startdate} >= (add_months(trunc(sysdate,'mm'),-13)) ) AND ({accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-13)) ) AND ( {accounttype} = 'Income' OR {accounttype}= 'Other Income' ) THEN {grossamount} ELSE 0 END");//C LM
ISColumns[12]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN ({accountingperiod.startdate} >= (add_months(trunc(sysdate,'mm'),-15))) AND ({accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-13))) AND ( {accounttype} = 'Income' OR {accounttype}= 'Other Income' ) THEN {grossamount}  ELSE 0 END");//C LQ
ISColumns[13]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN ( {accountingperiod.startdate} >= (add_months(trunc(sysdate,'mm'),-24)) ) AND ({accountingperiod.enddate} <=  last_day(add_months(trunc(sysdate,'mm'),-13))) AND ({accounttype} = 'Income' OR {accounttype}= 'Other Income') THEN {grossamount} ELSE 0 END");//C LY
////// end compare income

  var ISSearch = nlapiSearchRecord("transaction",null,
[
   ["trandate","onorafter","threefiscalyearsago"], 
   "AND", 
   ["posting","is","T"], 
   "AND", 
   ["accounttype","anyof","Income","COGS","Expense"], 
   "AND", 
   ["class","anyof","@ALL@"], 
   "AND", 
   ["account.parent","noneof","983"]
], 
ISColumns
);
  //////////////////////////////end income statement search 

var arcolumns = new Array();
 
arcolumns[0] =  new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("NVL({debitamount},0)-NVL({creditamount},0)"); 
arcolumns[1] =    new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-1)) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END"); 
arcolumns[2] =    new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  2  )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END"); 
arcolumns[3] =    new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  3  )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END");
arcolumns[4] =    new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  4 )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END"); 
arcolumns[5] =   new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  5  )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END"); 
arcolumns[6] =   new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  6 )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END");
arcolumns[7] =   new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  7 )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END"); 
arcolumns[8] =   new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  8  )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END"); 
arcolumns[9] =   new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  9  )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END"); 
arcolumns[10] =    new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  10  )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END");
arcolumns[11] =    new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  11  )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END");
arcolumns[12] =   new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  12  )) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END");
arcolumns[13] =   new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN  {accountingperiod.enddate} <= last_day(add_months(trunc(sysdate,'mm'),-  13)) THEN NVL({debitamount},0)-NVL({creditamount},0) ELSE 0 END");

  
////////////////////////end ar columns
//
//
var arSearch = nlapiSearchRecord("transaction",null,
[
   ["posting","is","T"], 
   "AND", 
   ["accounttype","anyof","AcctRec"], 
   "AND", 
   ["trandate","onorbefore","today"]
], 
arcolumns
);
  /////////////////////////////end ar search

var salesLM = ISSearch[0].getValue(ISColumns[0]);
var salesRQ = ISSearch[0].getValue(ISColumns[4]);
var salesRY = ISSearch[0].getValue(ISColumns[8]);
  
var COGSLM = ISSearch[0].getValue(ISColumns[1]);
var COGSRQ = ISSearch[0].getValue(ISColumns[5]);
var COGSRY = ISSearch[0].getValue(ISColumns[9]);
  
var ExpenseLM = ISSearch[0].getValue(ISColumns[2]);  
var ExpenseRQ = ISSearch[0].getValue(ISColumns[6]);
var ExpenseRY = ISSearch[0].getValue(ISColumns[10]);

var salesCompareLM = ISSearch[0].getValue(ISColumns[11]); 
var salesCompareRQ = ISSearch[0].getValue(ISColumns[12]);
var salesCompareRY = ISSearch[0].getValue(ISColumns[13]);

var ar = arSearch[0].getValue(arcolumns[0]);
var invAmount =   InvSearch[0].getValue(invColumns[0]);

  var totalap = totalAPSearch[0].getValue(totalAPColumns[0]);
  var AmountRecNotBilled =  recNotbilledSearch[0].getValue(nlobjSearchColumn("balance",null, null));
  var totalapPlusRecNotBilled  = Math.abs(parseInt(totalap)) + Math.abs(parseInt(AmountRecNotBilled)) ;
  var totalTrappedAR =  ar-((salesRY/365)*50) ;
 var content ="<table width=90% align=center><tr>  <td width=100% valign=\"middle\" align=center bgcolor=\"#dadada\" colspan= 4 ><b> Cash Generation </b></td>  </tr>";
  
content += "<tr>";
content += "<td align=center > </td>";
content += "<td align=center><b>&nbsp &nbsp &nbsp &nbsp  Last Month &nbsp &nbsp &nbsp &nbsp</b></td>";
content += "<td align=center ><b>&nbsp &nbsp &nbsp &nbsp Last 3 Months  &nbsp &nbsp &nbsp &nbsp</b></td>";
content += "<td align=center ><b>&nbsp &nbsp &nbsp &nbsp Trailing 12 Months &nbsp &nbsp &nbsp &nbsp</b> </td>";
content += "</tr>"; 
  
content += "<tr style=\" background-color: #f2f4f7 \">";
content += "<td align=left> <b> Sales </b></td>";
content += "<td align=center> <font color=blue> "+ '$' + parseFloat(salesLM).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");        + "</font></td>";
content += "<td align=center> <font color=blue>"+ '$' + parseFloat(salesRQ).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");         + "</font></td>";
content += "<td align=center> <font color=blue>"+  '$' + parseFloat(salesRY).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");        +"</font></td>";
content += "</tr>";
  
content += "<tr style=\"border-bottom:1pt solid black;\">";
content += "<td align=left> <b><i> &nbsp&nbsp &nbsp&nbsp  vs Prior Year % </i></b></td>";
content += "<td align=center>   "+  parseFloat(   ((salesLM - salesCompareLM) /   salesCompareLM ) *100    ).toFixed(2)      + "% </td>";
content += "<td align=center>   "+  parseFloat(((salesRQ - salesCompareRQ) /   salesCompareRQ) *100 ).toFixed(2)      + "% </td>";
content += "<td align=center>   "+  parseFloat(((salesRY - salesCompareRY) /   salesCompareRY) *100 ).toFixed(2)      + "% </td>";
content += "</tr>";
  

  
content += "<tr style=\" background-color: #f2f4f7 \">";
content += "<td align=left> <b> Gross Margin %</b></td>";
content += "<td align=center>   "+  parseFloat(   (1-(Math.abs(parseFloat(COGSLM))/Math.abs(parseFloat(salesLM))))*100   ).toFixed(2)      + "% </td>";
content += "<td align=center>   "+  parseFloat(  (1-(Math.abs(parseFloat(COGSRQ))/Math.abs(parseFloat(salesRQ))))*100     ).toFixed(2)      + "% </td>";   
content += "<td align=center>   "+  parseFloat(   (1-(Math.abs(parseFloat(COGSRY))/Math.abs(parseFloat(salesRY))))*100     ).toFixed(2)      + "% </td>";   
content += "</tr>";
  

  
content += "<tr>";
content += "<td align=left> <b> Operating Expenses </b></td>";
content += "<td align=center> <font color=blue> "+ '$' + parseFloat(ExpenseLM).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");        + "</font></td>";
content += "<td align=center> <font color=blue>"+  '$' + parseFloat(ExpenseRQ).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");        + "</font></td>";
content += "<td align=center> <font color=blue>"+  '$' + parseFloat(ExpenseRY).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");        +"</font></td>";
content += "</tr>";
  
content += "<tr style=\" background-color: #f2f4f7 \">";
content += "<td align=left> <b><i> &nbsp &nbsp &nbsp &nbsp  % Of Sales</i></b></td>";
content += "<td align=center>   "+  parseFloat( (ExpenseLM /   salesLM)  *100).toFixed(2)      + "% </td>";   
content += "<td align=center>   "+  parseFloat( (ExpenseRQ /   salesRQ)  *100).toFixed(2)      + "% </td>";
content += "<td align=center>   "+  parseFloat( ( ExpenseRY /   salesRY) *100).toFixed(2)      + "% </td>";
content += "</tr>";
  
  content +=   "<tr>  <td width=100% valign=\"middle\" align=center   colspan= 4 ><b> &nbsp&nbsp  </b></td>  </tr>";
  
  content +=   "<tr>  <td width=100% valign=\"middle\" align=center bgcolor=\"#dadada\" colspan= 4 ><b>  Cash Management  </b></td>  </tr>";
  
content += "<tr>";
content += "<td align=center > </td>";
content += "<td align=center><b>Current Amount </b></td>";
content += "<td align=center ><b>Goal</b></td>";
content += "<td align=center ><b>Difference</b> </td>";
content += "</tr>"; 
  
 content += "<tr style=\" background-color: #f2f4f7 \">";
content += "<td align=left> <b> Accounts Receivable </b></td>";
content += "<td align=center> <font color=blue> "+ '$' + parseFloat(ar).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");        + "</font></td>";
content += "<td align=center>  "+  '$' + parseFloat((salesRY/365)*50).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");                 + "</td>";
   if(totalTrappedAR<0) { totalTrappedAR=0; }  
content += "<td align=center> "+  '$' +     parseFloat(    totalTrappedAR      ).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");                 +" </td>";
content += "</tr>";
  
 
  
 content += "<tr>";
content += "<td align=left> <b> Inventory </b></td>";
content += "<td align=center> <font color=blue> "+ '$' + parseFloat(invAmount).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");        + "</font></td>";
content += "<td align=center>  "+  '$' + parseFloat( (COGSRQ * 1.5)/3   ).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");                 + "</td>";
content += "<td align=center> "+  '$' +  parseFloat( invAmount- ((COGSRQ * 1.5)/3)  ).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");  +" </td>";
content += "</tr>";



   content += "<tr style=\" background-color: #f2f4f7 \">";
content += "<td align=left> <b> \"Trapped\" Cash </b></td>";
content += "<td align=center>  </td>";
content += "<td align=center>  </td>";
content += "<td align=center style=\"border-top: 2px solid ; \"> <b>"+  '$' +     parseFloat(  totalTrappedAR + (   invAmount- ((COGSRQ * 1.5)/3)       )       ).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");  +"</b> </td>";
content += "</tr>";
  
  
    content +=   "<tr>  <td width=100% valign=\"middle\" align=center   colspan= 4 ><b> &nbsp&nbsp  </b></td>  </tr>";
  
  content +=   "<tr>  <td width=100% valign=\"middle\" align=center bgcolor=\"#dadada\" colspan= 4 ><b>  Accounts Receivable  </b></td>  </tr>";
  
content += "<tr>";
content += "<td align=center > </td>";
content += "<td align=center><b>Current AP </b></td>";
content += "<td align=center ><b>Inventory Received Not Billed</b></td>";
content += "<td align=center ><b>Total AP </b> </td>";
content += "</tr>"; 
  
 content += "<tr style=\" background-color: #f2f4f7 \">";
content += "<td align=left> <b> Accounts Receivable </b></td>";
content += "<td align=center> " + '$' + parseFloat( totalap ).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");        + "</td>";
content += "<td align=center>  "+  '$' + parseFloat( AmountRecNotBilled ).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");                 + "</td>";
content += "<td align=center> "+  '$' +     parseFloat(  totalapPlusRecNotBilled       ).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");                 +" </td>";
content += "</tr>";
  
    response.write(content);
}