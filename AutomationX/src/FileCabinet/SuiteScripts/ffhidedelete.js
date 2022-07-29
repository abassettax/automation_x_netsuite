function aftersubmitFF(type, name)
{
if(type != 'delete')
  {
  ///////////////////////////////////////////////////////Start save TO
  nlapiLogExecution('debug', 'createdfrom' , nlapiGetFieldValue('createdfrom') + nlapiGetFieldText('createdfrom'));
  var createdFrom = nlapiGetFieldText('createdfrom');
if( createdFrom.indexOf("Transfer Order") >=0)
  {
var TO = nlapiLoadRecord('transferorder',  nlapiGetFieldValue('createdfrom'));

    
    var lineCount = TO.getLineItemCount('item');

  for ( x = 1; x <= lineCount; x++)
	{
var avgCost =  TO.getLineItemValue('item', 'averagecost', x); if(!avgCost){ avgCost = 0.00; }
  TO.setLineItemValue('item', 'rate' , x, avgCost);
    }
    
nlapiSubmitRecord( TO);
  }
  
  /////////////////////////////////////////////////////end save TO
  }
}

function latedaybeforesave ( type)

{

if(  nlapiGetRecordId() && type != 'delete')
  {
var oldRecord =nlapiGetOldRecord();
var oldRecordshipStat = oldRecord.getFieldValue('shipstatus');

if(nlapiGetFieldValue('shipstatus') == "C" &&  oldRecordshipStat !="C")
{
var columnsFF = new Array();
columnsFF[0] = new nlobjSearchColumn("formulanumeric").setFormula("TO_CHAR({datecreated} ,'HH24') ");
 var itemfulfillmentSearch = nlapiSearchRecord("itemfulfillment",null,
[
   ["type","anyof","ItemShip"], 
   "AND", 
   ["internalidnumber","equalto", nlapiGetRecordId()], 
   "AND", 
   ["mainline","is","T"]
],
columnsFF
);
  var dateCreated = itemfulfillmentSearch[0].getValue( columnsFF[0] );
 //nlapiLogExecution('debug', nlapiGetRecordId() , dateCreated);

if(dateCreated > 13)
{
nlapiSetFieldValue('custbody100', 1);
  //nlapiLogExecution('debug',  nlapiGetRecordId() , 'set late day');
}
}
}


///////////////////////////////////////////////////////////////////////////////////End Late Day FF
  
  
  
  
}







function ffhideDelete( type, form)
{

 



  //tbl_markpacked'  
//var shipbutton =  document.getElementsByClassName('pgBntG pgBntB').style.visibility='hidden';
  
if(type == 'view'){ 
  
  var shiptype =   nlapiGetFieldValue('shipmethod');
  var status =  nlapiGetFieldValue('shipstatus');
  if((status == 'B' &&  ( shiptype ==  2229 || shiptype == 4605 ))  || status == 'A' )
    {
      var blabel = 'Mark Shipped';
      if(status == 'A'){blabel = 'Mark Pick/Pack for Shipping'   }
      var forms = nlapiGetFieldValue('customform');
  form.addButton('custpage_markshipped', blabel, 'markshipped()'); 
        	form.setScript('customscript361'); // sets the script on the client side
    }
}
  
    if(type == 'create'){
  var cust  =   nlapiGetFieldValue('entity'); 
   var so = nlapiGetFieldValue('createdfrom');   
  var createft =  nlapiLookupField('transaction', so , 'type', true);

      
if(createft != 'Transfer Order' && createft != 'Vendor Return Authorization')
   {
       var printPS= nlapiLookupField('customer',   cust , 'custentity336');  
      nlapiSetFieldValue('custbody177', printPS);
     
   }
    }
  
  if(type == 'edit'){

var formm = nlapiGetFieldValue('customform');
var so = nlapiGetFieldValue('createdfrom');
//var transfer = nlapiLoadRecord('transferorder', so);
var shipstat = nlapiGetFieldValue('shipstatus');

var createft =  nlapiLookupField('transaction', so , 'type', true);


if(createft != 'Transfer Order' && createft != 'Vendor Return Authorization')
   {

//var record = nlapiLoadRecord('salesorder', so);
var stat =  nlapiLookupField('transaction',  so, 'statusRef'); // record.getFieldValue('statusRef');

if(stat == 'fullyBilled')
  {
       var lineQty = nlapiGetLineItemField('item', 'quantity' ); 
    
    lineQty.setDisplayType('disabled');
     var ds = nlapiGetField('shipstatus');
 ds.setDisplayType('disabled');
form.removeButton('delete');
  }
else if( stat == 'partiallyFulfilled' || stat == 'pendingBillingPartFulfilled'  ){ //&& nlapiGetFieldValue('shipstatus') == "C"

//var lineCount = record.getLineItemCount('item');

//for ( x = 1; x <= nlapiGetLineItemCount('item'); x++)
//	{

   // var ffqty = nlapiGetLineItemValue('item', 'quantity', x);
  // var SOlineNums = nlapiGetLineItemValue('item', 'orderline', x);
  
  var columnsFFBilled = new Array();
columnsFFBilled[0] = new nlobjSearchColumn("formulanumeric",null,"SUM").setFormula("CASE WHEN {quantitybilled} - (    {quantitypicked} - {fulfillingtransaction.quantity} ) > 0 THEN 1 ELSE 0 END");
  var salesorderSearch = nlapiSearchRecord("salesorder",null,
[
   ["type","anyof","SalesOrd"], 
   "AND", 
   ["internalidnumber","equalto",so], 
   "AND", 
   ["fulfillingtransaction.internalidnumber","equalto",nlapiGetRecordId()]
], 
columnsFFBilled
);



  var lockFF =  salesorderSearch[0].getValue(columnsFFBilled[0]);     
      nlapiLogExecution('debug','lockFF',  lockFF + ' ' + nlapiGetRecordId());
/*var soInvDetail = nlapiSearchRecord("transaction",null,
[
   ["internalidnumber","equalto",so], 
   "AND", 
   ["line","equalto",SOlineNums]
], 
[
   new nlobjSearchColumn("quantitypicked"), 
   new nlobjSearchColumn("quantitybilled"), 
   new nlobjSearchColumn("tranid")
]
);


var soinv =   soInvDetail[0].getValue('quantitybilled');         // record.getLineItemValue('item', 'quantitybilled',  i);
var soqtyff = soInvDetail[0].getValue('quantitypicked');        //record.getLineItemValue('item', 'quantitypicked',  i);
ffqty;

nlapiLogExecution('debug','soinv - (soqtyff -   ffqty',soinv +' ' +soqtyff + ' ' +  ffqty);
nlapiLogExecution('debug','total',(soinv - (soqtyff - ffqty )));
*/
//if((soinv - (soqtyff - ffqty )) > 0 )// || soinv != null)
if(lockFF > 0 )
{

form.removeButton('delete');  
  
 var lineQty = nlapiGetLineItemField('item', 'quantity', 0);
 lineQty.setDisplayType('disabled');
  
  var ds = nlapiGetField('shipstatus');
  ds.setDisplayType('disabled');
  nlapiLogExecution('debug','disabled', 0);

}
//}
//}
      
//}
   }   
} } }








function ffdisablefields(type, form)
{
  


  if(type == 'edit'){




var shipstat = nlapiGetFieldValue('shipstatus');

if(shipstat  != "C")
       {
var nt = "F";

 nlapiSetFieldValue('generateintegratedshipperlabel', nt);
 	}

//-----------------

  if(shipstat  == "C" ) //&& formm == 202 )//221 &&  nlapiLookupField('transaction',  nlapiGetFieldValue('createdfrom') , 'statusRef', true) == 'fullyBilled'
  {
 //var ds = nlapiGetField('shipstatus');
// ds.setDisplayType('disabled');

 //for ( x = 1; x <= nlapiGetLineItemCount('item'); x++)
//	{
 var qty = nlapiGetLineItemField('item', 'quantity');
 qty.setDisplayType('disabled');
 //
 	//}
    }


 }}

