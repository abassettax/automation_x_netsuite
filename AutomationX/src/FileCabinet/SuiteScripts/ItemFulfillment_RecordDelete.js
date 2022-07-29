function drivingdistance()
{
var recordid = nlapiGetRecordId();
  if(!recordid){alert("Please Save before mapping."); return false;}
    
 var deliveriesColumns = new Array();
  deliveriesColumns[0] =  new nlobjSearchColumn("formulatext").setFormula("'https://www.google.com/maps/dir/?api=1&origin=' ||(CASE WHEN  {location.address1}   IS NOT NULL THEN REPLACE( {location.address1}  , ' ', '+') ELSE NULL END) || (CASE WHEN  {location.address2}   IS NOT NULL THEN  '+' || REPLACE( {location.address2}  , ' ', '+') ELSE NULL END) || (CASE WHEN  {location.address3}  IS NOT NULL THEN  '+' || REPLACE( {location.address3} , ' ', '+') ELSE NULL END) || (CASE WHEN  {location.city} IS NOT NULL THEN  '+' || REPLACE( {location.city}, ' ', '+') ELSE NULL END) || (CASE WHEN {location.state}  IS NOT NULL THEN  '+' || REPLACE({location.state} , ' ', '+') ELSE NULL END) || (CASE WHEN {location.zip} IS NOT NULL THEN  '+' || REPLACE({location.zip}, ' ', '+') ELSE NULL END)|| '&destination=' ||(CASE WHEN  {shipaddress1}   IS NOT NULL THEN REPLACE( {shipaddress1}  , ' ', '+') ELSE NULL END) || (CASE WHEN  {shipaddress2}   IS NOT NULL THEN  '+' || REPLACE( {shipaddress2}  , ' ', '+') ELSE NULL END) || (CASE WHEN  {shipaddress3}  IS NOT NULL THEN  '+' || REPLACE( {shipaddress3} , ' ', '+') ELSE NULL END) || (CASE WHEN  {shipcity} IS NOT NULL THEN  '+' || REPLACE( {shipcity}, ' ', '+') ELSE NULL END) || (CASE WHEN {shipstate}  IS NOT NULL THEN  '+' || REPLACE({shipstate} , ' ', '+') ELSE NULL END) || (CASE WHEN {shipzip} IS NOT NULL THEN  '+' || REPLACE({shipzip}, ' ', '+') ELSE NULL END)|| '&travelmode=driving'").setSort(true);
  
var transactionSearchdelivery = nlapiSearchRecord("transaction",null,
[
   ["internalidnumber","equalto",recordid], 
   "AND", 
   ["mainline","is","T"]
], 
deliveriesColumns
);
if(!transactionSearchdelivery){alert("You are missing required information.  Please verify there is a location selected and a shipping address. "); return false;}
var GMURL = transactionSearchdelivery[0].getValue(deliveriesColumns[0]);  
window.open(GMURL , "_blank");
  return true;
}


function deleteFF(type)
{
var deletedfulfilment = nlapiGetFieldValue('tranid');
  if(deletedfulfilment){
var deletedcustomer = nlapiGetFieldValue('entity'); 
var deletedaddress = nlapiGetFieldValue('shipaddress'); 
var deletedwarehousenotes =nlapiGetFieldValue('custbody33'); 
var deletedcreatedfrom = nlapiGetFieldValue('createdfrom');
var createft =  nlapiLookupField('transaction', deletedcreatedfrom , 'type', true);
var substgcf = createft.substring(0,2);
if(substgcf != 'Tr')
   {
if(substgcf != "Ve"  )
{
for( var i = 1; i <= nlapiGetLineItemCount('item'); i++) 
{

//var itemType = nlapiGetLineItemValue('item', 'itemtype', i);
var itemId = nlapiGetLineItemValue('item', 'item', i);
var itemInactive = nlapiLookupField('item', itemId , 'isinactive', true);


if(itemInactive == "F")
{

//get line item values
var deletedlocation = nlapiGetLineItemValue('item', 'location', i);
var deleteditem = nlapiGetLineItemValue('item', 'item', i);
var deletedqty = nlapiGetLineItemValue('item', 'quantity', i);



//create new record 

 var record = nlapiCreateRecord('customrecord192');
 record.setFieldValue( 'custrecord50', deletedfulfilment   );
 record.setFieldValue( 'custrecord51',  deletedcustomer  );
 record.setFieldValue( 'custrecord52', deletedaddress   );
 record.setFieldValue( 'custrecord54',  deletedwarehousenotes  );
 record.setFieldValue( 'custrecord56',  deletedcreatedfrom  );
 record.setFieldValue( 'custrecord49', deletedlocation   );
 record.setFieldValue( 'custrecord48',  deleteditem  );
 record.setFieldValue( 'custrecord53', deletedqty   );
 record.setFieldValue( 'altname', nlapiGetUser() );

 
 id = nlapiSubmitRecord(record, true);   
}}}
  }
return true;
  }
}
