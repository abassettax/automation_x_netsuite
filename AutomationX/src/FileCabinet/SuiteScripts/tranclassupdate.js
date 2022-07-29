function changeclass(recordType, recordID)
{

var cust_class ="43";


//nlapiSubmitField(recordType, recordID, 'class', cust_class );



var recOpportunity = nlapiLoadRecord(recordType, recordID);
   var lineCount = parseInt( recOpportunity.getLineItemCount('item'));

	for(x =1; x<=lineCount; x++)
	{  
  recOpportunity.setLineItemValue('item', 'class', x,cust_class );
    }
  
recOpportunity.setFieldValue('class', cust_class );
nlapiSubmitRecord(recOpportunity, null, true); 
}