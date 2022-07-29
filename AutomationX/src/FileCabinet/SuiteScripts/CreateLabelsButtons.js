function onsave()
{
  if(nlapiGetFieldValue('custpage_tranid') && nlapiGetFieldValue('custpage_palletlabel') == "T")
{
  //  var createPDFURL = nlapiResolveURL('SUITELET', 'customscript1229',  'customdeploy1', false);
  var IR = nlapiGetFieldText('custpage_tranid'); 
  var IR = IR.replace("Item Receipt #","");alert(IR);
  var lineCount = nlapiGetLineItemCount('custpagesublist');
  for(x =1; x<=lineCount; x++)
    {

var fiveCode = nlapiGetLineItemValue('custpagesublist', 'custitem35', x);

var PalletLabelURL = 'https://system.na3.netsuite.com/app/common/search/searchresults.csv?printType=SEARCH&l=T&e=T&id=5600&FU_Transaction_NUMBERTEXT=' +IR+ '&CUSTCOL38=' + fiveCode + '&style=NORMAL&FU_Transaction_NUMBERTEXTtype=STARTSWITH&CUSTCOL38type=STARTSWITH&report=&grid=&searchid=5600&dle=T&sortcol=Transaction_TRANDATE_raw&sortdir=ASC&pdf=&size=1000&twbx=F&csv=Export&printtemplate=138&whence=';
window.open(PalletLabelURL, '_blank' );
   
    }
    
}

  return true;
}


function resetsuitlet()
{
  var createPDFURL = nlapiResolveURL('SUITELET', 'customscript1229',  'customdeploy1', false);
    window.open(createPDFURL, '_self' );
}


////////////////////////////////////////////////////////////////
function filterresults()

{
    var url = nlapiResolveURL('SUITELET', 'customscript1229', 'customdeploy1');
    url += '&custpage_locationid=' + nlapiGetFieldValue('custpage_locationid')   + '&custpage_tranid=' + nlapiGetFieldValue('custpage_tranid')  + '&custpage_instock=' + nlapiGetFieldValue('custpage_instock')  +'&custpage_normallystock=' + nlapiGetFieldValue('custpage_normallystock') + '&custpage_prefvendor=' + nlapiGetFieldValue('custpage_prefvendor')+ '&custpage_printcustpartnumber='+ nlapiGetFieldValue('custpage_printcustpartnumber') ;
    window.open(url , "_self");
}

////////////////////////////////////////////////////////////////
function checkall()
{
  var lineCount = nlapiGetLineItemCount('custpagesublist');
  for(x =1; x<=lineCount; x++)
    {
      nlapiSelectLineItem('custpagesublist', x)
      nlapiSetCurrentLineItemValue('custpagesublist', 'print', 'T');
      nlapiCommitLineItem('custpagesublist');
    }

}

////////////////////////////////////////////////////////
function Uncheckall()
{
  var lineCount = nlapiGetLineItemCount('custpagesublist');
  for(x =1; x<=lineCount; x++)
    {
      nlapiSelectLineItem('custpagesublist', x)
      nlapiSetCurrentLineItemValue('custpagesublist', 'print', 'F');
      nlapiCommitLineItem('custpagesublist');
    }
}
////////////////////////////////////////////////////////
function RemoveAll()
{
   var lineCount = nlapiGetLineItemCount('custpagesublist');
  for(x =1; x<=lineCount; x++)
    {
nlapiRemoveLineItem('custpagesublist', x)
  }
}


////////////////////////////////////////////////////////
function fchangeGetItemInfo(type,name)
{
  if(name == 'custpage_palletlabel' && !nlapiGetFieldValue('custpage_tranid'))
  {
    alert("To print pallet labels please select an item receipt. "); return false; 
   }
  
if(name == 'itemids')
  {
var idd =nlapiGetCurrentLineItemValue('custpagesublist', 'itemids' );
 
 var labelitems = new Array();
 labelitems[0] = new nlobjSearchColumn("custitem35"); 
 labelitems[1] = new nlobjSearchColumn("itemid").setSort(false); 
 labelitems[2] = new nlobjSearchColumn("displayname"); 
 labelitems[3] = new nlobjSearchColumn("formulatext").setFormula("CASE WHEN   LENGTH({mpn}) >70 THEN  '...' ||SUBSTR({mpn} , LENGTH({mpn}) -70, LENGTH({mpn})) ELSE {mpn} END"); 
 labelitems[4] = new nlobjSearchColumn("formulatext"); 
 labelitems[5] = new nlobjSearchColumn("upccode"); 
 labelitems[6] = new nlobjSearchColumn("internalid");  
 labelitems[7] = new nlobjSearchColumn("type"); 
 labelitems[8] = new nlobjSearchColumn("formulatext").setFormula("{name}");
  
     var itemSearch = nlapiSearchRecord("item",null,
[
["internalidnumber","equalto", idd]
], 
labelitems
);

var carr = new Array();      
       if(itemSearch){ 
 
    var Listfivecode = itemSearch[0].getValue(labelitems[0]);
    var ListItem = itemSearch[0].getValue(labelitems[6]);
    var ListItemText = itemSearch[0].getValue(labelitems[8]);
    var ListDisplayName = itemSearch[0].getValue(labelitems[2]);
    var ListMPN = itemSearch[0].getValue(labelitems[3]);
    var ListUPC = itemSearch[0].getValue(labelitems[5]);
    var ListType = itemSearch[0].getValue(labelitems[7]);

nlapiSetCurrentLineItemValue('custpagesublist', 'custitem35',Listfivecode);
nlapiSetCurrentLineItemValue('custpagesublist', 'displayname',ListDisplayName);
nlapiSetCurrentLineItemValue('custpagesublist', 'mpn',ListMPN);
nlapiSetCurrentLineItemValue('custpagesublist', 'upccode',ListUPC);
nlapiSetCurrentLineItemValue('custpagesublist', 'itemtype',ListType);
nlapiSetCurrentLineItemValue('custpagesublist', 'itemnametext',ListItemText);
         
  }
  }

}