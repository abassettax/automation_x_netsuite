function submitbutton()
{
 if(nlapiGetCurrentLineItemValue('custpagesublist', 'itemids') ) { nlapiCommitLineItem('custpagesublist');}
  var totallines = 0;
  var recId = nlapiGetFieldValue('custidd');
  var cclass = nlapiLookupField('customer', recId ,'custentity149');
  var cloc = nlapiLookupField('customer', recId ,'custentity180' );
   var ctax = nlapiLookupField('customer', recId ,'taxitem' );
  
  
     var online = nlapiGetCurrentLineItemValue('custpagesublist', 'itemid');
     if(online){nlapiCommitLineItem('custpagesublist');}else if(!online){ nlapiCancelLineItem("custpagesublist");}
  
  
  var lineCount = nlapiGetLineItemCount('custpagesublist');
  for(x =1; x<=lineCount; x++)
  {    var lineQty = nlapiGetLineItemValue('custpagesublist', 'qty', x); if(lineQty >0 )  { totallines++   }    }
 // alert(totallines);
if(totallines>0){
 // alert("startquote");
  ////start create quote 
var newQuote = nlapiCreateRecord('estimate');
 //set header fields
    newQuote.setFieldValue( 'entity',  recId );
    newQuote.setFieldValue( 'custbody125',  11 );
    newQuote.setFieldValue( 'entitystatus',  10 );
    newQuote.setFieldValue( 'probability',  0 );
    newQuote.setFieldValue( 'class',  cclass );
    newQuote.setFieldValue( 'location',  cloc );

 var lineCount = nlapiGetLineItemCount('custpagesublist');
  for(x =1; x<=lineCount; x++)
{
//alert(11);
      var lineQty = nlapiGetLineItemValue('custpagesublist', 'qty', x);
      var lineitem = nlapiGetLineItemValue('custpagesublist', 'itemids', x);
//alert(lineitem);
      if(lineQty > 0 && lineitem)
        { 

//alert("addlines")  ;       //add lines
         newQuote.selectNewLineItem('item');
         newQuote.setCurrentLineItemValue('item','item', lineitem ,true);
         newQuote.setCurrentLineItemValue('item','quantity', lineQty ,true); //
         newQuote.setCurrentLineItemValue('item','custpage_ava_deftax', ctax ,true);
         newQuote.setCurrentLineItemValue('item', 'location',cloc, true);
/////////////////////////////////////////////////////////////////////////////
          /////////////////////////////////////////////////////////////////////////////
          /////////////////////////////////////////////////////////////////////////////
         
  //   var uid = lineitem;

 //      var headerlocation = cloc;
        
    //   newQuote.setCurrentLineItemValue('item', 'location',headerlocation, true);   //nlapiSetCurrentLineItemValue('item', 'location',headerlocation);
  
	//var lineCount = parseInt( nlapiGetLineItemCount('item'))+1;
	//nlapiSetCurrentLineItemValue('item', 'custcol_linenumber',lineCount );
/*      if(headerlocation)
        {
          
///////////////////////////
var itemfilters= new Array ();
itemfilters[0] = new nlobjSearchFilter("internalidnumber",null, "equalto",uid);
itemfilters[1] = new nlobjSearchFilter("inventorylocation", null, "anyof",headerlocation );
itemfilters[2] = new nlobjSearchFilter("type",null, "anyof",["InvtPart","Assembly" ]);
      
var itemcolumns = new Array();
itemcolumns[0] = new nlobjSearchColumn("locationquantityavailable",null,null);
itemcolumns[1] = new nlobjSearchColumn("quantityavailable",null,null);  
itemcolumns[2] = new nlobjSearchColumn("custitem69",null,null); 
    
var itemSearches = nlapiSearchRecord("item",null,itemfilters, itemcolumns);
//alert(11);
if(itemSearches)
  {
      
var avalocal = itemSearches[0].getValue(itemcolumns[0]);
var avacompany = itemSearches[0].getValue(itemcolumns[1]);
var overstock = itemSearches[0].getValue(itemcolumns[2]);
      

if(overstock == "T"  ) 
                 {    
   
if(avalocal )
{
alert(2);//return true;
}
else if (avacompany)
{
  var filtersCA = new Array ();
filtersCA[0] = new nlobjSearchFilter("internalidnumber",null, "equalto",uid);
filtersCA[1] = new nlobjSearchFilter("custrecord17", "inventorylocation","is","T" );
filtersCA[2] = new nlobjSearchFilter("locationquantityavailable", null,"greaterthan","0" );
filtersCA[3] = new nlobjSearchFilter("type",null, "anyof",["InvtPart","Assembly" ]);
  
var columnsCA = new Array();
columnsCA[0] = new nlobjSearchColumn("inventorylocation",null,null);
columnsCA[1] = new nlobjSearchColumn("locationquantityavailable",null,null).setSort(true);

var itemSearchCA = nlapiSearchRecord("item",null,filtersCA, columnsCA);
var newlocation = itemSearchCA[0].getValue(columns[0]);

alert(newlocation);
   newQuote.setCurrentLineItemValue('item', 'location',newlocation, true);
  // nlapiSetCurrentLineItemValue('item', 'location', newlocation);
 //  var newlocationtext = nlapiGetCurrentLineItemText('item', 'location');
  // alert("This item is overstocked at another location.  The location for this line item has been changed to:\n\n " +newlocationtext+ " \n \n Please ship or transfer this product from the new location." );
 //return true;
}

alert(4);
                              
              }}}   */ 

/////////////////////////////////////////////////////////////////////////////
          /////////////////////////////////////////////////////////////////////////////
          /////////////////////////////////////////////////////////////////////////////
 // alert(1.1);
      newQuote.commitLineItem('item');// alert(1.2);

        }
}
 // alert(5);
 var idd = nlapiSubmitRecord(newQuote, true, true); // newtransferorder.getFieldValue( 'tranid' );
//  alert(idd);
  var URL = 'https://system.na3.netsuite.com/app/accounting/transactions/estimate.nl?id='+idd +'&e=T&whence=';
 //var response =  nlapiResolveURL('RECORD', 'estimate',idd );
 window.open(URL); 
 //   alert(idd);
}
}

function fchange(type,name)
{
  	if(name =='itemid')
	{
    // var newid = nlapiGetCurrentLineItemValue('custpagesublist', 'item');
     // var cclass = nlapiLookupField('item', newid ,'custentity149');
       nlapiSetCurrentLineItemValue('custpagesublist', 'trandate',"");
       nlapiSetCurrentLineItemValue('custpagesublist', 'tranid',"");
       nlapiSetCurrentLineItemValue('custpagesublist', 'custitem35',"");
    }
}