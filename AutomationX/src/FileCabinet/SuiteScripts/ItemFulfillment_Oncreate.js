function FFoncreate() 
{


var cf= nlapiGetFieldValue('createdfrom');
 // alert(nlapiGetFieldText('createdfrom'));
  nlapiSetFieldValue('custbody133', nlapiGetFieldText('createdfrom'));
var createft =  nlapiLookupField('transaction', cf, 'type', true);

 nlapiSetFieldValue('custbody145', "T");

if(createft == 'Transfer Order')  // sets transfer order class to stock request  move to on create 
   {

for ( x = 1; x <= nlapiGetLineItemCount('item'); x++)
	{
var classs = nlapiGetLineItemValue('item', 'class', x,x)

if(classs != 38)
		{
		nlapiSelectLineItem('item', x)	
		nlapiSetCurrentLineItemValue('item', 'class', 38);
		}

	 }}



}