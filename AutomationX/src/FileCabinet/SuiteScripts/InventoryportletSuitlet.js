function createinvportlet()
{


//////////////start inv value
  	var InventoryvalueColumns = new Array();
     InventoryvalueColumns[0] =  new nlobjSearchColumn("custrecord154","inventoryLocation","GROUP");
     InventoryvalueColumns[1] =   new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("{locationaveragecost} * {locationquantityavailable}");
     InventoryvalueColumns[2] =  new nlobjSearchColumn("locationtotalvalue",null,"SUM");
  
var itemSearch = nlapiSearchRecord("item",null,
[
   //["locationquantityavailable","greaterthan","0"], 
 //  "AND", 
   ["custitem46","noneof","2"]
],  
InventoryvalueColumns
);

/////////////end inv value


////////////start cogs bu portlet
  
  	var cogsColumns = new Array();
     cogsColumns[0] = new nlobjSearchColumn("custrecord154","location","GROUP").setSort(false);
     cogsColumns[1] = new nlobjSearchColumn("formulacurrency",null,"SUM").setFormula("CASE WHEN( {accounttype} = 'Cost of Goods Sold' ) THEN {grossamount} ELSE 0 END");

var transactionSearch = nlapiSearchRecord("transaction",null,
[
   ["saleseffectivedate","within","lastrollingquarter"], 
   "AND", 
   ["posting","is","T"], 
   "AND", 
   ["accounttype","anyof","COGS"], 
   "AND", 
   ["item.type","anyof","Assembly","InvtPart","Service","Kit","Group"], 
   "AND", 
   ["class","anyof","@ALL@"], 
   "AND", 
   ["location.custrecord154","noneof","@NONE@"], 
   "AND", 
   ["item.custitem46","noneof","2"]
], 
cogsColumns
);

////////////end cogs bu portlet
var content = "<table height=\"60\%\"><th align=\"center\" valign=\"top\" bgcolor=\"#dadada\" >Business Unit  </TH><th align=\"center\" valign=\"top\" bgcolor=\"#dadada\" >Average COGS  </TH> <th align=\"center\" valign=\"top\" bgcolor=\"#dadada\" >Target Inventory </TH> <th align=\"center\" valign=\"top\" bgcolor=\"#dadada\" > Available Value   </TH> <th align=\"center\" valign=\"top\" bgcolor=\"#dadada\" >  Total Value   </TH> <th align=\"center\" valign=\"top\" bgcolor=\"#dadada\" >  Committed Value  </TH> <th align=\"center\" valign=\"top\" bgcolor=\"#dadada\" > % of Target Value </TH> <th align=\"center\" valign=\"top\" bgcolor=\"#dadada\"  >Estimated Annual Turn Over  </TH> ";

var BU = "";
var AverageCOGS = 0;
var TargetINVValue = 0;
var AvaINVvalue = 0;
var commitedvalue = 0;
var totalINVvalue = 0;
var percenthighAVA = 0;
var percenthightotal =0;
var estTO = 0;
var BUID = "";  
  //////start rows
  for ( var i = 0; transactionSearch != null && i < transactionSearch.length; i++ )
  {
    if(i%2 == 0)
      {
       content += "<tr>";   
      }
    else
    {
      content += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
    }

BUID = transactionSearch[i].getValue(cogsColumns[0]);
BU = transactionSearch[i].getText(cogsColumns[0]);
BU = BU;
 
BU = BU.replace( 'A: Business Unit : ', '');
BU = BU.replace("E:", "");
    
//if(BU.slice(2) == 'A:') {BU = BU.slice(18)};
//BU = BU.slice(2)
    AverageCOGS =  transactionSearch[i].getValue(cogsColumns[1])/3;
   TargetINVValue = parseFloat(AverageCOGS)*1.5;
    
var formatedAverageCOGS = '$' + parseFloat(AverageCOGS).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
var TargetINVValueformated ='$' + parseFloat(TargetINVValue).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    
    
    for ( var b = 0; itemSearch != null && b < itemSearch.length; b++ )
  {
var inventorylocid = itemSearch[b].getValue(InventoryvalueColumns[0]);
   if(BUID == inventorylocid)
     {
    AvaINVvalue =itemSearch[b].getValue(InventoryvalueColumns[1]);
    totalINVvalue=itemSearch[b].getValue(InventoryvalueColumns[2]);
    commitedvalue = totalINVvalue - AvaINVvalue;
    percenthightotal =  totalINVvalue /TargetINVValue;
    estTO =  parseFloat( ((transactionSearch[i].getValue(cogsColumns[1]) / totalINVvalue)*4)).toFixed(2); 
      
AvaINVvalue ='$' + parseFloat(AvaINVvalue).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
totalINVvalue ='$' + parseFloat(totalINVvalue).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
commitedvalue ='$' + parseFloat(commitedvalue).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
percenthightotal  =(Math.round((percenthightotal*100)).toFixed(0));

     }
  }
content += "<td  width=\"20\%\"><b>"  + BU + "</td><td align= \"center\"  >"  + formatedAverageCOGS + "</td>" +"<td align= \"center\"  >"  + TargetINVValueformated + "</td>" +"<td align= \"center\" >"  +  AvaINVvalue +  "</td>"  +"<td align= \"center\" >"  + totalINVvalue + "</td>" +"<td align= \"center\" >"  +  commitedvalue  + "</td>" + "<td align= \"center\" >"  + percenthightotal + "%</td>"  + "<td align= \"center\" >"  + estTO + "</td>"

 content +=  "</tr>"; 
  }
 response.write(content);
}