function WHReportCard(request,response) //(portlet, column)
{
var d = new Date();
var n = parseInt(d.getDay());
var z = parseInt(d.getDate());  
var defaultinvadjmentlabel = "Defaults to This Month";
var defaultcyclecountlabel = "Defaults to This Month";
var defaultmisslabel = "Defaults to This Week";
  
 var cyclecountdaterange = request.getParameter('custpage_periodselect');
 if(!cyclecountdaterange && z <= 11)
   {cyclecountdaterange = "lastmonth"; defaultcyclecountlabel = "Defaults to Last Month";}else if(!cyclecountdaterange){cyclecountdaterange = "thismonth";}
  
   var invadjustmentrange = request.getParameter('custpage_invadj');
 if(!invadjustmentrange && z <= 11)
   {invadjustmentrange = "lastmonth";  defaultinvadjmentlabel = "Defaults to Last Month";}else if(!invadjustmentrange){invadjustmentrange = "thismonth";}
  
var defaultmisslabel = "Defaults to This Week";


   var missreportdaterange = request.getParameter('custpage_cyclecount');
 if(!missreportdaterange && (n<= 1))
   {missreportdaterange = "lastweek"; defaultmisslabel = "Defaults to Last Week";}else if (!missreportdaterange ){missreportdaterange = "thisweek";}
  
 //var cyclecountdaterange = request.getParameter('custpage_periodselect');
 // var invadjustmentrange = request.getParameter('custpage_invadj'); 
 //  var missreportdaterange = request.getParameter('custpage_cyclecount');
  
  ////////////////////////list of locations search
  	var columnsA = new Array();
     columnsA[0] =    new nlobjSearchColumn("internalid",null,null).setSort(false);
     columnsA[1] =    new nlobjSearchColumn("name",null,null).setSort(false);
  
  var locationSearch = nlapiSearchRecord("location",null,
[
   ["custrecord17","is","T"], 
   "AND", 
   ["isinactive","is","F"],
     "AND", 
   ["internalid","noneof","16"]
], 
columnsA
);
  ////////////////////////end locations
  
  //////////////////////// Cycle count info
	var columnsB = new Array();
     columnsB[0] =    new nlobjSearchColumn("location",null,"GROUP");
     columnsB[1] =    new nlobjSearchColumn("formulanumeric",null,"COUNT").setFormula("{internalid} || {item.internalid}"); // new nlobjSearchColumn("item",null,"COUNT");
     columnsB[2] =    new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula(" case when {transactionlinetype} = 'Adjusted Quantity' AND    ABS({quantity}) > 0   then   1  else    NULL end");
      columnsB[3] =    new nlobjSearchColumn("internalid","location","GROUP").setSort(false); 
       columnsB[4] =   new nlobjSearchColumn("formulanumeric",null,"COUNT").setFormula("{internalid} || {item.internalid}");   //replace columnsB[1] with this to show items that were counted more than once
var inventorycountSearch = nlapiSearchRecord("inventorycount",null,
[
   ["type","anyof","InvCount"], 
   "AND", 
  ["trandate","within",cyclecountdaterange], 
   "AND", 
   ["location.custrecord17","is","T"], 
   "AND", 
   ["mainline","is","F"], 
   "AND", 
   ["type","anyof","InvCount"]
], 
columnsB
);
  ////////////////////////end cycle count info
  

  ////////////////////////WH adjustment Detail
  	var columnsC = new Array();
       columnsC[0] =  new nlobjSearchColumn("location",null,"GROUP");
       columnsC[1] =  new nlobjSearchColumn("amount",null,"SUM");
        columnsC[2] =    new nlobjSearchColumn("internalid","location","GROUP").setSort(false);
  
var inventoryadjustmentSearch = nlapiSearchRecord("inventoryadjustment",null,
[
   ["type","anyof","InvAdjst"], 
   "AND", 
   ["location","anyof","@ALL@"], 
   "AND", 
   ["trandate","within", invadjustmentrange], 
   "AND", 
   ["mainline","is","T"], 
   "AND", 
   ["type","anyof","InvAdjst"]
], 
columnsC
);
  //////////////////////// end WH adjustment detail
  
  ////////////////////////INV value 
    	var columnsD = new Array();
       columnsD[0] =  new nlobjSearchColumn("inventorylocation",null,"GROUP");
       columnsD[1] =  new nlobjSearchColumn("locationtotalvalue",null,"SUM");
       columnsD[2] =  new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("CASE WHEN {locationtotalvalue} > 0 THEN 1 ELSE 0 END");
       columnsD[3] =    new nlobjSearchColumn("internalid","inventoryLocation","GROUP").setSort(false);
var itemSearch = nlapiSearchRecord("item",null,
[
   ["inventorylocation.custrecord17","is","T"], 
   "AND", 
   ["inventorylocation.name","startswith","A:"]
], 
columnsD
);
  ////////////////////////end inv value

  ///////////////////////////////////////////miss report
var columnsE = new Array();
      
  columnsE[0] =  new nlobjSearchColumn("internalid","location","GROUP").setSort(false);
  columnsE[1] =   new nlobjSearchColumn("tranid",null,"COUNT").setSort(false); 
  columnsE[2] =  new nlobjSearchColumn("formulapercent",null,"AVG").setFormula("case when   (case when (to_number(to_char({datecreated},'D')) =6) AND (to_number(to_char({systemnotes.date},'D')) =2) then   (ROUND(       ({systemnotes.date} - {datecreated} ) , 2 )-2) else    ROUND(       ({systemnotes.date} - {datecreated} ) , 2 )end) > 1 then 1 else 0 END");
  columnsE[3] =  new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula(" CASE WHEN  {custbody100} IS NULL  Then (case when   (case when (to_number(to_char({datecreated},'D')) =6) AND (to_number(to_char({systemnotes.date},'D')) =2) then   (ROUND(       ({systemnotes.date} - {datecreated} ) , 2 )-2) else    ROUND(       ({systemnotes.date} - {datecreated} ) , 2 )end) > 1 then 1 else 0 END)    Else  (case when   (case when (to_number(to_char({datecreated},'D')) =6) AND (to_number(to_char({systemnotes.date},'D')) =2) then   (ROUND(       ({systemnotes.date} - {datecreated} ) , 2 )-2) else    ROUND(       ({systemnotes.date} - {datecreated} ) , 2 )end) > .5 then 1 else 0 END) END");
  columnsE[4] =  new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("   CASE WHEN  {custbody100} IS NULL  Then (case when   (case when (to_number(to_char({datecreated},'D')) =6) AND (to_number(to_char({systemnotes.date},'D')) =2) then   (ROUND(       ({systemnotes.date} - {datecreated} ) , 2 )-2) else    ROUND(       ({systemnotes.date} - {datecreated} ) , 2 )end) > .5 then 1 else 0 END)    Else   (case when   ((case when (to_number(to_char({datecreated},'D')) =6) AND (to_number(to_char({systemnotes.date},'D')) =2) then   (ROUND(({systemnotes.date} - {datecreated} ) , 2 )-2) else    ROUND( ({systemnotes.date} - {datecreated} ) , 2 )end) - {custbody100} )> .5 then 1 else 0 END) END"); 
  columnsE[5] = new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("   CASE WHEN  {custbody100} IS NULL  Then (case when   (case when (to_number(to_char({datecreated},'D')) =6) AND (to_number(to_char({systemnotes.date},'D')) =2) then   (ROUND(       ({systemnotes.date} - {datecreated} ) , 2 )-2) else    ROUND(       ({systemnotes.date} - {datecreated} ) , 2 )end) > 2 then 1 else 0 END)    Else   (case when   ((case when (to_number(to_char({datecreated},'D')) =6) AND (to_number(to_char({systemnotes.date},'D')) =2) then   (ROUND(({systemnotes.date} - {datecreated} ) , 2 )-2) else    ROUND( ({systemnotes.date} - {datecreated} ) , 2 )end) - {custbody100} )> 2 then 1 else 0 END) END");


  
 var itemfulfillmentSearch = nlapiSearchRecord("itemfulfillment",null,
[
   ["type","anyof","ItemShip"], 
   "AND", 
   ["mainline","is","T"], 
   "AND", 
   ["systemnotes.field","anyof","TRANDOC.KSTATUS"], 
   "AND", 
   ["systemnotes.newvalue","startswith","Order Shipped"], 
   "AND", 
   ["createdfrom.custbody65","is","F"], 
   "AND", 
   ["shipmethod","noneof","2229","4605"], 
   "AND", 
   ["trandate","within", missreportdaterange], //
   "AND", 
   ["name","noneof","4413","2225","8029","2224","3298","2203","7659"], 
   "AND", 
   ["custbody65","is","F"], 
   "AND", 
  // ["location.custrecord17","is","T"], 
  // "AND", 
   ["createdfrom.customform","noneof","237"], 
   "AND", 
   ["formulanumeric: CASE WHEN {location} = {customermain.custentity180} THEN 1 ELSE 0 END","equalto","0"], 
   "AND", 
   ["type","anyof","ItemShip"]
], 
columnsE
); 
  
  
  ///////////////////////////end miss report
  
  
  
  
  
  
  ////////////////////////////////////////////////////////////////////////////////////////start content 
  
var content = "<table    font-family: \"Arial\"; style=\"font-size:14px\" >  <TR><td></TD> <th align=\"center\" colspan =5  style= \"border-bottom: solid; border-color: #ff0000; \">Cycle Count </br><font size=\"1\">" + defaultcyclecountlabel+"</font> </td><th align=\"center\" colspan =3 style= \"border-bottom: solid; border-color:  #0000ff; \">  Inventory Accuracy </BR> <font size=\"1\">" + defaultinvadjmentlabel + " </font></td>           <th align=\"center\" colspan =14 style= \"border-bottom: solid; border-color:  #589E41; \">  Miss Report </BR> <font size=\"1\">" + defaultmisslabel + "</font> </td>    </tr><tr><td>"+ "</td><td></td><td></td><td></td><td></TD></tr>  <th valign=\"middle\" bgcolor=\"#dadada\"><b>Warehouse  </b></th> <th align=\"center\" valign=\"top\" bgcolor=\"#dadada\"  style= \"border-left: solid; border-color: #000000; \">Items Counted  </TH><th align=\"center\" valign=\"top\" bgcolor=\"#dadada\">  Items Off</Th> <th align=\"center\" bgcolor=\"#dadada\"><b> % Of Items Off <font size=\"1\">(< 5%)</font> </b></th><th valign=\"middle\" bgcolor=\"#dadada\"><b> Target Item Count </b></th> <th valign=\"middle\" bgcolor=\"#dadada\"><b> % of Target </b></th><th bgcolor=\"#dadada\"  align=\"center\" valign=\"top\" style= \"border-left: solid; border-color: #000000; \" >Total Inventory Value </th>  <th valign=\"middle\"  bgcolor=\"#dadada\"><b>  Inventory Adjustment Total</b> </th>  <th valign=\"middle\" bgcolor=\"#dadada\"><b> % Value Adjusted <font size=\"1\"> \(\<1%\)</font> &nbsp&nbsp </b></th> <th colspan=\"6\" valign=\"middle\" bgcolor=\"#dadada\" style= \"border-left: solid; border-color: #000000; \"><b> 1 Day Miss </br><font size=\"2\">(Total/miss/%miss)</font> <font size=\"1\"><br>(Target < 2%)</font>  </b></th>  <th colspan=\"6\"  valign=\"middle\" bgcolor=\"#dadada\" style= \"border-right: solid; border-color: #000000; \"><b> 2 Day Miss</br>  <font size=\"2\">(Total/miss/%miss)</font> <font size=\"1\">(Goal 0%)</font> </b></th> ";
 
var itemscounted = 0;
var percentottargetcount =0;
var itemsoff = 0;
var percentofitemsoff = 0;
var totalINVvalue = 0;
var amountofadjustment = 0;
var percentofvalueoff = 0;
var amountofadjustmentformated =0;
var totalINVvalueformated =0;
var totalitemsOnhand =0; 
var targetcount = 0;
var percentoftarget=0;
 var nonlocalshipments=0;
 var nonlocalmissoneday=0;
 var nonlocalmisstwoday=0;
  var percentnonlocalmissoneday=0;
  var percentnonlocalmisstwoday=0;
  
var itemscountedtotal=0;
var itemsofftotal=0;
var percentofitemsofftotal=0;
var targetcounttotal=0;
var percentoftargettotal =0;
var totalINVvaluetotal=0;
var amountofadjustmenttotal=0;
var percentofvalueofftotal=0;
var nonlocalshipmentstotal=0;
var nonlocalmissonedaytotal=0;
var percentnonlocalmissonedaytotal=0;
var nonlocalmisstwodaytotal=0;
var percentnonlocalmisstwodaytotal=0;
var totalINVvalueformatedtotal =0;
var amountofadjustmentformatedtotal=0;
var failitempercentoff ="";
var failpercentoftarget = "";
var failpercentofvalueoff = "";
var failpercentnonlocalmissoneday = "";
var failpercentnonlocalmisstwoday = "";
  
for ( var i = 0; locationSearch != null && i < locationSearch.length; i++ )
  {
    
 if(locationSearch[i].getValue(columnsA[0]) != 16  )
 {
    if(i%2 == 0)
      {
       content += "<tr>";   
      }
    else
    {
      content += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
    }
//// add and format cell content
var locationname = locationSearch[i].getValue(columnsA[1]);
var locationID = locationSearch[i].getValue(columnsA[0]);
///items counted
    for ( var b = 0; inventorycountSearch != null && b < inventorycountSearch.length; b++ )
  {
var countlocation = inventorycountSearch[b].getValue(columnsB[3]);
   if(countlocation == locationID)
     {
itemscounted = inventorycountSearch[b].getValue(columnsB[1]);
itemsoff = inventorycountSearch[b].getValue(columnsB[2]);
percentofitemsoff = (((Math.abs(parseFloat(itemsoff))/Math.abs(parseFloat(itemscounted))))*100).toFixed(0);
if(percentofitemsoff >= 5){failitempercentoff="#cc3300";}else{failitempercentoff="";}

     }
  }
//// end item counted
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// adjustment detail
    for ( var b = 0; inventoryadjustmentSearch != null && b < inventoryadjustmentSearch.length; b++ )
  {
var adjlocation = inventoryadjustmentSearch[b].getValue(columnsC[2]);
   if(adjlocation == locationID)
     {
amountofadjustment = (inventoryadjustmentSearch[b].getValue(columnsC[1]))*-1;
amountofadjustmentformated ='$' + parseFloat(amountofadjustment).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 

     }   
    
  }
//////end adjustment detail
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
///// inventory detail
    for ( var b = 0; itemSearch != null && b < itemSearch.length; b++ )
  {
var Vallocation = itemSearch[b].getValue(columnsD[3]);
   if(Vallocation == locationID)
     {
totalINVvalue = itemSearch[b].getValue(columnsD[1]);
totalitemsOnhand = itemSearch[b].getValue(columnsD[2]);      
totalINVvalueformated = '$' + parseFloat(totalINVvalue).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

     }   
  }
///// end inventory detail
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    ///// miss detail
    for ( var b = 0; itemfulfillmentSearch != null && b < itemfulfillmentSearch.length; b++ )
  {
var misslocation = itemfulfillmentSearch[b].getValue(columnsE[0]);
   if(misslocation == locationID)
     {
nonlocalshipments = Math.round(itemfulfillmentSearch[b].getValue(columnsE[1]));
nonlocalmissoneday =Math.round(itemfulfillmentSearch[b].getValue(columnsE[4]));
nonlocalmisstwoday = Math.round(itemfulfillmentSearch[b].getValue(columnsE[5]));
percentnonlocalmissoneday= (((Math.abs(parseFloat(nonlocalmissoneday))/Math.abs(parseFloat(nonlocalshipments))))*100).toFixed(0);
percentnonlocalmisstwoday= (((Math.abs(parseFloat(nonlocalmisstwoday))/Math.abs(parseFloat(nonlocalshipments))))*100).toFixed(0);
  if(percentnonlocalmisstwoday >= .1){failpercentnonlocalmisstwoday="background-color:#cc3300";}else{failpercentnonlocalmisstwoday="";}
  if(percentnonlocalmissoneday >= 2){failpercentnonlocalmissoneday="background-color:#cc3300";}else{failpercentnonlocalmissoneday="";}
     }   
  }
///// end miss detail
    
percentofvalueoff = ((((((parseFloat(amountofadjustment)))/Math.abs(parseFloat(totalINVvalue)))))*100).toFixed(2);
targetcount = Math.round(parseFloat(totalitemsOnhand) * .20);
 if(targetcount < 100){targetcount = 100;}
percentoftarget =  (((Math.abs(parseFloat(itemscounted))/Math.abs(parseFloat(targetcount))))*100).toFixed(0);
if(percentoftarget < 100 ){failpercentoftarget="#cc3300";}else{failpercentoftarget="";}
 if(percentofvalueoff >= 1 || percentofvalueoff <= -1){failpercentofvalueoff="#cc3300";}else{failpercentofvalueoff="";}   
//////////totals
 amountofadjustmenttotal += parseFloat( amountofadjustment);
itemscountedtotal  += parseFloat(itemscounted);
itemsofftotal  += parseFloat(itemsoff);
totalINVvaluetotal += parseFloat(totalINVvalue);
percentofitemsofftotal = (((Math.abs(parseFloat(itemsofftotal))/Math.abs(parseFloat(itemscountedtotal))))*100).toFixed(0);
targetcounttotal += parseFloat(targetcount);
percentoftargettotal  = (((Math.abs(parseFloat(itemscountedtotal))/Math.abs(parseFloat(targetcounttotal))))*100).toFixed(0);
nonlocalshipmentstotal += parseFloat(nonlocalshipments);
nonlocalmissonedaytotal+= parseFloat(nonlocalmissoneday);
nonlocalmisstwodaytotal += parseFloat(nonlocalmisstwoday);

percentofvalueofftotal = (((((parseFloat(amountofadjustmenttotal))/Math.abs(parseFloat(totalINVvaluetotal))))*100)).toFixed(2);

percentnonlocalmissonedaytotal = (((Math.abs(parseFloat(nonlocalmissonedaytotal))/Math.abs(parseFloat(nonlocalshipmentstotal))))*100).toFixed(0);
percentnonlocalmisstwodaytotal  = (((Math.abs(parseFloat(nonlocalmisstwodaytotal))/Math.abs(parseFloat(nonlocalshipmentstotal))))*100).toFixed(0);
    
totalINVvalueformatedtotal = '$' + parseFloat(totalINVvaluetotal).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
amountofadjustmentformatedtotal = '$' + parseFloat(amountofadjustmenttotal).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    /////////////////////end totals

//if(nonlocalshipments < 10){nonlocalshipments =  nonlocalshipments + "&nbsp;&nbsp;" ;}else if(nonlocalshipments < 100){nonlocalshipments = nonlocalshipments + "&nbsp;";}else{nonlocalshipments;}

var userlocation = nlapiGetLocation();
var onedaymisslink= "<a href=\" https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=2953&saverun=T&whence=\" target=\"_blank\">" + nonlocalmissoneday  +"</a>";
var twodaymisslink= "<a href=\"https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchid=2953&saverun=T&whence=\" target=\"_blank\">" + nonlocalmisstwoday  +"</a>";

content += "<td  ><b>"  + locationname + "</b></td>" + "<td align= \"center\" style= \"border-left: solid;\">" + itemscounted + "</td>" + "<td align= \"center\">" + itemsoff + "</td>"  + "<td align= \"center\"  bgcolor=\""+ failitempercentoff + "\">" + percentofitemsoff + "%</td>" +"<TD align= \"center\">" +  targetcount + "</td>" + "<td align= \"center\" bgcolor=\""+ failpercentoftarget + "\">" +  percentoftarget + "%</td>"  +"<td align= \"center\" style= \"border-left: solid;\">" + totalINVvalueformated + "</td>"  +"<TD align= \"center\">" +  amountofadjustmentformated + "</td>" + "<TD align= \"center\" bgcolor=\""+ failpercentofvalueoff + "\">" + percentofvalueoff + "%</td>" +  "<TD   align= \"center\" style= \"border-left: solid;\">" + nonlocalshipments + "</TD>"+"<TD   align= \"center\">"+" / " +"</TD>"+ "<TD   align= \"center\">" + onedaymisslink + "</TD>" + "<TD   align= \"center\" >" + " / " + "</TD>" +"<TD   align= \"center\" style=\""+ failpercentnonlocalmissoneday + "\">" + percentnonlocalmissoneday+ "%</td>" + "<TD align= \"center\">"+  "</TD>" +  "<TD   align= \"center\">" + nonlocalshipments + "</TD>"+"<TD   align= \"center\">"+" / " +"</TD>"+ "<TD   align= \"center\">" + twodaymisslink + "</TD>" + "<TD  align= \"center\" >" + " / " + "</TD>" +"<TD  align= \"center\" style=\""+ failpercentnonlocalmisstwoday + "\">" + percentnonlocalmisstwoday+ "%</td>" + "<TD align= \"center\" style= \"border-right: solid;\">"+  "</TD>"   ;

 

failitempercentoff = "";
failpercentoftarget = "";
failpercentofvalueoff = "";
failpercentnonlocalmissoneday = "";
failpercentnonlocalmisstwoday = "";
itemscounted = 0;
itemsoff = 0;
percentofitemsoff = 0;
amountofadjustment =0;
amountofadjustmentformated =0;
totalINVvalueformated=0;
totalINVvalue = 0;
percentofvalueoff=0;
targetcount = 0;
percentoftarget=0;  
 nonlocalshipments=0;
 nonlocalmissoneday=0;
 nonlocalmisstwoday=0;
percentnonlocalmissoneday=0;
percentnonlocalmisstwoday=0;

 content +=  "</tr>"; 
  }
  }
  
     ////////////total row
content += "<tr><td  width=\"20\%\" bgcolor=\"#dadada\" align= \"center\"><b> Totals </td>" + "<td style= \"border-top: solid; border-color: #ff0000;    \"  bgcolor=\"#dadada\" align= \"center\" > <b>" + itemscountedtotal +"</td>" + "<td  style= \"border-top: solid; border-color: #ff0000; \" bgcolor=\"#dadada\" align= \"center\"> <b>" + itemsofftotal + "</td>"  + "<td  style= \"border-top: solid; border-color: #ff0000; \" bgcolor=\"#dadada\" align= \"center\"> <b>" + percentofitemsofftotal + "%</td>" +"<TD  style= \"border-top: solid; border-color: #ff0000; \" bgcolor=\"#dadada\" align= \"center\"> <b>" +  targetcounttotal + "</td>" + "<td   style= \"border-top: solid; border-color: #ff0000; \" bgcolor=\"#dadada\" align= \"center\"> <b>" +  percentoftargettotal + "%</td>"  +"<td   style= \"border-top: solid; border-color:  #0000ff; \"  bgcolor=\"#dadada\" align= \"center\" style= \"border-left: solid; border-color: #000000; \"> <b>" + totalINVvalueformatedtotal + "</td>"  +"<TD   style= \"border-top: solid; border-color:  #0000ff; \"  bgcolor=\"#dadada\" align= \"center\"> <b>" +  amountofadjustmentformatedtotal + "</td>" + "<TD  style= \"border-top: solid; border-color:  #0000ff; \"  bgcolor=\"#dadada\" align= \"center\" > <b>" + percentofvalueofftotal + "%</td>"  +  "<TD style= \"border-top: solid; border-color:  #589E41; \" bgcolor=\"#dadada\" align= \"center\"> <b>"  + nonlocalshipmentstotal + "</TD>"+"<TD style= \"border-top: solid; border-color:  #589E41; \"  bgcolor=\"#dadada\" align= \"center\"> <b>"+" / " +"</TD>" + "<TD  style= \"border-top: solid; border-color:  #589E41; \" bgcolor=\"#dadada\" align= \"center\" > <b>" + nonlocalmissonedaytotal + "</TD>" + "<TD style= \"border-top: solid; border-color:  #589E41; \" bgcolor=\"#dadada\" align= \"center\"> <b>" + " / " + "</TD>" +"<TD style= \"border-top: solid; border-color:  #589E41; \" bgcolor=\"#dadada\" align= \"center\" style= \"border-left: solid; border-color: #000000; \"> <b>" + percentnonlocalmissonedaytotal+ "%</td>" + "<TD style= \"border-top: solid; border-color:  #589E41; \"  bgcolor=\"#dadada\"  ></TD>"  +  "<TD style= \"border-top: solid; border-color:  #589E41; \" bgcolor=\"#dadada\" align= \"center\" > <b>"  + nonlocalshipmentstotal + "</TD>"+"<TD style= \"border-top: solid; border-color:  #589E41; \" bgcolor=\"#dadada\" align= \"center\"> <b> "+" / " +"</TD>" + "<TD style= \"border-top: solid; border-color:  #589E41; \" bgcolor=\"#dadada\" align= \"center\" > <b>" + nonlocalmisstwodaytotal + "</TD>" + "<TD style= \"border-top: solid; border-color:  #589E41; \" bgcolor=\"#dadada\" align= \"center\"> <b> " + " / " + "</TD>" +"<TD style= \"border-top: solid; border-color:  #589E41; \" bgcolor=\"#dadada\" align= \"center\" style= \"border-right: solid; border-color: #000000; \"> <b>" + percentnonlocalmisstwodaytotal+  "%</td>" + "</b><TD style= \"border-top: solid; border-color:  #589E41; \" bgcolor=\"#dadada\"></TD></table>" ;
    

  response.write(content);
  
  }