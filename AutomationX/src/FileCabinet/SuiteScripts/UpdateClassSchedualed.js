function changeclasssch()
{
  
var searchresults = nlapiSearchRecord('transaction', 5579, null, null ); // results from the Pervasive Auto Send PDF Email Report

for ( var mm = 0; searchresults != null && mm < searchresults.length ; mm++ )
 		{
	var searchresult = searchresults[mm];	
	var iid = searchresult.getId( );
            nlapiLogExecution('debug', 'iid', iid);
    var transactionType = searchresult.getRecordType()
       /*   var recordtype = nlapiLookupField('transaction', iid, 'type');

               switch (itype) {   // Compare item type to its record type counterpart
            case 'ITEMSHIP':
                recordtype = 'itemfulfilment';
                break;
            case 'NonInvtPart':
                recordtype = 'salesorder';
                break;
            case 'Service':
                recordtype = 'purchaseorder';
                break;
            case 'Assembly':
                recordtype = 'estimate';
                break;
                
            case 'GiftCert':
                recordtype = 'invoice';
                break;
            default:
        }
        */

var cust_class ="73";


//nlapiSubmitField(transactionType , idd; 'class', cust_class );



var recOpportunity = nlapiLoadRecord(transactionType, iid);
   var lineCount = parseInt( recOpportunity.getLineItemCount('item'));

	for(x =1; x<=lineCount; x++)
	{  
  recOpportunity.setLineItemValue('item', 'class', x,cust_class );
    }
  
recOpportunity.setFieldValue('class', cust_class );
nlapiSubmitRecord(recOpportunity, null, true); 
}
}