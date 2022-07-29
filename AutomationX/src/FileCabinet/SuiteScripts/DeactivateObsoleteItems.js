function deactivateitems()
{
var searchresults = nlapiSearchRecord('item', 5657, null, null ); // INACTIVATE AFTER INVENTORY DEPLETION
  nlapiLogExecution('debug', 'searchresults.length', searchresults.length);
for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{
var searchresult = searchresults[ i ];
var iid = searchresult.getValue('internalid', null); 
var itemType = searchresult.getValue('type', null); 

		var recordType = '';
        switch (itemType) {   // Compare item type to its record type counterpart
            case 'InvtPart':
            	recordType = 'inventoryitem';
                break;
            case 'NonInvtPart':
            	recordType = 'noninventoryitem';
                break;
            case 'Service':
            	recordType = 'serviceitem';
                break;
            case 'Assembly':
            	recordType = 'assemblyitem';
                break;                
            case 'GiftCert':
            	recordType = 'giftcertificateitem';
                break;
            default:
       }
          
var itemrec = nlapiLoadRecord( recordType,iid ); //opens record
itemrec.setFieldValue('isinactive', "T");
           var lineCount = parseInt( itemrec.getLineItemCount('locations'));
	for(x =1; x<=lineCount; x++)
	{
itemrec.setLineItemValue('locations', 'preferredstocklevel', x,0);
    }

nlapiSubmitRecord(itemrec, true);
        }

}