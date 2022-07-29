

function PageIntMH(request, response)
{




var cust = nlapiGetFieldValue('entity');
var stat = nlapiGetFieldValue('status');
var number = nlapiGetFieldValue('tranid'); 
var CFF = nlapiGetFieldValue('createdfrom');


  
/*  
if(!stat)
 {
   for ( m = 1; m <= nlapiGetLineItemCount('item'); m++)
	{
      var haslinkedtran =nlapiGetLineItemValue('item', 'custcol74', m);
if( haslinkedtran)
  {

  }
    }
 }




if(stat == "Billed" && number != "To Be Generated")
	{
for ( i = 1; i <= nlapiGetLineItemCount('item'); i++)
	{

	var uid =nlapiGetCurrentLineItemValue('item', 'item');
   
	nlapiDisableLineItemField('item', 'item', true,i);
	nlapiDisableLineItemField('item', 'quantity', true,i);
	nlapiDisableLineItemField('item', 'location', true,i);
	}

	}
*/

if(cust != "" && number == "To Be Generated" )//&& !CFF )
 {
//alert("hi");
var record = nlapiLoadRecord('customer', cust);
//-------------------------------------------------------------------
//var cust_invInstructions = record.getFieldValue('custentity251');//custentity251
var cust_location = record.getFieldValue('custentity180');
var cust_class = record.getFieldValue('custentity149');
//var cust_shippingInstructions = record.getFieldValue('custentity204');
//-------------------------------------------------------------------
var custterms =  record.getFieldValue('terms');
if(custterms!= 8)
{
nlapiSetFieldValue('terms',custterms );  
nlapiSetFieldValue('creditcard',"");  
}


//---------------------------------------------------------------------------

//if(nlapiGetFieldValue('custbody73')== "")
//{
//var aprover = record.getFieldValue( 'custentity158');
//nlapiSetFieldValue('custbody73',aprover );
//}

//if(nlapiGetFieldValue('custbody69')== "")
//{
//var plantcode = record.getFieldValue('custentity157');
//nlapiSetFieldValue('custbody69',plantcode);
//}

//---------------------------------

var cust_wellsitename  = record.getFieldValue('custentity_req_wellsitename');
//var order_wellsitename = nlapiGetFieldValue('custbody8');

var cust_wellnumber  = record.getFieldValue( 'custentity_req_wellnumber');
//var order_wellnumber  = nlapiGetFieldValue('custbody9');

var cust_accountingnum  = record.getFieldValue( 'custentity_req_accountingnumber');
//var order_accountingnum  = nlapiGetFieldValue('custbody10');

var cust_glaccount  = record.getFieldValue( 'custentity_req_glaccount');
//var order_glaccount  = nlapiGetFieldValue('custbody74');

var cust_techname  = record.getFieldValue( 'custentity_req_techname');
//var order_techname  = nlapiGetFieldValue('custbody38');

var cust_xtocode  = record.getFieldValue( 'custentity_req_xtocode');
//var order_xtocode  = nlapiGetFieldValue('custbody11');

var cust_plantcode  = record.getFieldValue( 'custentity_req_plantcode');
//var order_plantcode  = nlapiGetFieldValue('custbody69');

var cust_approverid  = record.getFieldValue( 'custentity_req_approverid');
//var order_approverid  = nlapiGetFieldValue('custbody73');

var cust_xtoreasoncodes  = record.getFieldValue( 'custentity_req_xto_reason_codes');
//var order_xtoreasoncodes  = nlapiGetFieldValue('custbody67');

var cust_paykey_userId_required   = nlapiLookupField('customer', cust, 'custentity187');
//var order_paykey_userId_required  = nlapiGetFieldValue('custbody7');

var cust_po_required   = nlapiLookupField('customer', cust, 'custentity193');
//var order_po_required  = nlapiGetFieldValue('otherrefnum');

var req = 'Required'
var blank = ""

/*/-------------------------

if( order_wellsitename == req) 
{
nlapiSetFieldValue('custbody8', blank,  null, false);
}

if ( cust_wellnumber == req)  
{
nlapiSetFieldValue('custbody9', blank,  null, false );
}

if (order_accountingnum == req)  
{
nlapiSetFieldValue('custbody10', blank,  null, false);
}

if (order_glaccount == req)  
{
nlapiSetFieldValue('custbody74', blank,  null, false);
}

if (  order_techname == req)  
{
nlapiSetFieldValue('custbody88', blank,  null, false);
}

if(order_xtocode == req)  
{
nlapiSetFieldValue('custbody11', blank,  null, false);
}

if (order_plantcode == req)   
{
nlapiSetFieldValue('custbody69', blank,  null, false);
}

if (  order_approverid == req)  
{
nlapiSetFieldValue('custbody73', blank,  null, false);
}

if (order_xtoreasoncodes == req)  
{
nlapiSetFieldValue('custbody67', blank,  null, true);
}


if (order_paykey_userId_required == req)  
{
nlapiSetFieldValue('custbody7', blank,  null, true);
}

if (order_po_required  == req)  
{
nlapiSetFieldValue('otherrefnum', blank,  null, true);
}

*///------------------------


if(cust_wellsitename == "T")// && order_wellsitename == "") 
{
if( nlapiGetFieldValue('custbody8') == "")
  {
nlapiSetFieldValue('custbody8', req,  null, false);
  }
}

if ( cust_wellnumber  == "T" )//&& order_wellnumber == "")  
{
  if( nlapiGetFieldValue('custbody9') == "")
  {
nlapiSetFieldValue('custbody9', req,  null, false );
  }
}

if (  cust_accountingnum == "T" )//&& order_accountingnum == "")  
{
   if( nlapiGetFieldValue('custbody10') == "")
  {
nlapiSetFieldValue('custbody10', req,  null, false);
  }
}

if (  cust_glaccount == "T" )//&& order_glaccount == "")  
{
     if( nlapiGetFieldValue('custbody74') == "")
  {
nlapiSetFieldValue('custbody74', req,  null, false);
  }
}

if (  cust_techname == "T" )//&& order_techname == "")  
{
       if( nlapiGetFieldValue('custbody38') == "")
  {
nlapiSetFieldValue('custbody38', req,  null, false);
  }
}

if(  cust_xtocode == "T" )//&& order_xtocode == "") 
{
         if( nlapiGetFieldValue('custbody11') == "")
  {
nlapiSetFieldValue('custbody11', req,  null, false);
  }
}

if ( cust_plantcode == "T" )//&& order_plantcode == "") 
{
           if( nlapiGetFieldValue('custbody69') == "")
  {
nlapiSetFieldValue('custbody69', req,  null, false);
  }
}

if (  cust_approverid == "T" )//&& order_approverid == "")  
{
             if( nlapiGetFieldValue('custbody73') == "")
  {
nlapiSetFieldValue('custbody73', req,  null, false);
  }
}

if (  cust_xtoreasoncodes == "T" )//&& order_xtoreasoncodes == "")  
{
               if( nlapiGetFieldValue('custbody67') == "")
  {
nlapiSetFieldValue('custbody67', req,  null, true);
  }
}

if (  cust_paykey_userId_required == "T" )//&& order_paykey_userId_required  == "")  
{
                 if( nlapiGetFieldValue('custbody7') == "")
  {
nlapiSetFieldValue('custbody7', 182,  null, true);
  }
}

if (  cust_po_required == "T" )//&& order_po_required == "")  
{
                   if( nlapiGetFieldValue('otherrefnum') == "")
  {
nlapiSetFieldValue('otherrefnum', req,  null, true);
  }
}


//------------------------
var empty = "";
//nlapiSetFieldText('custbody36', empty  );
//nlapiSetFieldValue('custbody36', empty  );
nlapiSetFieldValue('class',cust_class );
nlapiSetFieldValue('location', cust_location );
//nlapiSetFieldValue('custbody36', cust_invInstructions );
//nlapiSetFieldValue('custbody35', cust_shippingInstructions );



//----------------------------------------------------------------------------------




//-----------------------

//return true;
}
return true;
}

//---------------------------



//------------------------------



//gethist gets the customer history on a particular item 

function gethistso( type )
{

var uid =nlapiGetCurrentLineItemValue('item', 'item');
var cust = nlapiGetFieldValue('entity');


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

contentmargin += "<td style=\"padding-right: 19px;\">" + bu + "</td><td>"+ maxM + "</td><td>" + avgM + "</td><td>" +  minM + "</td></tr>";

  }
contentmargin += "</table></br></br>";


///////////////////////////////////////////////////////////////////////////////////////////////
      
var docwrite = '<div></div>';
      
var win = window.open(docwrite , '_blank', "dependent = yes, height=1100, width=1120, top=100, left=200, toolbar=no, scrollbars=yes, menubar=no, status=no, titlebar=no, resizable=yes");
      
    if(win==null)
    {alert("Your Browsers Popup Blocker has blocked this window.  Please allow Popups from Netsuite. ");    return true; }    
      win.document.write('<div><b>History For: '+ custname + '  ---  Item: ' + ItemName  + '</b></br></div><div style=" width:100%;  ">'+ customerhistoryN + '</div>  <div><b>AX Margin Summary</b></br></div><div style=" width:100%;  ">'+ contentmargin + '</div>   <div><b>Recent Item Sales</b></br></div><div >'+ content +'</div>');


	return true;
	}

return true;
}


//---------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------------

