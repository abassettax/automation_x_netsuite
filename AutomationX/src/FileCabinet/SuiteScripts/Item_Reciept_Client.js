function fchange(type,name)
{
  
if(name=='custbody181' && nlapiGetFieldValue('custbody181')=='T' )
{
 
  var thistext =" Please include the following: \n\n-Line#:\n-Packing Slip QTY:\n-Actual Weight:\n-Attach Packing Slip:\n\nGeneral Description:   "
 nlapiSetFieldValue('custbody182', thistext);

}
  
if(name =='location')
{
var po = nlapiGetFieldValue('createdfrom');
var poloc = nlapiLookupField('purchaseorder', po, 'location');
var loc = nlapiGetCurrentLineItemValue('item', 'location');

var createf = nlapiGetFieldValue('createdfrom');
var createft = nlapiLookupField('transaction', createf , 'type', true);



if(poloc !=  loc  && createft != 'Return Authorization' && createft != 'Transfer Order')
{

nlapiSetCurrentLineItemValue('item', 'location',poloc);
alert("Item Receipt Location must match the Purchase Order Location.  Please update the Purchase Order first.");
//nlapiSetLineItemValue('item', 'location', i,poloc);

return true;

}



}
}


function pageint()
{
  var createf = nlapiGetFieldValue('createdfrom');
  if(createf)
    {
var createft = nlapiLookupField('transaction', createf , 'type', true);
  
  if(createft == "Transfer Order")
    {
var TOdestination = nlapiLookupField('transaction', createf , 'transferlocation', true);
      nlapiSetFieldText('location', TOdestination);
    }
 // alert(TOdestination);
    }
}
  
