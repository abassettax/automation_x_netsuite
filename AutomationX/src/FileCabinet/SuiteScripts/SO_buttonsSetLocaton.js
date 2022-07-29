//setpolocationvlgx  Set line item location to match header
function setpolocationvlgx()
{



var loc = nlapiGetFieldValue('location');
if(nlapiGetFieldValue('source') != "Web Services")
{

//for ( x = 1; x <= nlapiGetLineItemCount('item'); x++)
 var item_count = nlapiGetLineItemCount('item');
for (var t = 1; item_count != null && t <= item_count; t++)
	{
	
var itemloc = nlapiGetLineItemValue('item', 'location', t);

nlapiSelectLineItem('item', t);
nlapiSetCurrentLineItemValue('item', 'location', loc  );
nlapiCommitLineItem('item');
//alert(t);
	}

}}