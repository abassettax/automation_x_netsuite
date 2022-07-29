function alignmenthud(request,response)
{
  

  var nameArr = nlapiGetContext().getSetting('SCRIPT', 'custscript8');
    var ClassForDeploy =  nameArr.split(',');
  nlapiLogExecution('debug', 'ClassForDeploy', ClassForDeploy.length);
  
  var content = "";
  content += "<title>BU Alignment Report</title><table style=\"width: 100%;\ border: 1px solid ; \">";  //parent table
  content += " <tr  >";

for ( var b = 0; ClassForDeploy != null && b <  ClassForDeploy.length; b++ ) //
  {
    content += "<td  style=\"width: 25%; border: 2px solid ; vertical-align: top;  \">";
    var ThisLoopClass = ClassForDeploy[b];
  //////////////////////////////////////  rolling  sales
var LRYSalesColumns = new Array();
LRYSalesColumns[0]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("(CASE WHEN TO_CHAR(  {trandate}  ,'YYYYMM')  BETWEEN TO_CHAR(ADD_MONTHS({today} ,-6),'YYYYMM')  AND TO_CHAR(ADD_MONTHS({today} ,-1),'YYYYMM')  THEN (CASE When {type} = 'Invoice' THEN ABS({amount}) ELSE ({amount}) END)  ELSE 0 END)"); //rolling year sales
LRYSalesColumns[1]= new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("(CASE WHEN TO_CHAR(  {trandate}  ,'YYYYMM')  BETWEEN TO_CHAR(ADD_MONTHS({today} ,-12),'YYYYMM')  AND TO_CHAR(ADD_MONTHS({today} ,-7),'YYYYMM')  THEN (CASE When {type} = 'Invoice' THEN ABS({amount}) ELSE ({amount}) END)  ELSE 0 END)");  //prev rolling year sales
  
var RollingSales = nlapiSearchRecord("invoice",null,
[
   ["trandate","onorafter","daysago450"], 
   "AND", 
   ["mainline","is","F"], 
   "AND", 
   ["class","anyof",ThisLoopClass], 
   "AND", 
   ["closed","is","F"], 
   "AND", 
   ["type","anyof","CashSale","CustInvc","CustCred","CashRfnd"], 
   "AND", 
   ["taxline","is","F"], 
   "AND", 
   ["shipping","is","F"], 
   "AND", 
   ["excludecommissions","is","F"], 
   "AND", 
   ["quantity","isnotempty",""]
], 
LRYSalesColumns
);

  //////////////////////////////////////End  rolling  sales

var alignColumns = new Array();
alignColumns[0]=   new nlobjSearchColumn("custentity149");  //Class (Custom)
alignColumns[1]=   new nlobjSearchColumn("salesrep");  //Sales Rep
alignColumns[2]=  new nlobjSearchColumn("formulatext").setFormula("'<strong> <span style=\"font-size: 15px; text-align: left;\">' || REPLACE({entityid} ,{parentcustomer.entityid} ||' : ') || '</span></strong>' || ' <br> <span style=\"font-size: 12px; text-align: left;\">' || CASE WHEN {salesrep} IS NULL THEN 'Unassigned' ELSE {salesrep}  END || '</span>'"); // new nlobjSearchColumn("entityid"); //Name
alignColumns[3]=   new nlobjSearchColumn("custentity2");  //Automated Well Count (Custom)
alignColumns[4]=   new nlobjSearchColumn("custentity256");  //Automation Ranking (Custom)
alignColumns[5]=   new nlobjSearchColumn("custentity253");  //Automation Type (Custom)
alignColumns[6]=   new nlobjSearchColumn("custentity245");  //Regional Parent Well Count (Custom)
alignColumns[7]=   new nlobjSearchColumn("custentity244");  //Regional Parent Customer (Custom)
alignColumns[8]=   new nlobjSearchColumn("formulanumeric").setFormula("CASE WHEN {custentity246} > 0 THEN   {custentity246} ELSE 0 END").setSort(true);  //Field Office Well Count (Custom)
alignColumns[9]=   new nlobjSearchColumn("custentity247");  //Spend Potential (Custom)
alignColumns[10]=   new nlobjSearchColumn("custentity184");  //% of Business (Custom)
alignColumns[11]=   new nlobjSearchColumn("custentity243");  //Market % (Custom)
alignColumns[12]=   new nlobjSearchColumn("custentity255");  //Measurement Only (Custom)
alignColumns[13]=   new nlobjSearchColumn("custentity257");  //QTR over QTR Sales (Custom)
alignColumns[14]=   new nlobjSearchColumn("custentity262");  //Same Rolling Quarter Last Year (Custom)
alignColumns[15]=   new nlobjSearchColumn("custentity263");  //Previous Rolling Quarter Sales (Custom)
alignColumns[16]=   new nlobjSearchColumn("custentity264");  //Rolling Quarter Sales (Custom)
alignColumns[17]=   new nlobjSearchColumn("custentity93");  //Natural Gas Basin (Custom)
alignColumns[18]=   new nlobjSearchColumn("custentity250"); //Priority Rank (Custom)
alignColumns[19]=   new nlobjSearchColumn("namenohierarchy","CUSTENTITY149", null); //class 

var AlignmentSearch = nlapiSearchRecord("customer",null,
[
   ["isinactive","is","F"], 
   "AND", 
   ["custentity149","anyof", ThisLoopClass]
], 
alignColumns
);

  
  /////////////////////////////////////////end alignment info
  //
  
   var ThisClass = AlignmentSearch[0].getValue(alignColumns[19]);
   var PrevYearSales = RollingSales[0].getValue(LRYSalesColumns[1])*1;
   var LastYearSales =  RollingSales[0].getValue(LRYSalesColumns[0])*1;
  var percentChange =   ((  (parseFloat(LastYearSales) - parseFloat(PrevYearSales))   /   parseFloat(PrevYearSales) ) *100);                 //LastRollingYearSales
  var customerName = "";
  var spendPotential=0;
var  LastRQSales = 0;
var SameQLastYear = 0;
var PrevRQ = 0;
var Xcount = 0;
  var percentOfBusiness = 0;
 // nlapiLogExecution('debug', 'LastYearSales', LastYearSales);
//  nlapiLogExecution('debug', 'PrevYearSales', PrevYearSales);
//  nlapiLogExecution('debug', 'percentChange', percentChange);
  


  var buPercentHeaderColor = "<font color=\"#c6f7c1\">"; if(percentChange<0 ){buPercentHeaderColor = "<font color=\"#fadbd9\">";}
  ////start header Class Info
content += "<table style=\"width:100%; vertical-align: top; border-collapse: collapse; \">";
content +=        " <tr style=\"   background-color:#4472c4;\">"  
content +=          "<td  style=\"padding-left: 10px; padding-top: 5px; \"> <span style=\"font-size: 26px; color:white; text-align: right; \" ><strong><i> Business Unit: </i></span> <span style=\"font-size: 28px; color:#f2f55b; text-align: right; \" >"+ ThisClass   +  "</span><span style=\"font-size: 20px; color:white; text-align: right;\"></br><i>BU Sales % Change: </i>"+ buPercentHeaderColor + parseFloat(percentChange).toFixed(2)    +"% </font>  </span> <br><span style=\"font-size: 13px; color:white; text-align: right; \"><i> (Last Rolling Half VS Previous)</i></span></strong></td> ";
//content +=           "<td> <span style=\"font-size: 20px; text-align: right;\"><strong> Rolling 2 Year Sales: "+ parseFloat(percentChange).toFixed(2)    +  "% </strong></span></td> ";
content +=         " </tr>"
content +=  "</table> "

/////////////////end header class info 

  
   

 content += "<table style=\"width:100%; vertical-align: top; border-collapse: collapse; \">"; 

 content += " <tr >";
    content += " <td style=\"  background-color: #4472c4; width:17%; vertical-align: bottom;  padding-left:6px;\"><strong><span style=\"font-size: 22px; color:white; \">Customer</span></strong></td> ";
  content += " <th style=\"  background-color: #4472c4; width:2%;\"><span style=\"font-size: 13px; color:white; \">% of Potential Spend</span></th> ";
 content += " <th style=\"  background-color: #4472c4; width:3%;\"><span style=\"font-size: 13px; color:white; \">LRQ Sales VS Same QTR Last Year</span></th> ";  //Last Rolling Qtr. Sales VS Same Rolling Qtr. Sales Last Year
 content += " <th style=\"  background-color: #4472c4; width:3%;\"><span style=\"font-size: 13px; color:white; \">LRQ VS Previous RQ Sales</span></th> ";  //Last Rolling Qtr. Sales VS Previous Rolling Qtr. Sales
content += " </tr> ";
  
  
  for ( var i = 0; AlignmentSearch != null && i < AlignmentSearch.length; i++)   //AlignmentSearch.length; i++ ) //
  {
    if(i%2 == 0)
      {
       content +=  "<tr style=\" background-color: #f5f8fc;  \">";
      }
    else
    {
      content += "<tr style=\" background-color: #d9e1f2; \">"; //#f2f3f4
    }

customerName = AlignmentSearch[i].getValue(alignColumns[2]);
spendPotential = AlignmentSearch[i].getValue(alignColumns[9]);
LastRQSales = AlignmentSearch[i].getValue(alignColumns[16]);  
Xcount = parseInt(LastRQSales/10000); nlapiLogExecution('debug', 'Xcount', Xcount);
SameQLastYear = AlignmentSearch[i].getValue(alignColumns[14]);
PrevRQ = AlignmentSearch[i].getValue(alignColumns[15]);
percentOfBusiness =  parseFloat( (((LastRQSales/3) / spendPotential )) *100).toFixed(1); if(!percentOfBusiness || percentOfBusiness=='Infinity'      || percentOfBusiness== 'NaN' ){percentOfBusiness = 0;}
  
 var RQvsLYpercentChange =     parseFloat(((  (LastRQSales -  SameQLastYear)   /    SameQLastYear ) *100)).toFixed(0)  ;                 
  var RQvsPRQpercentChange =      parseFloat(((  (parseFloat(LastRQSales) - parseFloat(PrevRQ))   /   parseFloat(PrevRQ) ) *100)).toFixed(0)  ;      
if(RQvsLYpercentChange =='NaN' || RQvsLYpercentChange == 'Infinity'){  RQvsLYpercentChange = "";}
if(RQvsPRQpercentChange =='NaN' || RQvsPRQpercentChange == 'Infinity'){  RQvsPRQpercentChange = "";}

var cellformatRQvsLYpercentChange = "<td style=\"text-align: center; border-bottom:1pt solid black;\">";
  if(RQvsLYpercentChange >= 1  ) {  cellformatRQvsLYpercentChange =  "<td style=\"text-align: center; color:green;   border-bottom:1pt solid black;\"><strong>" ;  }if(RQvsLYpercentChange  <= -1) {  cellformatRQvsLYpercentChange =  "<td style=\"text-align: center; color:red;  border-bottom:1pt solid black; \"><strong>" ;  }
    
var cellformatRQvsPRQpercentChange = "<td style=\"text-align: center; border-bottom:1pt solid black;\">";
  if(RQvsPRQpercentChange >= 1 ) {  cellformatRQvsPRQpercentChange =  "<td style=\"text-align: center; color:green;  border-bottom:1pt solid black; \"><strong>" ;  }if(RQvsPRQpercentChange <= -1) {  cellformatRQvsPRQpercentChange =  "<td style=\"text-align: center; color:red; border-bottom:1pt solid black; \"><strong>" ;  }  //background-color:#f3fcf2;  background-color:#fff5f5;
    
content += "<td style=\"text-align: left; border-bottom:1pt solid black; padding-top: 5px; padding-left: 5px; padding-bottom: 5px;  \">" + customerName  +' <span style=\"font-size: 12px; text-align: left;\"><i>  ('+ Xcount + ')' + " </i></span></td>";
content += "<td style=\"text-align: center; border-bottom:1pt solid black;\"><strong>" + percentOfBusiness  + "%</strong></td>";
    
 var RQvsLYClose = "<strong></td>";   if(RQvsLYpercentChange  > .99 || RQvsLYpercentChange < -.99){ RQvsLYClose = "%<strong></td>";} 
content += cellformatRQvsLYpercentChange + RQvsLYpercentChange  + RQvsLYClose;
    var RQvsPRQClose = "<strong></td>";   if(RQvsPRQpercentChange > .99 || RQvsPRQpercentChange < -.99){ RQvsPRQClose = "%<strong></td>";} 
content += cellformatRQvsPRQpercentChange + RQvsPRQpercentChange  + RQvsPRQClose;
content += "</tr>";
  }//////////////////////////////////////// end row loop
  

content += "</table>";


content += "</td>";
  
}
  content += " </tr></table>";
  response.write(content);
}