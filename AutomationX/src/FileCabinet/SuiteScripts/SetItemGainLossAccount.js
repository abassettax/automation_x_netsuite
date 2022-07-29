function setItemGainLossAccount()
{
/*
var searchresults = nlapiSearchRecord('item', 5551, null, null ); //  9.3.08
for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{

var searchresult = searchresults[ i ];
var iid = searchresult.getRecordId(); //getValue('internalid', null);
var itemType = searchresult.getValue('type', null);
nlapiLogExecution('debug', 'iid', iid);
nlapiLogExecution('debug', 'itemType', itemType);
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
nlapiLogExecution('debug', 'recordType',recordType);
var itemrec = nlapiLoadRecord( recordType,iid ); //opens record
if(recordType == 'assemblyitem'){ if( !itemrec.getFieldValue('preferredlocation') ) {   itemrec.setFieldValue('preferredlocation', 1); nlapiLogExecution('debug', 'preflocation',itemrec.getFieldValue('preferredlocation'));  }   }
itemrec.setFieldValue('gainlossaccount', 431);
nlapiSubmitRecord(itemrec, true);
nlapiLogExecution('debug', 'done','done');
                }*/
    ///////////////////////////////////////////////////////start temp
 
  var searchresults = nlapiSearchRecord('item', 5680, null, null ); //  9.3.08
for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
 		{

var searchresult = searchresults[ i ];
var iid = searchresult.getValue('internalid', null);
var venCost = searchresult.getValue('vendorcost', null);
//var itemType = .getValue('vendorcost', null);
nlapiLogExecution('debug', 'iid', iid);

	
 
nlapiSubmitField('inventoryitem',iid, 'cost',venCost );


                }
 /////////////////////////////////////////////////////////end temp
}