function oncreatevendorbill()
{
  
 var ven = nlapiGetFieldValue('entity'); 
if(ven)
{
var columns = new Array();
columns[0] =  new nlobjSearchColumn("billaddress",null,null);
  
var vendorSearch = nlapiSearchRecord("vendor",null,
[
   ["internalidnumber","equalto",ven], 
   "AND", 
   ["isdefaultbilling","is","T"]
], 
columns
);


if(vendorSearch)
{
 nlapiSetFieldValue('billaddress',vendorSearch[0].getValue(columns[0]) );   //billaddress
}
}
}