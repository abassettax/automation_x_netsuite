function beforesubmitINVmh()
{
     for (var i = 1; i <= parseInt(nlapiGetLineItemCount('itemvendor')); i++) 
 {
  var isPrefVendor = nlapiGetLineItemValue('itemvendor','preferredvendor', i);  
  if(isPrefVendor == 'T'   )
    {
 var newPP = (nlapiGetLineItemValue('itemvendor','purchaseprice',i ) * 1.02).toFixed(2);
     
nlapiSetFieldValue('cost',newPP );
     
    }
 } ///////////////////////////end set purchase price
  
  //////////////////////////start key words
  
var keywords = nlapiGetFieldValue('searchkeywords');
var mpNum = nlapiGetFieldValue('mpn');
  if(mpNum  && keywords)
 {
 var MPNnoSpaces = mpNum.split(" ").join(""); if(mpNum.indexOf(" ") ==-1){ MPNnoSpaces ='.';    }
  var MPNnoDash = mpNum.split("-").join(""); if(mpNum.indexOf("-") ==-1){ MPNnoDash ='.';    }
  var MPNnoDot = mpNum.split(".").join(""); if(mpNum.indexOf(".") ==-1){ MPNnoDot ='.';    }  nlapiLogExecution('debug', 'mpNum.indexOf(".")',mpNum.indexOf(".")); 
  
 var cleanKeywords =keywords.split(mpNum).join("");
 var cleanerKeywords =cleanKeywords.split(MPNnoSpaces).join("");
 var cleanererKeywords =cleanerKeywords.split(MPNnoDash).join("");
 var  cleanestKeywords =cleanererKeywords.split(MPNnoDot).join("");
  
 //nlapiLogExecution('debug', 'cleanKeywords',cleanKeywords);
// nlapiLogExecution('debug', 'cleanerKeywords',cleanerKeywords);  
 //nlapiLogExecution('debug', 'cleanestKeywords',cleanestKeywords);
  
var newkeyword =  nlapiGetFieldValue('salesdescription')  + "  " +  cleanestKeywords + "  " + mpNum + "  " +   MPNnoSpaces     + "  " + MPNnoDash   + "  " + MPNnoDot;
nlapiLogExecution('debug', 'newkeyword',newkeyword);
  
  nlapiSetFieldValue('custitem90',newkeyword );
  ///
 }
}

function showhideinventorysublist(type,form) // 
{
  //////////////////////////set purchase price

  
      if(type == 'view')
    {
   form.addButton('custpage_printshelfbutton', 'Print Shelf Label', 'printShelfLabel()');  
 form.setScript('customscript359'); // sets the script on the client side
    }
  
  
  var itemid = nlapiGetRecordId();
   var sublist = form.getSubList('customsublist256');
  var sublist1 = form.getSubList('customsublist258');
 
    var purchrequestDropdown =   nlapiGetLineItemField('locations', 'quantityonhand'); 
   if(purchrequestDropdown){purchrequestDropdown.setDisplayType('disabled');}
   
  if(sublist){ sublist.setDisplayType('hidden');}
  if(sublist1){ sublist1.setDisplayType('hidden');}
  
  if(itemid)
    {
  var invoiceSearch = nlapiSearchRecord("transaction",null,
[
   ["type","anyof","SalesOrd","Build"], 
   "AND", 
   ["mainline","is","F"], 
   "AND", 
   ["item.internalidnumber","equalto",itemid], 
   "AND", 
   ["trandate","within","daysago90","daysago0"],
    "AND",
    ["closed","is","F"]
], 
[
   new nlobjSearchColumn("tranid",null,null)
]
);
  
  
  if(!invoiceSearch)
    {
 if(sublist1){ sublist1.setDisplayType('normal');}
    }
  else
    {
 if(sublist){ sublist.setDisplayType('normal');}
    }
    }
  
}
///////////////////////////////////////////////////////////////////////////////////////////

function aftersubmitCreateFiveCode()
{
  

//////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
if(  nlapiGetFieldValue('custitem35') == "")
{
var itemid = nlapiGetRecordId();
var itemtype = nlapiGetRecordType();

var record = nlapiLoadRecord(itemtype , itemid );


var prefix = "000";

var longfivecode = prefix + itemid ;

var fivelong = longfivecode.substr( -5, longfivecode.length-0);


var new5code = "-" + fivelong 

var keywords =nlapiGetFieldValue('searchkeywords');
var newkeywords = keywords + "  " + new5code ;


record.setFieldValue('searchkeywords',newkeywords );
//record.setFieldValue('custitem90',newkeywords );
record.setFieldValue('custitem35',new5code );

nlapiSubmitRecord(record);

}
}