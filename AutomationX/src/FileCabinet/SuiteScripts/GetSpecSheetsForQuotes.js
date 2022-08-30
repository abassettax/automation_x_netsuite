function getSpecSheetQuotes()
{

quoteid = nlapiGetContext().getSetting('SCRIPT','custscript9');

  var quoteRec = nlapiLoadRecord('estimate', quoteid);
  
var itemCount = quoteRec.getLineItemCount('item');	
  if(itemCount >= 75) // times out if quote is too long
    {
	for (var i=1;  i<=itemCount;i++){			
		
		// get Item Id
		var itemId = quoteRec.getLineItemValue('item','item',i);
		
        // get item type
		var itemType = quoteRec.getLineItemValue('item', 'itemtype', i);
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

		// load item and get image file from Item Display Thumbnail
		if(recordType == 'inventoryitem')
          {
		//var item = nlapiLoadRecord(recordType,itemId);	 nlapiLogExecution('debug','item', item);	
		var imgFileId =nlapiLookupField(recordType,itemId ,'custitem16');	
        nlapiLogExecution('debug','imgFileId', imgFileId);	
		// if it has image - continue
		if (imgFileId) {
			var file = nlapiLoadFile(imgFileId);
           nlapiLogExecution('debug','file', file);	
          

				var imageUrl = 'https://shop.automation-x.com' +file.getURL();

            var mySubString = imageUrl.substring( imageUrl.lastIndexOf("h=") + 2,  imageUrl.lastIndexOf("&"));
            nlapiLogExecution('debug','mySubString', mySubString);
				 nlapiLogExecution('debug','imageUrl', imageUrl);
				quoteRec.setLineItemValue('item','custcol98',i,imageUrl);
			//}
		}
	  }
    } }
nlapiSubmitRecord(quoteRec);
}