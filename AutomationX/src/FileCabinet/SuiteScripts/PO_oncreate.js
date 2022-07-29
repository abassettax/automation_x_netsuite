function PODROPSHIPADDRESS()
{
var soid =  nlapiGetFieldValue('createdfrom');
var dropc = 0;
  var locationDS =  nlapiGetFieldValue('location');  
  if(locationDS){
  var emaillocPo =  nlapiLookupField('location', locationDS,'custrecordpopricechange') ;
    nlapiSetFieldValue('custbody195', emaillocPo);
                 }

  if(nlapiGetFieldValue('custbody179')=='T' &&  parseInt(nlapiGetFieldValue('total'))< 1000){nlapiSetFieldValue('custbody6',3);} 
  if(nlapiGetFieldValue('custbody179')=='T' &&  parseInt(nlapiGetFieldValue('total')) > 1000){   nlapiSetFieldValue('approvalstatus',  1 );}
  
 if(nlapiGetFieldValue('custbody70')=='T') {nlapiSetFieldValue('shipmethod',1222);}
else{ nlapiSetFieldValue('shipmethod',1224); }
  
if(nlapiGetFieldValue('custbody147')=='T'){ nlapiSetFieldValue('shipmethod',70093); }
  
for ( x = 1; x <= nlapiGetLineItemCount('item'); x++)
	{

var drop = nlapiGetLineItemValue('item', 'custcol4', x,x);
if(drop == "T" )
{ var newdropc = dropc++ }
		
    }
      
if( dropc  > 0 && soid != null  && soid != "" )
{
var address = nlapiLookupField('salesorder', soid , 'shipaddress');
nlapiSetFieldValue('shipaddress',address);


}


}