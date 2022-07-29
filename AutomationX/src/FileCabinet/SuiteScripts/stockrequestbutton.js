function fchange(name)
{ 
if(name=='custpage_filterlocationid') { alert(1); return true;}
}

/////start buttons
function reset()
{
window.open("https://system.na3.netsuite.com/app/site/hosting/scriptlet.nl?script=1102&deploy=1", '_blank');//
return true;
}


function openitem() //opens item in new tab
{
  var uid = nlapiGetCurrentLineItemValue('custpagesublist', 'itemid');
 if(!uid){alert("Please select an item"); return true;}
 if(uid ) 
{
window.open("https://system.na3.netsuite.com/app/common/item/item.nl?id=" + uid + "&e=T  ", '_blank');
  alert(1);
return true;
}

}

////////////////////////////
///////////////////////////
///////////////////////////
function openrequest() // opens stock detail in new tab
{

  var srID = nlapiGetCurrentLineItemValue('custpagesublist', 'id');
 if(!srID){alert("Please select an item"); return true;}
  if(srID) 
{
window.open("https://system.na3.netsuite.com/app/common/custom/custrecordentry.nl?rectype=463&id=" + srID , '_blank');//+ "&e=T  "
return true;
}
  


}
////////////////////////////
///////////////////////////
///////////////////////////

function tranHistory()  // gets transaction history for an item
{
  var uid = nlapiGetCurrentLineItemValue('custpagesublist', 'itemid');
  var lineloc = nlapiGetCurrentLineItemValue('custpagesublist', 'locationid' );
  var cust = nlapiGetCurrentLineItemValue('custpagesublist', 'customer' );
  
var sloc = "ALL";  
  if(lineloc){sloc = lineloc;}
  if  ( !uid  && !lineloc)
{
alert("Please select a line to check inventory.");
return true;
}

if  (type == 'item'  && uid =="")return true;
{

var w = screen.width -50;
var h = screen.height -50;
  
window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_LOCATION="+ sloc  + "&IT_Item_INTERNALID="+ uid  +"&searchid=4847&whence=", "newwin", "dependent = yes, height=" + h + ", width=" + w +", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");

return true;
}
return true;
}

/////////////////////////////////////
/////////////////////////////////////


//getinv  gets inventory stock and lead time information for selected item
function getinv( type )
{

  var uid = nlapiGetCurrentLineItemValue('custpagesublist', 'itemid');
  

  if  ( uid =="")
{
alert("Please select a line to check inventory.");
return true;
}

if  (type == 'item'  && uid =="")return true;
{

   var invoiceSearch = nlapiSearchRecord("invoice",null,
[
   ["type","anyof","CustInvc"], 
   "AND", 
   ["mainline","is","F"], 
   "AND", 
   ["item.internalidnumber","equalto",uid], 
   "AND", 
   ["trandate","within","daysago90","daysago0"]
], 
[
   new nlobjSearchColumn("tranid",null,null)
]
);
var w = screen.width -50;
  
  if(!invoiceSearch)
    {
 window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID="+uid+"&style=NORMAL&report=&grid=&searchid=3995&sortcol=Item_INVENTOCATION17_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F", "newwin", "dependent = yes, height=800, width=" + w +", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");

    }
  else
    {
 window.open("https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Item&Item_INTERNALID="+uid+"&style=NORMAL&report=&grid=&searchid=3993&sortcol=Item_INVENTOCATION17_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&size=1000&twbx=F", "newwin", "dependent = yes, height=800, width=" + w +", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes, location=no");

    } 
  



return true;
  
}
}

///////////////////////////////////
//////////////////////////////
///////////////////////////////////
//////////////////////////////
//gethist gets the customer history on a particular item 

function gethist( type )
{

  var uid = nlapiGetCurrentLineItemValue('custpagesublist', 'itemid');
  var lineloc = nlapiGetCurrentLineItemValue('custpagesublist', 'locationid' );
  var cust = nlapiGetCurrentLineItemValue('custpagesublist', 'customer' );


  if  ( uid =="" || cust == "" )
{
alert("Please select a line and make sure you have added a customer to view this customers purchasing history.");
return true;
}


if  (type == 'item'  && (uid =="" || cust == ""))return true;
	{


var custhistcolumns = new Array();
 custhistcolumns[0] =  new nlobjSearchColumn("trandate",null,"GROUP").setSort(true);
 custhistcolumns[1] =  new nlobjSearchColumn("item",null, "GROUP");
 custhistcolumns[2] =  new nlobjSearchColumn("tranid",null,"GROUP");
 custhistcolumns[3] =  new nlobjSearchColumn("rate",null,"GROUP");
 custhistcolumns[4] =   new nlobjSearchColumn("baseprice","item","GROUP");
 custhistcolumns[5] =   new nlobjSearchColumn("pricelevel",null,"GROUP");
 custhistcolumns[6] =   new nlobjSearchColumn("internalid",null,"GROUP");
  custhistcolumns[7] =  new nlobjSearchColumn("type",null, "GROUP");
   custhistcolumns[8] =  new nlobjSearchColumn("entity",null, "GROUP");    
      
var custhisttransactionSearch = nlapiSearchRecord("transaction",null,
[
   ["type","anyof","CustInvc","Estimate","SalesOrd","CashSale"], 
   "AND", 
   ["status","anyof","Estimate:C","SalesOrd:A","SalesOrd:B","Estimate:X","SalesOrd:D","SalesOrd:E","SalesOrd:F","CashSale:A","CashSale:B","CashSale:C","CustInvc:A","CustInvc:B","Estimate:A"], 
   "AND", 
   ["mainline","is","F"], 
   "AND", 
   ["quantity","greaterthan","0"], 
   "AND", 
   ["amount","greaterthan","0.00"], 
   "AND", 
   ["taxline","is","F"], 
   "AND", 
   ["shipping","is","F"], 
   "AND", 
   ["trandate","onorafter","daysago1000"], 
   "AND", 
    ["name","anyof",cust],
     "AND", 
   ["item.internalidnumber", "equalto", uid]

], 
custhistcolumns
);
if(custhisttransactionSearch != null)
{
       var ItemName = custhisttransactionSearch[0].getText(custhistcolumns[1]);
      var custname = custhisttransactionSearch[0].getText(custhistcolumns[8]);
}
 var customerhistoryN = "<table><tr><th style=\"padding-right: 12px;\"> Date </th><th style=\"padding-right: 20px;\">Type</th><th style=\"padding-right: 12px;\">Document #</th><th style=\"padding-right: 12px;\">Item Rate</th><th style=\"padding-right: 12px;\"> Base Price</th><th style=\"padding-right: 20px;\">Price Level</th></tr>";

      if(!custhisttransactionSearch)
      {customerhistoryN += "<TR><TD> NO RESULTS FOUND <TD></TR>"}
          else if(custhisttransactionSearch.length >20  )
           {var searchlength = 20;}  else {var searchlength = custhisttransactionSearch.length;}

for ( var k = 0; custhisttransactionSearch != null && k < searchlength; k++ )
  {
    if(k%2 == 0)
      {
       customerhistoryN += "<tr>";   
      }
    else
    {
      customerhistoryN += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
    }
      var tranDate = custhisttransactionSearch[k].getValue(custhistcolumns[0]);
      var doctypes = custhisttransactionSearch[k].getText(custhistcolumns[7]);
      var docnumber = custhisttransactionSearch[k].getValue(custhistcolumns[2]);  
      var itemrate = custhisttransactionSearch[k].getValue(custhistcolumns[3]);
      var Baseprice = custhisttransactionSearch[k].getValue(custhistcolumns[4]);
      var pricelevel = custhisttransactionSearch[k].getText(custhistcolumns[5]);
      var docinternalid = custhisttransactionSearch[k].getText(custhistcolumns[6]);

    var urltype = "";
    if(doctypes == "Sales Order")
    {  urltype = "salesord"; }
    else if(doctypes == "Invoice")
    {  urltype = "custinvc"; }
        else if(doctypes == "Quote")
    {  urltype = "estimate"; }
    else{urltype = "cashsale";}

    var response =  "https://system.na3.netsuite.com/app/accounting/transactions/" + urltype +".nl?id=" + docinternalid;

 var hreflink = "<a href=\""+response +"\">"+  docnumber + "</a>";
customerhistoryN += "<td style=\"padding:0px 10px;\">" + tranDate + "</td><td style=\"padding:0px 10px;\">"+ doctypes + "</td><td style=\"padding:0px 10px;\">" + hreflink + "</td><td style=\"padding:0px 10px;\">$" + itemrate +  "</td><td style=\"padding:0px 10px;\">$" + Baseprice + "</td><td style=\"padding:0px 10px;\">" + pricelevel + "</td></tr>";
//<td style=\"padding:0px 10px;\">"+ newdoct + "</td>
  }
customerhistoryN += "</table></br></br>";




//////////////////////////////////////////////////////////////////////


       var customerhistory= '<div> <b>Customer Purchasing History</B></div> <div style="overflow:hidden; "><iframe style="border: 0px none;  height:100%; margin-top: -250px; width:100%;  " src="https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&Transaction_NAME='+cust+'&IT_Item_INTERNALID='+uid+'&sortcol=Transaction_TRANDATE_raw&sortdir=DESC&csv=HTML&OfficeXML=F&style=GRID&report=&grid=T&searchid=390"></iframe></div>';

var allpricingcolums = new Array();
 allpricingcolums[0] = new nlobjSearchColumn("custcol38",null,"GROUP");
 allpricingcolums[1] = new nlobjSearchColumn("rate",null,"GROUP"); 
 allpricingcolums[2] = new nlobjSearchColumn("item",null,"GROUP");
 allpricingcolums[3] = new nlobjSearchColumn("pricelevel",null,"GROUP");
 allpricingcolums[4] = new nlobjSearchColumn("tranid",null,"COUNT").setSort(true);
 
var AllpricingSearch = nlapiSearchRecord("transaction",null,
[
   ["type","anyof","Estimate","SalesOrd","CashSale"], 
   "AND", 
   ["mainline","is","F"], 
   "AND", 
   ["quantity","greaterthan","0"], 
   "AND", 
   ["amount","greaterthan","0.00"], 
   "AND", 
   ["taxline","is","F"], 
   "AND", 
   ["shipping","is","F"], 
   "AND", 
   ["trandate","within","lastrollingquarter"], 
   "AND", 
   ["name","anyof",cust]
 
  
], 
allpricingcolums
);
      
var content = "<table><tr><th> &nbsp; &nbsp;5 Code &nbsp; &nbsp;</th><th>Item</th><th>Price Level</th><th>Unit Price</th></tr>";

for ( var i = 0; AllpricingSearch != null && i < AllpricingSearch.length; i++ )
  {
    if(i%2 == 0)
      {
       content += "<tr>";   
      }
    else
    {
      content +=  "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
    }
  var fivecode = AllpricingSearch[i].getValue(allpricingcolums[0]);
  var price = AllpricingSearch[i].getValue(allpricingcolums[1]);
  var itemname = AllpricingSearch[i].getText(allpricingcolums[2]);  
  var pricelevels = AllpricingSearch[i].getText(allpricingcolums[3]);

content += "<td style=\"padding-right: 12px;\">" + fivecode + "</td><td style=\"padding-right: 12px;\">"+itemname+ "</td><td style=\"padding-right: 12px;\">" + pricelevels + "</td><td style=\"padding-right: 12px;\">$" + price + "</td></tr>";

  }
content += "</table></br></br>";




//////////////////////////////////////////////////////////////////////

 var newfilter = new nlobjSearchFilter("internalid", "item" ,"anyof", uid);
 var salesorderSearch = nlapiSearchRecord('transaction', '2479',newfilter);

var contentmargin = "<table><tr><th style=\"padding-right: 12px;\">Business Unit</th><th style=\"padding-right: 19px;\">Maximum Margin</th><th style=\"padding-right: 19px;\">Average Margin</th><th style=\"padding-right: 19px;\">  Minimum Margin</th></tr>";

for ( var i = 0; salesorderSearch != null && i < salesorderSearch.length; i++ )
  {
    if(i%2 == 0)
      {
       contentmargin += "<tr>";   
      }
    else
    {
      contentmargin += "<tr style=\" background-color: #f2f4f7 \">"; //#f2f3f4
    }
    var salesorderSearchs = salesorderSearch[i];
    var sellingmargincolums = salesorderSearchs.getAllColumns();
    
  var bu = salesorderSearchs.getValue(sellingmargincolums[0]);
  var minM = salesorderSearchs.getValue(sellingmargincolums[3]);
  var avgM = salesorderSearchs.getValue(sellingmargincolums[2]);  
  var maxM = salesorderSearchs.getValue(sellingmargincolums[1]);
    var w = screen.width -100;
    var h = screen.height -100;
    
var custitemhistory =  '<div style="overflow:hidden; "><iframe style="border: 0px none;  height:100%; margin-top: -200px; width:100%;  " src="https://system.na3.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&CU_Entity_INTERNALID='+ cust + '&searchid=758"></iframe></div>';

contentmargin += "<td style=\"padding-right: 19px;\">" + bu + "</td><td>"+ maxM + "</td><td>" + avgM + "</td><td>" +  minM + "</td></tr>";

  }
contentmargin += "</table></br></br>";


///////////////////////////////////////////////////////////////////////////////////////////////
      
var docwrite = '<div></div>';
      
var win = window.open(docwrite , '_blank', "dependent = yes, height="+h+", width=" + w +", top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes");
      
    if(win==null)
    {alert("Your Browsers Popup Blocker has blocked this window.  Please allow Popups from Netsuite. ");    return true; }    
      win.document.write('<div><b>History For: '+ custname + '  ---  Item: ' + ItemName  + '</b></br></div><div style=" width:100%;  ">'+ customerhistoryN + '</div>  <div><b>AX Margin Summary</b></br></div><div style=" width:100%;  ">'+ contentmargin + '</div>   <div><b>Customer Item History</b></br></div><div >' + custitemhistory +'</div>'); //+ content +'</div>');


	return true;
	}

return true;
}


//---------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------

function clearalllines()
{
  var lineCount = nlapiGetLineItemCount('custpagesublist');
       for(o =1; o<=lineCount; o++)
	{
  
nlapiSelectLineItem('custpagesublist', o);
nlapiSetCurrentLineItemValue('custpagesublist', 'status', ''  );
nlapiCommitLineItem('custpagesublist');

    }
  
}

//end buttons
///////////////////////////////////
//////////////////////////////









/*

function pageint()
{
 
    var screenHeight = screen.height -400;
// alert(screenHeight);
 // document.getElementById("uir-quickfind-box").parentElement.parentElement.parentElement.parentElement.style.position="fixed";
//  document.getElementById("uir-quickfind-box").parentElement.parentElement.parentElement.parentElement.style.marginTop="-5px";
  if(screenHeight<400){screenHeight = 400;}
document.getElementById("custpagesublist_splits").parentElement.style.overflow= "auto"; 
document.getElementById("custpagesublist_splits").parentElement.style.height= screenHeight+"px";
document.getElementById("custpagesublist_splits").parentElement.addEventListener("scroll",function(){
   var translate = "translate(0,"+this.scrollTop+"px)";
   
   const allTh = this.querySelectorAll("tr#custpagesublist_headerrow.uir-machine-headerrow");
   for( var i=0; i < allTh.length; i++ ) {
     allTh[i].style.transform = translate;
   }
});  


}


function stockrequestbutton()
{ 
//nlapiGetContext().getRemainingUsage = function(){return this.getTotalUsage()-(this.usage[this.getScriptId()]==null?0:parseInt(this.usage[this.getScriptId()]));}

 
 if(nlapiGetCurrentLineItemValue('custpagesublist', 'itemid'))  {nlapiCommitLineItem('custpagesublist'); }
  var lineinfo = new Array();
  var locationVendorPOheader = new Array();
  var stockrequestIDsPO= new Array();
  var TransferOrderIDs= new Array();
  var stockrequestIDsTO = new Array();
  var checkVenLoctionItemStatusArray = new Array();
 
  
  var SOsBackLink = new Array();
  var SOsToUpdate = new Array();
  var SOsToUpdateTO = new Array();
  var SOtext = new Array();
  var lineCount = nlapiGetLineItemCount('custpagesublist');
       for(x =1; x<=lineCount; x++)
	{
      var Poloc = nlapiGetLineItemValue('custpagesublist', 'locationid', x);
      var forecastnotess = nlapiGetLineItemValue('custpagesublist', 'forecastnotes', x);
      var fromlocation =nlapiGetLineItemValue('custpagesublist', 'fromlocationid', x); 
      var POven = nlapiGetLineItemValue('custpagesublist', 'vendor', x);
      var lineQTY = nlapiGetLineItemValue('custpagesublist', 'qty', x);
      var itemid = nlapiGetLineItemValue('custpagesublist', 'itemid', x);
      var currentStockrequest = nlapiGetLineItemValue('custpagesublist', 'id', x);
      var processtype = nlapiGetLineItemValue('custpagesublist', 'status', x);
      var updatenotes =nlapiGetLineItemValue('custpagesublist', 'purchasingnotes', x);
      var so = nlapiGetLineItemValue('custpagesublist', 'so', x);
      var sotext = nlapiGetLineItemValue('custpagesublist', 'sotext', x);
      var avgcost = nlapiGetLineItemValue('custpagesublist', 'avgcost', x);
      var solineid = nlapiGetLineItemValue('custpagesublist', 'solineid', x); //alert(solineid);  avgcost id
      var lineid = nlapiGetLineItemValue('custpagesublist', 'id', x); //alert(solineid);  avgcost id
      var empemailfg = nlapiGetLineItemValue('custpagesublist', 'empemails', x); 
      var checkVenLocation = Poloc +"-"+POven; 
      var checkVenLocationItem =Poloc +"-"+POven+"-"+itemid;
      var checkcombolocation = fromlocation +"-"+Poloc;
      var checkVenLoctionItemStatus = Poloc +"-"+POven+"-"+itemid +"-"+ processtype  +"-"+ fromlocation ;
     

/// push values into array 
         if(  POven && Poloc )  //
        {
 if(locationVendorPOheader.indexOf(checkVenLocation) == -1 && processtype==1  )  
  {locationVendorPOheader.push(checkVenLocation);   }
 if(TransferOrderIDs.indexOf(checkcombolocation) == -1 && processtype==2 && fromlocation){TransferOrderIDs.push(checkcombolocation); }

  //if(lineinfo.findIndex(i => i.checkVenLocationItem === checkVenLocationItem) == -1) checkVenLoctionItemStatusArray
if(checkVenLoctionItemStatusArray.indexOf(checkVenLoctionItemStatus) == -1 ) 
              {
checkVenLoctionItemStatusArray.push(checkVenLoctionItemStatus);
lineinfo.push({
  Poloc:Poloc,
  POven:POven,
  lineQTY:lineQTY,
  itemid:itemid,
  currentStockrequest:currentStockrequest,
  processtype:processtype,
  updatenotes:updatenotes,
  checkVenLocation:checkVenLocation,  
  checkVenLocationItem:checkVenLocationItem,
  so:so,
  sotext:sotext,
  solineid:solineid,
  fromlocation:fromlocation,
  avgcost:avgcost,
  lineid:lineid,
  checkcombolocation:checkcombolocation,
  empemailfg:empemailfg,
  forecastnotess:forecastnotess
});
              }
 //else if(lineinfo.findIndex(i => i.checkVenLocationItem === checkVenLocationItem) > -1 )
 else if(checkVenLoctionItemStatusArray.indexOf(checkVenLoctionItemStatus)> -1 ) 
   { 
     var arrayid = lineinfo.findIndex(i => i.checkVenLocationItem === checkVenLocationItem);
     var newqty = parseInt(lineinfo.map(a => a.lineQTY)) + parseInt(lineQTY);
    lineinfo[arrayid].lineQTY = newqty;
     
  lineinfo.push({
  Poloc:Poloc,
  POven:POven,
  lineQTY:0,
  tolineqty:lineQTY,
  itemid:itemid,
  currentStockrequest:currentStockrequest,
  processtype:processtype,
  updatenotes:updatenotes,
  checkVenLocation:checkVenLocation,  
  checkVenLocationItem:checkVenLocationItem,
  so:so,
  sotext:sotext,
  solineid:solineid,
  fromlocation:fromlocation,
  avgcost:avgcost,
  lineid:lineid,
  checkcombolocation:checkcombolocation,
  empemailfg:empemailfg,
    forecastnotess:forecastnotess
});
   }

      } //end array value push
    } // end line loop array 
   //  alert(locationVendorPOheader);
///loop to create POs//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  for(y =0; y<locationVendorPOheader.length && locationVendorPOheader; y++ )  
	{
    //  if( nlobjGetContext.getRemainingUsage() < 100){alert("Script has reached limit.  Please refresh and continue processing.")}
   
//alert(locationVendorPOheader[y]);
      var newpurchaseorder = nlapiCreateRecord('purchaseorder');

 stockrequestIDsPO.length = 0;
 SOsBackLink.length = 0; 
 SOsToUpdate.length = 0;
 SOtext.length = 0;
      var linenotes = "";
      
var ItemsperlocationPO = 0;
var combinedlocationPO =  locationVendorPOheader[y];
var dashspotPO =  combinedlocationPO.indexOf("-");
var currentPOvendor =  combinedlocationPO.substring((dashspotPO+1), 1000);
var currentPOlocation  = combinedlocationPO.substring(-1000, (dashspotPO));

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
if(dd<10) {  dd = '0'+dd } ;
if(mm<10) {  mm = '0'+mm}; 
today = mm + '/' + dd + '/' + yyyy;
      
          //set header fields
   var createdby = 'Created From Stock Request';
    newpurchaseorder.setFieldValue( 'entity',  currentPOvendor );
    newpurchaseorder.setFieldValue( 'location',  currentPOlocation );
    newpurchaseorder.setFieldValue( 'custbody72',  "T" );  
    newpurchaseorder.setFieldValue( 'trandate',  today );
    newpurchaseorder.setFieldValue( 'approvalstatus',  2 );
         // end set header fields 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start add Items
    
  for(q =0; q<lineinfo.length && lineinfo; q++)  
	{
  //    alert(lineinfo[q].checkVenLocation);
if( lineinfo[q].checkVenLocation == combinedlocationPO  && lineinfo[q].processtype==1 )   //
  {   
var empemails = lineinfo[q].empemailfg;
 
var ItemsPOlocation =  lineinfo[q].Poloc;
var Itemsvendor = lineinfo[q].POven;                  
var lineQTY = lineinfo[q].lineQTY;
var itemid =  lineinfo[q].itemid;
var currentStockrequest = lineinfo[q].currentStockrequest;
var currentSO = lineinfo[q].so;
var currentSOtext = lineinfo[q].sotext;
var currentSOlineID = lineinfo[q].solineid; 
var currentSOvenLocItem = lineinfo[q].checkVenLocationItem;
var currentlinenotes = lineinfo[q].forecastnotess;
var TOqty = 0;
var TOitemcost = 0;
//alert( ItemsPOlocation +" " +  Itemsvendor +" " +   lineQTY +" " +  itemid +" " +  currentStockrequest   );
 
 newpurchaseorder.setFieldValue( 'custbody_po_follow_up',  empemails );
    
var updatestatus =lineinfo[q].processtype;
var updatenotes =lineinfo[q].updatenotes;
//alert(currentlinenotes);
if(currentlinenotes){linenotes += '\n\n' + currentlinenotes +' ' + 'Purchasing Request #'+ currentStockrequest;}
//alert(linenotes);
       nlapiSubmitField('customrecord463', currentStockrequest, ['custrecord214' , 'custrecord213'], [ updatestatus,updatenotes ] );//update stock req detail
       SOsBackLink.push({SOlineID:currentSOlineID, so:currentSO});
       if(SOsToUpdate.indexOf(currentSO) == -1  ){SOsToUpdate.push(currentSO); SOsToUpdate.push(currentSO);  } 
       stockrequestIDsPO.push(currentStockrequest);
 
     for(d =0; d<lineinfo.length && lineinfo; d++)  
	{
      if(lineinfo[d].checkVenLocationItem == currentSOvenLocItem && SOtext.indexOf(lineinfo[d].sotext) == -1){SOtext.push(lineinfo[d].sotext);}
    }
   
 
     if( lineinfo[q].checkVenLocation == combinedlocationPO    && lineQTY> 0 && lineinfo[q].processtype==1)  
     {
        newpurchaseorder.selectNewLineItem('item');
        newpurchaseorder.setCurrentLineItemValue('item','item', itemid ,true);
        newpurchaseorder.setCurrentLineItemValue('item','quantity', lineQTY, true);
        newpurchaseorder.setCurrentLineItemValue('item','location', ItemsPOlocation ,true);
       var cleanSOtext = SOtext.toString().replace('Sales Order #','');
       var cleanerSOtext = cleanSOtext.replace(',','\n');
       var cleanererSOtext =cleanerSOtext.replace('#','');
        newpurchaseorder.setCurrentLineItemValue('item','custcol89',cleanererSOtext.replace('Sales Order','') , true);

        newpurchaseorder.commitLineItem('item'); 
         
     }
  }

    }    ///end add items.
   newpurchaseorder.setFieldValue( 'custbody34',  linenotes );
var idd = nlapiSubmitRecord(newpurchaseorder); 
var response =  nlapiResolveURL('RECORD', 'purchaseorder',idd );
 window.open(response);
       
for(k=0; k<stockrequestIDsPO.length && stockrequestIDsPO; k++){var thislineid = stockrequestIDsPO[k]; if(thislineid) {nlapiSubmitField('customrecord463', thislineid, 'custrecord215' , idd );  }}

     
for(t=0; t<SOsToUpdate.length && SOsToUpdate; t++)
              {
                 var soupdate = SOsToUpdate[t];
                 if(soupdate){
var recso = nlapiLoadRecord('salesorder', soupdate);
for(f=0; f<SOsBackLink.length && SOsBackLink; f++)
                            {
 if( SOsBackLink[f].so == soupdate )
 { 
   var lineidupdate = SOsBackLink[f].SOlineID;
   if(lineidupdate)
     {
  recso.selectLineItem('item', lineidupdate);
  recso.setCurrentLineItemValue('item', 'custcol74', idd);
  recso.commitLineItem('item');  
     }
 }
                          } 
nlapiSubmitRecord(recso);
 
              } }  
//alert("done");
     }
///////////////////////////////////////////////////////////end create Purchase order
  
////////////////////////////////////////////////////////////////////////  ///start TO 
///////////////////////////////////////
 // alert(TransferOrderIDs);
  for(y =0; y<TransferOrderIDs.length && TransferOrderIDs; y++ && processtype==2)  
	{
  //      alert(TransferOrderIDs[y]);
  var newto= nlapiCreateRecord('transferorder');
      
    SOsToUpdateTO.length = 0;
    stockrequestIDsTO.length = 0;
var Itemsperlocation = 0;
var combinedlocation =  TransferOrderIDs[y];
var dashspot =  combinedlocation.indexOf("-");
var currentTolocation=  combinedlocation.substring((dashspot+1), 1000);
var currentfromlocation = combinedlocation.substring(-1000, (dashspot));

       //// set header fields 
    newto.setFieldValue( 'location',  currentfromlocation );
    newto.setFieldValue( 'transferlocation',  currentTolocation );
    newto.setFieldValue( 'employee',  nlapiGetUser() );   
     newto.setFieldValue( 'orderstatus', "B"); 
      ///// start line items
   for(q =0; q<lineinfo.length && lineinfo; q++)  
	{    
var ItemsPOlocation =  lineinfo[q].Poloc;
var Itemsvendor = lineinfo[q].POven;
var lineQTY = lineinfo[q].lineQTY;
var itemid =  lineinfo[q].itemid;
var currentStockrequest = lineinfo[q].currentStockrequest;
var currentSO = lineinfo[q].so;
var currentSOtext = lineinfo[q].sotext;
var currentSOlineID = lineinfo[q].solineid; 
var currentSOvenLocItem = lineinfo[q].checkVenLocationItem;
var updatestatus =lineinfo[q].processtype;
var updatenotes =lineinfo[q].updatenotes;
var lineavgcost = lineinfo[q].avgcost;
var lineid    =   lineinfo[q].lineid
var TOqty = 0;
var TOitemcost = 0;
  
nlapiSubmitField('customrecord463', currentStockrequest, ['custrecord214' , 'custrecord213'], [ updatestatus,updatenotes ] );//update stock req detail
 if(SOsToUpdateTO.indexOf(currentSO) == -1  ){SOsToUpdateTO.push(currentSO); SOsToUpdateTO.push(currentSO);  } 
      
     if( lineinfo[q].checkcombolocation == combinedlocation    && lineQTY > 0 && lineinfo[q].processtype==2)  
     {
        newto.selectNewLineItem('item');
        newto.setCurrentLineItemValue('item','item', itemid ,true);
        newto.setCurrentLineItemValue('item','quantity', lineQTY ,true);
        newto.setCurrentLineItemValue('item','rate', lineavgcost ,true);  
        newto.commitLineItem('item');
        stockrequestIDsTO.push( lineid );
      
     }
    } /// end line items
          
var idd = nlapiSubmitRecord(newto); 
 
 var response =  nlapiResolveURL('RECORD', 'transferorder',idd );
 
    for(k=0; k<stockrequestIDsTO.length && stockrequestIDsTO; k++){  var thislineid = stockrequestIDsTO[k];  nlapiSubmitField('customrecord463', thislineid, 'custrecord215' , idd );     }
 
 window.open(response); 
     
      for(t=0; t<SOsToUpdateTO.length && SOsToUpdateTO; t++)
              {
                 var soupdate = SOsToUpdateTO[t];
                 if(soupdate){
var recso = nlapiLoadRecord('salesorder', soupdate);
for(f=0; f<SOsBackLink.length && SOsBackLink; f++)
                            {
 if( SOsBackLink[f].so == soupdate )
 { 
   var lineidupdate = SOsBackLink[f].SOlineID;
   if(lineidupdate)
     {
  recso.selectLineItem('item', lineidupdate);
  recso.setCurrentLineItemValue('item', 'custcol74', idd);
  recso.commitLineItem('item');  
     }
 }
                          } 
nlapiSubmitRecord(recso);

              } }
    }


  //////////////////////////////////////////////////////////////////////  ///end  TO 

 /////////////////////////////////////////////////////////////////// ///start rejected 
///////////////////////////////////////
            for(v =0; v<lineinfo.length && lineinfo; v++ )  
	{
      if(lineinfo[v].processtype ==3)
        {
          var currentStockrequest =lineinfo[v].currentStockrequest;
          var updatenotes =lineinfo[v].updatenotes;
          nlapiSubmitField('customrecord463', currentStockrequest, ['custrecord214' , 'custrecord213'], [ 3,updatenotes ] );
       }
    }
///////////////////////////////////////////////////////////
     /////end rejected
  window.onbeforeunload = null;
  window.location = window.location.href;
location.reload();
}

//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////
//////////////////////////////////


*/

